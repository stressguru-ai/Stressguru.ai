import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
// @ts-ignore Native ES module audit utility.
import { assertAwsDatabaseUrl, assertHeroUnchanged, containsSecret, assertSafeRecord, releaseScope } from "../scripts/growth/guardrails.mjs";
const root = path.resolve(import.meta.dirname, "..");
const dsn = (host: string, db: string, port = 3306) => ["mysql:", "//", "test", ":", "synthetic", "@", host, ":", port, "/", db].join("");
const policy = JSON.parse(fs.readFileSync(path.join(root, "docs/growth/policy.json"), "utf8"));
const approvals = JSON.parse(fs.readFileSync(path.join(root, "docs/growth/approvals.json"), "utf8"));
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

function fixture(files: Record<string, string>) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "growth-guardrails-"));
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(directory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return directory;
}

function committedRegistryFixture() {
  const directory = fixture({
    "docs/growth/policy.json": `${JSON.stringify(policy)}\n`,
    "docs/growth/approvals.json": "[]\n",
    "client/src/pages/Home.tsx": `<h1>Stop Stress<br />Today.</h1>${policy.hero.subtitle}`,
    "scripts/generate-static-seo.js": `export default { h1: "${policy.hero.headline}" };\n`,
  });
  for (const file of ["scripts/growth/guardrails.mjs", "scripts/growth/validate-release.mjs"]) {
    const target = path.join(directory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, file), target);
  }
  const git = (args: string[]) => execFileSync("git", args, { cwd: directory, encoding: "utf8" });
  git(["init", "-q"]);
  git(["config", "user.email", "guardrails@example.test"]);
  git(["config", "user.name", "Guardrails Test"]);
  git(["add", "."]);
  git(["commit", "-qm", "Initial approval registry"]);
  return directory;
}

const publicTrainingRobots = (privateRule = "Disallow: /api") => `
User-agent: *
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
Allow: /
${privateRule}
`;

describe("growth agent release safeguards", () => {
  it("rejects TiDB, missing DSN, and unapproved databases without revealing DSN", () => {
    expect(() => assertAwsDatabaseUrl(undefined, policy)).toThrow(/no fallback/);
    expect(() => assertAwsDatabaseUrl(dsn("gateway02.us-east-1.prod.aws.tidbcloud.com", "other", 4000), policy)).toThrow(/approved/);
    expect(() => assertAwsDatabaseUrl(dsn("db.dentasmart.ai", "other"))).toThrow();
    expect(assertAwsDatabaseUrl(dsn("db.dentasmart.ai", "manus-stressguru"), policy)).toEqual({ host: "db.dentasmart.ai", database: "manus-stressguru", port: 3306 });
  });

  it("locks the current approved hero", () => expect(() => assertHeroUnchanged(root, policy)).not.toThrow());

  it("does not persist credentials or individual health data", () => {
    expect(containsSecret(dsn("example.org", "test"))).toBe(true);
    expect(() => assertSafeRecord({ email: "reader@example.org" })).toThrow();
    expect(() => assertSafeRecord({ note: dsn("example.org", "test") })).toThrow();
    expect(() => assertSafeRecord({ organicClicks: null, installs: null })).not.toThrow();
  });

  it("gates sensitive paths while allowing low-risk repairs and accepts the current hash-bound policy approval", () => {
    const scope = releaseScope(["server/seoStatic.ts", "client/src/pages/Home.tsx", "client/src/pages/Plans.tsx", "Dockerfile", "docs/growth/policy.json"], policy, approvals, { root });
    expect(scope.map((value: any) => value.allowed)).toEqual([true, false, false, false, true]);
    expect(approvals[0].fileHashes["docs/growth/policy.json"]).toBe(hash(fs.readFileSync(path.join(root, "docs/growth/policy.json"), "utf8")));
  });

  it("rejects a modified policy hash even with the existing initial approval", () => {
    const tempRoot = fixture({ "docs/growth/policy.json": `${JSON.stringify(policy)}\nchanged` });
    expect(releaseScope(["docs/growth/policy.json"], policy, approvals, { root: tempRoot })[0].allowed).toBe(false);
  });

  it("rejects approval registry changes so the registry cannot authorize itself", () => {
    expect(releaseScope(["docs/growth/approvals.json"], policy, approvals, { root })[0]).toMatchObject({ allowed: false, approvalRequired: true, protected: true });
  });

  it("rejects the bootstrap flag after the approval registry is committed", () => {
    const tempRoot = committedRegistryFixture();
    const registry = path.join(tempRoot, "docs/growth/approvals.json");
    fs.writeFileSync(registry, '[{"future":"approval"}]\n');
    const result = spawnSync(process.execPath, ["scripts/growth/validate-release.mjs", "--bootstrap-approval-sha", hash(fs.readFileSync(registry, "utf8"))], { cwd: tempRoot, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("only permitted before docs/growth/approvals.json exists in Git HEAD");
  });

  it("gates a path covered by a custom protectedPaths glob until its exact hash is approved", () => {
    const content = "private release note\n";
    const tempRoot = fixture({ "content/private/release.md": content });
    const customPolicy = { ...policy, protectedPaths: ["content/private/**"] };
    const file = "content/private/release.md";
    expect(releaseScope([file], customPolicy, [], { root: tempRoot })[0]).toMatchObject({ allowed: false, approvalRequired: true, protected: true });
    const matchingApproval = [{ author: "user", status: "approved", reason: "Reviewed private release note", approvedAt: "2026-10-24", paths: [file], fileHashes: { [file]: hash(content) } }];
    expect(releaseScope([file], customPolicy, matchingApproval, { root: tempRoot })[0].allowed).toBe(true);
  });

  it("keeps a parsed training group with an additional private exclusion low risk", () => {
    const tempRoot = fixture({ "client/public/robots.txt": publicTrainingRobots("Disallow: /admin/reports") });
    expect(releaseScope(["client/public/robots.txt"], policy, [], { root: tempRoot })[0]).toMatchObject({ risk: "low-risk", allowed: true });
  });

  it("requires approval when a parsed training group disallows root or a public path", () => {
    for (const disallow of ["Disallow: /", "Disallow: /wellness-guides"]) {
      const tempRoot = fixture({ "client/public/robots.txt": publicTrainingRobots(disallow) });
      expect(releaseScope(["client/public/robots.txt"], policy, [], { root: tempRoot })[0]).toMatchObject({ risk: "training-permissions", allowed: false, approvalRequired: true });
    }
  });
});
