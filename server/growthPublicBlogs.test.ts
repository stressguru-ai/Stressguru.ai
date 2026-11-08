import { describe, expect, it, vi } from "vitest";
// @ts-ignore Native ES module audit utility.
import { discoverPublicBlogRoutes, mergePublicBlogRoutes } from "../scripts/growth/public-blogs.mjs";

const listing = (rows: unknown[]) => new Response(JSON.stringify([{ result: { data: { json: rows } } }]), {
  status: 200, headers: { "content-type": "application/json" },
});

describe("published public blog audit discovery", () => {
  it("reads only the fixed public listing and rejects unsafe slugs or nonpublished rows", async () => {
    const fetchImpl = vi.fn(async (_url: Parameters<typeof fetch>[0], _init?: RequestInit) => listing([
      { slug: "valid-one", status: "published", content: "never retained", authorImage: "never retained" },
      { slug: "valid-one", status: "published" },
      { slug: "new-two", status: "published" },
      { slug: "draft", status: "draft" },
      { slug: "../admin", status: "published" },
      { slug: "https://example.org", status: "published" },
      null,
    ]));
    const result = await discoverPublicBlogRoutes("https://stressguru.ai", { fetchImpl });
    expect(result.status).toBe("observed");
    expect(result.routes.map((r: { path: string }) => r.path)).toEqual(["/blogs/new-two", "/blogs/valid-one"]);
    expect(result.rejectedRows).toBe(4);
    expect(JSON.stringify(result)).not.toContain("never retained");
    expect(fetchImpl.mock.calls[0][0]).toContain("https://stressguru.ai/api/trpc/blog.listPublished?");
    expect(fetchImpl.mock.calls[0][1]?.redirect).toBe("manual");
  });

  it("preserves source routes and labels newly discovered coverage", () => {
    const result = mergePublicBlogRoutes([{ path: "/" }, { path: "/blogs/known" }], {
      routes: [{ path: "/blogs/known" }, { path: "/blogs/new" }],
    });
    expect(result.routes.map((r: { path: string }) => r.path)).toEqual(["/", "/blogs/known", "/blogs/new"]);
    expect(result.publicBlogsMissingFromSource).toEqual(["/blogs/new"]);
  });

  it("rejects external, credential-bearing and loopback discovery before requesting anything", async () => {
    const fetchImpl = vi.fn();
    for (const origin of ["https://example.org", "https://user:pass@stressguru.ai", "http://127.0.0.1:3000"]) {
      await expect(discoverPublicBlogRoutes(origin, { fetchImpl })).rejects.toThrow();
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("records unavailable evidence instead of silently treating failures as zero blogs", async () => {
    for (const response of [new Response("redirect", { status: 302 }), new Response("<html>shell</html>"),
      new Response('{"error":"unsupported"}', { headers: { "content-type": "application/json" } })]) {
      const result = await discoverPublicBlogRoutes("https://stressguru.ai", { fetchImpl: async () => response });
      expect(result.status).toBe("unavailable");
      expect(result.routes).toEqual([]);
      expect("reason" in result && result.reason).toBeTruthy();
    }
    const rejected = await discoverPublicBlogRoutes("https://stressguru.ai", { fetchImpl: async () => { throw new Error("synthetic unavailable"); } });
    expect(rejected.status).toBe("unavailable");
  });

  it("refuses an oversized published listing rather than truncating coverage", async () => {
    const result = await discoverPublicBlogRoutes("https://stressguru.ai", { maxBlogs: 1,
      fetchImpl: async () => listing([{ slug: "one", status: "published" }, { slug: "two", status: "published" }]) });
    expect(result.status).toBe("unavailable");
    expect(result.routes).toEqual([]);
  });
});
