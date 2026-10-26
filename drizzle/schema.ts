import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

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
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Gurus table - stores information about each AI Guru persona
 */
export const gurus = mysqlTable("gurus", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  role: varchar("role", { length: 256 }).notNull(),
  image: varchar("image", { length: 512 }).notNull(),
  description: text("description"),
  /** ICP problems - JSON array of problem statements for AI blog generation */
  icpProblems: json("icpProblems").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Guru = typeof gurus.$inferSelect;
export type InsertGuru = typeof gurus.$inferInsert;

/**
 * Blogs table - stores all blog posts (both manually created and AI-generated)
 */
export const blogs = mysqlTable("blogs", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  /** Hero image URL */
  image: varchar("image", { length: 1024 }),
  /** Category for the blog post */
  category: varchar("category", { length: 128 }),
  /** Foreign key to gurus table */
  guruId: int("guruId").notNull(),
  /** Author name (denormalized for display) */
  authorName: varchar("authorName", { length: 128 }),
  /** Author role (denormalized for display) */
  authorRole: varchar("authorRole", { length: 256 }),
  /** Author image (denormalized for display) */
  authorImage: varchar("authorImage", { length: 512 }),
  /** SEO keywords - JSON array */
  seoKeywords: json("seoKeywords").$type<string[]>(),
  /** SEO meta title (30-60 chars) */
  metaTitle: varchar("metaTitle", { length: 70 }),
  /** SEO meta description (50-160 chars) */
  metaDescription: varchar("metaDescription", { length: 170 }),
  /** Canonical URL for SEO */
  canonicalUrl: varchar("canonicalUrl", { length: 512 }),
  /** Open Graph image URL for social sharing */
  ogImage: varchar("ogImage", { length: 1024 }),
  /** Read time estimate */
  readTime: varchar("readTime", { length: 32 }),
  /** Publication status */
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  /** How the blog was created */
  createdBy: mysqlEnum("createdBy", ["manual", "ai"]).default("manual").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = typeof blogs.$inferInsert;

/**
 * Stress Assessment Leads - stores user info and assessment results for email reports
 */
export const stressLeads = mysqlTable("stressLeads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  /** Final stress score 10-100 */
  score: int("score").notNull(),
  /** Stress level 0-9 */
  stressLevel: int("stressLevel").notNull(),
  /** Tier: Flourishing, Prevention, Recovery, Stabilization */
  tierTitle: varchar("tierTitle", { length: 64 }).notNull(),
  /** Tier ID 1-4 */
  tierId: int("tierId").notNull(),
  /** Primary recommended guru */
  primaryGuru: varchar("primaryGuru", { length: 64 }).notNull(),
  /** Secondary recommended guru */
  secondaryGuru: varchar("secondaryGuru", { length: 64 }),
  /** Domain averages as JSON */
  domainAverages: json("domainAverages").$type<Record<string, number>>(),
  /** Raw answers as JSON for detailed report */
  answers: json("answers").$type<Record<string, any>>(),
  /** Body map selected areas */
  bodyMapAreas: json("bodyMapAreas").$type<string[]>(),
  /** Whether the email report was sent successfully */
  emailSent: int("emailSent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StressLead = typeof stressLeads.$inferSelect;
export type InsertStressLead = typeof stressLeads.$inferInsert;
