import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import { createServer, type Server } from "node:http";
import adminRoutes from "./adminRoutes";

const testPassword = ["synthetic", "rest", "admin", "credential"].join("-");
let server: Server;
let origin: string;

beforeEach(async () => {
  vi.stubEnv("ADMIN_PASSWORD", testPassword);
  const app = express();
  app.use(express.json());
  app.use("/api/admin", adminRoutes);
  server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as { port: number };
  origin = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()));
  vi.unstubAllEnvs();
});

function login(username: string, password: string) {
  return fetch(`${origin}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

describe("REST admin runtime password", () => {
  it("accepts configured credentials and retains the existing cookie behavior", async () => {
    const response = await login("admin", testPassword);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    expect(response.headers.get("set-cookie")).toContain("admin_session=authenticated");
  });

  it("rejects incorrect credentials without setting a cookie", async () => {
    const response = await login("admin", "wrong");
    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each([undefined, "", "   "])("fails closed for missing or blank ADMIN_PASSWORD: %s", async configured => {
    vi.stubEnv("ADMIN_PASSWORD", configured);
    const response = await login("admin", testPassword);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: "Admin login is not configured" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("retains input validation independently of password configuration", async () => {
    vi.stubEnv("ADMIN_PASSWORD", undefined);
    const response = await login("", "");
    expect(response.status).toBe(400);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
