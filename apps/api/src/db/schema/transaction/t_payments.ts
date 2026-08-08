/**
 * TRANSACTION DATA: Payments & Payment Logs
 * Mengelola transaksi pembayaran via Midtrans.
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
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_users } from "../master/m_users";
import { t_bookings } from "./t_bookings";
import { paymentStatusEnum, paymentMethodEnum } from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// t_payments — Transaksi Pembayaran
// Satu booking punya satu record pembayaran.
// Jika pembayaran gagal lalu user coba lagi, buat record baru (jangan update yang lama).
// ─────────────────────────────────────────────────────────────────────────────
export const t_payments = pgTable("t_payments", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  booking_id:             uuid("booking_id").notNull().references(() => t_bookings.id),
  user_id:                uuid("user_id").notNull().references(() => m_users.id),

  // Referensi Midtrans
  midtrans_order_id:      varchar("midtrans_order_id", { length: 100 }).notNull().unique(),
  // Format: "XII-{booking_code}-{timestamp}" — unik setiap percobaan bayar
  midtrans_transaction_id: varchar("midtrans_transaction_id", { length: 200 }),
  snap_token:             text("snap_token"),                      // Token untuk Midtrans Snap UI

  // Detail Pembayaran
  amount:                 integer("amount").notNull(),              // Total yang harus dibayar
  payment_method:         paymentMethodEnum("payment_method"),      // Diisi setelah bayar
  payment_method_detail:  varchar("payment_method_detail", { length: 100 }), // contoh: "BCA Virtual Account 1234567890"

  // Status
  status:                 paymentStatusEnum("status").notNull().default("PENDING"),

  // Waktu
  created_at:             timestamp("created_at").notNull().defaultNow(),
  paid_at:                timestamp("paid_at"),                    // Waktu konfirmasi bayar dari Midtrans
  expired_at:             timestamp("expired_at"),                 // Waktu kadaluarsa
  refunded_at:            timestamp("refunded_at"),

  // Raw Response dari Midtrans (untuk debugging & audit)
  midtrans_raw_response:  jsonb("midtrans_raw_response"),

  // Refund Info
  refund_amount:          integer("refund_amount"),
  refund_reason:          text("refund_reason"),
  refund_reference_id:    varchar("refund_reference_id", { length: 100 }),
}, (table) => ({
  bookingIdx:     index("t_payments_booking_idx").on(table.booking_id),
  orderIdIdx:     index("t_payments_order_id_idx").on(table.midtrans_order_id),
  statusIdx:      index("t_payments_status_idx").on(table.status),
  userIdx:        index("t_payments_user_idx").on(table.user_id),
  createdAtIdx:   index("t_payments_created_at_idx").on(table.created_at),
}));

// ─────────────────────────────────────────────────────────────────────────────
// t_payment_logs — Log Webhook & Event dari Midtrans
// Setiap notification dari Midtrans dicatat di sini untuk audit trail.
// ─────────────────────────────────────────────────────────────────────────────
export const t_payment_logs = pgTable("t_payment_logs", {
  id:             uuid("id").primaryKey().defaultRandom(),
  payment_id:     uuid("payment_id").references(() => t_payments.id),
  event_type:     varchar("event_type", { length: 50 }).notNull(),  // contoh: "NOTIFICATION", "STATUS_CHECK"
  source:         varchar("source", { length: 50 }).notNull(),      // "MIDTRANS_WEBHOOK", "MANUAL_CHECK"
  payload:        jsonb("payload"),                                   // Raw payload yang diterima
  is_verified:    boolean("is_verified").notNull().default(false),   // Apakah signature valid
  notes:          text("notes"),
  created_at:     timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  paymentIdx: index("t_payment_logs_payment_idx").on(table.payment_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const t_payments_relations = relations(t_payments, ({ one, many }) => ({
  booking:  one(t_bookings, {
    fields: [t_payments.booking_id],
    references: [t_bookings.id],
  }),
  user:     one(m_users, {
    fields: [t_payments.user_id],
    references: [m_users.id],
  }),
  logs:     many(t_payment_logs),
}));

export const t_payment_logs_relations = relations(t_payment_logs, ({ one }) => ({
  payment: one(t_payments, {
    fields: [t_payment_logs.payment_id],
    references: [t_payments.id],
  }),
}));
