/**
 * TRANSACTION DATA: Loyalty Points, Auth Tokens, Notifications, Voucher Usage
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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_users } from "../master/m_users";
import { m_vouchers } from "../master/m_commerce";
import { t_bookings } from "./t_bookings";
import {
  pointTransactionTypeEnum,
  notificationTypeEnum,
  notificationChannelEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// t_point_transactions — Riwayat Transaksi Poin (Earn & Redeem)
// Setiap perubahan poin dicatat di sini. Ini adalah ledger poin.
// ─────────────────────────────────────────────────────────────────────────────
export const t_point_transactions = pgTable("t_point_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  user_id:        uuid("user_id").notNull().references(() => m_users.id),
  booking_id:     uuid("booking_id").references(() => t_bookings.id), // NULL jika bukan dari booking

  // Transaksi Poin
  type:           pointTransactionTypeEnum("type").notNull(),
  points:         integer("points").notNull(),                     // Positif = earn, Negatif = redeem/expire

  // Saldo Poin (snapshot setelah transaksi ini)
  balance_before: integer("balance_before").notNull(),
  balance_after:  integer("balance_after").notNull(),

  // Kadaluarsa Poin (untuk poin yang di-earn, ada masa berlaku 1 tahun)
  expires_at:     timestamp("expires_at"),                         // NULL = tidak kadaluarsa

  // Deskripsi
  description:    text("description").notNull(),                   // contoh: "Poin dari booking XII-2026-A1B2"

  // Metadata
  is_reversed:    boolean("is_reversed").notNull().default(false), // TRUE jika booking dibatalkan & poin dikembalikan
  created_at:     timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx:      index("t_point_transactions_user_idx").on(table.user_id),
  bookingIdx:   index("t_point_transactions_booking_idx").on(table.booking_id),
  typeIdx:      index("t_point_transactions_type_idx").on(table.type),
  createdAtIdx: index("t_point_transactions_created_at_idx").on(table.created_at),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_voucher_usages — Log Penggunaan Voucher per User per Booking
// ─────────────────────────────────────────────────────────────────────────────
export const t_voucher_usages = pgTable("t_voucher_usages", {
  id:           uuid("id").primaryKey().defaultRandom(),
  voucher_id:   uuid("voucher_id").notNull().references(() => m_vouchers.id),
  user_id:      uuid("user_id").notNull().references(() => m_users.id),
  booking_id:   uuid("booking_id").notNull().references(() => t_bookings.id),

  // Nilai diskon yang diberikan dari voucher ini
  discount_amount: integer("discount_amount").notNull(),

  created_at:   timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  voucherUserIdx: index("t_voucher_usages_voucher_user_idx").on(table.voucher_id, table.user_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_notifications — Riwayat Notifikasi yang Dikirim ke Pengguna
// ─────────────────────────────────────────────────────────────────────────────
export const t_notifications = pgTable("t_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Penerima
  user_id:        uuid("user_id").notNull().references(() => m_users.id),

  // Konten
  type:           notificationTypeEnum("type").notNull(),
  channel:        notificationChannelEnum("channel").notNull(),
  title:          varchar("title", { length: 100 }).notNull(),
  body:           text("body").notNull(),
  image_url:      text("image_url"),

  // Deep Link (untuk navigasi saat notifikasi di-tap)
  deep_link:      varchar("deep_link", { length: 200 }),             // contoh: "xii://booking/XII-2026-A1B2"
  action_url:     text("action_url"),                                 // URL untuk notifikasi web/email

  // Referensi ke entitas terkait
  related_entity_type: varchar("related_entity_type", { length: 50 }), // "BOOKING", "MOVIE", "PROMO"
  related_entity_id:   uuid("related_entity_id"),

  // Status Pengiriman
  is_sent:        boolean("is_sent").notNull().default(false),
  sent_at:        timestamp("sent_at"),
  send_error:     text("send_error"),                               // Error jika gagal kirim

  // Status Baca (untuk In-App Notification)
  is_read:        boolean("is_read").notNull().default(false),
  read_at:        timestamp("read_at"),

  // Jadwal Kirim (untuk notifikasi yang dijadwalkan)
  scheduled_at:   timestamp("scheduled_at"),                         // NULL = kirim segera

  // Metadata
  created_at:     timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx:        index("t_notifications_user_idx").on(table.user_id),
  typeIdx:        index("t_notifications_type_idx").on(table.type),
  isReadIdx:      index("t_notifications_is_read_idx").on(table.user_id, table.is_read),
  scheduledAtIdx: index("t_notifications_scheduled_at_idx").on(table.scheduled_at),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_otp_codes — Kode OTP untuk Verifikasi (Registrasi, Reset Password)
// ─────────────────────────────────────────────────────────────────────────────
export const t_otp_codes = pgTable("t_otp_codes", {
  id:         uuid("id").primaryKey().defaultRandom(),
  user_id:    uuid("user_id").references(() => m_users.id),
  target:     varchar("target", { length: 150 }).notNull(), // Email atau nomor HP
  code:       varchar("code", { length: 6 }).notNull(),     // 6-digit OTP
  purpose:    varchar("purpose", { length: 30 }).notNull(), // "EMAIL_VERIFY", "PHONE_VERIFY", "RESET_PASSWORD"
  is_used:    boolean("is_used").notNull().default(false),
  attempts:   integer("attempts").notNull().default(0),     // Jumlah percobaan verifikasi (max 5)
  expires_at: timestamp("expires_at").notNull(),            // Kadaluarsa dalam 5 menit
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  targetIdx: index("t_otp_codes_target_idx").on(table.target, table.purpose),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_refresh_tokens — Token untuk Refresh JWT Access Token
// ─────────────────────────────────────────────────────────────────────────────
export const t_refresh_tokens = pgTable("t_refresh_tokens", {
  id:           uuid("id").primaryKey().defaultRandom(),
  user_id:      uuid("user_id").notNull().references(() => m_users.id, { onDelete: "cascade" }),
  token_hash:   varchar("token_hash", { length: 64 }).notNull().unique(), // SHA-256 hash dari token

  // Info Device (untuk session management)
  device_name:  varchar("device_name", { length: 100 }),
  device_ip:    varchar("device_ip", { length: 45 }),
  user_agent:   text("user_agent"),

  is_revoked:   boolean("is_revoked").notNull().default(false),
  revoked_at:   timestamp("revoked_at"),
  expires_at:   timestamp("expires_at").notNull(),
  created_at:   timestamp("created_at").notNull().defaultNow(),
  last_used_at: timestamp("last_used_at"),
}, (table) => ({
  userIdx:    index("t_refresh_tokens_user_idx").on(table.user_id),
  tokenIdx:   uniqueIndex("t_refresh_tokens_hash_idx").on(table.token_hash),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_ticket_validations — Log Validasi Tiket di Pintu Masuk Studio
// ─────────────────────────────────────────────────────────────────────────────
export const t_ticket_validations = pgTable("t_ticket_validations", {
  id:                 uuid("id").primaryKey().defaultRandom(),
  booking_item_id:    uuid("booking_item_id").notNull(),             // FK ke t_booking_items
  showtime_id:        uuid("showtime_id").notNull(),                  // FK ke t_showtimes
  scanned_by_user_id: uuid("scanned_by_user_id").notNull(),          // Staff yang scan

  // Hasil Validasi
  is_valid:           boolean("is_valid").notNull(),
  validation_result:  varchar("validation_result", { length: 30 }).notNull(),
  // Nilai: "VALID", "ALREADY_USED", "INVALID_QR", "WRONG_SHOWTIME", "EXPIRED_BOOKING"

  scanned_at:         timestamp("scanned_at").notNull().defaultNow(),
}, (table) => ({
  bookingItemIdx: index("t_ticket_validations_item_idx").on(table.booking_item_id),
  showtimeIdx:    index("t_ticket_validations_showtime_idx").on(table.showtime_id),
  scannedAtIdx:   index("t_ticket_validations_scanned_at_idx").on(table.scanned_at),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const t_point_transactions_relations = relations(t_point_transactions, ({ one }) => ({
  user:    one(m_users, { fields: [t_point_transactions.user_id], references: [m_users.id] }),
  booking: one(t_bookings, { fields: [t_point_transactions.booking_id], references: [t_bookings.id] }),
}));

export const t_voucher_usages_relations = relations(t_voucher_usages, ({ one }) => ({
  voucher: one(m_vouchers, { fields: [t_voucher_usages.voucher_id], references: [m_vouchers.id] }),
  user:    one(m_users, { fields: [t_voucher_usages.user_id], references: [m_users.id] }),
  booking: one(t_bookings, { fields: [t_voucher_usages.booking_id], references: [t_bookings.id] }),
}));

export const t_notifications_relations = relations(t_notifications, ({ one }) => ({
  user: one(m_users, { fields: [t_notifications.user_id], references: [m_users.id] }),
}));

export const t_refresh_tokens_relations = relations(t_refresh_tokens, ({ one }) => ({
  user: one(m_users, { fields: [t_refresh_tokens.user_id], references: [m_users.id] }),
}));
