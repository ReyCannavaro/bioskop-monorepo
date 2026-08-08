/**
 * REPORT DATA: Tabel-tabel Laporan (Materialized / Aggregated)
 * Tabel ini diisi oleh background job (bukan user langsung).
 * Tujuan: Mempercepat query dashboard & laporan analitik tanpa membebani tabel transaksi.
 * Prefix: r_
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
  decimal,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_cinemas, m_studios } from "../master/m_cinemas";
import { m_movies } from "../master/m_movies";
import { m_cities } from "../master/m_locations";

// ─────────────────────────────────────────────────────────────────────────────
// r_daily_sales — Rekapitulasi Penjualan Harian per Bioskop
// Diperbarui setiap hari pada pukul 00:05 WIB oleh background job.
// ─────────────────────────────────────────────────────────────────────────────
export const r_daily_sales = pgTable("r_daily_sales", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  date:             date("date").notNull(),
  cinema_id:        uuid("cinema_id").notNull().references(() => m_cinemas.id, { onDelete: "cascade" }),
  city_id:          uuid("city_id").notNull(),                           // Snapshot dari cinema.mall.city

  // Metriks Tiket
  total_bookings:   integer("total_bookings").notNull().default(0),      // Jumlah transaksi booking
  total_tickets:    integer("total_tickets").notNull().default(0),       // Jumlah kursi terjual
  cancelled_tickets: integer("cancelled_tickets").notNull().default(0),

  // Metriks Revenue
  gross_revenue:    integer("gross_revenue").notNull().default(0),       // Total sebelum diskon (IDR)
  discount_amount:  integer("discount_amount").notNull().default(0),     // Total diskon
  net_revenue:      integer("net_revenue").notNull().default(0),         // Gross - Discount (IDR)
  service_fee_total: integer("service_fee_total").notNull().default(0),  // Total biaya layanan

  // Metriks F&B
  food_revenue:     integer("food_revenue").notNull().default(0),        // Revenue dari F&B

  // Metriks Pengguna
  unique_customers: integer("unique_customers").notNull().default(0),    // Pelanggan unik
  new_customers:    integer("new_customers").notNull().default(0),       // Pelanggan baru hari itu

  // Breakdown Metode Pembayaran (JSON untuk fleksibilitas)
  payment_breakdown: text("payment_breakdown"),                           // JSON: { "GOPAY": 150000, "QRIS": 200000 }

  // Metadata
  computed_at:      timestamp("computed_at").notNull().defaultNow(),
  is_finalized:     boolean("is_finalized").notNull().default(false),    // TRUE jika hari sudah selesai
}, (table) => ({
  dateCinemaIdx:  uniqueIndex("r_daily_sales_date_cinema_idx").on(table.date, table.cinema_id),
  dateIdx:        index("r_daily_sales_date_idx").on(table.date),
  cityIdx:        index("r_daily_sales_city_idx").on(table.city_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// r_movie_performance — Performa Film per Bioskop per Periode
// ─────────────────────────────────────────────────────────────────────────────
export const r_movie_performance = pgTable("r_movie_performance", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  date:             date("date").notNull(),                              // Tanggal laporan
  movie_id:         uuid("movie_id").notNull().references(() => m_movies.id, { onDelete: "cascade" }),
  cinema_id:        uuid("cinema_id").notNull().references(() => m_cinemas.id, { onDelete: "cascade" }),

  // Metriks
  total_showtimes:  smallint("total_showtimes").notNull().default(0),   // Jumlah sesi tayang hari ini
  total_tickets:    integer("total_tickets").notNull().default(0),
  gross_revenue:    integer("gross_revenue").notNull().default(0),
  net_revenue:      integer("net_revenue").notNull().default(0),

  // Occupancy Rate
  total_capacity:   integer("total_capacity").notNull().default(0),     // Total kapasitas kursi dari semua sesi
  occupancy_rate:   decimal("occupancy_rate", { precision: 5, scale: 2 }).notNull().default("0"), // Persentase

  // Metadata
  computed_at:      timestamp("computed_at").notNull().defaultNow(),
}, (table) => ({
  datMovCinIdx:   uniqueIndex("r_movie_perf_date_movie_cinema_idx").on(table.date, table.movie_id, table.cinema_id),
  movieIdx:       index("r_movie_perf_movie_idx").on(table.movie_id),
  dateIdx:        index("r_movie_perf_date_idx").on(table.date),
}));

// ─────────────────────────────────────────────────────────────────────────────
// r_studio_occupancy — Tingkat Keterisian Studio per Showtime
// Diupdate real-time setiap ada booking confirmed atau cancelled.
// ─────────────────────────────────────────────────────────────────────────────
export const r_studio_occupancy = pgTable("r_studio_occupancy", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  showtime_id:      uuid("showtime_id").notNull().unique(),              // FK ke t_showtimes
  studio_id:        uuid("studio_id").notNull().references(() => m_studios.id),
  cinema_id:        uuid("cinema_id").notNull().references(() => m_cinemas.id),
  date:             date("date").notNull(),

  // Kapasitas
  total_seats:      smallint("total_seats").notNull().default(0),
  booked_seats:     smallint("booked_seats").notNull().default(0),
  available_seats:  smallint("available_seats").notNull().default(0),
  locked_seats:     smallint("locked_seats").notNull().default(0),

  // Rate
  occupancy_rate:   decimal("occupancy_rate", { precision: 5, scale: 2 }).notNull().default("0"),

  // Revenue dari showtime ini
  gross_revenue:    integer("gross_revenue").notNull().default(0),

  // Metadata
  updated_at:       timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  dateStudioIdx:  index("r_studio_occ_date_studio_idx").on(table.date, table.studio_id),
  cinemaDateIdx:  index("r_studio_occ_cinema_date_idx").on(table.cinema_id, table.date),
}));

// ─────────────────────────────────────────────────────────────────────────────
// r_monthly_summary — Rekapitulasi Bulanan per Bioskop
// Diperbarui setiap awal bulan berikutnya.
// ─────────────────────────────────────────────────────────────────────────────
export const r_monthly_summary = pgTable("r_monthly_summary", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  year:             smallint("year").notNull(),
  month:            smallint("month").notNull(),                         // 1-12
  cinema_id:        uuid("cinema_id").notNull().references(() => m_cinemas.id, { onDelete: "cascade" }),

  // Metriks Tiket
  total_bookings:   integer("total_bookings").notNull().default(0),
  total_tickets:    integer("total_tickets").notNull().default(0),
  cancelled_tickets: integer("cancelled_tickets").notNull().default(0),
  refunded_tickets: integer("refunded_tickets").notNull().default(0),

  // Metriks Revenue
  gross_revenue:    integer("gross_revenue").notNull().default(0),
  discount_amount:  integer("discount_amount").notNull().default(0),
  net_revenue:      integer("net_revenue").notNull().default(0),
  food_revenue:     integer("food_revenue").notNull().default(0),
  total_revenue:    integer("total_revenue").notNull().default(0),       // net + food

  // Metriks Pengguna
  unique_customers:   integer("unique_customers").notNull().default(0),
  new_customers:      integer("new_customers").notNull().default(0),
  returning_customers: integer("returning_customers").notNull().default(0),

  // Metriks Occupancy
  avg_occupancy_rate: decimal("avg_occupancy_rate", { precision: 5, scale: 2 }).notNull().default("0"),

  // Top Film Bulan Ini (JSON)
  top_movies: text("top_movies"),                                        // JSON: [{ movie_id, tickets, revenue }]

  // Metadata
  computed_at:      timestamp("computed_at").notNull().defaultNow(),
  is_finalized:     boolean("is_finalized").notNull().default(false),
}, (table) => ({
  yearMonthCinemaIdx: uniqueIndex("r_monthly_summary_ym_cinema_idx").on(table.year, table.month, table.cinema_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// r_user_activity_summary — Ringkasan Aktivitas Pengguna per Bulan
// Untuk analitik MAU, retensi, dan tier loyalty.
// ─────────────────────────────────────────────────────────────────────────────
export const r_user_activity_summary = pgTable("r_user_activity_summary", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  year:                 smallint("year").notNull(),
  month:                smallint("month").notNull(),
  city_id:              uuid("city_id"),                               // NULL = semua kota

  // Metriks Pengguna
  total_registered:     integer("total_registered").notNull().default(0),
  new_registered:       integer("new_registered").notNull().default(0),  // Registrasi bulan ini
  monthly_active:       integer("monthly_active").notNull().default(0),  // MAU
  daily_active_avg:     integer("daily_active_avg").notNull().default(0), // Rata-rata DAU

  // Breakdown Tier Loyalty
  tier_classic_count:   integer("tier_classic_count").notNull().default(0),
  tier_silver_count:    integer("tier_silver_count").notNull().default(0),
  tier_gold_count:      integer("tier_gold_count").notNull().default(0),
  tier_platinum_count:  integer("tier_platinum_count").notNull().default(0),

  // Breakdown Sumber Booking
  booking_from_mobile:  integer("booking_from_mobile").notNull().default(0),
  booking_from_web:     integer("booking_from_web").notNull().default(0),
  booking_from_boxoffice: integer("booking_from_boxoffice").notNull().default(0),

  // Metadata
  computed_at:          timestamp("computed_at").notNull().defaultNow(),
}, (table) => ({
  yearMonthCityIdx: uniqueIndex("r_user_activity_ym_city_idx").on(table.year, table.month, table.city_id),
}));

// ─────────────────────────────────────────────────────────────────────────────
// r_food_sales — Laporan Penjualan F&B per Hari per Bioskop
// ─────────────────────────────────────────────────────────────────────────────
export const r_food_sales = pgTable("r_food_sales", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Dimensi
  date:             date("date").notNull(),
  cinema_id:        uuid("cinema_id").notNull().references(() => m_cinemas.id, { onDelete: "cascade" }),
  food_item_id:     uuid("food_item_id").notNull(),                    // Snapshot, tanpa FK untuk performa

  // Snapshot Info Produk
  food_name:        varchar("food_name", { length: 100 }).notNull(),
  food_category:    varchar("food_category", { length: 20 }).notNull(),

  // Metriks
  total_quantity:   integer("total_quantity").notNull().default(0),
  total_revenue:    integer("total_revenue").notNull().default(0),

  // Metadata
  computed_at:      timestamp("computed_at").notNull().defaultNow(),
}, (table) => ({
  dateCinemaFoodIdx: uniqueIndex("r_food_sales_date_cinema_food_idx").on(table.date, table.cinema_id, table.food_item_id),
}));
