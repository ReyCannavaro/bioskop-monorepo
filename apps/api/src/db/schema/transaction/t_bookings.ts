/**
 * TRANSACTION DATA: Bookings, Booking Items, Booking Foods, Reviews
 * Prefix: t_
 */
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  smallint,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_users } from "../master/m_users";
import { m_seats } from "../master/m_cinemas";
import { m_food_items, m_vouchers } from "../master/m_commerce";
import { m_movies } from "../master/m_movies";
import { t_showtimes } from "./t_showtimes";
import {
  bookingStatusEnum,
  bookingSourceEnum,
  seatTypeEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// t_bookings — Header Transaksi Pemesanan
// Satu booking bisa mencakup beberapa kursi + F&B dalam satu transaksi.
// ─────────────────────────────────────────────────────────────────────────────
export const t_bookings = pgTable("t_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Kode unik human-readable untuk ditampilkan ke pengguna
  booking_code:     varchar("booking_code", { length: 20 }).notNull().unique(), // contoh: "XII-2026-A1B2C3"

  // Relasi
  user_id:          uuid("user_id").notNull().references(() => m_users.id),
  showtime_id:      uuid("showtime_id").notNull().references(() => t_showtimes.id),

  // Sumber Pemesanan
  source:           bookingSourceEnum("source").notNull().default("MOBILE_APP"),

  // Rincian Harga
  subtotal_ticket:  integer("subtotal_ticket").notNull().default(0),  // Total harga tiket
  subtotal_food:    integer("subtotal_food").notNull().default(0),     // Total harga F&B
  discount_amount:  integer("discount_amount").notNull().default(0),   // Total diskon dari voucher
  points_discount:  integer("points_discount").notNull().default(0),   // Diskon dari penukaran poin
  service_fee:      integer("service_fee").notNull().default(0),       // Biaya layanan platform
  total_amount:     integer("total_amount").notNull(),                  // Grand total yang dibayar

  // Voucher
  voucher_id:       uuid("voucher_id").references(() => m_vouchers.id),
  voucher_code:     varchar("voucher_code", { length: 50 }),            // Snapshot kode saat dipakai
  points_redeemed:  integer("points_redeemed").notNull().default(0),    // Jumlah poin yang ditukar
  points_earned:    integer("points_earned").notNull().default(0),      // Poin yang didapat dari booking ini

  // Status
  status:           bookingStatusEnum("status").notNull().default("PENDING"),
  cancel_reason:    text("cancel_reason"),
  cancelled_at:     timestamp("cancelled_at"),
  cancelled_by:     uuid("cancelled_by"),                               // User atau admin yang membatalkan

  // Mencegah Double Submit
  idempotency_key:  uuid("idempotency_key").notNull().unique(),

  // Waktu Kadaluarsa Pembayaran (15 menit dari created_at)
  payment_deadline: timestamp("payment_deadline").notNull(),

  // Metadata
  created_at:       timestamp("created_at").notNull().defaultNow(),
  updated_at:       timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  bookingCodeIdx:   uniqueIndex("t_bookings_code_idx").on(table.booking_code),
  userIdx:          index("t_bookings_user_idx").on(table.user_id),
  showtimeIdx:      index("t_bookings_showtime_idx").on(table.showtime_id),
  statusIdx:        index("t_bookings_status_idx").on(table.status),
  idempotencyIdx:   uniqueIndex("t_bookings_idempotency_idx").on(table.idempotency_key),
  createdAtIdx:     index("t_bookings_created_at_idx").on(table.created_at),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_booking_items — Detail Tiket per Kursi dalam satu Booking
// Satu booking bisa punya banyak item (satu per kursi yang dipilih).
// ─────────────────────────────────────────────────────────────────────────────
export const t_booking_items = pgTable("t_booking_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  booking_id:   uuid("booking_id").notNull().references(() => t_bookings.id, { onDelete: "cascade" }),
  seat_id:      uuid("seat_id").notNull().references(() => m_seats.id),

  // Snapshot Data Kursi (disimpan agar tidak terpengaruh perubahan master data)
  seat_label:   varchar("seat_label", { length: 5 }).notNull(),     // Contoh: "A1", "B12"
  seat_type:    seatTypeEnum("seat_type").notNull(),
  seat_row:     varchar("seat_row", { length: 2 }).notNull(),
  seat_col:     smallint("seat_col").notNull(),

  // Harga
  price:        integer("price").notNull(),

  // QR Code Tiket — Setiap kursi punya QR code unik tersendiri
  // Isi: JWT signed { booking_item_id, booking_id, showtime_id, seat_label, exp }
  qr_code_data: text("qr_code_data").notNull(),                    // Raw JWT string
  qr_code_url:  text("qr_code_url"),                               // URL gambar QR code di Cloudinary (opsional)

  // Validasi di Pintu Masuk
  is_validated:   boolean("is_validated").notNull().default(false),
  validated_at:   timestamp("validated_at"),
  validated_by:   uuid("validated_by"),                             // Staff yang scan

  // Metadata
  created_at:     timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  bookingIdx:   index("t_booking_items_booking_idx").on(table.booking_id),
  seatIdx:      index("t_booking_items_seat_idx").on(table.seat_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_booking_foods — Item F&B dalam satu Booking
// ─────────────────────────────────────────────────────────────────────────────
export const t_booking_foods = pgTable("t_booking_foods", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  booking_id:     uuid("booking_id").notNull().references(() => t_bookings.id, { onDelete: "cascade" }),
  food_item_id:   uuid("food_item_id").notNull().references(() => m_food_items.id),

  // Snapshot Data F&B
  food_name:      varchar("food_name", { length: 100 }).notNull(),   // Snapshot nama saat order
  food_category:  varchar("food_category", { length: 20 }).notNull(),

  // Kuantitas & Harga
  quantity:       smallint("quantity").notNull().default(1),
  unit_price:     integer("unit_price").notNull(),                    // Snapshot harga saat order
  subtotal:       integer("subtotal").notNull(),                      // quantity * unit_price

  // Status Pengambilan
  is_picked_up:   boolean("is_picked_up").notNull().default(false),
  picked_up_at:   timestamp("picked_up_at"),

  // Metadata
  created_at:     timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  bookingIdx: index("t_booking_foods_booking_idx").on(table.booking_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_movie_reviews — Ulasan Film oleh Pelanggan
// Hanya bisa dibuat setelah booking dengan status CONFIRMED & jadwal sudah selesai
// ─────────────────────────────────────────────────────────────────────────────
export const t_movie_reviews = pgTable("t_movie_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  user_id:      uuid("user_id").notNull().references(() => m_users.id),
  movie_id:     uuid("movie_id").notNull().references(() => m_movies.id),
  booking_id:   uuid("booking_id").notNull().references(() => t_bookings.id), // Bukti sudah nonton

  // Konten Review
  rating:       smallint("rating").notNull(),                        // 1–5 bintang
  title:        varchar("title", { length: 100 }),
  body:         text("body"),

  // Moderasi
  is_spoiler:   boolean("is_spoiler").notNull().default(false),
  is_approved:  boolean("is_approved").notNull().default(true),      // FALSE jika diblokir admin
  rejected_reason: text("rejected_reason"),

  // Helpful Votes
  helpful_count: integer("helpful_count").notNull().default(0),

  // Metadata
  created_at:   timestamp("created_at").notNull().defaultNow(),
  updated_at:   timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Satu user hanya bisa review film yang sama sekali (via booking yang berbeda)
  // Tapi kita batasi: 1 review per booking per film
  userMovieIdx: index("t_movie_reviews_user_movie_idx").on(table.user_id, table.movie_id),
  movieIdx:     index("t_movie_reviews_movie_idx").on(table.movie_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const t_bookings_relations = relations(t_bookings, ({ one, many }) => ({
  user:     one(m_users, {
    fields: [t_bookings.user_id],
    references: [m_users.id],
  }),
  showtime: one(t_showtimes, {
    fields: [t_bookings.showtime_id],
    references: [t_showtimes.id],
  }),
  voucher: one(m_vouchers, {
    fields: [t_bookings.voucher_id],
    references: [m_vouchers.id],
  }),
  items:  many(t_booking_items),
  foods:  many(t_booking_foods),
}));

export const t_booking_items_relations = relations(t_booking_items, ({ one }) => ({
  booking: one(t_bookings, {
    fields: [t_booking_items.booking_id],
    references: [t_bookings.id],
  }),
  seat: one(m_seats, {
    fields: [t_booking_items.seat_id],
    references: [m_seats.id],
  }),
}));

export const t_booking_foods_relations = relations(t_booking_foods, ({ one }) => ({
  booking: one(t_bookings, {
    fields: [t_booking_foods.booking_id],
    references: [t_bookings.id],
  }),
  food_item: one(m_food_items, {
    fields: [t_booking_foods.food_item_id],
    references: [m_food_items.id],
  }),
}));

export const t_movie_reviews_relations = relations(t_movie_reviews, ({ one }) => ({
  user:    one(m_users, { fields: [t_movie_reviews.user_id], references: [m_users.id] }),
  movie:   one(m_movies, { fields: [t_movie_reviews.movie_id], references: [m_movies.id] }),
  booking: one(t_bookings, { fields: [t_movie_reviews.booking_id], references: [t_bookings.id] }),
}));
