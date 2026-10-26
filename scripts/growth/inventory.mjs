import fs from "node:fs";
import path from "node:path";

const GUIDE_FILE_CANDIDATES = [
  "contentPages.generated.json",
  "client/src/data/contentPages.generated.json",
];
const BLOG_FILE_CANDIDATES = [
  "blogs.generated.json",
  "docs/seo/blogs.generated.json",
];
const SITEMAP_FILE_CANDIDATES = ["sitemap.xml", "client/public/sitemap.xml"];
const APP_FILE_CANDIDATES = ["client/src/App.tsx", "App.tsx"];
const STOP_WORDS = new Set([
  "a", "an", "and", "at", "for", "from", "how", "in", "is", "of", "on", "or",
  "the", "to", "with", "your", "you", "guide", "tips", "women", "woman", "working",
]);

/**
 * Build a repository-only inventory for the growth agent.
 *
 * This function deliberately reads checked-in source artifacts only. Its output is a
 * repository snapshot, not a claim about a deployed site, AWS, analytics, or a live
 * database. It performs no network I/O and writes no files.
 *
 * @param {string} root absolute or relative repository directory
 * @returns {object} JSON-serializable inventory with routes, content, assets and links
 */
export function buildInventory(root) {
  if (typeof root !== "string" || root.trim() === "") {
    throw new TypeError("buildInventory(root) requires a non-empty repository path");
  }

  const repositoryRoot = path.resolve(root);
  if (!fs.existsSync(repositoryRoot) || !fs.statSync(repositoryRoot).isDirectory()) {
    throw new TypeError(`Repository root does not exist or is not a directory: ${repositoryRoot}`);
  }

  const files = {
    guides: findFirstFile(repositoryRoot, GUIDE_FILE_CANDIDATES),
    blogs: findFirstFile(repositoryRoot, BLOG_FILE_CANDIDATES),
    sitemap: findFirstFile(repositoryRoot, SITEMAP_FILE_CANDIDATES),
    app: findFirstFile(repositoryRoot, APP_FILE_CANDIDATES),
  };

  const guidePages = readJsonArray(files.guides, "generated guide content");
  const blogPages = readJsonArray(files.blogs, "generated blog content");
  const sitemapEntries = parseSitemap(files.sitemap);
  const sourceRoutes = parseSourceRoutes(files.app, repositoryRoot);
  const sitemapByPath = new Map(sitemapEntries.map((entry) => [entry.path, entry]));

  const guides = guidePages
    .filter((page) => isPlainObject(page) && typeof page.url === "string" && isPublicPath(page.url))
    .map((page, index) => createGuideRecord(page, index, sitemapByPath.get(normalizePath(page.url)), repositoryRoot, files.guides));

  // A draft is intentionally not represented as a public record, even if a stale sitemap
  // happened to contain its path. The generated status is the publication authority here.
  const publishedBlogs = blogPages
    .filter((blog) => isPlainObject(blog) && String(blog.status || "").toLowerCase() === "published")
    .filter((blog) => typeof blog.slug === "string" && isSafeSlug(blog.slug))
    .map((blog, index) => createBlogRecord(blog, index, sitemapByPath.get(`/blogs/${blog.slug}`), repositoryRoot, files.blogs));

  const guidePaths = new Set(guides.map((record) => record.path));
  const publishedBlogPaths = new Set(publishedBlogs.map((record) => record.path));
  const coreRoutes = sitemapEntries
    .filter((entry) => !guidePaths.has(entry.path))
    .filter((entry) => !entry.path.startsWith("/blogs/") || publishedBlogPaths.has(entry.path))
    .filter((entry) => !publishedBlogPaths.has(entry.path))
    .map((entry) => createCoreRecord(entry, repositoryRoot, files.sitemap, sourceRoutes));

  const publicRoutes = uniqueByPath([...coreRoutes, ...guides, ...publishedBlogs]);
  const linkGraph = buildLinkGraph(publicRoutes, guides, publishedBlogs);
  const localImages = buildLocalImageManifest(repositoryRoot, publicRoutes);
  const clusterMapping = buildClusterMapping(guides);
  const duplicateIntentHypotheses = buildDuplicateIntentHypotheses([...guides, ...publishedBlogs]);

  const sourceRouteRecords = sourceRoutes.map((route) => ({
    ...route,
    sourceFile: toRepoPath(repositoryRoot, files.app),
    repositoryOnly: true,
  }));

  return {
    snapshot: {
      scope: "repository-snapshot",
      description:
        "Derived from checked-in sitemap, route source, generated guide/blog JSON, and local image files. This is not live AWS, deployment, crawl, analytics, or database evidence.",
      liveAws: false,
      networkAccessed: false,
      inputFiles: Object.fromEntries(
        Object.entries(files).map(([key, filename]) => [key, filename ? toRepoPath(repositoryRoot, filename) : null]),
      ),
    },
    // Kept both as named fields and a grouped contract for simple runner consumption.
    coreRoutes,
    sourceRoutes: sourceRouteRecords,
    publicRoutes,
    routes: {
      core: coreRoutes,
      source: sourceRouteRecords,
      public: publicRoutes,
    },
    guides,
    publishedBlogs,
    blogs: publishedBlogs,
    localImages,
    linkGraph,
    duplicateIntentHypotheses,
    clusterMapping,
    existingClusterMapping: clusterMapping,
  };
}

