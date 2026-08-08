/**
 * MASTER DATA: Provinces & Cities
 * Hierarki: Province -> City
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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// m_provinces — Provinsi di Indonesia
// ─────────────────────────────────────────────────────────────────────────────
export const m_provinces = pgTable("m_provinces", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identity
  code:           varchar("code", { length: 10 }).notNull().unique(),   // contoh: "DKI", "JB"
  name:           varchar("name", { length: 100 }).notNull(),           // contoh: "DKI Jakarta"

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_cities — Kota/Kabupaten
// ─────────────────────────────────────────────────────────────────────────────
export const m_cities = pgTable("m_cities", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasi
  province_id:    uuid("province_id").notNull().references(() => m_provinces.id),

  // Identity
  code:           varchar("code", { length: 10 }).notNull().unique(),   // contoh: "JKT", "SBY"
  name:           varchar("name", { length: 100 }).notNull(),           // contoh: "Jakarta Selatan"
  timezone:       varchar("timezone", { length: 50 }).notNull().default("Asia/Jakarta"),

  // Metadata
  is_active:      boolean("is_active").notNull().default(true),
  created_at:     timestamp("created_at").notNull().defaultNow(),
  updated_at:     timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const m_provinces_relations = relations(m_provinces, ({ many }) => ({
  cities: many(m_cities),
}));

export const m_cities_relations = relations(m_cities, ({ one, many }) => ({
  province: one(m_provinces, {
    fields: [m_cities.province_id],
    references: [m_provinces.id],
  }),
}));
