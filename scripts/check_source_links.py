from __future__ import annotations

import concurrent.futures as cf
import json
from collections import defaultdict
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "client/src/data/contentPages.generated.json"
BLOGS = ROOT / "docs/seo/blogs.generated.json"
REPORT = ROOT / "docs/seo/source-link-report.md"


def check(url: str) -> tuple[str, int | str, str]:
    try:
        response = requests.get(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; StressGuruCitationAudit/1.0; +https://stressguru.ai)"},
            timeout=25,
            allow_redirects=True,
            stream=True,
        )
        return url, response.status_code, response.url
    except Exception as exc:
        return url, "ERROR", str(exc)


def main() -> None:
    pages = json.loads(PAGES.read_text(encoding="utf-8"))
    blogs = json.loads(BLOGS.read_text(encoding="utf-8")) if BLOGS.exists() else []
    used_by: dict[str, set[str]] = defaultdict(set)
    for page in pages:
        for source in page.get("sources", []):
            used_by[source["url"]].add(page["url"])
    for blog in blogs:
        for source in blog.get("sources", []):
            used_by[source["url"]].add(f"/blogs/{blog['slug']}")

    results = []
    with cf.ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(check, sorted(used_by)):
            results.append(result)

    broken = [row for row in results if row[1] == "ERROR" or (isinstance(row[1], int) and row[1] in {404, 410})]
    lines = [
        "# StressGuru Citation Link Report",
        "",
        "**Checked:** September 19, 2026",
        "",
        f"**Unique source URLs:** {len(results)}",
        "",
        f"**Broken or unreachable URLs requiring review:** {len(broken)}",
        "",
        "| Status | Source URL | Final URL or error | Used by pages |",
        "|---:|---|---|---:|",
    ]
    for url, status, final in results:
        lines.append(f"| {status} | {url.replace('|', '%7C')} | {str(final).replace('|', '%7C')} | {len(used_by[url])} |")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Checked {len(results)} source URLs; {len(broken)} returned 404, 410, or connection errors. Report: {REPORT}")
    if broken:
        for row in broken:
            print("BROKEN", *row)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
