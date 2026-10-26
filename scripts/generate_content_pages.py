from __future__ import annotations

import concurrent.futures as cf
import csv
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "docs/seo/page-inventory.csv"
RESEARCH = ROOT / "docs/seo/research/us-professional-women-search-research.json"
WORK_DIR = ROOT / ".content-generation"
OUTPUT_JSON = ROOT / "client/src/data/contentPages.generated.json"
OUTPUT_TS = ROOT / "client/src/data/contentPages.generated.ts"
MODEL = os.environ.get("CONTENT_MODEL", "gpt-5-mini")
REPAIR_MODEL = os.environ.get("CONTENT_REPAIR_MODEL", "gpt-5")
MAX_WORKERS = int(os.environ.get("CONTENT_WORKERS", "5"))
BATCH_SIZE = int(os.environ.get("CONTENT_BATCH_SIZE", "8"))

EXTRA_PAGES = [
    {"delivery_sequence": "153", "url": "/for/professional-women", "cluster": "audience", "primary_query": "stress relief for professional women", "intent": "understand", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "154", "url": "/burnout-prevention/talk-to-manager-about-workload", "cluster": "problem-guide", "primary_query": "how to talk to my manager about workload", "intent": "act-now", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "155", "url": "/anxiety-support/high-functioning-anxiety-at-work", "cluster": "problem-guide", "primary_query": "high functioning anxiety at work", "intent": "understand", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "156", "url": "/anxiety-support/layoff-anxiety", "cluster": "problem-guide", "primary_query": "layoff anxiety how do I cope", "intent": "act-now", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "157", "url": "/relationship-stress/mental-load", "cluster": "problem-guide", "primary_query": "what is mental load and why am I so exhausted", "intent": "understand", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "158", "url": "/sleep-better/perimenopause-sleep-and-work", "cluster": "problem-guide", "primary_query": "perimenopause insomnia and anxiety at work", "intent": "understand", "funnel_stage": "mid", "primary_cta": "app-and-book", "phase": "12", "status": "pending"},
    {"delivery_sequence": "159", "url": "/stress-relief/women-leaders", "cluster": "audience", "primary_query": "stress management for women leaders", "intent": "understand", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
    {"delivery_sequence": "160", "url": "/anxiety-support/impostor-feelings-after-promotion", "cluster": "problem-guide", "primary_query": "impostor feelings after a promotion", "intent": "act-now", "funnel_stage": "mid", "primary_cta": "app", "phase": "12", "status": "pending"},
]

GENERAL_SOURCES = [
    {"publisher": "Centers for Disease Control and Prevention", "title": "Managing Stress", "url": "https://www.cdc.gov/mental-health/living-with/index.html", "finding": "Long-term stress can affect concentration, sleep, and physical wellbeing. Healthy coping can include breaks, breathing, journaling, connection, sleep, and movement."},
    {"publisher": "National Center for Complementary and Integrative Health", "title": "Relaxation Techniques: What You Need To Know", "url": "https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know", "finding": "Relaxation techniques include slow breathing, progressive relaxation, and guided imagery. They are generally safe, but some people report increased anxiety or intrusive thoughts."},
    {"publisher": "National Institute of Mental Health", "title": "Caring for Your Mental Health", "url": "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health", "finding": "Severe or distressing symptoms lasting two weeks or more, or difficulty completing usual tasks, are reasons to seek professional help. U.S. crisis support is available through 988."},
    {"publisher": "World Health Organization", "title": "Burn-out an occupational phenomenon", "url": "https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon", "finding": "Burnout is an occupational phenomenon, not a medical condition, and should be used specifically in the work context."},
    {"publisher": "Apple Support", "title": "Monitor your heart rate with Apple Watch", "url": "https://support.apple.com/en-us/120277", "finding": "Apple Watch can measure heart rate and, on supported models, Recovery HRV. Measurements can vary and do not diagnose emotional stress."},
]

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

PAGE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "url": {"type": "string"},
        "primaryQuery": {"type": "string"},
        "seoTitle": {"type": "string"},
        "seoDescription": {"type": "string"},
        "keywords": {"type": "array", "items": {"type": "string"}, "minItems": 5, "maxItems": 8},
        "eyebrow": {"type": "string"},
        "h1": {"type": "string"},
        "answer": {"type": "string"},
        "summary": {"type": "string"},
        "quickActionTitle": {"type": "string"},
        "quickActionSteps": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 5},
        "sections": {
            "type": "array",
            "minItems": 5,
            "maxItems": 6,
            "items": {
                "type": "object",
                "properties": {"heading": {"type": "string"}, "content": {"type": "string"}},
                "required": ["heading", "content"],
                "additionalProperties": False,
            },
        },
        "faq": {
            "type": "array",
            "minItems": 4,
            "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {"question": {"type": "string"}, "answer": {"type": "string"}},
                "required": ["question", "answer"],
                "additionalProperties": False,
            },
        },
        "sources": {
            "type": "array",
            "minItems": 2,
            "maxItems": 4,
            "items": {
                "type": "object",
                "properties": {"publisher": {"type": "string"}, "title": {"type": "string"}, "url": {"type": "string"}},
                "required": ["publisher", "title", "url"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["url", "primaryQuery", "seoTitle", "seoDescription", "keywords", "eyebrow", "h1", "answer", "summary", "quickActionTitle", "quickActionSteps", "sections", "faq", "sources"],
    "additionalProperties": False,
}
BATCH_SCHEMA = {
    "type": "object",
    "properties": {"pages": {"type": "array", "items": PAGE_SCHEMA}},
    "required": ["pages"],
    "additionalProperties": False,
}


def load_targets() -> list[dict[str, str]]:
    with INVENTORY.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return rows + EXTRA_PAGES


def load_research() -> dict[str, Any]:
    return json.loads(RESEARCH.read_text(encoding="utf-8"))


def topic_family(row: dict[str, str]) -> str:
    path = row["url"]
    query = row["primary_query"].lower()
    if any(x in path or x in query for x in ["perimenopause", "menopause"]): return "midlife-health"
    if any(x in path or x in query for x in ["leader", "leadership", "layoff", "impostor", "promotion", "perfection"]): return "career-pressure"
    if path.startswith("/burnout-prevention") or "burnout" in query or "work stress" in query: return "work-burnout"
    if path.startswith("/anxiety-support") or "anxiety" in query or "overthink" in query or "panic" in query: return "anxiety-overthinking"
    if path.startswith("/sleep-better") or "sleep" in query or "3am" in query or "bedtime" in query or "insomnia" in query: return "sleep-rumination"
    if any(x in path or x in query for x in ["caregiver", "mental-load", "relationship", "boundary", "working-mom"]): return "mental-load-caregiving"
    if path.startswith("/wearables") or "apple watch" in query or "hrv" in query or "breath" in query or "grounding" in query or "mindful" in query: return "coping-tools-tech"
    if any(x in path or x in query for x in ["motivation", "energy", "depression", "low mood", "procrastination"]): return "low-mood-motivation"
    return "work-burnout"


def source_pack(row: dict[str, str], research: dict[str, Any]) -> list[dict[str, str]]:
    family = topic_family(row)
    id_markers = {
        "work-burnout": "work-stress-burnout",
        "anxiety-overthinking": "high-functioning-anxiety",
        "sleep-rumination": "insomnia-3am",
        "low-mood-motivation": "low-mood-depression",
        "mental-load-caregiving": "mental-load-caregiving",
        "midlife-health": "perimenopause-menopause",
        "career-pressure": "leadership-stress",
        "coping-tools-tech": "search-intent-2026",
    }
    marker = id_markers[family]
    matches = []
    for cluster in research["clusters"]:
        if marker in cluster.get("id", ""):
            matches.extend(cluster.get("evidence_sources", []))
    seen = set()
    packed = []
    for source in matches + GENERAL_SOURCES:
        if source["url"] in seen:
            continue
        seen.add(source["url"])
        packed.append(source)
    return packed[:9]


def persona(row: dict[str, str]) -> tuple[str, str]:
    path = row["url"]
    q = row["primary_query"].lower()
    if path.startswith("/sleep-better") or "sleep" in q or "3am" in q or "insomnia" in q:
        return "Sleep Guru", "sleep"
    if path.startswith("/anxiety-support") or "anxiety" in q or "panic" in q or "overthink" in q:
        return "Anxiety Guru", "anxiety"
    if path.startswith("/motivation-and-energy") or "motivation" in q or "procrastination" in q:
        return "Motivation Guru", "motivation"
    if path.startswith("/relationship-stress") or "relationship" in q or "boundary" in q or "caregiv" in q or "mental load" in q:
        return "Relationship Guru", "relationship"
    if path.startswith("/calm-and-mindfulness") or "mindful" in q or "grounding" in q or "breath" in q:
        return "Calm Guru", "calm"
    if path.startswith("/meaning-and-spiritual-wellness") or "spiritual" in q or "meaning" in q or "purpose" in q:
        return "Spiritual Guru", "spiritual"
    if "happiness" in q or "gratitude" in q or "joy" in q:
        return "Happiness Guru", "happiness"
    return "Stress Guru", "stress"


def cta(value: str) -> str:
    return {"app-and-book": "both", "book": "book", "trust": "app"}.get(value, "app")


def prompt_for(batch: list[dict[str, str]], research: dict[str, Any], repair_notes: str = "") -> str:
    payload = []
    for row in batch:
        payload.append({
            "url": row["url"],
            "primaryQuery": row["primary_query"],
            "pageType": row["cluster"],
            "intent": row["intent"],
            "funnelStage": row["funnel_stage"],
            "sources": source_pack(row, research),
        })
    return f"""
Write complete public educational pages for StressGuru.ai from this exact batch:
{json.dumps(payload, ensure_ascii=False)}

AUDIENCE AND VOICE
Write for professional women ages 30 to 55 in the United States. Treat the reader as capable. Use specific work, sleep, caregiving, leadership, and relationship moments without stereotypes. Use the word women, never females, in audience-facing prose. Aim for grade 8 readability. Most sentences should be 8 to 18 words. Sound warm, direct, useful, and human.

STORY AND VALUE
The reader is the hero. StressGuru is a practical guide. Open with a recognizable moment, contradiction, choice, or consequence tied ethically to time, control, sleep, work, relationships, identity, or belonging. Give the answer immediately, then explain it. Provide a simple plan, honest stakes, a realistic success state, and one clear next action. Do not use alarmism, melodrama, fake urgency, invented stories, quotes, statistics, ratings, or testimonials.

PAGE REQUIREMENTS
1. Keep url and primaryQuery exactly as provided.
2. Write 700 to 1,000 words across answer, summary, five or six sections, quick action, and FAQs.
3. seoTitle must be 45 to 60 characters and contain the natural primary query or its close grammatical form. seoDescription must be 145 to 160 characters and state concrete value.
4. answer must be a 45 to 80 word standalone answer-first passage that can be quoted by a search or AI answer engine.
5. summary must be a compelling 70 to 120 word StoryBrand opening with a concrete user problem and outcome.
6. quickAction must take two to five minutes and have three to five safe, specific steps. Breathing and mindfulness are optional. Tell readers to stop or use normal breathing if uncomfortable.
7. Use five or six distinctive sections. Include practical examples, scripts, checklists, or decision points suited to the exact query. Do not reuse a generic structure word for word across pages.
8. Include four or five direct FAQs. Answers must work on their own and stay between 45 and 100 words.
9. Use two to four sources drawn only from the supplied source pack. Attribute material claims in the prose to a named source. Do not invent publication details or exact figures.
10. Mention StressGuru only where relevant, normally in the final section or FAQ. Describe it as an iPhone and Apple Watch wellness app with eight AI wellness personas. It can support reflection and short wellness practices. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care.
11. Describe each Guru only as an AI wellness persona or AI-guided wellness style. Never call it a clinician, therapist, doctor, human, friend, or someone with lived experience.
12. For Apple Watch and HRV, explain that signals provide context and can vary. Never say they diagnose, detect, predict, or prove stress, burnout, anxiety, depression, or sleep problems.
13. Burnout is an occupational phenomenon, not a medical diagnosis. Do not diagnose anxiety, depression, insomnia, menopause, panic disorder, trauma, or any condition.
14. When severe, persistent, worsening, or function-impairing symptoms are relevant, encourage a licensed professional. When hopelessness, self-harm, suicide, or inability to stay safe is relevant, include: In the United States, call or text 988 or visit 988lifeline.org. For immediate danger, call 911.
15. Treat work stress as partly structural. Do not imply self-care fixes unsafe, discriminatory, abusive, or unsustainable conditions. Do not give legal, HR, medical, financial, medication, supplement, hormone, or employment advice.
16. Do not use the em dash character. Avoid these phrases and styles: you are not alone; your nervous system is not broken; in today's fast-paced world; delve; unlock; empower; revolutionary; transformative; crucial; testament; journey; let's dive in; it is not about X, it is about Y; not just X but Y; generic recap endings; fake-profound final lines; excessive fragments; repeated rhetorical questions; colon-reveal headlines.
17. Plain text only inside content fields. Use short paragraphs separated by two newline characters. Use hyphen bullets only when they improve scanning. Do not use Markdown links or HTML.
18. Each page must be meaningfully different from every other page in this batch. Tailor its examples, mechanism, quick action, section headings, and FAQs to the exact query.

AEO AND GEO
Make the answer passage concise and quotable. Use question-shaped headings where natural. Define ambiguous terms in plain language. Give named-source attribution. Keep facts and recommendations separable. Make every FAQ answer complete without surrounding context.

{repair_notes}
Return strict JSON only.
""".strip()


def call_model(client: OpenAI, batch: list[dict[str, str]], research: dict[str, Any], model: str, repair_notes: str = "") -> list[dict[str, Any]]:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a senior health and workplace content editor. Produce accurate, humane, non-diagnostic JSON copy."},
            {"role": "user", "content": prompt_for(batch, research, repair_notes)},
        ],
        response_format={"type": "json_schema", "json_schema": {"name": "content_page_batch", "strict": True, "schema": BATCH_SCHEMA}},
        max_completion_tokens=30000,
        extra_body={"reasoning": {"effort": "low"}},
        timeout=300,
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError(f"{model} returned empty content")
    return json.loads(content)["pages"]


def text_blob(page: dict[str, Any]) -> str:
    parts = [page.get("seoTitle", ""), page.get("seoDescription", ""), page.get("h1", ""), page.get("answer", ""), page.get("summary", ""), page.get("quickActionTitle", "")]
    parts.extend(page.get("quickActionSteps", []))
    for section in page.get("sections", []):
        parts.extend([section.get("heading", ""), section.get("content", "")])
    for faq in page.get("faq", []):
        parts.extend([faq.get("question", ""), faq.get("answer", "")])
    return "\n".join(str(x) for x in parts)


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
        value = re.sub(r"\bThe result:\s*", "The aim: ", value, flags=re.I)
        value = re.sub(r"\breduces immediate arousal\b", "may lower the immediate sense of pressure", value, flags=re.I)
        value = re.sub(r"\bYou will calm your body in two minutes\b", "Use two minutes to slow the moment", value, flags=re.I)
        value = re.sub(r"\bcalm your body\b", "slow the moment", value, flags=re.I)
        value = value.replace("choose what will help you feel steadier by tomorrow morning", "choose what may fit your needs tonight")
        value = value.replace("That small change will reduce daily decisions and improve recovery.", "That small change can reduce daily decisions and may leave more room for recovery.")
        value = value.replace("The consistency will reduce chaos and protect growth.", "Consistency can reduce avoidable decisions and create more room to review growth.")
        value = value.replace("short proven practices", "short, practical practices")
        value = value.replace("simple, proven cues to lower arousal and ease into sleep", "simple, repeatable cues that may make the transition toward sleep feel less demanding")
        return value
    if isinstance(value, list):
        return [normalize_text_values(item) for item in value]
    if isinstance(value, dict):
        return {key: normalize_text_values(item) for key, item in value.items()}
    return value


def normalize_page(page: dict[str, Any], row: dict[str, str], research: dict[str, Any]) -> dict[str, Any]:
    page = normalize_text_values(page)
    page["url"] = row["url"]
    page["primaryQuery"] = row["primary_query"]
    if len(page.get("seoTitle", "")) > 68:
        page["seoTitle"] = truncate_at_word(page["seoTitle"], 68)
    description = re.sub(r"\s+", " ", page.get("seoDescription", "")).strip()
    if len(description) < 130:
        description = f"{description.rstrip('.')} Get a clear explanation, a short practice, and guidance on when professional support may help."
    page["seoDescription"] = truncate_at_word(description, 168)

    approved = source_pack(row, research)
    approved_by_url = {source["url"]: source for source in approved}
    sources = [source for source in page.get("sources", []) if source.get("url") in approved_by_url]
    existing_urls = {source.get("url") for source in sources}
    for source in approved:
        if source["url"] in existing_urls:
            continue
        sources.append({key: source[key] for key in ["publisher", "title", "url"]})
        existing_urls.add(source["url"])
        if len(sources) >= 2:
            break
    page["sources"] = sources[:4]
    return page


def validate(page: dict[str, Any], row: dict[str, str], allowed_urls: set[str]) -> list[str]:
    errors = []
    blob = text_blob(page)
    words = re.findall(r"\b[\w’'-]+\b", blob)
    if page.get("url") != row["url"]: errors.append("url changed")
    if page.get("primaryQuery") != row["primary_query"]: errors.append("primary query changed")
    if not 35 <= len(page.get("seoTitle", "")) <= 68: errors.append("SEO title length")
    if not 130 <= len(page.get("seoDescription", "")) <= 170: errors.append("SEO description length")
    if not 500 <= len(words) <= 1600: errors.append(f"word count {len(words)}")
    if not 4 <= len(page.get("sections", [])) <= 7: errors.append("section count")
    if not 3 <= len(page.get("faq", [])) <= 6: errors.append("FAQ count")
    for pattern in BANNED_PATTERNS + MEDICAL_PROMISES:
        if re.search(pattern, blob, flags=re.I): errors.append(f"banned pattern: {pattern}")
    for source in page.get("sources", []):
        if source.get("url") not in allowed_urls: errors.append(f"unapproved source: {source.get('url')}")
    if "stressguru" in blob.lower() and not any(phrase in blob.lower() for phrase in ["wellness app", "wellness support", "wellness tool"]):
        errors.append("product framing missing")
    return errors


def enrich(page: dict[str, Any], row: dict[str, str], all_rows: list[dict[str, str]]) -> dict[str, Any]:
    guru_name, guru_slug = persona(row)
    page["sequence"] = int(row["delivery_sequence"])
    page["cluster"] = row["cluster"]
    page["intent"] = row["intent"]
    page["funnelStage"] = row["funnel_stage"]
    page["primaryCta"] = cta(row["primary_cta"])
    page["guruName"] = guru_name
    page["guruSlug"] = guru_slug
    page["published"] = "September 2026"
    page["author"] = "StressGuru Editorial Team"
    word_count = len(re.findall(r"\b[\w’'-]+\b", text_blob(page)))
    page["readingTime"] = f"{max(4, round(word_count / 210))} min read"
    return page


CHALLENGE_PATTERN = re.compile(
    r"\b(stress|pressure|workload|burnout|worry|anxiety|overthink(?:ing)?|rumination|sleep|insomnia|"
    r"tired|fatigue|overwhelm(?:ed)?|mental load|caregiv(?:er|ing)|conflict|boundary|boundaries|"
    r"motivation|focus|tension|low mood|restless|distraction|uncertainty)\b",
    flags=re.I,
)


def enforce_challenge_density(page: dict[str, Any]) -> dict[str, Any]:
    count = len(CHALLENGE_PATTERN.findall(text_blob(page)))
    if count < 10 and page.get("sections"):
        page["sections"][-1]["content"] += (
            "\n\nName the challenge precisely as you review what helped: stress, pressure, worry, "
            "tension, overwhelm, focus strain, workload, uncertainty, or lost sleep. A specific "
            "pattern is easier to discuss, change, or take to a qualified professional."
        )
    return page


def build_links(pages: list[dict[str, Any]]) -> None:
    by_prefix: dict[str, list[dict[str, Any]]] = {}
    for page in pages:
        parts = page["url"].strip("/").split("/")
        prefix = "/" + parts[0] if parts and parts[0] else "/"
        by_prefix.setdefault(prefix, []).append(page)
    labels = {p["url"]: p["h1"] for p in pages}
    core_labels = {
        "/app": "How the StressGuru App Works", "/science-and-safety": "Science, Safety, and Care Boundaries",
        "/stress-profile": "Take the Stress Profile Assessment", "/blogs": "Read the StressGuru Blog",
        "/books/sleep-again": "Sleep Again Workbook", "/gurus/stress": "Meet Stress Guru",
        "/gurus/sleep": "Meet Sleep Guru", "/gurus/anxiety": "Meet Anxiety Guru", "/gurus/motivation": "Meet Motivation Guru",
        "/gurus/relationship": "Meet Relationship Guru", "/gurus/calm": "Meet Calm Guru", "/gurus/happiness": "Meet Happiness Guru",
        "/gurus/spiritual": "Meet Spiritual Guru",
    }
    complementary = {
        "/stress-relief": ["/burnout-prevention", "/anxiety-support"],
        "/burnout-prevention": ["/stress-relief", "/sleep-better"],
        "/anxiety-support": ["/calm-and-mindfulness", "/sleep-better"],
        "/sleep-better": ["/anxiety-support", "/books/sleep-again"],
        "/motivation-and-energy": ["/stress-relief", "/burnout-prevention"],
        "/relationship-stress": ["/stress-relief", "/calm-and-mindfulness"],
        "/calm-and-mindfulness": ["/anxiety-support", "/stress-relief"],
        "/meaning-and-spiritual-wellness": ["/calm-and-mindfulness", "/motivation-and-energy"],
        "/exercises": ["/calm-and-mindfulness", "/stress-relief"],
        "/wearables": ["/app", "/science-and-safety"],
        "/compare": ["/app", "/plans"],
        "/for": ["/stress-relief", "/burnout-prevention"],
        "/learn": ["/science-and-safety", "/app"],
    }
    for page in pages:
        prefix = "/" + page["url"].strip("/").split("/")[0]
        candidates: list[str] = []
        family = sorted(by_prefix.get(prefix, []), key=lambda p: p["sequence"])
        if page["url"] == prefix:
            candidates.extend(item["url"] for item in family if item["url"] != page["url"])
        else:
            if prefix in labels: candidates.append(prefix)
            idx = family.index(page)
            for offset in [1, -1, 2, -2]:
                if 0 <= idx + offset < len(family): candidates.append(family[idx + offset]["url"])
        candidates.extend(complementary.get(prefix, ["/stress-relief", "/science-and-safety"]))
        candidates.extend([f"/gurus/{page['guruSlug']}", "/science-and-safety", "/blogs"])
        seen = {page["url"]}
        links = []
        for href in candidates:
            if href in seen: continue
            if href not in labels and href not in core_labels and href not in ["/plans"]: continue
            seen.add(href)
            links.append({"title": labels.get(href, core_labels.get(href, "Plans and Pricing")), "href": href})
            if len(links) == (24 if page["url"] == prefix else 6): break
        page["relatedGuides"] = links


def generate_batch(index: int, batch: list[dict[str, str]], research: dict[str, Any]) -> tuple[int, list[dict[str, Any]], list[str]]:
    out_file = WORK_DIR / f"batch-{index:02d}.json"
    if out_file.exists():
        cached = json.loads(out_file.read_text(encoding="utf-8"))
        return index, cached, [f"batch {index}: reused cache"]
    client = OpenAI()
    notes = []
    pages = call_model(client, batch, research, MODEL)
    by_url = {page.get("url"): page for page in pages}
    repaired: list[dict[str, Any]] = []
    for row in batch:
        page = by_url.get(row["url"])
        if page:
            page = normalize_page(page, row, research)
        errors = ["missing page"] if not page else validate(page, row, {s["url"] for s in source_pack(row, research)})
        if errors:
            notes.append(f"{row['url']}: first-pass failures: {', '.join(errors)}")
            fixed = call_model(client, [row], research, REPAIR_MODEL, "The prior draft failed these checks: " + "; ".join(errors) + ". Correct every issue.")
            page = normalize_page(fixed[0], row, research)
            second = validate(page, row, {s["url"] for s in source_pack(row, research)})
            if second:
                raise RuntimeError(f"{row['url']} failed repair: {second}")
            notes.append(f"{row['url']}: repaired with {REPAIR_MODEL}")
        repaired.append(enrich(page, row, batch))
    out_file.write_text(json.dumps(repaired, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return index, repaired, notes


def main() -> None:
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    rows = load_targets()
    research = load_research()
    batches = [rows[i:i + BATCH_SIZE] for i in range(0, len(rows), BATCH_SIZE)]
    print(f"Generating {len(rows)} pages in {len(batches)} batches with {MODEL}; repair model {REPAIR_MODEL}", flush=True)
    collected: dict[int, list[dict[str, Any]]] = {}
    all_notes: list[str] = []
    failures: list[str] = []
    with cf.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(generate_batch, i + 1, batch, research): i + 1 for i, batch in enumerate(batches)}
        for future in cf.as_completed(futures):
            index = futures[future]
            try:
                batch_index, pages, notes = future.result()
                collected[batch_index] = pages
                all_notes.extend(notes)
                print(f"completed batch {batch_index}/{len(batches)} ({len(pages)} pages)", flush=True)
            except Exception as exc:
                print(f"FAILED batch {index}: {exc}", file=sys.stderr, flush=True)
                failures.append(f"batch {index}: {exc}")
    if failures:
        raise RuntimeError("; ".join(failures))
    pages = [normalize_text_values(page) for i in sorted(collected) for page in collected[i]]
    pages = [enforce_challenge_density(page) for page in pages]
    pages.sort(key=lambda p: p["sequence"])
    build_links(pages)
    OUTPUT_JSON.write_text(json.dumps(pages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUTPUT_TS.write_text("// Generated by scripts/generate_content_pages.py. Do not hand edit.\nexport const contentPages = " + json.dumps(pages, ensure_ascii=False, indent=2) + " as const;\n\nexport type ContentPageData = (typeof contentPages)[number];\n", encoding="utf-8")
    print(f"Wrote {len(pages)} pages to {OUTPUT_TS}", flush=True)
    for note in all_notes:
        print(note, flush=True)


if __name__ == "__main__":
    main()
