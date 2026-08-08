/**
 * MASTER DATA: Movies, Genres, Movie-Genre Junction
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
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  movieStatusEnum,
  ageRatingEnum,
  movieLanguageEnum,
} from "../enums";

// ─────────────────────────────────────────────────────────────────────────────
// m_genres — Daftar Genre Film
// ─────────────────────────────────────────────────────────────────────────────
export const m_genres = pgTable("m_genres", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       varchar("name", { length: 50 }).notNull().unique(), // contoh: "Action", "Horor"
  name_en:    varchar("name_en", { length: 50 }).notNull().unique(),
  slug:       varchar("slug", { length: 60 }).notNull().unique(),
  icon_url:   text("icon_url"),                // Ikon genre opsional
  is_active:  boolean("is_active").notNull().default(true),
  sort_order: smallint("sort_order").notNull().default(0),       // Urutan tampil
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// m_movies — Katalog Film
// ─────────────────────────────────────────────────────────────────────────────
export const m_movies = pgTable("m_movies", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identitas Film
  title:            varchar("title", { length: 200 }).notNull(),
  title_en:         varchar("title_en", { length: 200 }),           // Judul bahasa Inggris
  slug:             varchar("slug", { length: 220 }).notNull().unique(),
  synopsis:         text("synopsis"),
  synopsis_en:      text("synopsis_en"),

  // Media
  poster_url:       text("poster_url"),                           // URL Cloudinary portrait
  backdrop_url:     text("backdrop_url"),                         // URL Cloudinary landscape
  trailer_url:      text("trailer_url"),                          // URL YouTube
  trailer_thumbnail_url: text("trailer_thumbnail_url"),

  // Klasifikasi
  duration_minutes: smallint("duration_minutes").notNull(),
  age_rating:       ageRatingEnum("age_rating").notNull().default("SU"),
  language:         movieLanguageEnum("language").notNull().default("ENGLISH"),
  is_subtitled:     boolean("is_subtitled").notNull().default(false),
  subtitle_language: varchar("subtitle_language", { length: 50 }), // contoh: "Bahasa Indonesia"

  // Produksi & Distribusi
  production_studio: varchar("production_studio", { length: 150 }), // contoh: "Marvel Studios"
  local_distributor: varchar("local_distributor", { length: 150 }), // contoh: "Falcon Pictures"
  country_of_origin: varchar("country_of_origin", { length: 50 }),  // contoh: "USA", "KOR"
  imdb_id:          varchar("imdb_id", { length: 20 }),              // Untuk integrasi TMDB
  tmdb_id:          integer("tmdb_id"),                              // The Movie Database ID

  // Tanggal
  release_date:     date("release_date"),                            // Tanggal rilis di Indonesia
  end_date:         date("end_date"),                                // Tanggal selesai tayang (opsional)

  // Statistik (Denormalized untuk performa query)
  total_sold_tickets: integer("total_sold_tickets").notNull().default(0),
  average_rating:     varchar("average_rating", { length: 4 }).notNull().default("0.0"),
  total_reviews:      integer("total_reviews").notNull().default(0),

  // Status
  status:           movieStatusEnum("status").notNull().default("DRAFT"),
  is_featured:      boolean("is_featured").notNull().default(false),  // Tampil di banner utama

  // Metadata
  is_active:        boolean("is_active").notNull().default(true),
  created_at:       timestamp("created_at").notNull().defaultNow(),
  updated_at:       timestamp("updated_at").notNull().defaultNow(),
  created_by:       uuid("created_by"),
  updated_by:       uuid("updated_by"),
}, (table) => ({
  // Index untuk query yang sering dilakukan
  statusIdx:        index("m_movies_status_idx").on(table.status),
  releaseDateIdx:   index("m_movies_release_date_idx").on(table.release_date),
  slugIdx:          uniqueIndex("m_movies_slug_idx").on(table.slug),
}));

// ─────────────────────────────────────────────────────────────────────────────
// m_movie_genres — Junction Table: Film <-> Genre (Many-to-Many)
// ─────────────────────────────────────────────────────────────────────────────
export const m_movie_genres = pgTable("m_movie_genres", {
  movie_id:   uuid("movie_id").notNull().references(() => m_movies.id, { onDelete: "cascade" }),
  genre_id:   uuid("genre_id").notNull().references(() => m_genres.id, { onDelete: "cascade" }),
}, (table) => ({
  // Composite primary key
}));

// ─────────────────────────────────────────────────────────────────────────────
// m_movie_casts — Pemeran & Kru Film
// ─────────────────────────────────────────────────────────────────────────────
export const m_movie_casts = pgTable("m_movie_casts", {
  id:           uuid("id").primaryKey().defaultRandom(),
  movie_id:     uuid("movie_id").notNull().references(() => m_movies.id, { onDelete: "cascade" }),
  name:         varchar("name", { length: 100 }).notNull(),
  role:         varchar("role", { length: 20 }).notNull(),      // "DIRECTOR", "ACTOR", "PRODUCER"
  character_name: varchar("character_name", { length: 100 }),  // Nama karakter yang dimainkan
  photo_url:    text("photo_url"),
  sort_order:   smallint("sort_order").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const m_movies_relations = relations(m_movies, ({ many }) => ({
  genres:   many(m_movie_genres),
  casts:    many(m_movie_casts),
}));

export const m_genres_relations = relations(m_genres, ({ many }) => ({
  movies: many(m_movie_genres),
}));

export const m_movie_genres_relations = relations(m_movie_genres, ({ one }) => ({
  movie: one(m_movies, {
    fields: [m_movie_genres.movie_id],
    references: [m_movies.id],
  }),
  genre: one(m_genres, {
    fields: [m_movie_genres.genre_id],
    references: [m_genres.id],
  }),
}));

export const m_movie_casts_relations = relations(m_movie_casts, ({ one }) => ({
  movie: one(m_movies, {
    fields: [m_movie_casts.movie_id],
    references: [m_movies.id],
  }),
}));
