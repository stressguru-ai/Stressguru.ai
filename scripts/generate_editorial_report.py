from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/seo/research/us-professional-women-search-research.json"
OUTPUT = ROOT / "docs/seo/editorial-strategy-2026-09.md"


def safe(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\n", " ").replace("—", "-")


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    strategy = data["strategy"]
    lines = [
        "# StressGuru U.S. Editorial Strategy",
        "",
        "**Research date:** September 19, 2026",
        "",
        "This strategy centers professional women ages 30 to 55 in the United States. It uses current audience language, workplace evidence, public health guidance, and search-result phrasing. The priority order is qualitative because no authenticated keyword-volume provider was available. It does not claim exact monthly search volume.",
        "",
        "## Editorial Position",
        "",
        "The reader is the hero. StressGuru serves as a practical wellness guide for moments when work pressure, sleep disruption, anxiety, low mood, caregiving, or relationship strain begin to take over the day. Each page gives a direct answer, a small next step, honest product limits, named sources, and a clear route to professional or crisis support when appropriate.",
        "",
        "StressGuru is an iPhone and Apple Watch wellness app with eight AI wellness personas. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care. Apple Watch and HRV observations provide context and do not diagnose a condition or determine a person's emotional state.",
        "",
        "## Priority Keyword Map",
        "",
        "| Rank | Query | Cluster | Intent | Why it matters |",
        "|---:|---|---|---|---|",
    ]
    for item in strategy["top_keywords"]:
        lines.append(f"| {item['rank']} | {safe(item['query'])} | {safe(item['cluster'])} | {safe(item['intent'])} | {safe(item['priority_reason'])} |")
    lines.extend(["", "## Cluster Architecture", "", "| Cluster | Pillar query | Supporting queries | Cannibalization rule |", "|---|---|---|---|"])
    for item in strategy["cluster_strategy"]:
        supporting = "; ".join(item["supporting_queries"])
        lines.append(f"| {safe(item['cluster'])} | {safe(item['pillar_query'])} | {safe(supporting)} | {safe(item['cannibalization_note'])} |")
    lines.extend(["", "## Weekly Blog Archive Through September 2026", "", "| Date | Primary query | Article | Reader value | AI wellness persona | Primary call to action |", "|---|---|---|---|---|---|"])
    for item in strategy["weekly_topics"]:
        lines.append(f"| {item['date']} | {safe(item['primary_query'])} | {safe(item['title'])} | {safe(item['practical_value'])} | {safe(item['guru'])} | {safe(item['cta'])} |")
    lines.extend(["", "## Evidence Base", ""])
    for index, source in enumerate(strategy["sources"], 1):
        lines.append(f"{index}. [{safe(source['title'])}]({source['url']}), {safe(source['publisher'])}.")
    lines.extend(["", "## Claims and Safety Guardrails", ""])
    for guardrail in strategy["guardrails"]:
        lines.append(f"- {safe(guardrail)}")
    lines.extend(["", "## Internal-Linking Standard", "", "Each pillar links to its complete child cluster. Every supporting guide links back to its pillar, to nearby intent-matched guides, to the relevant Guru page, to Science and Safety, and to the blog index. Every blog links to four intent-matched guides, its relevant Guru page, and Science and Safety. The sitemap and `llms-full.txt` resource map list every canonical URL.", ""])
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
