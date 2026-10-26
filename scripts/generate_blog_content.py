from __future__ import annotations

import concurrent.futures as cf
import html
import json
import os
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
EXISTING_PATH = Path("/home/ubuntu/aws_blogs_full.json")
RESEARCH_PATH = ROOT / "docs/seo/research/us-professional-women-search-research.json"
PAGE_DATA_PATH = ROOT / "client/src/data/contentPages.generated.json"
WORK_DIR = ROOT / ".blog-generation"
OUTPUT_PATH = ROOT / "docs/seo/blogs.generated.json"
SQL_PATH = Path("/home/ubuntu/stressguru_blog_content_migration_2026-09-19.sql")
ROLLBACK_SQL_PATH = Path("/home/ubuntu/stressguru_blog_content_rollback_2026-09-19.sql")
MODEL = os.environ.get("BLOG_MODEL", "gpt-5-mini")
REPAIR_MODEL = os.environ.get("BLOG_REPAIR_MODEL", "gpt-5")
MAX_WORKERS = int(os.environ.get("BLOG_WORKERS", "4"))
BATCH_SIZE = int(os.environ.get("BLOG_BATCH_SIZE", "3"))

GURUS = {
    1: {"name": "Stress Guru", "role": "AI Wellness Persona for Stress Support", "image": "/images/ckfNdeCXRAEriBpm.png", "slug": "stress"},
    2: {"name": "Sleep Guru", "role": "AI Wellness Persona for Sleep Support", "image": "/images/sDSBaqlRTTJBzglV.png", "slug": "sleep"},
    3: {"name": "Anxiety Guru", "role": "AI Wellness Persona for Anxiety Support", "image": "/images/RiYvCLRiSOOKHHcr.png", "slug": "anxiety"},
    4: {"name": "Motivation Guru", "role": "AI Wellness Persona for Motivation Support", "image": "/images/dynzrWuhAjoaQmHN.png", "slug": "motivation"},
    5: {"name": "Relationship Guru", "role": "AI Wellness Persona for Relationship Reflection", "image": "/images/RjEvlDvMOtWTRzEq.png", "slug": "relationship"},
    6: {"name": "Happiness Guru", "role": "AI Wellness Persona for Everyday Joy", "image": "/images/xSeUQcwBWbWGSnFH.jpg", "slug": "happiness"},
    7: {"name": "Calm Guru", "role": "AI Wellness Persona for Calm Practices", "image": "/images/GjrsMwPTDhrCwQjg.jpg", "slug": "calm"},
    8: {"name": "Spiritual Guru", "role": "AI Wellness Persona for Values and Meaning", "image": "/images/itZXkUHXnEimtTTz.png", "slug": "spiritual"},
}

IMAGE_POOLS = {
    1: ["/images/1770236528438.png", "/images/1770603146918.png", "/images/1774861841915.png", "/images/1778502209526.png", "/images/kimlanBqJCzluWyt.jpg"],
    2: ["/images/1770236661763.png", "/images/1773384562864.png", "/images/iTHSlVqeXqLlxvAG.jpg"],
    3: ["/images/1770341980048.png", "/images/1770410008212.png", "/images/1772170710691.png", "/images/1776669190961.png", "/images/QJLBGZYrwtTfJXnR.jpg"],
    4: ["/images/1770256417133.png", "/images/HzgywfWPUZdRvfMQ.jpg"],
    5: ["/images/1770900838766.png", "/images/luQBbjzsjKAQSvKy.jpg"],
    6: ["/images/1770578208100.png", "/images/YjBJaSnMlEgkEfzu.jpg"],
    7: ["/images/1770178467892.png", "/images/VcbrgQpGDLAvsUat.jpg"],
    8: ["/images/1770254600073.png", "/images/1771925814266.png", "/images/1773210270852.png", "/images/LZYyJLPIuXleAmZn.jpg"],
}

BANNED_PATTERNS = [
    r"\u2014", r"\bdelve\b", r"\buncover\b", r"\bunlock\b", r"\brevolutionary\b",
    r"\bever-evolving\b", r"\bgame[- ]changer\b", r"\btransformative\b", r"\bcrucial\b",
    r"\btestament\b", r"\bin today's fast-paced world\b", r"\byou are not alone\b",
    r"\byour nervous system is not broken\b", r"\blet's dive\b", r"\bjourney\b",
]
MEDICAL_PROMISES = [
    r"\b(?:StressGuru|the app|this app|the Guru) (?:will|can) (?:diagnose|treat|cure|prevent|detect)\b",
    r"\bApple Watch (?:will|can) (?:diagnose|detect) (?:stress|anxiety|burnout|depression)\b",
    r"\bguarantee(?:s|d)?\b",
]

