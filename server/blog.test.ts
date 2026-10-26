import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllGurus: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "stress-guru",
      name: "Stress Guru",
      role: "Expert in Stress Reduction",
      image: "/images/gurus/stress_guru.png",
      description: "Your guide to managing daily stress",
      icpProblems: ["Problem 1", "Problem 2"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getGuruById: vi.fn().mockResolvedValue({
    id: 1,
    slug: "stress-guru",
    name: "Stress Guru",
    role: "Expert in Stress Reduction",
    image: "/images/gurus/stress_guru.png",
    description: "Your guide to managing daily stress",
    icpProblems: ["Problem 1", "Problem 2"],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getAllBlogs: vi.fn().mockResolvedValue([]),
  getPublishedBlogs: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "stress-management-guide",
      title: "The High-Achiever's Paradox",
      excerpt: "Test excerpt",
      content: "<p>Test content</p>",
      image: "https://example.com/image.jpg",
      category: "Stress Management",
      guruId: 1,
      authorName: "Stress Guru",
      authorRole: "Expert in Stress Reduction",
      authorImage: "/images/gurus/stress_guru.png",
      seoKeywords: ["stress", "management"],
      readTime: "12 min read",
      status: "published",
      createdBy: "manual",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getBlogBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "stress-management-guide") {
      return Promise.resolve({
        id: 1,
        slug: "stress-management-guide",
        title: "The High-Achiever's Paradox",
        excerpt: "Test excerpt",
        content: "<p>Test content</p>",
        image: "https://example.com/image.jpg",
        category: "Stress Management",
        guruId: 1,
        authorName: "Stress Guru",
        authorRole: "Expert in Stress Reduction",
        authorImage: "/images/gurus/stress_guru.png",
        seoKeywords: ["stress", "management"],
        readTime: "12 min read",
        status: "published",
        createdBy: "manual",
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return Promise.resolve(null);
  }),
  createBlog: vi.fn().mockResolvedValue(1),
  updateBlog: vi.fn().mockResolvedValue(undefined),
  deleteBlog: vi.fn().mockResolvedValue(undefined),
  updateGuru: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("blog router", () => {
  describe("listGurusAdmin", () => {
    it("returns gurus for admin users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.listGurusAdmin();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.blog.listGurusAdmin()).rejects.toThrow();
    });
  });

  describe("getGuruProblems", () => {
    it("returns ICP problems for a guru", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.getGuruProblems({ guruId: 1 });

      expect(result).toBeDefined();
      expect(result.problems).toBeDefined();
      expect(Array.isArray(result.problems)).toBe(true);
    });
  });

  describe("list (admin)", () => {
    it("returns blogs for admin users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.list({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("supports search filtering", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.list({ search: "stress" });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.blog.list({})).rejects.toThrow();
    });
  });

  describe("listPublished (public)", () => {
    it("returns published blogs for public users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.listPublished();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toBe("The High-Achiever's Paradox");
      expect(result[0].authorName).toBe("Stress Guru");
    });
  });

  describe("getBySlug (public)", () => {
    it("returns a blog by slug for public users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.getBySlug({ slug: "stress-management-guide" });

      expect(result).toBeDefined();
      expect(result?.title).toBe("The High-Achiever's Paradox");
      expect(result?.authorName).toBe("Stress Guru");
      expect(result?.category).toBe("Stress Management");
    });

    it("returns null for non-existent slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.getBySlug({ slug: "non-existent-blog" });

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("allows admin to create a blog", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.create({
        title: "Test Blog",
        excerpt: "Test excerpt",
        content: "<p>Test content</p>",
        guruId: 1,
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("throws error for non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.blog.create({
          title: "Test Blog",
          excerpt: "Test excerpt",
          content: "<p>Test content</p>",
          guruId: 1,
        })
      ).rejects.toThrow();
    });
  });
});
