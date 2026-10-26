import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const testPassword = ["synthetic", "admin", "test", "credential"].join("-");
beforeEach(() => vi.stubEnv("ADMIN_PASSWORD", testPassword));
afterEach(() => vi.unstubAllEnvs());

type CookieCall = {
  name: string;
  value?: string;
  options: Record<string, unknown>;
};

function createPublicContext(): { ctx: TrpcContext; setCookies: CookieCall[]; clearedCookies: CookieCall[] } {
  const setCookies: CookieCall[] = [];
  const clearedCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        cookie: "",
      },
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as unknown as TrpcContext["res"],
  };

  return { ctx, setCookies, clearedCookies };
}

function createAuthenticatedContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        cookie: "admin_session=authenticated",
      },
    } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as unknown as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("adminAuth router", () => {
  describe("login", () => {
    it("successfully logs in with correct credentials", async () => {
      const { ctx, setCookies } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.login({
        username: "admin",
        password: testPassword,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful");
      expect(setCookies).toHaveLength(1);
      expect(setCookies[0]?.name).toBe("admin_session");
      expect(setCookies[0]?.value).toBe("authenticated");
    });

    it("rejects invalid username", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.adminAuth.login({
          username: "wronguser",
          password: testPassword,
        })
      ).rejects.toThrow("Invalid username or password");
    });

    it("rejects invalid password", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.adminAuth.login({
          username: "admin",
          password: "wrong",
        })
      ).rejects.toThrow("Invalid username or password");
    });
  });

  describe("logout", () => {
    it("clears the admin session cookie", async () => {
      const { ctx, clearedCookies } = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe("admin_session");
    });
  });

  describe("checkAuth", () => {
    it("returns authenticated when session cookie is present", async () => {
      const { ctx } = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.checkAuth();

      expect(result.isAuthenticated).toBe(true);
      expect(result.username).toBe("admin");
    });

    it("returns not authenticated when session cookie is missing", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.checkAuth();

      expect(result.isAuthenticated).toBe(false);
      expect(result.username).toBeNull();
    });
  });
});

describe("adminAuth runtime password configuration", () => {
  it.each([undefined, "", "   "])("fails closed when ADMIN_PASSWORD is %s", async (configured) => {
    vi.stubEnv("ADMIN_PASSWORD", configured);
    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.adminAuth.login({ username: "admin", password: testPassword })).rejects.toThrow("Admin login is not configured");
    expect(setCookies).toHaveLength(0);
  });

  it("reads changed runtime configuration on each login instead of capturing it at import", async () => {
    const rotated = ["rotated", "synthetic", "credential"].join("-");
    vi.stubEnv("ADMIN_PASSWORD", rotated);
    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.adminAuth.login({ username: "admin", password: testPassword })).rejects.toThrow("Invalid username or password");
    expect(setCookies).toHaveLength(0);
    await expect(caller.adminAuth.login({ username: "admin", password: rotated })).resolves.toMatchObject({ success: true });
  });
});