function findFirstFile(root, candidates) {
  for (const candidate of candidates) {
    const filename = path.join(root, candidate);
    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) return filename;
  }
  return null;
}

function readJsonArray(filename, label) {
  if (!filename) return [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${label} at ${filename}: ${error.message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new TypeError(`${label} at ${filename} must be a JSON array`);
  }
  return parsed;
}

function parseSitemap(filename) {
  if (!filename) return [];
  const xml = fs.readFileSync(filename, "utf8");
  const entries = [];
  const urlBlocks = xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi);
  for (const match of urlBlocks) {
    const block = match[1];
    const loc = readXmlTag(block, "loc");
    if (!loc) continue;
    const routePath = routeFromLocation(loc);
    if (!routePath || !isPublicPath(routePath)) continue;
    entries.push({
      path: routePath,
      location: loc,
      lastmod: readXmlTag(block, "lastmod"),
      changefreq: readXmlTag(block, "changefreq"),
      priority: readXmlTag(block, "priority"),
    });
  }
  return uniqueByPath(entries);
}

function readXmlTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>\\s*([^<]+?)\\s*</${tagName}>`, "i"));
  return match ? decodeXml(match[1].trim()) : null;
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function routeFromLocation(location) {
  try {
    if (location.startsWith("/")) return normalizePath(location);
    const parsed = new URL(location);
    return normalizePath(parsed.pathname);
  } catch {
    return null;
  }
}

function parseSourceRoutes(filename, repositoryRoot) {
  if (!filename) return [];
  const source = fs.readFileSync(filename, "utf8");
  const records = [];
  const seen = new Set();
  const routePattern = /<Route\s+path\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*["']([^"']+)["']\s*\})/g;
  for (const match of source.matchAll(routePattern)) {
    const routePath = match[1] || match[2] || match[3];
    if (!routePath || seen.has(routePath)) continue;
    seen.add(routePath);
    const privateRoute = routePath === "/admin" || routePath.startsWith("/admin/");
    records.push({
      path: routePath,
      kind: "source-route",
      source: "application-route",
      visibility: privateRoute ? "private" : "public-template",
      isDynamic: routePath.includes(":"),
      isPublic: !privateRoute,
      sourceFile: toRepoPath(repositoryRoot, filename),
    });
  }
  return records;
}

function createCoreRecord(entry, repositoryRoot, sitemapFile, sourceRoutes) {
  const sourceRoute = sourceRoutes.find((route) => route.path === entry.path);
  return {
    path: entry.path,
    kind: "core",
    source: "sitemap",
    isPublic: true,
    inSitemap: true,
    sitemap: sitemapMetadata(entry),
    sourceFile: toRepoPath(repositoryRoot, sitemapFile),
    sourceRoute: sourceRoute ? sourceRoute.path : null,
    evidenceSources: [],
    sources: [],
  };
}

function createGuideRecord(page, index, sitemapEntry, repositoryRoot, filename) {
  const routePath = normalizePath(page.url);
  const evidenceSources = normalizeEvidenceSources(page.sources);
  return {
    path: routePath,
    kind: "guide",
    source: "generated-guide",
    isPublic: true,
    inSitemap: Boolean(sitemapEntry),
    sitemap: sitemapMetadata(sitemapEntry),
    sourceFile: toRepoPath(repositoryRoot, filename),
    sourceIndex: index,
    title: firstNonEmpty(page.h1, page.seoTitle, page.primaryQuery, routePath),
    primaryQuery: stringOrNull(page.primaryQuery),
    intent: stringOrNull(page.intent),
    funnelStage: stringOrNull(page.funnelStage),
    cluster: stringOrNull(page.cluster),
    published: stringOrNull(page.published),
    evidenceSources,
    // `sources` is retained as a convenient consumer-facing alias; neither field makes
    // a real-time verification claim.
    sources: evidenceSources,
    relatedLinks: normalizeLinks(page.relatedGuides),
    assetReferences: collectImageReferences(page),
  };
}

function createBlogRecord(blog, index, sitemapEntry, repositoryRoot, filename) {
  const routePath = `/blogs/${blog.slug}`;
  const evidenceSources = normalizeEvidenceSources(blog.sources);
  return {
    path: routePath,
    kind: "blog",
    source: "generated-blog",
    isPublic: true,
    inSitemap: Boolean(sitemapEntry),
    sitemap: sitemapMetadata(sitemapEntry),
    sourceFile: toRepoPath(repositoryRoot, filename),
    sourceIndex: index,
    slug: blog.slug,
    status: "published",
    publishedAt: stringOrNull(blog.publishedAt),
    title: firstNonEmpty(blog.title, blog.originalTitle, blog.slug),
    primaryQuery: firstNonEmpty(blog.primaryQuery, blog.primaryQueryHint, null),
    intent: stringOrNull(blog.category),
    category: stringOrNull(blog.category),
    evidenceSources,
    sources: evidenceSources,
    relatedLinks: normalizeLinks(blog.relatedLinks),
    contentLinks: extractHtmlLinks(blog.content),
    assetReferences: collectImageReferences(blog),
  };
}

function sitemapMetadata(entry) {
  if (!entry) return null;
  return {
    location: entry.location,
    lastmod: entry.lastmod,
    changefreq: entry.changefreq,
    priority: entry.priority,
  };
}

function normalizeEvidenceSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources
    .filter(isPlainObject)
    .map((source) => ({
      publisher: stringOrNull(source.publisher),
      title: stringOrNull(source.title),
      url: safeHttpUrl(source.url),
    }))
    .filter((source) => source.publisher || source.title || source.url);
}

function normalizeLinks(links) {
  if (!Array.isArray(links)) return [];
  return links
    .filter(isPlainObject)
    .map((link) => ({ href: normalizeInternalHref(link.href), title: stringOrNull(link.title) }))
    .filter((link) => link.href);
}

function extractHtmlLinks(html) {
  if (typeof html !== "string") return [];
  const links = [];
  const hrefPattern = /\bhref\s*=\s*(["'])(.*?)\1/gi;
  for (const match of html.matchAll(hrefPattern)) {
    const href = normalizeInternalHref(decodeXml(match[2]));
    if (href) links.push({ href, title: null });
  }
  return uniqueByHref(links);
}

function buildLinkGraph(publicRoutes, guides, publishedBlogs) {
  const knownPaths = new Set(publicRoutes.map((route) => route.path));
  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (from, to, kind) => {
    if (!knownPaths.has(from) || !to) return;
    const key = `${from}\u0000${to}\u0000${kind}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, kind, knownTarget: knownPaths.has(to) });
  };

  // The blog listing is an explicit application route and is a known public listing of
  // generated published posts. No similarly broad guide listing is invented.
  if (knownPaths.has("/blogs")) {
    for (const blog of publishedBlogs) addEdge("/blogs", blog.path, "known-listing");
  }
  for (const guide of guides) {
    for (const link of guide.relatedLinks) addEdge(guide.path, link.href, "guide-related");
  }
  for (const blog of publishedBlogs) {
    for (const link of blog.relatedLinks) addEdge(blog.path, link.href, "blog-related");
    for (const link of blog.contentLinks) addEdge(blog.path, link.href, "blog-content");
  }

  const inbound = new Map(publicRoutes.map((route) => [route.path, []]));
  const outbound = new Map(publicRoutes.map((route) => [route.path, []]));
  for (const edge of edges) {
    if (edge.knownTarget && edge.from !== edge.to) inbound.get(edge.to).push(edge);
    if (knownPaths.has(edge.from)) outbound.get(edge.from).push(edge);
  }

  const nodes = publicRoutes.map((route) => ({
    path: route.path,
    kind: route.kind,
    inboundCount: inbound.get(route.path).length,
    outboundCount: outbound.get(route.path).length,
    inboundFrom: inbound.get(route.path).map((edge) => edge.from),
  }));
  const orphans = nodes
    .filter((node) => node.path !== "/" && node.inboundCount === 0)
    .map((node) => ({ path: node.path, kind: node.kind, reason: "No known internal inbound link in the repository snapshot" }));

  return {
    scope: "known-internal-links-from-generated-content-and-known-listings",
    edges,
    nodes,
    inbound: Object.fromEntries(nodes.map((node) => [node.path, node.inboundFrom])),
    orphans,
  };
}