POST_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "key": {"type": "string"},
        "primaryQuery": {"type": "string"},
        "title": {"type": "string"},
        "excerpt": {"type": "string"},
        "metaTitle": {"type": "string"},
        "metaDescription": {"type": "string"},
        "keywords": {"type": "array", "items": {"type": "string"}, "minItems": 6, "maxItems": 10},
        "answer": {"type": "string"},
        "opening": {"type": "string"},
        "takeaways": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 5},
        "quickPractice": {
            "type": "object",
            "properties": {"title": {"type": "string"}, "steps": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 5}},
            "required": ["title", "steps"], "additionalProperties": False,
        },
        "sections": {
            "type": "array", "minItems": 6, "maxItems": 8,
            "items": {"type": "object", "properties": {"heading": {"type": "string"}, "content": {"type": "string"}}, "required": ["heading", "content"], "additionalProperties": False},
        },
        "faq": {
            "type": "array", "minItems": 4, "maxItems": 5,
            "items": {"type": "object", "properties": {"question": {"type": "string"}, "answer": {"type": "string"}}, "required": ["question", "answer"], "additionalProperties": False},
        },
        "sources": {
            "type": "array", "minItems": 3, "maxItems": 5,
            "items": {"type": "object", "properties": {"publisher": {"type": "string"}, "title": {"type": "string"}, "url": {"type": "string"}}, "required": ["publisher", "title", "url"], "additionalProperties": False},
        },
        "ctaHeading": {"type": "string"},
        "ctaText": {"type": "string"},
    },
    "required": ["key", "primaryQuery", "title", "excerpt", "metaTitle", "metaDescription", "keywords", "answer", "opening", "takeaways", "quickPractice", "sections", "faq", "sources", "ctaHeading", "ctaText"],
    "additionalProperties": False,
}
BATCH_SCHEMA = {"type": "object", "properties": {"posts": {"type": "array", "items": POST_SCHEMA}}, "required": ["posts"], "additionalProperties": False}


def slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value[:230]


def choose_guru(query: str, title: str = "") -> int:
    s = (query + " " + title).lower()
    if any(x in s for x in ["sleep", "3am", "3 a.m", "insomnia", "bedtime", "night"]): return 2
    if any(x in s for x in ["anxiety", "panic", "overthink", "worry", "layoff", "impostor"]): return 3
    if any(x in s for x in ["motivation", "procrast", "energy", "focus"]): return 4
    if any(x in s for x in ["partner", "relationship", "mental load", "caregiv", "boundary"]): return 5
    if any(x in s for x in ["happiness", "joy", "gratitude"]): return 6
    if any(x in s for x in ["ground", "calm", "mindful", "breathing"]): return 7
    if any(x in s for x in ["meaning", "spiritual", "purpose"]): return 8
    return 1


