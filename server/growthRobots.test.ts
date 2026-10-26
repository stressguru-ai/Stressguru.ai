import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("growth crawler permissions", () => {
  it("keeps search and training agents in the same protected public group", () => {
    const robots = fs.readFileSync(path.resolve(import.meta.dirname, "../client/public/robots.txt"), "utf8");
    const agents = [...robots.matchAll(/^User-agent:\s*(.+)$/gm)].map(m => m[1]);
    expect(agents).toEqual(expect.arrayContaining(["*", "Googlebot", "Bingbot", "OAI-SearchBot", "Claude-SearchBot", "GPTBot", "ClaudeBot", "Google-Extended"]));
    expect(robots).toMatch(/^Allow: \/$/m);
    for (const route of ["api", "admin", "account", "preview"]) expect(robots).toContain(`Disallow: /${route}`);
    // Consecutive user-agent lines share all following rules until the next group.
    expect(robots.slice(robots.indexOf("Allow:"))).not.toContain("User-agent:");
    expect(robots).not.toMatch(/^Disallow: \/$/m);
    expect(robots).toContain("Sitemap: https://stressguru.ai/sitemap.xml");
  });
});