function buildLocalImageManifest(repositoryRoot, publicRoutes) {
  const imageDirectory = path.join(repositoryRoot, "client", "public", "images");
  const references = new Map();
  for (const route of publicRoutes) {
    for (const imagePath of route.assetReferences || []) {
      const normalized = normalizeImagePath(imagePath);
      if (!normalized) continue;
      const current = references.get(normalized) || [];
      current.push(route.path);
      references.set(normalized, current);
    }
  }

  const images = [];
  if (fs.existsSync(imageDirectory) && fs.statSync(imageDirectory).isDirectory()) {
    for (const absolutePath of walkFiles(imageDirectory)) {
      const relativeToImages = path.relative(imageDirectory, absolutePath).split(path.sep).join("/");
      const publicPath = `/images/${relativeToImages}`;
      const stat = fs.statSync(absolutePath);
      images.push({
        path: publicPath,
        file: toRepoPath(repositoryRoot, absolutePath),
        extension: path.extname(relativeToImages).toLowerCase(),
        bytes: stat.size,
        referencedBy: [...new Set(references.get(publicPath) || [])].sort(),
      });
    }
  }
  images.sort((left, right) => left.path.localeCompare(right.path));

  return {
    scope: "local-files-under-client/public/images",
    directory: fs.existsSync(imageDirectory) ? toRepoPath(repositoryRoot, imageDirectory) : null,
    images,
    count: images.length,
    unreferenced: images.filter((image) => image.referencedBy.length === 0).map((image) => image.path),
  };
}

