/**
 * MASTER DATA: Malls, Cinemas, Studios, Seats
 * Hierarki: City -> Mall -> Cinema -> Studio -> Seat
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
  decimal,
  jsonb,
  smallint,
  char,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { m_cities } from "./m_locations";
import {
  cinemaStatusEnum,
  studioTypeEnum,
  studioStatusEnum,
  seatTypeEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// m_malls — Data Mall/Venue
// ─────────────────────────────────────────────────────────────────────────────
export const m_malls = pgTable("m_malls", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  city_id:        uuid("city_id").notNull().references(() => m_cities.id),

  // Identity
  name:           varchar("name", { length: 150 }).notNull(),
  slug:           varchar("slug", { length: 160 }).notNull().unique(),

  // Alamat & Lokasi
  address:        text("address").notNull(),
  district:       varchar("district", { length: 100 }),           // Kecamatan
  postal_code:    varchar("postal_code", { length: 10 }),
  latitude:       decimal("latitude", { precision: 10, scale: 7 }),
  longitude:      decimal("longitude", { precision: 10, scale: 7 }),
  google_maps_url: text("google_maps_url"),

  // Media
  thumbnail_url:  text("thumbnail_url"),

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
  created_by:     uuid("created_by"),                             // FK -> m_users (hindari circular, tanpa FK)
});

// ─────────────────────────────────────────────────────────────────────────────
// m_cinemas — Data Bioskop XII di dalam Mall
// ─────────────────────────────────────────────────────────────────────────────
export const m_cinemas = pgTable("m_cinemas", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  mall_id:        uuid("mall_id").notNull().references(() => m_malls.id),

  // Identity
  name:           varchar("name", { length: 150 }).notNull(),     // contoh: "XII Kelapa Gading"
  slug:           varchar("slug", { length: 160 }).notNull().unique(),
  code:           varchar("code", { length: 20 }).notNull().unique(), // contoh: "XII-KG-001"

  // Detail Lokasi dalam Mall
  floor:          varchar("floor", { length: 10 }),               // contoh: "LG", "2", "3A"
  phone:          varchar("phone", { length: 20 }),
  email:          varchar("email", { length: 100 }),
  whatsapp:       varchar("whatsapp", { length: 20 }),

  // Jam Operasional — stored as JSONB untuk fleksibilitas
  // Format: { "monday": {"open": "10:00", "close": "23:30"}, ... }
  operating_hours: jsonb("operating_hours"),

  // Status
  status:         cinemaStatusEnum("status").notNull().default("ACTIVE"),
  maintenance_note: text("maintenance_note"),                      // Alasan maintenance

  // Media
  banner_url:     text("banner_url"),
  logo_url:       text("logo_url"),

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
  created_by:     uuid("created_by"),
  updated_by:     uuid("updated_by"),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_studios — Studio/Aula Bioskop
// ─────────────────────────────────────────────────────────────────────────────
export const m_studios = pgTable("m_studios", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  cinema_id:      uuid("cinema_id").notNull().references(() => m_cinemas.id),

  // Identity
  name:           varchar("name", { length: 50 }).notNull(),      // contoh: "Studio 1", "IMAX"
  code:           varchar("code", { length: 10 }).notNull(),      // contoh: "S1", "IMAX", "GC"
  type:           studioTypeEnum("type").notNull().default("REGULAR"),

  // Layout Fisik — Akan diisi saat Seat Map Builder digunakan
  total_rows:     smallint("total_rows").notNull().default(0),
  total_cols:     smallint("total_cols").notNull().default(0),
  total_seats:    smallint("total_seats").notNull().default(0),   // Dihitung otomatis (exclude VOID)

  // Fasilitas
  has_dolby_atmos:  boolean("has_dolby_atmos").notNull().default(false),
  has_laser_projector: boolean("has_laser_projector").notNull().default(false),
  screen_size_meter: decimal("screen_size_meter", { precision: 5, scale: 2 }), // Ukuran layar dalam meter

  // Status
  status:         studioStatusEnum("status").notNull().default("ACTIVE"),
  maintenance_note: text("maintenance_note"),

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
  created_by:     uuid("created_by"),
  updated_by:     uuid("updated_by"),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_seats — Denah Kursi per Studio (Static Master)
// Tabel ini menyimpan posisi FISIK kursi yang tidak berubah.
// Status ketersediaan tiap jadwal ada di t_showtime_seats.
// ─────────────────────────────────────────────────────────────────────────────
export const m_seats = pgTable("m_seats", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  studio_id:      uuid("studio_id").notNull().references(() => m_studios.id),

  // Posisi pada Grid
  row_index:      smallint("row_index").notNull(),   // Indeks baris (0-based, untuk layout)
  col_index:      smallint("col_index").notNull(),   // Indeks kolom (0-based, untuk layout)

  // Identitas Kursi
  row_label:      char("row_label", { length: 2 }).notNull(), // Contoh: "A", "B", "AA"
  col_number:     smallint("col_number").notNull(),            // Contoh: 1, 2, 3, 12
  label:          varchar("label", { length: 5 }).notNull(),  // Gabungan: "A1", "B12", "AA5"

  // Tipe & Properti
  type:           seatTypeEnum("type").notNull().default("REGULAR"),
  is_aisle_left:  boolean("is_aisle_left").notNull().default(false),   // Ada lorong di kiri
  is_aisle_right: boolean("is_aisle_right").notNull().default(false),  // Ada lorong di kanan

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const m_malls_relations = relations(m_malls, ({ one, many }) => ({
  city: one(m_cities, {
    fields: [m_malls.city_id],
    references: [m_cities.id],
  }),
  cinemas: many(m_cinemas),
}));

export const m_cinemas_relations = relations(m_cinemas, ({ one, many }) => ({
  mall: one(m_malls, {
    fields: [m_cinemas.mall_id],
    references: [m_malls.id],
  }),
  studios: many(m_studios),
}));

export const m_studios_relations = relations(m_studios, ({ one, many }) => ({
  cinema: one(m_cinemas, {
    fields: [m_studios.cinema_id],
    references: [m_cinemas.id],
  }),
  seats: many(m_seats),
}));

export const m_seats_relations = relations(m_seats, ({ one }) => ({
  studio: one(m_studios, {
    fields: [m_seats.studio_id],
    references: [m_studios.id],
  }),
}));
