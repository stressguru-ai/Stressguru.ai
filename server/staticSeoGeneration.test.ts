import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const marker = "<!-- stressguru-generated-seo-snapshot -->";
const base = (asset = "first.js") => `<!doctype html><html><head><title>Fixture</title><meta name="description" content="Fixture"><link rel="canonical" href="https://stressguru.ai/"><link rel="icon" href="/favicon.png"><script src="/assets/${asset}"></script></head><body><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=fixture" height="0" width="0"></iframe></noscript><div id="root"></div></body></html>`;

describe("static SEO generation repeatability", () => {
  let fixture: string;
  const generate = () => execFileSync(process.execPath, [path.join(fixture, "scripts/generate-static-seo.js")], { cwd: fixture, encoding: "utf8", stdio: "pipe" });
  beforeEach(async () => {
    fixture = await fs.mkdtemp(path.join(os.tmpdir(), "stressguru-seo-repeatability-"));
    for (const directory of ["scripts", "client/src/data", "docs/seo", "dist/public"]) await fs.mkdir(path.join(fixture, directory), { recursive: true });
    await fs.copyFile(path.join(repositoryRoot, "scripts/generate-static-seo.js"), path.join(fixture, "scripts/generate-static-seo.js"));
    await fs.writeFile(path.join(fixture, "package.json"), '{"type":"module"}\n');
    await fs.writeFile(path.join(fixture, "client/src/data/contentPages.generated.json"), "[]\n");
    await fs.writeFile(path.join(fixture, "docs/seo/blogs.generated.json"), "[]\n");
    await fs.writeFile(path.join(fixture, "dist/public/index.html"), base());
  });
  afterEach(async () => fs.rm(fixture, { recursive: true, force: true }));

  it("does not duplicate page body, heading, schema or tracking on rerun", async () => {
    generate();
    const first = await fs.readFile(path.join(fixture, "dist/public/app.html"), "utf8");
    const firstRoot = await fs.readFile(path.join(fixture, "dist/public/index.html"), "utf8");
    generate();
    const second = await fs.readFile(path.join(fixture, "dist/public/app.html"), "utf8");
    expect(second).toBe(first);
    expect(await fs.readFile(path.join(fixture, "dist/public/index.html"), "utf8")).toBe(firstRoot);
    expect(second.match(/<h1\b/g)).toHaveLength(1);
    expect(second.match(/application\/ld\+json/g)).toHaveLength(4);
    expect(second.match(/googletagmanager/g)).toHaveLength(1);
    expect(second).toContain('/favicon.png');
    expect(second).toContain('href="https://stressguru.ai/app"');
    expect(await fs.readFile(path.join(fixture, "dist/.stressguru-seo-template.html"), "utf8")).toBe(base());
    await expect(fs.access(path.join(fixture, "dist/public/.stressguru-seo-template.html"))).rejects.toThrow();
  });

  it("uses the existing client title branding rule without duplicating StressGuru", async () => {
    generate();
    const book = await fs.readFile(path.join(fixture, "dist/public/books/sleep-again.html"), "utf8");
    expect(book).toContain("<title>Sleep Again: A 21-Day Workbook for Racing Thoughts | StressGuru</title>");
    const app = await fs.readFile(path.join(fixture, "dist/public/app.html"), "utf8");
    expect(app).not.toContain("StressGuru | StressGuru");
  });

  it("refreshes original asset hashes after a fresh Vite template replaces index", async () => {
    generate();
    await fs.writeFile(path.join(fixture, "dist/public/index.html"), base("second.js"));
    generate();
    const html = await fs.readFile(path.join(fixture, "dist/public/app.html"), "utf8");
    expect(html).toContain("second.js");
    expect(html).not.toContain("first.js");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
  });

  it("fails safely when a generated homepage lacks its pristine template", async () => {
    generate();
    await fs.unlink(path.join(fixture, "dist/.stressguru-seo-template.html"));
    expect(() => generate()).toThrow(/no pristine SEO template/);
  });

  it("rejects a contaminated cache and an older unmarked generated homepage", async () => {
    generate();
    await fs.writeFile(path.join(fixture, "dist/.stressguru-seo-template.html"), marker + base());
    expect(() => generate()).toThrow(/contains generated snapshot content/);
    await fs.writeFile(path.join(fixture, "dist/public/index.html"), base().replace('<div id="root"></div>', '<noscript><main><article><h1>Prior generated answer</h1></article></main></noscript><div id="root"></div>'));
    expect(() => generate()).toThrow(/Legacy generated homepage/);
  });
});