function buildClusterMapping(guides) {
  const mapping = {};
  for (const guide of guides) {
    const cluster = guide.cluster || "unclustered";
    if (!mapping[cluster]) mapping[cluster] = [];
    // Exact existing URLs are retained; this inventory never proposes a route rewrite.
    mapping[cluster].push(guide.path);
  }
  return Object.fromEntries(Object.entries(mapping).map(([cluster, routes]) => [cluster, [...routes]]));
}

function buildDuplicateIntentHypotheses(records) {
  const candidates = records
    .map((record, index) => ({
      index,
      path: record.path,
      kind: record.kind,
      title: record.title || record.path,
      rawIntent: firstNonEmpty(record.primaryQuery, record.intent, record.title, ""),
    }))
    .map((record) => ({ ...record, tokens: intentTokens(record.rawIntent) }))
    .filter((record) => record.tokens.length > 0);

  const parent = candidates.map((_, index) => index);
  const find = (index) => (parent[index] === index ? index : (parent[index] = find(parent[index])));
  const join = (left, right) => {
    const leftParent = find(left);
    const rightParent = find(right);
    if (leftParent !== rightParent) parent[rightParent] = leftParent;
  };
  const similarities = new Map();

  for (let left = 0; left < candidates.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      const similarity = jaccard(candidates[left].tokens, candidates[right].tokens);
      const exact = candidates[left].tokens.join(" ") === candidates[right].tokens.join(" ");
      if (exact || (similarity >= 0.72 && Math.min(candidates[left].tokens.length, candidates[right].tokens.length) >= 2)) {
        join(left, right);
        similarities.set(`${left}:${right}`, similarity);
      }
    }
  }

  const groups = new Map();
  for (let index = 0; index < candidates.length; index += 1) {
    const root = find(index);
    const group = groups.get(root) || [];
    group.push(candidates[index]);
    groups.set(root, group);
  }

  return [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => {
      const pairScores = [];
      for (let left = 0; left < group.length; left += 1) {
        for (let right = left + 1; right < group.length; right += 1) {
          pairScores.push(jaccard(group[left].tokens, group[right].tokens));
        }
      }
      const shared = group
        .map((record) => new Set(record.tokens))
        .reduce((common, tokens) => new Set([...common].filter((token) => tokens.has(token))));
      return {
        intentKey: group[0].tokens.join("-"),
        routes: group.map((record) => record.path),
        records: group.map(({ path: route, kind, title, rawIntent }) => ({ route, kind, title, intent: rawIntent })),
        similarity: Number(Math.max(...pairScores, 0).toFixed(3)),
        sharedTerms: [...shared].sort(),
        status: "hypothesis",
        requiresEditorialReview: true,
        reason: "Potential overlap from repository intent text; this is not a redirect, deletion, or consolidation decision.",
      };
    })
    .sort((left, right) => left.routes[0].localeCompare(right.routes[0]));
}

