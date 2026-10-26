import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { safeWriteJson } from "./guardrails.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pages = JSON.parse(fs.readFileSync(path.join(root, "client/src/data/contentPages.generated.json"), "utf8"));
const candidateQueries = [
  "best stress relief app", "stress management app for women", "AI mental wellness app", "AI stress relief app", "app for work burnout support",
  "anxiety support app", "mental wellness app for working mothers", "stress management app for nurses", "app for overthinking", "AI emotional support app",
  "alternatives to Calm", "alternatives to Headspace", "AI wellness app with Apple Watch", "iPhone stress support app", "work stress support app",
  "app for bedtime racing thoughts", "conversational wellness app", "stress relief app pricing", "stress app for busy professionals", "AI Guru wellness app",
  "app for after-work stress", "caregiver stress support app", "stress and sleep wellness app", "relationship reflection app", "grounding app for everyday worry",
  "mental load support app", "stress support app for executives", "private AI wellness app", "StressGuru plans", "StressGuru AI Gurus"
];
const officialProductEvidence = ["https://stressguru.ai/app", "https://stressguru.ai/plans", "https://apps.apple.com/us/app/stressguru-ai/id6748682052"];
const commercial = candidateQueries.map((query, index) => ({
  id: `commercial-${String(index + 1).padStart(2, "0")}`, query, intent: "commercial-comparison", country: "US",
  status: "candidate, not demand-validated", evidenceType: "confirmed product/category fit; wording is a research hypothesis",
  sources: /Calm|Headspace/.test(query) ? ["https://www.calm.com/", "https://www.headspace.com/", ...officialProductEvidence] : officialProductEvidence,
  usMonthlySearchVolume: null, keywordDifficulty: null, measuredDemand: false, verifiedAt: "2026-10-24",
  priorityStatus: "needs GSC or keyword-tool evidence before new-page approval"
}));
const seen = new Set();
const problems = [];
for (const page of pages) {
  for (const item of page.faq ?? []) {
    const question = item.question?.trim();
    const key = question?.toLowerCase().replace(/\s+/g, " ");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    problems.push({ id: `problem-${String(problems.length + 1).padStart(3, "0")}`, question,
      intent: /professional|doctor|clinician|medical|therapy|therapist/i.test(question) ? "professional-help-or-care-boundaries" : /watch|wearable|HRV|heart rate/i.test(question) ? "wearable-education" : /app|Guru|plan|cost|free/i.test(question) ? "support-options" : page.intent === "act-now" ? "immediate-self-help" : "understand-the-problem",
      existingRoute: page.url, primaryTopic: page.primaryQuery, evidenceType: "existing source-cited editorial question; verify claim-to-source fit before rewriting",
      sources: (page.sources ?? []).map(s => ({ url: s.url, title: s.title, publisher: s.publisher })),
      status: "source-grounded candidate; exact-query demand unmeasured", usMonthlySearchVolume: null, keywordDifficulty: null, measuredDemand: false,
      provenance: "repository content inventory, not a fresh user-search observation", verifiedAt: "2026-10-24"
    });
  }
}
const output = { version: 1, seededAt: "2026-10-24", commercial, problems,
  interpretation: "Evidence supports the topic or existing editorial answer, not popularity of every exact phrase. Re-check source meaning and current public coverage. All search volume and difficulty values are unavailable until measured.",
  toolingStatus: { gsc: "not connected", keywordTool: "not connected", aiPromptDemand: "not directly exposed by engines" } };
safeWriteJson(path.join(root, "docs/growth/keyword-universe.json"), output);
console.log(`Seeded ${commercial.length} commercial candidates and ${problems.length} unique source-linked problem questions. Demand remains unmeasured.`);
