import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { parse as parseCookieHeader } from "cookie";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Check for simple admin session cookie
function checkAdminSession(req: CreateExpressContextOptions["req"]): boolean {
  const cookieHeader = req.headers.cookie || "";
  const cookies = parseCookieHeader(cookieHeader);
  return cookies.admin_session === "authenticated";
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // First check for simple admin session cookie
  if (checkAdminSession(opts.req)) {
    // Create a synthetic admin user for simple auth
    user = {
      id: 0,
      openId: "admin-simple-auth",
      name: "Admin",
      email: null,
      loginMethod: "simple",
      role: "admin",
      lastSignedIn: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    // Try Manus OAuth authentication
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