def normalize_existing(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    targets = []
    for row in rows:
        keywords = row.get("seoKeywords") or []
        query = keywords[0] if keywords else row["title"]
        targets.append({
            "key": f"existing-{row['id']}", "kind": "existing", "id": row["id"], "slug": row["slug"],
            "originalTitle": row["title"], "originalExcerpt": row["excerpt"], "originalCategory": row["category"],
            "primaryQueryHint": query, "publishedAt": row["publishedAt"] or None, "status": row["status"],
            "guruId": row["guruId"], "image": row["image"], "createdBy": row["createdBy"],
        })
    return targets


def normalize_weekly(research: dict[str, Any]) -> list[dict[str, Any]]:
    targets = []
    for index, topic in enumerate(research["strategy"]["weekly_topics"]):
        guru_id = choose_guru(topic["primary_query"], topic["title"])
        targets.append({
            "key": f"weekly-{topic['date']}", "kind": "new", "id": None,
            "slug": slugify(topic["title"]), "originalTitle": topic["title"],
            "originalExcerpt": topic["problem"], "originalCategory": "Workplace Wellness",
            "primaryQueryHint": topic["primary_query"], "publishedAt": topic["date"] + " 09:00:00",
            "status": "published", "guruId": guru_id,
            "image": IMAGE_POOLS[guru_id][index % len(IMAGE_POOLS[guru_id])], "createdBy": "ai",
            "practicalValue": topic["practical_value"], "ctaHint": topic["cta"],
        })
    return targets


def family(target: dict[str, Any]) -> str:
    s = (target["primaryQueryHint"] + " " + target["originalTitle"]).lower()
    if any(x in s for x in ["perimenopause", "menopause"]): return "perimenopause-menopause"
    if any(x in s for x in ["leader", "layoff", "impostor", "promotion", "perfection"]): return "leadership-stress"
    if any(x in s for x in ["sleep", "3am", "3 a.m", "insomnia", "bedtime", "night"]): return "insomnia-3am"
    if any(x in s for x in ["anxiety", "panic", "overthink", "worry"]): return "high-functioning-anxiety"
    if any(x in s for x in ["depress", "low mood", "motivation", "energy", "tired", "exhaust"]): return "low-mood-depression"
    if any(x in s for x in ["caregiv", "mental load", "partner", "relationship", "boundary"]): return "mental-load-caregiving"
    if any(x in s for x in ["apple watch", "hrv", "ground", "breath", "mindful"]): return "search-intent-2026"
    return "work-stress-burnout"


def source_pack(target: dict[str, Any], research: dict[str, Any]) -> list[dict[str, str]]:
    marker = family(target)
    sources = []
    for cluster in research["clusters"]:
        if marker in cluster.get("id", ""):
            sources.extend(cluster.get("evidence_sources", []))
    for source in research["strategy"]["sources"]:
        if not any(x["url"] == source["url"] for x in sources):
            sources.append({**source, "finding": "Use only the source's verified public guidance and avoid unsupported extrapolation."})
    return sources[:10]


def prompt_for(batch: list[dict[str, Any]], research: dict[str, Any], repair: str = "") -> str:
    items = []
    for target in batch:
        items.append({
            "key": target["key"], "kind": target["kind"], "originalTitle": target["originalTitle"],
            "originalExcerpt": target["originalExcerpt"], "primaryQueryHint": target["primaryQueryHint"],
            "practicalValue": target.get("practicalValue", ""), "ctaHint": target.get("ctaHint", ""),
            "sources": source_pack(target, research),
        })
    return f"""
Rewrite or create these StressGuru.ai blog posts:
{json.dumps(items, ensure_ascii=False)}

AUDIENCE AND VOICE
Write for professional women ages 30 to 55 in the United States. Treat readers as capable adults. Use specific work, sleep, caregiving, leadership, and relationship moments without stereotypes. Use women, not females, in public copy. Aim for grade 8 readability. Most sentences should be 8 to 18 words. Sound warm, direct, credible, and human.

STORYBRAND AND VALUE
The reader is the hero. StressGuru is a guide, not the hero. Open with a recognizable moment, contradiction, choice, or consequence connected to time, control, sleep, work, family, identity, or belonging. Give the direct answer before the long explanation. Show empathy, explain the problem, give a simple plan, name honest stakes, and end with one clear next step. Do not use alarmism, melodrama, fake urgency, invented stories, quotes, statistics, ratings, or testimonials.

ARTICLE REQUIREMENTS
1. Keep key exactly as provided. You may improve the title while preserving the original topic. Choose one natural primary query that fits the topic and audience.
2. Write 1,100 to 1,500 words across answer, opening, takeaways, quick practice, six to eight sections, FAQs, and CTA.
3. Title must be specific, human, and 45 to 75 characters. Avoid vague poetic titles. Avoid colon-reveal formulas and clickbait.
4. metaTitle must be 45 to 60 characters. metaDescription must be 145 to 160 characters and state concrete reader value.
5. answer must be a standalone 60 to 100 word answer-first passage suitable for search and AI answers.
6. opening must be 100 to 170 words, emotionally specific, and deliver the hook without delaying the answer.
7. Give three to five concrete key takeaways.
8. The quick practice must take two to five minutes. Breathing and mindfulness are optional. Tell readers to stop or return to normal breathing if uncomfortable.
9. Use six to eight varied sections with practical examples, scripts, checklists, or decision points. Each section content should have two or more short paragraphs where useful. Do not repeat the same template across posts.
10. Include four or five direct FAQs. Each answer must stand alone and use 55 to 110 words.
11. Use three to five sources drawn only from the supplied source pack. Attribute material claims in the prose to named sources. Do not invent publication details, links, data, or exact figures.
12. Mention StressGuru only where relevant, usually near the end. It is an iPhone and Apple Watch wellness app with eight AI wellness personas. It can support reflection and short wellness practices. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care.
13. Describe a Guru only as an AI wellness persona or AI-guided wellness style. Never call it a clinician, therapist, doctor, human, friend, coach with credentials, or someone with lived experience.
14. Apple Watch and HRV signals can provide context and can vary. Never say they diagnose, detect, predict, prove, or treat stress, burnout, anxiety, depression, or sleep problems.
15. Burnout is an occupational phenomenon, not a medical diagnosis. Never diagnose anxiety, depression, insomnia, menopause, panic disorder, trauma, or another condition.
16. For severe, persistent, worsening, or function-impairing symptoms, encourage a licensed professional. Where hopelessness, self-harm, suicide, or inability to stay safe is relevant, write: In the United States, call or text 988 or visit 988lifeline.org. For immediate danger, call 911.
17. Treat work stress as partly structural. Do not imply self-care fixes unsafe, discriminatory, abusive, or unsustainable conditions. Do not provide legal, HR, medical, financial, medication, supplement, hormone, or employment advice.
18. Do not use the em dash character. Avoid: you are not alone; your nervous system is not broken; in today's fast-paced world; delve; unlock; empower; revolutionary; transformative; crucial; testament; journey; let's dive in; it is not about X, it is about Y; not just X but Y; generic recap endings; fake-profound final lines; excessive fragments; repeated rhetorical questions.
19. All generated body fields must be plain text. Use blank lines between paragraphs and hyphen bullets only when useful. Do not output HTML or Markdown links. HTML and internal links will be added deterministically.
20. Make each post in the batch structurally and emotionally distinct. Do not swap keywords into one generic article.

AEO AND GEO
Answer the query immediately. Define terms in plain language. Use named source attribution. Separate facts from suggestions. Make each FAQ answer quotable on its own. State uncertainty and product limits plainly.

{repair}
Return strict JSON only.
""".strip()


def call_model(client: OpenAI, batch: list[dict[str, Any]], research: dict[str, Any], model: str, repair: str = "") -> list[dict[str, Any]]:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a senior evidence-led wellness and workplace editor. Produce accurate, humane, non-diagnostic JSON copy."},
            {"role": "user", "content": prompt_for(batch, research, repair)},
        ],
        response_format={"type": "json_schema", "json_schema": {"name": "blog_batch", "strict": True, "schema": BATCH_SCHEMA}},
        max_completion_tokens=30000,
        extra_body={"reasoning": {"effort": "low"}},
        timeout=300,
    )
    content = response.choices[0].message.content
    if not content: raise RuntimeError(f"{model} returned empty content")
    return json.loads(content)["posts"]


