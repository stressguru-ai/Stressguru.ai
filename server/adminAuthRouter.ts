import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";

// Admin username is fixed; the password is configured only at runtime.
const ADMIN_USERNAME = "admin";
const ADMIN_SESSION_COOKIE = "admin_session";

export const adminAuthRouter = router({
  // Login with username/password
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = String(input.username).trim();
      const password = String(input.password).trim();

      const configuredPassword = process.env.ADMIN_PASSWORD;
      if (!configuredPassword?.trim()) {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Admin login is not configured" });
      }

      if (username !== ADMIN_USERNAME || password !== configuredPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(ADMIN_SESSION_COOKIE, "authenticated", {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { success: true, message: "Login successful" };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),

  checkAuth: publicProcedure.query(({ ctx }) => {
    const cookies = ctx.req.headers.cookie || "";
    const isAuthenticated = cookies.includes(`${ADMIN_SESSION_COOKIE}=authenticated`);
    return {
      isAuthenticated,
      username: isAuthenticated ? ADMIN_USERNAME : null,
    };
  }),
});

export { ADMIN_SESSION_COOKIE };
