import { validateCrawlOrigin } from "./crawler.mjs";

const listingPath = "/api/trpc/blog.listPublished?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D";
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Only the unauthenticated, published listing is read. No DB, user data, article
// body, private endpoint, credentials, publication action, or image write occurs.
export async function discoverPublicBlogRoutes(origin, {
  fetchImpl = fetch, timeoutMs = 15000, maxBlogs = 1000,
} = {}) {
  const base = validateCrawlOrigin(origin);
  if (base !== "https://stressguru.ai") throw new Error("Live blog discovery requires the approved public HTTPS origin");
  const endpoint = `${base}${listingPath}`;
  const unavailable = reason => ({ status: "unavailable", reason, endpoint, routes: [], rejectedRows: 0 });
  try {
    const response = await fetchImpl(endpoint, {
      headers: { accept: "application/json", "user-agent": "StressGuruGrowthAudit/1.0 (+https://stressguru.ai/editorial-policy)" },
      redirect: "manual", signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status !== 200) return unavailable(`Published listing returned HTTP ${response.status}`);
    if (!(response.headers.get("content-type") ?? "").includes("application/json")) return unavailable("Published listing did not return JSON");
    const text = await response.text();
    if (text.length > 5_000_000) return unavailable("Published listing exceeds audit size limit");
    const parsed = JSON.parse(text);
    const envelope = Array.isArray(parsed) ? parsed[0] : parsed;
    const data = envelope?.result?.data;
    const blogs = data?.json ?? data;
    if (!Array.isArray(blogs)) return unavailable("Published listing has an unsupported response shape");
    if (blogs.length > maxBlogs) return unavailable("Published listing exceeds route count limit; no truncated audit is claimed");
    let rejectedRows = 0;
    const paths = new Set();
    for (const blog of blogs) {
      if (!blog || blog.status !== "published" || typeof blog.slug !== "string" || blog.slug.length > 200 || !safeSlug.test(blog.slug)) {
        rejectedRows++;
        continue;
      }
      paths.add(`/blogs/${blog.slug}`);
    }
    return { status: "observed", endpoint, publishedListingRows: blogs.length, rejectedRows,
      routes: [...paths].sort().map(path => ({ path, evidenceSource: "public-published-blog-api" })) };
  } catch {
    // Do not persist untrusted response bodies or credential-shaped error details.
    return unavailable("Published listing could not be retrieved or parsed within the audit limits");
  }
}

export function mergePublicBlogRoutes(sourceRoutes, discovery) {
  const byPath = new Map(sourceRoutes.map(route => [typeof route === "string" ? route : route.path ?? route.url, route]));
  const sourcePaths = new Set(byPath.keys());
  for (const route of discovery.routes) if (!byPath.has(route.path)) byPath.set(route.path, route);
  return { routes: [...byPath.values()], sourceRouteCount: sourceRoutes.length,
    discoveredPublishedBlogs: discovery.routes.length,
    publicBlogsMissingFromSource: discovery.routes.map(route => route.path).filter(path => !sourcePaths.has(path)) };
}