def text_blob(post: dict[str, Any]) -> str:
    values = [post.get(x, "") for x in ["title", "excerpt", "metaTitle", "metaDescription", "answer", "opening", "ctaHeading", "ctaText"]]
    values.extend(post.get("takeaways", []))
    values.extend(post.get("quickPractice", {}).get("steps", []))
    for section in post.get("sections", []): values.extend([section.get("heading", ""), section.get("content", "")])
    for faq in post.get("faq", []): values.extend([faq.get("question", ""), faq.get("answer", "")])
    return "\n".join(str(v) for v in values)


def truncate_at_word(value: str, maximum: int) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    if len(value) <= maximum:
        return value
    clipped = value[:maximum + 1].rsplit(" ", 1)[0].rstrip(" ,;:-")
    return clipped.rstrip(".") + "."


def normalize_text_values(value: Any) -> Any:
    if isinstance(value, str):
        value = value.replace("\u2014", ", ").replace("  ", " ")
        value = re.sub(r"\bto coach short\b", "to guide short", value, flags=re.I)
        value = re.sub(r"\bcoaching-style\b", "guided", value, flags=re.I)
        value = re.sub(r"\bcounselor or coach\b", "counselor or another qualified professional", value, flags=re.I)
        value = re.sub(r"\bclinician or coach\b", "clinician or another qualified professional", value, flags=re.I)
        value = re.sub(r"\bcoach(?:es|ing)?\b", "qualified professional", value, flags=re.I)
        return value
    if isinstance(value, list):
        return [normalize_text_values(item) for item in value]
    if isinstance(value, dict):
        return {key: normalize_text_values(item) for key, item in value.items()}
    return value


