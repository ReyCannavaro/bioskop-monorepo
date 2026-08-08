/**
 * MASTER DATA: Users & Authentication
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
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  userRoleEnum,
  membershipTierEnum,
  authProviderEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// m_users — Pengguna Platform (Customer & Internal Staff)
// ─────────────────────────────────────────────────────────────────────────────
export const m_users = pgTable("m_users", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identity
  name:               varchar("name", { length: 100 }).notNull(),
  email:              varchar("email", { length: 150 }).notNull().unique(),
  phone:              varchar("phone", { length: 20 }),
  password_hash:      text("password_hash"),                        // NULL jika OAuth

  // Profile
  avatar_url:         text("avatar_url"),
  birth_date:         date("birth_date"),
  gender:             varchar("gender", { length: 10 }),            // "MALE", "FEMALE", "OTHER"
  city_preference:    uuid("city_preference"),                      // Kota favorit untuk filter bioskop

  // Auth & Role
  role:               userRoleEnum("role").notNull().default("CUSTOMER"),
  auth_provider:      authProviderEnum("auth_provider").notNull().default("EMAIL"),
  oauth_provider_id:  varchar("oauth_provider_id", { length: 200 }), // Google UID, dll.

  // Untuk Internal Staff: bioskop yang dikelola
  managed_cinema_id:  uuid("managed_cinema_id"),                   // FK ke m_cinemas (tanpa FK untuk hindari circular)

  // Verification
  is_email_verified:  boolean("is_email_verified").notNull().default(false),
  is_phone_verified:  boolean("is_phone_verified").notNull().default(false),
  email_verified_at:  timestamp("email_verified_at"),
  phone_verified_at:  timestamp("phone_verified_at"),

  // Loyalty Program
  total_points:       integer("total_points").notNull().default(0),
  lifetime_points:    integer("lifetime_points").notNull().default(0),  // Total poin sepanjang masa
  membership_tier:    membershipTierEnum("membership_tier").notNull().default("CLASSIC"),
  tier_updated_at:    timestamp("tier_updated_at"),

  // Preferensi Notifikasi — stored as JSONB
  // Format: { "push": true, "email": true, "sms": false, "promo": true }
  notification_prefs: text("notification_prefs").default('{"push":true,"email":true,"sms":false,"promo":true}'),

  // Referral
  referral_code:      varchar("referral_code", { length: 20 }).unique(),  // Kode referral user ini
  referred_by:        uuid("referred_by"),                                  // FK -> m_users

  // Status & Security
  is_active:          boolean("is_active").notNull().default(true),
  is_banned:          boolean("is_banned").notNull().default(false),
  ban_reason:         text("ban_reason"),
  ban_until:          timestamp("ban_until"),                               // NULL = permanent ban
  last_login_at:      timestamp("last_login_at"),
  last_login_ip:      varchar("last_login_ip", { length: 45 }),            // IPv6 support

  // Metadata
  created_at:         timestamp("created_at").notNull().defaultNow(),
  updated_at:         timestamp("updated_at").notNull().defaultNow(),
  deleted_at:         timestamp("deleted_at"),                              // Soft delete
}, (table) => ({
  emailIdx:     uniqueIndex("m_users_email_idx").on(table.email),
  phoneIdx:     index("m_users_phone_idx").on(table.phone),
  referralIdx:  uniqueIndex("m_users_referral_code_idx").on(table.referral_code),
  roleIdx:      index("m_users_role_idx").on(table.role),
}));

// ─────────────────────────────────────────────────────────────────────────────
// m_user_devices — Device yang Terdaftar (untuk Push Notification)
// ─────────────────────────────────────────────────────────────────────────────
export const m_user_devices = pgTable("m_user_devices", {
  id:             uuid("id").primaryKey().defaultRandom(),
  user_id:        uuid("user_id").notNull().references(() => m_users.id, { onDelete: "cascade" }),
  fcm_token:      text("fcm_token").notNull(),                    // Firebase Cloud Messaging Token
  device_type:    varchar("device_type", { length: 10 }).notNull(), // "ANDROID", "IOS"
  device_name:    varchar("device_name", { length: 100 }),         // contoh: "Samsung Galaxy S24"
  app_version:    varchar("app_version", { length: 20 }),          // contoh: "1.2.3"
  is_active:      boolean("is_active").notNull().default(true),
  last_used_at:   timestamp("last_used_at").notNull().defaultNow(),
  created_at:     timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_user_favorite_movies — Film Favorit User (untuk rekomendasi)
// ─────────────────────────────────────────────────────────────────────────────
export const m_user_favorite_movies = pgTable("m_user_favorite_movies", {
  user_id:    uuid("user_id").notNull(),
  movie_id:   uuid("movie_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const m_users_relations = relations(m_users, ({ many, one }) => ({
  devices:          many(m_user_devices),
  favorite_movies:  many(m_user_favorite_movies),
  referrer:         one(m_users, {
    fields: [m_users.referred_by],
    references: [m_users.id],
    relationName: "referral",
  }),
}));

export const m_user_devices_relations = relations(m_user_devices, ({ one }) => ({
  user: one(m_users, {
    fields: [m_user_devices.user_id],
    references: [m_users.id],
  }),
}));
