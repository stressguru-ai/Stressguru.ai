import { describe, it, expect } from "vitest";
// Node audit utilities are intentionally independent of the server/database runtime.
// @ts-ignore Native ES module utility.
import { inspectHtml, boundedMap, validateCrawlOrigin, crawlRoutes } from "../scripts/growth/crawler.mjs";
import express from "express";
import { createServer } from "node:http";

describe("growth raw HTML audit", () => {
  it("finds route-specific initial HTML without claiming rankings", () => {
    const result = inspectHtml(`<html><head><title>Work stress</title><meta content="A useful answer" name="description"><link href="https://stressguru.ai/work-stress" rel="canonical"></head><body><noscript><h1>Work stress</h1><p data-answer="true">${"A meaningful stress answer. ".repeat(20)}</p><a href="/sleep-better">Sleep</a></noscript><script type="application/ld+json">{"@type":"Article"}</script></body></html>`, "https://stressguru.ai/work-stress");
    expect(result.h1s).toEqual(["Work stress"]);
    expect(result.answerFirst).toBe(true);
    expect(result.schemaTypes).toEqual(["Article"]);
    expect(result.internalLinks).toEqual(["/sleep-better"]);
    expect(result.issues.map((i: any) => i.code)).toContain("noscript-snapshot");
    expect(result.issues.map((i: any) => i.code)).not.toContain("canonical-mismatch");
  });
  it("does not count head-only text as meaningful body content", () => {
    const result = inspectHtml(`<html><head><title>${"Long metadata. ".repeat(40)}</title></head><body><div id="root"></div></body></html>`, "https://stressguru.ai/app");
    expect(result.textCharacters).toBe(0);
    expect(result.issues.map((i: any) => i.code)).toContain("missing-crawlable-body");
  });
  it("accepts explicit decorative alt and hidden tracking images but flags missing content-image alt", () => {
    const result = inspectHtml('<html><body><img src="/images/decorative.png" alt=""><img src="https://example.org/pixel" width="1" height="1" style="display:none"><img src="/images/presentation.png" role="presentation"></body></html>', "https://stressguru.ai/app");
    expect(result.issues.map((i: any) => i.code)).not.toContain("image-alt");
    const missing = inspectHtml('<html><body><img src="/images/meaningful.png"></body></html>', "https://stressguru.ai/app");
    expect(missing.issues.map((i: any) => i.code)).toContain("image-alt");
  });
  it("flags the SPA shell and malformed schema", () => {
    const result = inspectHtml('<title>Home</title><div id="root"></div><script type="application/ld+json">invalid</script>', "https://stressguru.ai/unknown");
    expect(result.issues.map((i: any) => i.code)).toEqual(expect.arrayContaining(["missing-crawlable-body", "missing-canonical", "invalid-jsonld", "h1-count"]));
  });
  it("rejects credentials, external origins, and arbitrary crawl targets", () => {
    expect(() => validateCrawlOrigin("https://user:password@stressguru.ai")).toThrow();
    expect(() => validateCrawlOrigin("https://example.com")).toThrow();
    expect(() => validateCrawlOrigin("http://169.254.169.254")).toThrow();
    expect(validateCrawlOrigin("https://stressguru.ai")).toBe("https://stressguru.ai");
  });
  it("keeps bounded concurrency and input order", async () => {
    let running = 0, max = 0;
    const results = await boundedMap([1, 2, 3, 4], 2, async (n: number) => {
      running++; max = Math.max(max, running);
      await new Promise(resolve => setTimeout(resolve, 5)); running--; return n * 2;
    });
    expect(max).toBe(2); expect(results).toEqual([2, 4, 6, 8]);
  });
  it("records real HTTP status and refuses private routes", async () => {
    const app = express(); app.get("/", (_, res) => res.send("<title>Test</title><h1>Test</h1>"));
    const server = createServer(app); await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address() as { port: number };
    try {
      const audit = await crawlRoutes(`http://127.0.0.1:${address.port}`, ["/", "/missing"]);
      expect(audit.routes.map((r: any) => r.status)).toEqual([200, 404]);
      await expect(crawlRoutes(`http://127.0.0.1:${address.port}`, ["/api/trpc"])).rejects.toThrow();
    } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
  });
});