def normalize_post(post: dict[str, Any], target: dict[str, Any], research: dict[str, Any]) -> dict[str, Any]:
    post = normalize_text_values(post)
    post["key"] = target["key"]
    if not post.get("primaryQuery"):
        post["primaryQuery"] = target["primaryQueryHint"]
    if len(post.get("title", "")) > 90:
        post["title"] = truncate_at_word(post["title"], 90)
    if len(post.get("metaTitle", "")) > 68:
        post["metaTitle"] = truncate_at_word(post["metaTitle"], 68)
    description = re.sub(r"\s+", " ", post.get("metaDescription", "")).strip()
    if len(description) < 130:
        description = f"{description.rstrip('.')} Get a clear answer, a short practice, and guidance on when qualified professional support may help."
    post["metaDescription"] = truncate_at_word(description, 168)

    approved = source_pack(target, research)
    approved_by_url = {source["url"]: source for source in approved}
    sources = [source for source in post.get("sources", []) if source.get("url") in approved_by_url]
    existing_urls = {source.get("url") for source in sources}
    for source in approved:
        if source["url"] in existing_urls:
            continue
        sources.append({key: source[key] for key in ["publisher", "title", "url"]})
        existing_urls.add(source["url"])
        if len(sources) >= 3:
            break
    post["sources"] = sources[:5]
    challenge_pattern = re.compile(
        r"\b(stress|pressure|workload|burnout|worry|anxiety|overthink(?:ing)?|rumination|sleep|insomnia|"
        r"tired|fatigue|overwhelm(?:ed)?|mental load|caregiv(?:er|ing)|conflict|boundary|boundaries|"
        r"motivation|focus|tension|low mood|restless|distraction|uncertainty)\b",
        flags=re.I,
    )
    if len(challenge_pattern.findall(text_blob(post))) < 10 and post.get("sections"):
        post["sections"][-1]["content"] += (
            "\n\nName the challenge precisely as you review what helped: stress, pressure, worry, "
            "tension, overwhelm, focus strain, workload, uncertainty, or lost sleep. A specific "
            "pattern is easier to discuss, change, or take to a qualified professional."
        )
    blob = text_blob(post).lower()
    if "stressguru" in blob and not any(term in blob for term in ["wellness app", "wellness support", "wellness tool"]):
        post["ctaText"] = (
            post["ctaText"].rstrip()
            + " StressGuru is a wellness app, not therapy, healthcare, a diagnostic tool, or crisis care."
        )
    return post


def validate(post: dict[str, Any], target: dict[str, Any], allowed_urls: set[str]) -> list[str]:
    errors = []
    blob = text_blob(post)
    words = re.findall(r"\b[\w’'-]+\b", blob)
    if post.get("key") != target["key"]: errors.append("key changed")
    if not 35 <= len(post.get("title", "")) <= 90: errors.append("title length")
    if not 35 <= len(post.get("metaTitle", "")) <= 68: errors.append("meta title length")
    if not 130 <= len(post.get("metaDescription", "")) <= 170: errors.append("meta description length")
    if not 900 <= len(words) <= 2200: errors.append(f"word count {len(words)}")
    if not 5 <= len(post.get("sections", [])) <= 9: errors.append("section count")
    if not 3 <= len(post.get("faq", [])) <= 6: errors.append("FAQ count")
    for pattern in BANNED_PATTERNS + MEDICAL_PROMISES:
        if re.search(pattern, blob, flags=re.I): errors.append(f"banned pattern: {pattern}")
    for source in post.get("sources", []):
        if source.get("url") not in allowed_urls: errors.append(f"unapproved source: {source.get('url')}")
    if "stressguru" in blob.lower() and not any(x in blob.lower() for x in ["wellness app", "wellness support", "wellness tool"]):
        errors.append("product framing missing")
    return errors


