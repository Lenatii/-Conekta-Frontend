import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Properties table - stores rental property listings
 */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  propertyType: mysqlEnum("propertyType", ["apartment", "house", "bedsitter", "studio", "commercial"]).notNull(),
  bedrooms: int("bedrooms").notNull(),
  bathrooms: int("bathrooms").notNull(),
  price: int("price").notNull(), // Monthly rent in KES
  location: varchar("location", { length: 255 }).notNull(), // e.g., "Nakuru CBD"
  city: varchar("city", { length: 100 }).notNull(), // e.g., "Nakuru"
  county: varchar("county", { length: 100 }).notNull(), // e.g., "Nakuru"
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  
  // Amenities (stored as JSON or boolean flags)
  hasParking: boolean("hasParking").default(false),
  hasWifi: boolean("hasWifi").default(false),
  hasGenerator: boolean("hasGenerator").default(false),
  hasWater: boolean("hasWater").default(false),
  hasSecurity: boolean("hasSecurity").default(false),
  
  // Contact info (hidden until payment)
  landlordName: varchar("landlordName", { length: 255 }),
  landlordPhone: varchar("landlordPhone", { length: 20 }),
  landlordEmail: varchar("landlordEmail", { length: 320 }),
  
  // Status
  status: mysqlEnum("status", ["active", "rented", "inactive"]).default("active").notNull(),
  isVerified: boolean("isVerified").default(false), // UBARU verified
  
  // Metadata
  createdBy: int("createdBy"), // User ID who created the listing
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Property images table
 */
export const propertyImages = mysqlTable("propertyImages", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  orderIndex: int("orderIndex").default(0), // For sorting images
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = typeof propertyImages.$inferInsert;

/**
 * Contact reveals - tracks when users pay to see landlord contact
 */
export const contactReveals = mysqlTable("contactReveals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  propertyId: int("propertyId").notNull(),
  amount: int("amount").notNull(), // KES 150
  paymentMethod: varchar("paymentMethod", { length: 50 }).default("mpesa"),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactReveal = typeof contactReveals.$inferSelect;
export type InsertContactReveal = typeof contactReveals.$inferInsert;

/**
 * Guest sessions - tracks anonymous users and their search limits
 */
export const guestSessions = mysqlTable("guestSessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull().unique(),
  searchCount: int("searchCount").default(0),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
});

export type GuestSession = typeof guestSessions.$inferSelect;
export type InsertGuestSession = typeof guestSessions.$inferInsert;

/**
 * Service providers (Fundis)
 */
export const serviceProviders = mysqlTable("serviceProviders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Linked to users table if registered
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  serviceType: mysqlEnum("serviceType", ["plumber", "electrician", "carpenter", "painter", "cleaner", "other"]).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  city: varchar("city", { length: 100 }),
  hourlyRate: int("hourlyRate"), // KES per hour
  isVerified: boolean("isVerified").default(false), // UBARU verified
  rating: int("rating").default(0), // 0-5 stars
  totalJobs: int("totalJobs").default(0),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = typeof serviceProviders.$inferInsert;

/**
 * Reviews table
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  targetType: mysqlEnum("targetType", ["property", "service_provider"]).notNull(),
  targetId: int("targetId").notNull(), // Property ID or Service Provider ID
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
