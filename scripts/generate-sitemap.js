import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const BASE_URL = "https://stressguru.ai";
const OUTPUT_FILE = path.join(root, "client/public/sitemap.xml");
const CONTENT_FILE = path.join(root, "client/src/data/contentPages.generated.json");
const BLOG_FILE = path.join(root, "docs/seo/blogs.generated.json");
const LAST_MODIFIED = process.env.SITEMAP_LASTMOD || "2026-09-19";

const corePages = [
  "/",
  "/app",
  "/how-it-works",
  "/plans",
  "/about",
  "/contact",
  "/blogs",
  "/books",
  "/books/sleep-again",
  "/quiz",
  "/stress-profile",
  "/gurus",
  "/gurus/stress",
  "/gurus/sleep",
  "/gurus/anxiety",
  "/gurus/motivation",
  "/gurus/relationship",
  "/gurus/happiness",
  "/gurus/calm",
  "/gurus/spiritual",
  "/science-and-safety",
  "/editorial-policy",
  "/accessibility",
  "/privacy-policy",
  "/terms-and-conditions",
];

function readJson(file, fallback = []) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const contentPages = readJson(CONTENT_FILE).map(page => ({
  path: page.url,
  lastmod: LAST_MODIFIED,
  changefreq: page.cluster === "pillar-hub" ? "weekly" : "monthly",
  priority: page.cluster === "pillar-hub" ? "0.9" : "0.7",
}));

const blogPages = readJson(BLOG_FILE)
  .filter(blog => blog.status === "published")
  .map(blog => ({
    path: `/blogs/${blog.slug}`,
    lastmod: (blog.publishedAt || LAST_MODIFIED).slice(0, 10),
    changefreq: "monthly",
    priority: "0.7",
  }));

const entries = [
  ...corePages.map(page => ({
    path: page,
    lastmod: LAST_MODIFIED,
    changefreq: page === "/" || page === "/blogs" ? "weekly" : "monthly",
    priority: page === "/" ? "1.0" : "0.8",
  })),
  ...contentPages,
  ...blogPages,
];

const uniqueEntries = [...new Map(entries.map(entry => [entry.path, entry])).values()]
  .sort((a, b) => a.path.localeCompare(b.path));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueEntries.map(entry => `  <url>
    <loc>${escapeXml(BASE_URL + entry.path)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(OUTPUT_FILE, sitemap);
console.log(`Sitemap generated with ${uniqueEntries.length} URLs at ${OUTPUT_FILE}`);