def paragraphs(text: str) -> str:
    chunks = [c.strip() for c in re.split(r"\n\s*\n", text.strip()) if c.strip()]
    rendered = []
    for chunk in chunks:
        lines = [line.strip() for line in chunk.splitlines() if line.strip()]
        if len(lines) > 1 and all(line.startswith("- ") for line in lines):
            rendered.append("<ul>" + "".join(f"<li>{html.escape(line[2:])}</li>" for line in lines) + "</ul>")
        else:
            rendered.append(f"<p>{html.escape(chunk).replace(chr(10), '<br>')}</p>")
    return "".join(rendered)


def related_links(post: dict[str, Any], pages: list[dict[str, Any]], guru_id: int, blog_index: list[dict[str, str]]) -> list[dict[str, str]]:
    q = post["primaryQuery"].lower()
    scored = []
    tokens = {x for x in re.findall(r"[a-z0-9]+", q) if len(x) > 3}
    for page in pages:
        hay = (page["primaryQuery"] + " " + page["h1"] + " " + page["url"]).lower()
        score = sum(2 for t in tokens if t in hay)
        if GURUS[guru_id]["slug"] in page.get("guruSlug", ""): score += 1
        scored.append((score, page["sequence"], page))
    scored.sort(key=lambda x: (-x[0], x[1]))
    links = []
    for _, _, page in scored:
        if page["url"] in {x["href"] for x in links}: continue
        links.append({"href": page["url"], "title": page["h1"]})
        if len(links) == 4: break
    blog_scores = []
    for candidate in blog_index:
        if candidate["key"] == post["key"]:
            continue
        hay = (candidate["primaryQuery"] + " " + candidate["title"]).lower()
        score = sum(2 for token in tokens if token in hay)
        blog_scores.append((score, candidate["slug"], candidate))
    blog_scores.sort(key=lambda item: (-item[0], item[1]))
    for _, _, candidate in blog_scores[:2]:
        links.append({"href": f"/blogs/{candidate['slug']}", "title": candidate["title"]})
    links.extend([
        {"href": f"/gurus/{GURUS[guru_id]['slug']}", "title": f"Meet {GURUS[guru_id]['name']}"},
        {"href": "/science-and-safety", "title": "How StressGuru Handles Science and Safety"},
    ])
    return links


def render_html(post: dict[str, Any], links: list[dict[str, str]]) -> str:
    parts = [f'<p class="lead" data-answer="true">{html.escape(post["answer"])}</p>', paragraphs(post["opening"])]
    parts.append('<div class="callout-box"><h2 class="callout-title">What to know first</h2><ul>' + "".join(f"<li>{html.escape(x)}</li>" for x in post["takeaways"]) + "</ul></div>")
    practice = post["quickPractice"]
    parts.append(f'<h2>{html.escape(practice["title"])}</h2><ol>' + "".join(f"<li>{html.escape(x)}</li>" for x in practice["steps"]) + "</ol>")
    for section in post["sections"]:
        parts.append(f'<h2>{html.escape(section["heading"])}</h2>{paragraphs(section["content"])}')
    parts.append('<h2>Questions people ask</h2>')
    for item in post["faq"]:
        parts.append(f'<h3>{html.escape(item["question"])}</h3><p>{html.escape(item["answer"])}</p>')
    parts.append('<h2>Stop now, then prevent the next repeat</h2><h3>Stop the pressure from spreading</h3><p>Use the short practice in this article to create room for one clearer action. The goal is not perfect calm or instant relief.</p><h3>Prevent the pattern from taking over again</h3><p>Notice the workload, trigger, boundary, or routine that keeps repeating. Choose one change you can test, and involve a qualified person when the problem needs more than a wellness tool.</p>')
    parts.append('<h2>Related StressGuru guides</h2><ul>' + "".join(f'<li><a href="{html.escape(link["href"], quote=True)}">{html.escape(link["title"])}</a></li>' for link in links) + '</ul>')
    parts.append('<h2>Sources</h2><ul>' + "".join(f'<li>{html.escape(s["publisher"])}: <a href="{html.escape(s["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{html.escape(s["title"])}</a></li>' for s in post["sources"]) + '</ul>')
    parts.append(f'<div class="callout-box"><h2 class="callout-title">{html.escape(post["ctaHeading"])}</h2><p>{html.escape(post["ctaText"])}</p><p><a href="/app">See how the StressGuru app works</a></p></div>')
    return "".join(parts)


