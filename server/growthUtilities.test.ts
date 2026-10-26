import path from "node:path";
import fs from "node:fs";
import { describe, expect, it } from "vitest";

// The production growth utilities are intentionally dependency-light Node ESM modules.
// @ts-ignore Vitest transforms this checked-in JavaScript module in the server test run.
import { buildInventory } from "../scripts/growth/inventory.mjs";
// @ts-ignore See ESM utility note above.
import { prioritizeOpportunities } from "../scripts/growth/decision-engine.mjs";
// @ts-ignore See ESM utility note above.
import {
  compareComparableWindows,
  ingestMetrics,
  separateMentionsAndCitations,
  summarizeEngineBenchmark,
} from "../scripts/growth/metrics.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

function windowFor(start: string, end: string, metrics: object[], confounders: string[] = []) {
  return { windowDays: 30, start, end, metrics, confounders };
}

describe("growth inventory", () => {
  it("records real repository source and public route information without publishing draft blogs", () => {
    const inventory: any = buildInventory(repositoryRoot);

    expect(inventory.snapshot.scope).toBe("repository-snapshot");
    expect(inventory.snapshot.liveAws).toBe(false);
    expect(inventory.sourceRoutes.some((route: { path: string }) => route.path === "/blogs/:slug")).toBe(true);
    expect(inventory.coreRoutes.some((route: { path: string }) => route.path === "/blogs")).toBe(true);
    expect(inventory.guides.some((guide: { path: string; cluster: string }) => guide.path === "/stress-relief" && guide.cluster === "pillar-hub")).toBe(true);
    expect(inventory.publishedBlogs.some((blog: { path: string; status: string }) => blog.path === "/blogs/stress-management-guide" && blog.status === "published")).toBe(true);
    expect(inventory.publicRoutes.some((route: { path: string; kind: string }) => route.path === "/blogs" && route.kind === "core")).toBe(true);

    const generatedBlogs = JSON.parse(
      fs.readFileSync(path.join(repositoryRoot, "docs/seo/blogs.generated.json"), "utf8"),
    ) as Array<{ slug: string; status: string }>;
    const draftPaths = generatedBlogs
      .filter((blog) => blog.status === "draft")
      .map((blog) => `/blogs/${blog.slug}`);
    expect(draftPaths.length).toBeGreaterThan(0);
    expect(inventory.publicRoutes.map((route: { path: string }) => route.path)).not.toEqual(
      expect.arrayContaining(draftPaths),
    );
    expect(inventory.linkGraph.edges.some((edge: { from: string; kind: string }) => edge.from === "/blogs" && edge.kind === "known-listing")).toBe(true);
    expect(inventory.localImages.images.length).toBeGreaterThan(0);
  });
});

describe("approval-aware decision engine", () => {
  it("does not score missing metrics as an opportunity and gates new pages without demand", () => {
    const [decision]: any[] = prioritizeOpportunities([
      { id: "new-page", kind: "new-page", title: "A hypothetical guide", metrics: null, demand: null },
    ]);

    expect(decision.score).toBe(0);
    expect(decision.authorization).toBe("approval-required");
    expect(decision.riskGates).toContain("new-page-demand-unavailable");
    expect(decision.reason).toMatch(/missing metrics/i);
  });

  it("keeps clinical and locked-hero proposals approval-required despite observed evidence", () => {
    const decisions: any[] = prioritizeOpportunities([
      {
        id: "clinical",
        title: "Add a clinical treatment claim",
        metrics: [{ observed: true, value: 80 }],
        demand: { observed: true, value: 70 },
      },
      {
        id: "hero",
        title: "Change homepage hero copy",
        metrics: [{ observed: true, value: 80 }],
        demand: { observed: true, value: 70 },
      },
    ]);

    expect(decisions.find((decision) => decision.id === "clinical")?.riskGates).toContain("clinical-or-health-claim");
    expect(decisions.find((decision) => decision.id === "hero")?.riskGates).toContain("locked-hero");
    expect(decisions.every((decision) => decision.requiresApproval)).toBe(true);
  });

  it("penalizes duplicate implementation pending measurement and does not make a seven-day inconclusive record a reversal", () => {
    const [decision]: any[] = prioritizeOpportunities(
      [{ id: "existing", path: "/stress-relief", metrics: [{ observed: true, value: 90 }], demand: { observed: true, value: 90 }, asOf: "2026-10-24" }],
      {
        history: [
          { candidateId: "existing", implemented: true, implementedAt: "2026-10-01", status: "implemented" },
          { candidateId: "existing", completedAt: "2026-10-10", outcome: "inconclusive" },
        ],
      },
    );

    expect(decision.riskGates).toContain("duplicate-implementation-pending-measurement");
    expect(decision.riskGates).toContain("inconclusive-history-not-reversal-evidence");
    expect(decision.reason).toMatch(/does not establish a reversal/i);
  });

  it("uses supplied observation dates rather than the machine clock for deterministic history decisions", () => {
    const candidate = { id: "dated", metrics: [{ observed: true, value: 70 }], asOf: "2026-10-20" };
    const history = [{ candidateId: "dated", completedAt: "2026-10-10", outcome: "inconclusive" }];
    const first: any[] = prioritizeOpportunities([candidate], { history });
    const second: any[] = prioritizeOpportunities([candidate], { history });

    expect(first).toEqual(second);
    expect(first[0].riskGates).toContain("inconclusive-history-not-reversal-evidence");
  });
});

