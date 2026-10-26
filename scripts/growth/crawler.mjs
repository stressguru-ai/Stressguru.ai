import { createHash } from "node:crypto";

export function decodeHtml(value = "") {
  return String(value).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

export function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

export function inspectHtml(html, requestedUrl, { status = 200, finalUrl = requestedUrl, contentType = "text/html", expectedCanonicalUrl = requestedUrl } = {}) {
  const target = new URL(requestedUrl);
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attributes(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attributes(m[0]));
  const bodyHtml = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html.replace(/<head\b[\s\S]*?<\/head>/gi, " ");
  const bodyText = decodeHtml(bodyHtml.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const getMeta = key => metas.find(m => m.name === key || m.property === key)?.content ?? null;
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => decodeHtml(m[1].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim());
  const canonical = links.find(m => (m.rel ?? "").toLowerCase() === "canonical")?.href ?? null;
  const internalLinks = [...html.matchAll(/<a\b[^>]*>/gi)].map(m => attributes(m[0]).href).filter(Boolean).flatMap(href => {
    try { const url = new URL(href, finalUrl); return url.origin === target.origin ? [url.pathname] : []; } catch { return []; }
  });
  const imagePaths = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => attributes(m[0]));
  const schemas = [];
  const issues = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { schemas.push(JSON.parse(m[1])); } catch { issues.push({ code: "invalid-jsonld", priority: "high", evidence: "JSON-LD could not be parsed" }); }
  }
  const add = (code, priority, evidence) => issues.push({ code, priority, evidence });
  if (status !== 200) add("http-status", "high", `HTTP ${status}`);
  if (!contentType.includes("text/html")) add("non-html", "high", contentType);
  if (h1s.length !== 1) add("h1-count", "high", `${h1s.length} primary headings in initial HTML`);
  if (bodyText.length < 250) add("missing-crawlable-body", "critical", `${bodyText.length} text characters without script/style`);
  if (!canonical) add("missing-canonical", "high", "No canonical link in initial HTML");
  else if (canonical.replace(/\/$/, "") !== expectedCanonicalUrl.replace(/\/$/, "")) add("canonical-mismatch", "high", `Canonical differs: ${canonical}`);
  const title = decodeHtml(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!title) add("missing-title", "high", "No initial HTML title");
  if (!getMeta("description")) add("missing-description", "medium", "No initial HTML description");
  if (/noindex/i.test(getMeta("robots") ?? "")) add("noindex", "high", "Public URL has noindex metadata");
  const isNonContentImage = m => m["aria-hidden"] === "true" || ["presentation", "none"].includes(m.role) ||
    (m.width === "1" && m.height === "1" && /display\s*:\s*none|visibility\s*:\s*hidden/i.test(m.style ?? ""));
  if (imagePaths.some(m => !isNonContentImage(m) && !Object.hasOwn(m, "alt"))) add("image-alt", "medium", "At least one content image has no alt attribute; decorative alt values require contextual review");
  if (/<noscript\b/i.test(html) && /data-answer\s*=/i.test(html)) add("noscript-snapshot", "medium", "Answer snapshot is in noscript; not complete SSR/hydration parity and needs rendered comparison");
  return { url: requestedUrl, finalUrl, status, contentType, title, description: getMeta("description"), canonical, h1s,
    textCharacters: bodyText.length, textHash: createHash("sha256").update(bodyText).digest("hex"),
    answerFirst: /data-answer\s*=\s*["']true["']/i.test(html),
    noscriptContent: /<noscript\b/i.test(html), internalLinks: [...new Set(internalLinks)],
    schemaTypes: schemas.flatMap(s => Array.isArray(s) ? s.map(v => v["@type"]) : s["@graph"] ? s["@graph"].map(v => v["@type"]) : [s["@type"]]).filter(Boolean),
    issues };
}

export async function boundedMap(items, concurrency, fn) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error("Concurrency must be 1-8");
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) { const index = next++; results[index] = await fn(items[index], index); }
  }));
  return results;
}

export function validateCrawlOrigin(origin) {
  const url = new URL(origin);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("Crawl origin must not contain credentials, a path, or parameters");
  const isLocal = ["127.0.0.1", "localhost"].includes(url.hostname);
  if (!(url.protocol === "https:" && url.hostname === "stressguru.ai") && !(isLocal && url.protocol === "http:")) throw new Error("Only the approved public origin or local test HTTP origin is allowed");
  return url.origin;
}

export async function crawlRoutes(origin, routes, { concurrency = 3, timeoutMs = 15000, userAgent = "StressGuruGrowthAudit/1.0 (+https://stressguru.ai/editorial-policy)", onProgress = () => {} } = {}) {
  const base = validateCrawlOrigin(origin);
  const paths = [...new Set(routes.map(r => typeof r === "string" ? r : r.path ?? r.url))];
  const results = await boundedMap(paths, concurrency, async (route, index) => {
    if (!route?.startsWith("/") || route.startsWith("//") || /[?#\s]/.test(route) || /^\/(api|admin|account|preview)(\/|$)/.test(route)) {
      throw new Error(`Invalid public crawl route: ${route}`);
    }
    const requestedUrl = `${base}${route}`;
    const started = performance.now();
    try {
      let url = requestedUrl;
      let response;
      for (let hop = 0; hop <= 4; hop++) {
        response = await fetch(url, { headers: { "user-agent": userAgent, accept: "text/html" }, signal: AbortSignal.timeout(timeoutMs), redirect: "manual" });
        if (![301, 302, 303, 307, 308].includes(response.status)) break;
        const destination = new URL(response.headers.get("location"), url);
        if (destination.origin !== base) throw new Error("Cross-origin redirect blocked");
        url = destination.href;
        if (hop === 4) throw new Error("Redirect limit reached");
      }
      const html = await response.text();
      if (html.length > 5_000_000) throw new Error("Response exceeds audit size limit");
      const result = inspectHtml(html, requestedUrl, { status: response.status, finalUrl: url, contentType: response.headers.get("content-type") ?? "", expectedCanonicalUrl: `https://stressguru.ai${route}` });
      result.labRequestMs = Math.round(performance.now() - started);
      onProgress(index + 1, paths.length, result);
      return result;
    } catch (error) {
      const result = { url: requestedUrl, status: null, error: error.message, issues: [{ code: "request-failed", priority: "high", evidence: error.message }] };
      onProgress(index + 1, paths.length, result);
      return result;
    }
  });
  const groups = new Map();
  for (const row of results.filter(r => r.textHash)) {
    for (const [kind, value] of [["title", row.title], ["description", row.description], ["body", row.textHash]]) {
      if (!value) continue;
      const key = `${kind}:${value}`;
      const group = groups.get(key) ?? { kind, urls: [] }; group.urls.push(row.url); groups.set(key, group);
    }
  }
  return { origin: base, observedAt: new Date().toISOString(), javascriptExecuted: false, methodology: "Initial HTTP HTML only. Request timing is a lab observation, not LCP, INP, CLS or field Core Web Vitals.",
    routes: results, duplicateGroups: [...groups.values()].filter(g => g.urls.length > 1),
    totals: { checked: results.length, http200: results.filter(r => r.status === 200).length, failures: results.filter(r => r.status !== 200).length } };
}
