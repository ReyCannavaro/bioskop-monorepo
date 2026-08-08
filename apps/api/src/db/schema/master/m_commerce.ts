/**
 * MASTER DATA: Food & Beverage (Concession), Vouchers, Price Rules
 * Prefix: m_
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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_cinemas } from "./m_cinemas";
import {
  foodCategoryEnum,
  voucherTypeEnum,
  voucherScopeEnum,
  dayTypeEnum,
  studioTypeEnum,
  seatTypeEnum,
  showTimePeriodEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// m_food_items — Katalog Menu Makanan & Minuman
// ─────────────────────────────────────────────────────────────────────────────
export const m_food_items = pgTable("m_food_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Scope: NULL berarti tersedia di semua bioskop
  cinema_id:      uuid("cinema_id").references(() => m_cinemas.id, { onDelete: "set null" }),

  // Identity
  name:           varchar("name", { length: 100 }).notNull(),
  name_en:        varchar("name_en", { length: 100 }),
  description:    text("description"),
  category:       foodCategoryEnum("category").notNull(),

  // Media
  image_url:      text("image_url"),

  // Harga
  price:          integer("price").notNull(),                      // Dalam IDR (tanpa desimal)
  original_price: integer("original_price"),                       // Harga sebelum diskon (opsional)

  // Stok
  daily_stock:    smallint("daily_stock"),                         // NULL = tidak dibatasi
  calories:       smallint("calories"),                            // Info kalori opsional
  is_vegetarian:  boolean("is_vegetarian").notNull().default(false),
  allergens:      text("allergens"),                               // Info alergen

  // Display
  sort_order:     smallint("sort_order").notNull().default(0),
  is_featured:    boolean("is_featured").notNull().default(false),  // Item unggulan
  is_combo:       boolean("is_combo").notNull().default(false),     // Apakah ini paket combo

  // Status
  is_available:   boolean("is_available").notNull().default(true),
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
  created_by:     uuid("created_by"),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_vouchers — Master Kode Voucher & Promo
// ─────────────────────────────────────────────────────────────────────────────
export const m_vouchers = pgTable("m_vouchers", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identity
  code:               varchar("code", { length: 50 }).notNull().unique(),
  title:              varchar("title", { length: 100 }).notNull(),      // Nama promo
  description:        text("description"),
  terms_and_conditions: text("terms_and_conditions"),
  image_url:          text("image_url"),

  // Tipe & Nilai Diskon
  type:               voucherTypeEnum("type").notNull(),
  value:              integer("value").notNull(),                         // % atau IDR
  max_discount_amount: integer("max_discount_amount"),                    // Batas maksimal diskon (untuk %)

  // Scope & Aturan Penggunaan
  scope:              voucherScopeEnum("scope").notNull().default("ALL"),
  // Jika scope spesifik, isi salah satu dari bawah:
  applicable_movie_id:  uuid("applicable_movie_id"),
  applicable_cinema_id: uuid("applicable_cinema_id"),
  applicable_studio_type: studioTypeEnum("applicable_studio_type"),

  // Minimum Transaksi
  min_transaction:    integer("min_transaction").notNull().default(0),

  // Batas Penggunaan
  max_total_uses:     integer("max_total_uses"),                          // NULL = tidak dibatasi
  current_total_uses: integer("current_total_uses").notNull().default(0),
  max_uses_per_user:  smallint("max_uses_per_user").notNull().default(1),

  // Waktu Berlaku
  valid_from:         timestamp("valid_from").notNull(),
  valid_until:        timestamp("valid_until").notNull(),

  // Status
  is_active:          boolean("is_active").notNull().default(true),
  is_public:          boolean("is_public").notNull().default(true),      // FALSE = voucher rahasia (kode spesial)
  created_at:         timestamp("created_at").notNull().defaultNow(),
  updated_at:         timestamp("updated_at").notNull().defaultNow(),
  created_by:         uuid("created_by"),
}, (table) => ({
  validUntilIdx: index("m_vouchers_valid_until_idx").on(table.valid_until),
  isActiveIdx:   index("m_vouchers_is_active_idx").on(table.is_active),
}));

// ─────────────────────────────────────────────────────────────────────────────
// m_price_rules — Aturan Penetapan Harga Tiket
// Harga tiket bersifat dinamis tergantung: Hari, Waktu, Tipe Studio, Tipe Kursi
// ─────────────────────────────────────────────────────────────────────────────
export const m_price_rules = pgTable("m_price_rules", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Scope: NULL berarti berlaku untuk semua bioskop dalam jaringan
  cinema_id:        uuid("cinema_id").references(() => m_cinemas.id, { onDelete: "cascade" }),

  // Dimensi Harga
  studio_type:      studioTypeEnum("studio_type").notNull(),
  seat_type:        seatTypeEnum("seat_type").notNull(),
  day_type:         dayTypeEnum("day_type").notNull(),
  time_period:      showTimePeriodEnum("time_period").notNull(),

  // Harga
  price:            integer("price").notNull(),                    // Harga dalam IDR
  service_fee:      integer("service_fee").notNull().default(0),  // Biaya layanan platform

  // Metadata
  is_active:        boolean("is_active").notNull().default(true),
  created_at:       timestamp("created_at").notNull().defaultNow(),
  updated_at:       timestamp("updated_at").notNull().defaultNow(),
  created_by:       uuid("created_by"),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_national_holidays — Hari Libur Nasional (untuk Price Rule)
// ─────────────────────────────────────────────────────────────────────────────
export const m_national_holidays = pgTable("m_national_holidays", {
  id:           uuid("id").primaryKey().defaultRandom(),
  date:         date("date").notNull().unique(),
  name:         varchar("name", { length: 100 }).notNull(),       // contoh: "Hari Kemerdekaan RI"
  year:         smallint("year").notNull(),
  is_active:    boolean("is_active").notNull().default(true),
  created_at:   timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const m_food_items_relations = relations(m_food_items, ({ one }) => ({
  cinema: one(m_cinemas, {
    fields: [m_food_items.cinema_id],
    references: [m_cinemas.id],
  }),
}));

export const m_price_rules_relations = relations(m_price_rules, ({ one }) => ({
  cinema: one(m_cinemas, {
    fields: [m_price_rules.cinema_id],
    references: [m_cinemas.id],
  }),
}));