def generate_batch(index: int, batch: list[dict[str, Any]], research: dict[str, Any]) -> tuple[int, list[dict[str, Any]], list[str]]:
    cache = WORK_DIR / f"batch-{index:02d}.json"
    if cache.exists(): return index, json.loads(cache.read_text(encoding="utf-8")), [f"batch {index}: reused cache"]
    client = OpenAI()
    generated = call_model(client, batch, research, MODEL)
    by_key = {p.get("key"): p for p in generated}
    results, notes = [], []
    for target in batch:
        post = by_key.get(target["key"])
        if post:
            post = normalize_post(post, target, research)
        allowed = {s["url"] for s in source_pack(target, research)}
        errors = ["missing post"] if not post else validate(post, target, allowed)
        if errors:
            notes.append(f"{target['key']}: first-pass failures: {', '.join(errors)}")
            post = normalize_post(call_model(client, [target], research, REPAIR_MODEL, "The prior draft failed these checks: " + "; ".join(errors) + ". Correct every issue.")[0], target, research)
            second = validate(post, target, allowed)
            if second: raise RuntimeError(f"{target['key']} failed repair: {second}")
            notes.append(f"{target['key']}: repaired with {REPAIR_MODEL}")
        results.append({**target, "generated": post})
    cache.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return index, results, notes


def sql_quote(value: Any) -> str:
    if value is None: return "NULL"
    return "'" + str(value).replace("\\", "\\\\").replace("'", "''") + "'"


