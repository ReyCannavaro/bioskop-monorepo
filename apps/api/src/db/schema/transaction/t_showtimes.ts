/**
 * TRANSACTION DATA: Showtimes & Seat Status (Real-time)
 * Ini adalah inti dari sistem pemesanan tiket.
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
import { m_studios } from "../master/m_cinemas";
import { m_movies } from "../master/m_movies";
import { m_seats } from "../master/m_cinemas";
import { m_users } from "../master/m_users";
import { showtimeStatusEnum, showTimePeriodEnum, seatStatusEnum } from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// t_showtimes — Jadwal Tayang Film
// ─────────────────────────────────────────────────────────────────────────────
export const t_showtimes = pgTable("t_showtimes", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi utama
  studio_id:    uuid("studio_id").notNull().references(() => m_studios.id),
  movie_id:     uuid("movie_id").notNull().references(() => m_movies.id),

  // Waktu Tayang
  start_time:   timestamp("start_time").notNull(),
  end_time:     timestamp("end_time").notNull(),           // start_time + duration + cleanup time
  date:         varchar("date", { length: 10 }).notNull(), // "YYYY-MM-DD" — untuk query per hari yang cepat

  // Periode Waktu (untuk menentukan harga)
  time_period:  showTimePeriodEnum("time_period").notNull(),

  // Harga Snapshot — disalin dari m_price_rules saat showtime dibuat
  // Ini penting karena harga rule bisa berubah, tapi harga showtime yang sudah dijadwalkan tidak boleh berubah
  price_regular:  integer("price_regular").notNull(),
  price_premium:  integer("price_premium").notNull(),
  price_couple:   integer("price_couple").notNull(),
  price_gold:     integer("price_gold").notNull().default(0),  // Untuk Gold Class
  service_fee:    integer("service_fee").notNull().default(0),

  // Statistik (Denormalized untuk performa dashboard)
  total_seats:    smallint("total_seats").notNull().default(0),
  sold_seats:     smallint("sold_seats").notNull().default(0),
  available_seats: smallint("available_seats").notNull().default(0),
  locked_seats:   smallint("locked_seats").notNull().default(0),

  // Status
  status:         showtimeStatusEnum("status").notNull().default("SCHEDULED"),
  cancel_reason:  text("cancel_reason"),                    // Alasan pembatalan

  // Metadata
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
  created_by:     uuid("created_by"),
  updated_by:     uuid("updated_by"),
}, (table) => ({
  // Index kritis untuk performa query
  dateIdx:          index("t_showtimes_date_idx").on(table.date),
  studioDateIdx:    index("t_showtimes_studio_date_idx").on(table.studio_id, table.date),
  movieDateIdx:     index("t_showtimes_movie_date_idx").on(table.movie_id, table.date),
  statusIdx:        index("t_showtimes_status_idx").on(table.status),
  startTimeIdx:     index("t_showtimes_start_time_idx").on(table.start_time),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_showtime_seats — Status Kursi per Jadwal Tayang
// TABEL KRITIS: Ini yang mengatur seat locking & booking real-time.
// Setiap baris = satu kombinasi (showtime, seat).
// Dibuat secara BULK saat showtime baru dibuat (copy dari m_seats).
// ─────────────────────────────────────────────────────────────────────────────
export const t_showtime_seats = pgTable("t_showtime_seats", {
  // Composite Primary Key: showtime_id + seat_id
  showtime_id:      uuid("showtime_id").notNull().references(() => t_showtimes.id, { onDelete: "cascade" }),
  seat_id:          uuid("seat_id").notNull().references(() => m_seats.id),

  // Status Real-time (INILAH YANG DIKUNCI SAAT BOOKING)
  status:           seatStatusEnum("status").notNull().default("AVAILABLE"),

  // Seat Locking (AVAILABLE -> LOCKED -> BOOKED)
  locked_by_user_id: uuid("locked_by_user_id").references(() => m_users.id, { onDelete: "set null" }),
  locked_at:         timestamp("locked_at"),
  locked_until:      timestamp("locked_until"),              // Lock expires after 10 minutes

  // Setelah BOOKED, ini akan terisi
  booking_item_id:   uuid("booking_item_id"),                // FK ke t_booking_items (tanpa FK ketat untuk hindari deadlock)

  // Snapshot harga kursi (dari t_showtimes.price_*) — untuk referensi cepat
  price:             integer("price").notNull().default(0),

  // Metadata
  updated_at:        timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Index untuk query berdasarkan status (SANGAT SERING DIPAKAI)
  statusIdx:       index("t_showtime_seats_status_idx").on(table.showtime_id, table.status),
  lockedUntilIdx:  index("t_showtime_seats_locked_until_idx").on(table.locked_until),
  userLockIdx:     index("t_showtime_seats_user_lock_idx").on(table.locked_by_user_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const t_showtimes_relations = relations(t_showtimes, ({ one, many }) => ({
  studio:       one(m_studios, {
    fields: [t_showtimes.studio_id],
    references: [m_studios.id],
  }),
  movie:        one(m_movies, {
    fields: [t_showtimes.movie_id],
    references: [m_movies.id],
  }),
  showtime_seats: many(t_showtime_seats),
}));

export const t_showtime_seats_relations = relations(t_showtime_seats, ({ one }) => ({
  showtime: one(t_showtimes, {
    fields: [t_showtime_seats.showtime_id],
    references: [t_showtimes.id],
  }),
  seat: one(m_seats, {
    fields: [t_showtime_seats.seat_id],
    references: [m_seats.id],
  }),
  locked_by: one(m_users, {
    fields: [t_showtime_seats.locked_by_user_id],
    references: [m_users.id],
  }),
}));