describe("safe metrics", () => {
  it("preserves unavailable nulls separately from observed true zeros and never calls outbound clicks installations", () => {
    const ingested: any = ingestMetrics([
      { metric: "outboundClicks", value: 0, observedAt: "2026-10-01", source: "analytics" },
      { metric: "installations", value: null, status: "unavailable", observedAt: "2026-10-01", source: "analytics" },
      { metric: "visits", value: 2, observedAt: "2026-10-01", email: "person@example.com", apiKey: ["do", "not", "persist"].join("-") },
    ]);

    expect(ingested.records[0]).toMatchObject({ metric: "outboundClicks", value: 0, status: "observed" });
    expect(ingested.records[1]).toMatchObject({ metric: "installations", value: null, status: "unavailable" });
    expect(ingested.records[0].metric).not.toBe("installations");
    expect(JSON.stringify(ingested.records)).not.toContain("person@example.com");
    expect(JSON.stringify(ingested.records)).not.toContain("do-not-persist");
  });

  it("keeps mentions separate from citations and counts only valid observed dated engine tests", () => {
    const separated: any = separateMentionsAndCitations([
      { engine: "Example Engine", query: "stress app", observedAt: "2026-10-01", mentioned: true },
      { engine: "Example Engine", query: "stress app", observedAt: "2026-10-01", citationUrl: "https://example.org/source" },
    ]);
    expect(separated.mentions).toHaveLength(1);
    expect(separated.citations).toHaveLength(1);

    const benchmark: any = summarizeEngineBenchmark([
      { engine: "Example Engine", query: "stress app", observedAt: "2026-10-01", observed: true, result: { rank: 3 }, mentioned: true },
      { engine: "Example Engine", query: "unavailable", observedAt: "2026-10-01", observed: false, status: "unavailable" },
      { engine: "Example Engine", query: "invalid", observedAt: "2026-10-01", observed: true, valid: false, result: "bad response" },
      { engine: "Example Engine", query: "bad date", observedAt: "not-a-date", observed: true, result: "response" },
    ]);
    expect(benchmark.testCount).toBe(1);
    expect(benchmark.mentionCount).toBe(1);
    expect(benchmark.citationCount).toBe(0);
  });

  it("accepts iPhone and relationship questions but rejects credentials in citation URLs", () => {
    const fixtureUrl = ["https:", "//", "synthetic", ":", "fixture", "@", "example.org/source"].join("");
    const benchmark: any = summarizeEngineBenchmark([
      { engine: "Example Engine", query: "iPhone app for relationship stress", observedAt: "2026-10-24", observed: true, result: "Observed example response", citations: [fixtureUrl] },
    ]);
    expect(benchmark.testCount).toBe(1);
    expect(benchmark.citationCount).toBe(0);
  });

  it("does not compare different properties or metric definitions", () => {
    const result: any = compareComparableWindows(
      windowFor("2026-01-01", "2026-01-30", [{ metric: "visits", value: 10, observedAt: "2026-01-30", source: "GA4", property: "stressguru", segment: "US organic" }]),
      windowFor("2026-02-01", "2026-03-02", [{ metric: "visits", value: 12, observedAt: "2026-03-02", source: "GA4", property: "another-site", segment: "US organic" }]),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/different source, property or segment/);
  });

  it("rejects unrelated periods, protects zero denominators, and labels comparisons non-causally", () => {
    const unrelated: any = compareComparableWindows(
      windowFor("2026-01-01", "2026-01-30", [{ metric: "visits", value: 10, observedAt: "2026-01-30" }]),
      { windowDays: 60, start: "2026-02-01", end: "2026-04-01", metrics: [] },
    );
    expect(unrelated).toMatchObject({ valid: false, reason: "unrelated-period" });

    const comparable: any = compareComparableWindows(
      windowFor("2026-01-01", "2026-01-30", [{ metric: "outboundClicks", value: 0, observedAt: "2026-01-30" }], ["seasonality"]),
      windowFor("2026-02-01", "2026-03-02", [{ metric: "outboundClicks", value: 5, observedAt: "2026-03-02" }]),
    );
    expect(comparable.valid).toBe(true);
    expect(comparable.metrics[0]).toMatchObject({ metric: "outboundClicks", baseline: 0, comparison: 5, percentChange: null });
    expect(comparable.metrics[0].reason).toMatch(/true zero/i);
    expect(comparable.language).toMatch(/does not show.*caused/i);
    expect(comparable.confounders).toContain("seasonality");
  });
});
