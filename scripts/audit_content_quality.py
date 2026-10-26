from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES_PATH = ROOT / "client/src/data/contentPages.generated.json"
BLOGS_PATH = ROOT / "docs/seo/blogs.generated.json"
REPORT_PATH = ROOT / "docs/seo/content-quality-report.md"

CORE_ROUTES = {
    "/", "/app", "/how-it-works", "/plans", "/about", "/contact", "/blogs", "/books", "/books/sleep-again",
    "/quiz", "/stress-profile", "/gurus", "/science-and-safety", "/editorial-policy", "/accessibility",
    "/privacy-policy", "/terms-and-conditions", "/gurus/stress", "/gurus/sleep", "/gurus/anxiety",
    "/gurus/motivation", "/gurus/relationship", "/gurus/happiness", "/gurus/calm", "/gurus/spiritual", "/plans",
}
BANNED = [
    ("em dash", "\u2014"), ("delve", r"\bdelve\b"), ("unlock", r"\bunlock\b"),
    ("you are not alone", r"\byou are not alone\b"), ("nervous system is not broken", r"\byour nervous system is not broken\b"),
    ("fast-paced world", r"\bin today's fast-paced world\b"), ("journey", r"\bjourney\b"),
    ("AI coach terminology", r"\b(?:AI|StressGuru) (?:wellness )?coach(?:es|ing)?\b"),
]
UNSAFE = [
    r"\b(?:StressGuru|the app|this app|the Guru) (?:will|can) (?:diagnose|treat|cure|prevent|detect)\b",
    r"\bApple Watch (?:will|can) (?:diagnose|detect) (?:stress|anxiety|burnout|depression)\b",
]
CHALLENGE_PATTERN = re.compile(
    r"\b(stress|pressure|workload|burnout|worry|anxiety|overthink(?:ing)?|rumination|sleep|insomnia|"
    r"tired|fatigue|overwhelm(?:ed)?|mental load|caregiv(?:er|ing)|conflict|boundary|boundaries|"
    r"motivation|focus|tension|low mood|restless|distraction|uncertainty)\b",
    flags=re.I,
)


def all_text(page: dict) -> str:
    fields = [page.get(k, "") for k in ["seoTitle", "seoDescription", "h1", "answer", "summary", "quickActionTitle"]]
    fields.extend(page.get("quickActionSteps", []))
    for section in page.get("sections", []): fields.extend([section.get("heading", ""), section.get("content", "")])
    for faq in page.get("faq", []): fields.extend([faq.get("question", ""), faq.get("answer", "")])
    return "\n".join(map(str, fields))


