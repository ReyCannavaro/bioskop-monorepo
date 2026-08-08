/**
 * Schema Barrel Export — XII Cinema Platform
 * Re-exports all database schema tables and enums.
 * Import from this file to get full type inference.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────
export * from "./enums";

// ─── Master Data (m_) ─────────────────────────────────────────────────────────
export * from "./master/m_locations";
export * from "./master/m_cinemas";
export * from "./master/m_movies";
export * from "./master/m_users";
export * from "./master/m_commerce";

// ─── Transaction Data (t_) ────────────────────────────────────────────────────
export * from "./transaction/t_showtimes";
export * from "./transaction/t_bookings";
export * from "./transaction/t_payments";
export * from "./transaction/t_user_activity";

// ─── Report Data (r_) ─────────────────────────────────────────────────────────
export * from "./report/r_analytics";