function intentTokens(value) {
  if (typeof value !== "string") return [];
  return [...new Set(value.toLowerCase().replaceAll(/[^a-z0-9]+/g, " ").split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token)))].sort();
}

function jaccard(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = [...leftSet].filter((token) => rightSet.has(token)).length;
  const union = new Set([...leftSet, ...rightSet]).size;
  return union === 0 ? 0 : intersection / union;
}

function collectImageReferences(record) {
  const found = new Set();
  const visit = (value, key = "") => {
    if (typeof value === "string") {
      if (/image|content|html/i.test(key)) {
        for (const match of value.matchAll(/\/images\/[^\s"'<>)]+/g)) found.add(decodeXml(match[0]));
      }
      if (/image|og/i.test(key)) found.add(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item, key);
      return;
    }
    if (isPlainObject(value)) {
      for (const [childKey, childValue] of Object.entries(value)) visit(childValue, childKey);
    }
  };
  visit(record);
  return [...found].map(normalizeImagePath).filter(Boolean).sort();
}

function normalizeImagePath(value) {
  if (typeof value !== "string") return null;
  const matched = value.match(/^(\/images\/[^?#]+)(?:[?#].*)?$/);
  return matched ? matched[1] : null;
}

function normalizeInternalHref(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const href = value.trim();
  if (href.startsWith("/")) return normalizePath(href);
  try {
    const parsed = new URL(href);
    if (parsed.hostname === "stressguru.ai" || parsed.hostname === "www.stressguru.ai") {
      return normalizePath(parsed.pathname);
    }
  } catch {
    // Malformed values cannot be internal graph edges.
  }
  return null;
}

function normalizePath(value) {
  const withoutFragment = String(value).split("#", 1)[0].split("?", 1)[0];
  if (!withoutFragment.startsWith("/")) return null;
  return withoutFragment === "" ? "/" : withoutFragment;
}

function isPublicPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    && !/^\/(?:api|admin|account|preview|404)(?:\/|$)/.test(value)
    && !/[?#\s]/.test(value);
}

function isSafeSlug(value) {
  return /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/i.test(value);
}

function safeHttpUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    return !parsed.username && !parsed.password && (parsed.protocol === "https:" || parsed.protocol === "http:") ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function walkFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

function uniqueByPath(records) {
  const seen = new Set();
  return records.filter((record) => {
    if (!record || !record.path || seen.has(record.path)) return false;
    seen.add(record.path);
    return true;
  });
}

function uniqueByHref(records) {
  const seen = new Set();
  return records.filter((record) => {
    if (seen.has(record.href)) return false;
    seen.add(record.href);
    return true;
  });
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  return null;
}

function stringOrNull(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toRepoPath(repositoryRoot, filename) {
  if (!filename) return null;
  return path.relative(repositoryRoot, filename).split(path.sep).join("/");
}
