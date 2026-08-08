/**
 * Centralized PostgreSQL Enum definitions for XII Cinema Platform.
 * All enums are prefixed with their domain for clarity.
 */
import { pgEnum } from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// USER & AUTH ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "MANAGER",
  "BOX_OFFICE",
  "CUSTOMER",
]);

export const membershipTierEnum = pgEnum("membership_tier", [
  "CLASSIC",
  "SILVER",
  "GOLD",
  "PLATINUM",
]);

export const authProviderEnum = pgEnum("auth_provider", [
  "EMAIL",
  "GOOGLE",
  "APPLE",
]);

// ─────────────────────────────────────────────────────────────────────────────
// CINEMA & LOCATION ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const cinemaStatusEnum = pgEnum("cinema_status", [
  "ACTIVE",
  "MAINTENANCE",
  "CLOSED",
]);

export const studioTypeEnum = pgEnum("studio_type", [
  "REGULAR",
  "IMAX",
  "GOLD_CLASS",
  "FOUR_DX",
  "SWEETBOX",
  "VELVET",
  "PREMIERE",
]);

export const studioStatusEnum = pgEnum("studio_status", [
  "ACTIVE",
  "MAINTENANCE",
]);

// ─────────────────────────────────────────────────────────────────────────────
// SEAT ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const seatTypeEnum = pgEnum("seat_type", [
  "REGULAR",
  "PREMIUM",
  "COUPLE",
  "WHEELCHAIR",
  "VOID",
]);

export const seatStatusEnum = pgEnum("seat_status", [
  "AVAILABLE",
  "LOCKED",
  "BOOKED",
]);

// ─────────────────────────────────────────────────────────────────────────────
// MOVIE ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const movieStatusEnum = pgEnum("movie_status", [
  "DRAFT",
  "COMING_SOON",
  "NOW_SHOWING",
  "ENDED",
]);

export const ageRatingEnum = pgEnum("age_rating", [
  "SU",          // Semua Umur
  "THIRTEEN_PLUS",   // 13+
  "SEVENTEEN_PLUS",  // 17+
  "TWENTYONE_PLUS",  // 21+
]);

export const movieLanguageEnum = pgEnum("movie_language", [
  "BAHASA_INDONESIA",
  "ENGLISH",
  "KOREAN",
  "JAPANESE",
  "MANDARIN",
  "OTHER",
]);

// ─────────────────────────────────────────────────────────────────────────────
// SHOWTIME ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const showtimeStatusEnum = pgEnum("showtime_status", [
  "SCHEDULED",
  "ONGOING",
  "ENDED",
  "CANCELLED",
]);

export const showTimePeriodEnum = pgEnum("showtime_period", [
  "MATINEE",  // Pagi (sebelum jam 12)
  "REGULAR",  // Siang-sore (12-18)
  "NIGHT",    // Malam (18+)
  "MIDNIGHT", // Tengah malam (23+)
]);

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING & PAYMENT ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const bookingStatusEnum = pgEnum("booking_status", [
  "PENDING",      // Menunggu pembayaran
  "CONFIRMED",    // Pembayaran berhasil
  "CANCELLED",    // Dibatalkan user/sistem
  "REFUNDED",     // Sudah di-refund
  "EXPIRED",      // Waktu pembayaran habis
]);

export const bookingSourceEnum = pgEnum("booking_source", [
  "MOBILE_APP",
  "WEB",
  "BOX_OFFICE",   // Pembelian manual oleh staf
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
  "REFUNDED",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "GOPAY",
  "OVO",
  "DANA",
  "SHOPEE_PAY",
  "QRIS",
  "BCA_VA",
  "BNI_VA",
  "BRI_VA",
  "MANDIRI_VA",
  "PERMATA_VA",
  "OTHER_VA",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",           // Untuk pembelian di box office
]);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD & BEVERAGE ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const foodCategoryEnum = pgEnum("food_category", [
  "POPCORN",
  "DRINK",
  "SNACK",
  "COMBO",
  "MEAL",
  "DESSERT",
]);

// ─────────────────────────────────────────────────────────────────────────────
// VOUCHER ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const voucherTypeEnum = pgEnum("voucher_type", [
  "PERCENTAGE",   // Diskon persentase
  "FIXED",        // Diskon nominal tetap
  "FREE_ITEM",    // Item gratis (F&B)
  "UPGRADE",      // Upgrade kursi gratis
]);

export const voucherScopeEnum = pgEnum("voucher_scope", [
  "ALL",          // Berlaku untuk semua
  "SPECIFIC_MOVIE",
  "SPECIFIC_CINEMA",
  "SPECIFIC_STUDIO_TYPE",
  "FOOD_ONLY",
  "TICKET_ONLY",
]);

// ─────────────────────────────────────────────────────────────────────────────
// POINTS ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const pointTransactionTypeEnum = pgEnum("point_transaction_type", [
  "EARN_TICKET",        // Dapat poin dari beli tiket
  "EARN_FOOD",          // Dapat poin dari beli F&B
  "EARN_REVIEW",        // Dapat poin dari review film
  "EARN_BIRTHDAY",      // Bonus poin ulang tahun
  "EARN_REFERRAL",      // Bonus poin referral
  "EARN_FIRST_BOOKING", // Bonus poin pertama kali booking
  "REDEEM",             // Penukaran poin jadi diskon
  "EXPIRED",            // Poin kadaluarsa
  "ADJUSTMENT",         // Koreksi manual oleh admin
]);

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum("notification_type", [
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "TICKET_REMINDER_24H",
  "TICKET_REMINDER_2H",
  "PROMO",
  "NEW_MOVIE",
  "POINT_EARNED",
  "POINT_EXPIRING",
  "SYSTEM",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "PUSH",     // Firebase Push Notification
  "EMAIL",    // Email via Resend
  "IN_APP",   // In-app notification bell
  "SMS",      // SMS (opsional)
]);

// ─────────────────────────────────────────────────────────────────────────────
// PRICE RULE ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const dayTypeEnum = pgEnum("day_type", [
  "WEEKDAY",    // Senin - Kamis
  "WEEKEND",    // Jumat - Minggu
  "HOLIDAY",    // Libur nasional
  "ALL",        // Semua hari
]);

// ─────────────────────────────────────────────────────────────────────────────
// REPORT ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const reportPeriodEnum = pgEnum("report_period", [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);