def main() -> None:
    pages = json.loads(PAGES_PATH.read_text(encoding="utf-8"))
    blogs = json.loads(BLOGS_PATH.read_text(encoding="utf-8"))
    routes = CORE_ROUTES | {p["url"] for p in pages} | {f"/blogs/{b['slug']}" for b in blogs}
    errors: list[str] = []
    warnings: list[str] = []
    inbound = Counter()

    # Preserve the approved baseline without treating future growth as an error.
    if len(pages) < 160: errors.append(f"Content fell below the 160-page baseline: {len(pages)}; consolidation requires review")
    if len(blogs) < 44: errors.append(f"Blog package fell below the 44-record baseline: {len(blogs)}")
    if sum(1 for b in blogs if b["status"] == "published") < 43: errors.append("Published package fell below the 43-blog baseline; unpublishing requires review")

    for field in ["url", "seoTitle", "seoDescription", "h1"]:
        counts = Counter(p[field] for p in pages)
        for value, count in counts.items():
            if count > 1: errors.append(f"Duplicate page {field}: {value}")

    for field in ["answer", "summary"]:
        counts = Counter(re.sub(r"\s+", " ", p[field]).strip().lower() for p in pages)
        for value, count in counts.items():
            if count > 1:
                errors.append(f"Duplicate page {field} used {count} times: {value[:100]}")

    for page in pages:
        text = all_text(page)
        if not 35 <= len(page["seoTitle"]) <= 68: warnings.append(f"{page['url']}: title length {len(page['seoTitle'])}")
        if not 130 <= len(page["seoDescription"]) <= 170: warnings.append(f"{page['url']}: description length {len(page['seoDescription'])}")
        if len(page.get("faq", [])) < 3: errors.append(f"{page['url']}: fewer than three FAQs")
        if len(page.get("sources", [])) < 2: errors.append(f"{page['url']}: fewer than two sources")
        if len(page.get("relatedGuides", [])) < 5: errors.append(f"{page['url']}: fewer than five internal links")
        if len(CHALLENGE_PATTERN.findall(text)) < 10: warnings.append(f"{page['url']}: review audience relevance; fewer than ten challenge references is not a publishing blocker")
        for label, pattern in BANNED:
            if re.search(pattern, text, flags=re.I): errors.append(f"{page['url']}: banned {label}")
        for pattern in UNSAFE:
            if re.search(pattern, text, flags=re.I): errors.append(f"{page['url']}: unsafe claim {pattern}")
        for link in page.get("relatedGuides", []):
            if link["href"] not in routes: errors.append(f"{page['url']}: broken internal link {link['href']}")
            inbound[link["href"]] += 1

    blog_slugs = Counter(b["slug"] for b in blogs)
    for slug, count in blog_slugs.items():
        if count > 1: errors.append(f"Duplicate blog slug: {slug}")
    blog_content = Counter(re.sub(r"\s+", " ", strip).strip().lower() for strip in [re.sub(r"<[^>]+>", " ", b["content"]) for b in blogs])
    for value, count in blog_content.items():
        if count > 1:
            errors.append(f"Duplicate full blog content used {count} times: {value[:100]}")
    for blog in blogs:
        path = f"/blogs/{blog['slug']}"
        text = re.sub(r"<[^>]+>", " ", blog["content"])
        if 'data-answer="true"' not in blog["content"]: errors.append(f"{path}: no answer-first marker")
        if blog["content"].count("<h3>") < 3: errors.append(f"{path}: fewer than three FAQ-style questions")
        if len(blog.get("sources", [])) < 3: errors.append(f"{path}: fewer than three sources")
        if len(blog.get("relatedLinks", [])) < 5: errors.append(f"{path}: fewer than five related links")
        if len(CHALLENGE_PATTERN.findall(text)) < 10: warnings.append(f"{path}: review audience relevance; fewer than ten challenge references is not a publishing blocker")
        for label, pattern in BANNED:
            if re.search(pattern, text, flags=re.I): errors.append(f"{path}: banned {label}")
        for pattern in UNSAFE:
            if re.search(pattern, text, flags=re.I): errors.append(f"{path}: unsafe claim {pattern}")
        for link in blog.get("relatedLinks", []):
            if link["href"] not in routes: errors.append(f"{path}: broken internal link {link['href']}")
            inbound[link["href"]] += 1
        inbound[path] += 1  # Blog listing links every published and draft-visible item after publication state filtering.

    for page in pages:
        if inbound[page["url"]] == 0: errors.append(f"Orphan content page: {page['url']}")

    remote_hits = []
    for root in [ROOT / "client/src", ROOT / "client/public"]:
        for file in root.rglob("*"):
            if file.is_file() and file.suffix.lower() in {".ts", ".tsx", ".html", ".css", ".txt", ".xml", ".json"}:
                value = file.read_text(encoding="utf-8", errors="replace")
                if "manuscdn.com" in value or "cloudfront.net" in value:
                    remote_hits.append(str(file.relative_to(ROOT)))
    if remote_hits: errors.append("Remote image hosts remain in: " + ", ".join(remote_hits))

    image_refs = set()
    for blog in blogs:
        for key in ["image", "authorImage", "ogImage"]:
            value = blog.get(key)
            if isinstance(value, str) and value.startswith("/images/"): image_refs.add(value)
    for file in (ROOT / "client/src").rglob("*"):
        if file.is_file() and file.suffix.lower() in {".ts", ".tsx", ".html", ".css", ".json"}:
            value = file.read_text(encoding="utf-8", errors="replace")
            image_refs.update(re.findall(r"/images/[A-Za-z0-9._/-]+", value))
    for ref in sorted(image_refs):
        asset = ROOT / "client/public" / ref.lstrip("/")
        if not asset.exists() or asset.stat().st_size == 0: errors.append(f"Missing local image asset: {ref}")

    status = "PASS" if not errors else "FAIL"
    lines = [
        "# StressGuru Content Quality Report", "", f"**Status:** {status}", "", "## Coverage", "",
        f"- Content pages: {len(pages)}", f"- Blog records prepared: {len(blogs)}",
        f"- Published blog records: {sum(1 for b in blogs if b['status'] == 'published')}",
        f"- Known internal routes: {len(routes)}", f"- Local image references checked: {len(image_refs)}", "",
        "## Errors", "",
    ]
    lines.extend([f"- {item}" for item in errors] or ["- None"])
    lines.extend(["", "## Warnings", ""])
    lines.extend([f"- {item}" for item in warnings] or ["- None"])
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{status}: {len(errors)} errors, {len(warnings)} warnings. Report: {REPORT_PATH}")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
