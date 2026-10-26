import { eq, like, and, or, gte, lte, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogs, gurus, InsertBlog, InsertGuru, Blog, Guru } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== GURU HELPERS ====================

export async function getAllGurus(): Promise<Guru[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(gurus).orderBy(asc(gurus.name));
  return result;
}

export async function getGuruById(id: number): Promise<Guru | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(gurus).where(eq(gurus.id, id)).limit(1);
  return result[0];
}

export async function getGuruBySlug(slug: string): Promise<Guru | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(gurus).where(eq(gurus.slug, slug)).limit(1);
  return result[0];
}

export async function createGuru(guru: InsertGuru): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(gurus).values(guru);
  return result[0].insertId;
}

export async function updateGuru(id: number, guru: Partial<InsertGuru>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(gurus).set(guru).where(eq(gurus.id, id));
}

// ==================== BLOG HELPERS ====================

export interface BlogFilters {
  guruId?: number;
  status?: "draft" | "published";
  category?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getAllBlogs(filters?: BlogFilters): Promise<Blog[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (filters?.guruId) {
    conditions.push(eq(blogs.guruId, filters.guruId));
  }
  if (filters?.status) {
    conditions.push(eq(blogs.status, filters.status));
  }
  if (filters?.category) {
    conditions.push(eq(blogs.category, filters.category));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(blogs.title, `%${filters.search}%`),
        like(blogs.excerpt, `%${filters.search}%`)
      )
    );
  }
  if (filters?.dateFrom) {
    conditions.push(gte(blogs.createdAt, filters.dateFrom));
  }
  if (filters?.dateTo) {
    conditions.push(lte(blogs.createdAt, filters.dateTo));
  }
  
  if (conditions.length > 0) {
    return db.select().from(blogs).where(and(...conditions)).orderBy(desc(blogs.createdAt));
  }
  
  return db.select().from(blogs).orderBy(desc(blogs.createdAt));
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogs)
    .where(eq(blogs.status, "published"))
    .orderBy(desc(blogs.publishedAt));
}

export async function getBlogById(id: number): Promise<Blog | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  return result[0];
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
  return result[0];
}

export async function createBlog(blog: InsertBlog): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogs).values(blog);
  return result[0].insertId;
}

export async function updateBlog(id: number, blog: Partial<InsertBlog>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogs).set(blog).where(eq(blogs.id, id));
}

export async function deleteBlog(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogs).where(eq(blogs.id, id));
}

export async function publishBlog(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogs).set({
    status: "published",
    publishedAt: new Date(),
  }).where(eq(blogs.id, id));
}

export async function unpublishBlog(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogs).set({
    status: "draft",
    publishedAt: null,
  }).where(eq(blogs.id, id));
}

export async function getBlogCategories(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ category: blogs.category }).from(blogs).where(sql`${blogs.category} IS NOT NULL`);
  return result.map(r => r.category).filter((c): c is string => c !== null);
}
