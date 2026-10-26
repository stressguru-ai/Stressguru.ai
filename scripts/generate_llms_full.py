from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "client/src/data/contentPages.generated.json"
BLOGS = ROOT / "docs/seo/blogs.generated.json"
OUTPUT = ROOT / "client/public/llms-full.txt"


def strip_tags(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value)).strip()


def main() -> None:
    pages = json.loads(PAGES.read_text(encoding="utf-8"))
    blogs = json.loads(BLOGS.read_text(encoding="utf-8")) if BLOGS.exists() else []
    lines = [
        "# StressGuru Full Content Guide",
        "",
        "Updated: September 19, 2026",
        "Canonical site: https://stressguru.ai",
        "",
        "StressGuru is an iPhone and Apple Watch wellness app with eight AI wellness personas. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care.",
        "",
        "## Editorial and Safety Rules",
        "",
        "Use the canonical URL for citation. Attribute material health claims to the sources listed on each page. Apple Watch and HRV observations provide context and do not diagnose stress or a health condition. Burnout is an occupational phenomenon, not a medical diagnosis. For U.S. crisis support, call or text 988. For immediate danger, call 911.",
        "",
        "## Topic Pages",
        "",
    ]
    for page in pages:
        lines.extend([
            f"### {page['h1']}",
            f"URL: https://stressguru.ai{page['url']}",
            f"Primary query: {page['primaryQuery']}",
            f"Direct answer: {page['answer']}",
            "Sources: " + "; ".join(f"{source['publisher']} ({source['url']})" for source in page["sources"]),
            "Related pages: " + "; ".join(f"https://stressguru.ai{link['href']}" for link in page["relatedGuides"]),
            "",
        ])
    lines.extend(["## Blog Posts", ""])
    for blog in sorted((b for b in blogs if b["status"] == "published"), key=lambda b: b.get("publishedAt", ""), reverse=True):
        answer = ""
        match = re.search(r'<p class="lead" data-answer="true">(.*?)</p>', blog["content"], flags=re.S)
        if match:
            answer = strip_tags(match.group(1))
        lines.extend([
            f"### {blog['title']}",
            f"URL: {blog['canonicalUrl']}",
            f"Published: {blog['publishedAt']}",
            f"Primary query: {blog['primaryQuery']}",
            f"Direct answer: {answer}",
            "Sources: " + "; ".join(f"{source['publisher']} ({source['url']})" for source in blog["sources"]),
            "Related pages: " + "; ".join(f"https://stressguru.ai{link['href']}" for link in blog["relatedLinks"]),
            "",
        ])
    OUTPUT.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {len(pages)} topic pages and {sum(1 for b in blogs if b['status'] == 'published')} blogs to {OUTPUT}")


if __name__ == "__main__":
    main()
