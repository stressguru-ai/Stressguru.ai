import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the email service to avoid sending real emails during tests
vi.mock("./emailService", () => ({
  sendStressReport: vi.fn().mockResolvedValue(true),
}));

// Mock the database
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
});
const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    orderBy: vi.fn().mockImplementation(() => {
      // When called with limit (for list), return chained object
      // When called without (for exportCsv), return resolved array
      const result = Promise.resolve([]);
      (result as any).limit = vi.fn().mockReturnValue({
        offset: vi.fn().mockResolvedValue([]),
      });
      return result;
    }),
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue([]),
    }),
    groupBy: vi.fn().mockResolvedValue([]),
  }),
});

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: (...args: any[]) => mockInsert(...args),
    update: (...args: any[]) => mockUpdate(...args),
    select: (...args: any[]) => mockSelect(...args),
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@stressguru.ai",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

const validSubmitInput = {
  name: "John Doe",
  email: "john@example.com",
  score: 65,
  stressLevel: 5,
  tierTitle: "Recovery",
  tierId: 3,
  tierSummary: "Stress is taking a toll on you.",
  primaryGuru: "Stress",
  secondaryGuru: "Sleep",
  domainAverages: {
    stress: 2.5,
    sleep: 1.8,
    anxiety: 1.2,
    relationship: 0.8,
    motivation: 1.5,
    calm: 1.0,
    spiritual: 0.5,
  },
  bodyMapAreas: ["head", "shoulders", "neck"],
};

describe("stressLeads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a valid submission and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stressLeads.submit(validSubmitInput);

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("emailSent", true);
    expect(result).toHaveProperty("leadId");
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.stressLeads.submit({
        ...validSubmitInput,
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.stressLeads.submit({
        ...validSubmitInput,
        name: "",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with score out of range", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.stressLeads.submit({
        ...validSubmitInput,
        score: 5, // min is 10
      })
    ).rejects.toThrow();
  });

  it("accepts submission without optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stressLeads.submit({
      name: "Jane Smith",
      email: "jane@example.com",
      score: 30,
      stressLevel: 2,
      tierTitle: "Flourishing",
      tierId: 1,
      tierSummary: "You are doing great!",
      primaryGuru: "Calm",
      domainAverages: { calm: 0.5 },
    });

    expect(result.success).toBe(true);
  });
});

describe("stressLeads.list (admin)", () => {
  it("requires admin authentication", async () => {
    const ctx = createPublicContext(); // no user
    const caller = appRouter.createCaller(ctx);

    await expect(caller.stressLeads.list()).rejects.toThrow();
  });

  it("returns leads list for admin user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // The mock returns empty arrays, but the structure should be correct
    const result = await caller.stressLeads.list();
    expect(result).toHaveProperty("leads");
    expect(result).toHaveProperty("total");
  });
});

describe("stressLeads.stats (admin)", () => {
  it("requires admin authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.stressLeads.stats()).rejects.toThrow();
  });

  it("returns stats for admin user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stressLeads.stats();
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("emailsSent");
    expect(result).toHaveProperty("avgScore");
    expect(result).toHaveProperty("tierBreakdown");
  });
});

describe("stressLeads.getById (admin)", () => {
  it("requires admin authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.stressLeads.getById({ id: 1 })).rejects.toThrow();
  });
});

describe("stressLeads.exportCsv (admin)", () => {
  it("requires admin authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.stressLeads.exportCsv()).rejects.toThrow();
  });

  it("returns CSV data for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stressLeads.exportCsv();
    expect(result).toHaveProperty("csv");
    expect(typeof result.csv).toBe("string");
  });
});