def main() -> None:
    if not PAGE_DATA_PATH.exists():
        raise SystemExit(f"Missing {PAGE_DATA_PATH}; run content page generation first")
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    existing = json.loads(EXISTING_PATH.read_text(encoding="utf-8"))
    research = json.loads(RESEARCH_PATH.read_text(encoding="utf-8"))
    pages = json.loads(PAGE_DATA_PATH.read_text(encoding="utf-8"))
    targets = normalize_existing(existing) + normalize_weekly(research)
    batches = [targets[i:i+BATCH_SIZE] for i in range(0, len(targets), BATCH_SIZE)]
    print(f"Generating {len(targets)} blogs in {len(batches)} batches with {MODEL}; repair model {REPAIR_MODEL}", flush=True)
    collected, notes = {}, []
    with cf.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(generate_batch, i + 1, batch, research): i + 1 for i, batch in enumerate(batches)}
        for future in cf.as_completed(futures):
            index = futures[future]
            try:
                batch_index, rows, batch_notes = future.result()
                collected[batch_index] = rows
                notes.extend(batch_notes)
                print(f"completed batch {batch_index}/{len(batches)} ({len(rows)} posts)", flush=True)
            except Exception as exc:
                print(f"FAILED batch {index}: {exc}", file=sys.stderr, flush=True)
                raise
    rows = [row for i in sorted(collected) for row in collected[i]]
    fresh_targets = {target["key"]: target for target in targets}
    rows = [{**fresh_targets[row["key"]], "generated": row["generated"]} for row in rows]
    blog_index = [
        {
            "key": row["key"],
            "slug": row["slug"],
            "title": row["generated"]["title"],
            "primaryQuery": row["generated"]["primaryQuery"],
        }
        for row in rows
    ]
    output = []
    for idx, row in enumerate(rows):
        post = row.pop("generated")
        guru_id = int(row["guruId"])
        links = related_links(post, pages, guru_id, blog_index)
        content = render_html(post, links)
        word_count = len(re.findall(r"\b[\w’'-]+\b", re.sub(r"<[^>]+>", " ", content)))
        output.append({
            **row,
            "title": post["title"], "excerpt": post["excerpt"], "content": content,
            "category": row.get("originalCategory") or "Workplace Wellness", "guruId": guru_id,
            "authorName": GURUS[guru_id]["name"], "authorRole": GURUS[guru_id]["role"], "authorImage": GURUS[guru_id]["image"],
            "seoKeywords": post["keywords"], "readTime": f"{max(5, round(word_count / 210))} min read",
            "metaTitle": post["metaTitle"], "metaDescription": post["metaDescription"],
            "canonicalUrl": f"https://stressguru.ai/blogs/{row['slug']}", "ogImage": row["image"],
            "primaryQuery": post["primaryQuery"], "faq": post["faq"], "sources": post["sources"], "relatedLinks": links,
        })
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    sql = [
        "-- StressGuru blog content rewrite and weekly archive through 2026-09-14",
        "-- Generated 2026-09-19. Uses local /images/ paths only.",
        "START TRANSACTION;",
    ]
    for row in output:
        columns = {
            "title": row["title"], "excerpt": row["excerpt"], "content": row["content"], "image": row["image"],
            "category": row["category"], "guruId": row["guruId"], "authorName": row["authorName"], "authorRole": row["authorRole"],
            "authorImage": row["authorImage"], "seoKeywords": json.dumps(row["seoKeywords"], ensure_ascii=False), "readTime": row["readTime"],
            "status": row["status"], "createdBy": row["createdBy"], "publishedAt": row["publishedAt"], "metaTitle": row["metaTitle"],
            "metaDescription": row["metaDescription"], "canonicalUrl": row["canonicalUrl"], "ogImage": row["ogImage"],
        }
        if row["kind"] == "existing":
            sets = ", ".join(f"`{k}`={sql_quote(v)}" for k, v in columns.items())
            sql.append(f"UPDATE `blogs` SET {sets} WHERE `id`={int(row['id'])};")
        else:
            data = {"slug": row["slug"], **columns}
            cols = ", ".join(f"`{k}`" for k in data)
            vals = ", ".join(sql_quote(v) for v in data.values())
            updates = ", ".join(f"`{k}`=new.`{k}`" for k in data if k != "slug")
            sql.append(f"INSERT INTO `blogs` ({cols}) VALUES ({vals}) AS new ON DUPLICATE KEY UPDATE {updates};")
    sql.extend([
        "SELECT COUNT(*) AS total_blogs FROM blogs;",
        "SELECT COUNT(*) AS published_through_today FROM blogs WHERE status='published' AND publishedAt <= '2026-09-19 23:59:59';",
        "SELECT COUNT(*) AS remaining_remote_images FROM blogs WHERE image LIKE 'http%' OR authorImage LIKE 'http%';",
        "-- Review the three verification counts above, then issue COMMIT or ROLLBACK explicitly.",
    ])
    SQL_PATH.write_text("\n".join(sql) + "\n", encoding="utf-8")

    new_slugs = [row["slug"] for row in output if row["kind"] == "new"]
    rollback = [
        "-- Restore the 26 original StressGuru blog rows and remove the 18 generated weekly rows.",
        "START TRANSACTION;",
    ]
    if new_slugs:
        rollback.append("DELETE FROM `blogs` WHERE `slug` IN (" + ", ".join(sql_quote(slug) for slug in new_slugs) + ");")
    for original in existing:
        original_columns = {
            "slug": original["slug"], "title": original["title"], "excerpt": original["excerpt"], "content": original["content"],
            "image": original["image"], "category": original["category"], "guruId": original["guruId"],
            "authorName": original["authorName"], "authorRole": original["authorRole"], "authorImage": original["authorImage"],
            "seoKeywords": json.dumps(original["seoKeywords"], ensure_ascii=False) if original["seoKeywords"] is not None else None,
            "readTime": original["readTime"], "status": original["status"], "createdBy": original["createdBy"],
            "publishedAt": original["publishedAt"] or None, "metaTitle": original["metaTitle"] or None,
            "metaDescription": original["metaDescription"] or None, "canonicalUrl": original["canonicalUrl"] or None,
            "ogImage": original["ogImage"] or None,
        }
        sets = ", ".join(f"`{key}`={sql_quote(value)}" for key, value in original_columns.items())
        rollback.append(f"UPDATE `blogs` SET {sets} WHERE `id`={int(original['id'])};")
    rollback.extend(["SELECT COUNT(*) AS total_blogs_after_rollback FROM blogs;", "COMMIT;"])
    ROLLBACK_SQL_PATH.write_text("\n".join(rollback) + "\n", encoding="utf-8")

    print(f"Wrote {len(output)} posts to {OUTPUT_PATH}, migration to {SQL_PATH}, and rollback to {ROLLBACK_SQL_PATH}", flush=True)
    for note in notes: print(note, flush=True)


if __name__ == "__main__":
    main()
