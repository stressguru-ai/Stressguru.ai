# StressGuru.ai Baseline SEO Audit

**Date:** August 6, 2026  
**Auditor:** Manus AI  
**Starting commit:** 5df4de56 (main)  
**Branch:** seo-geo-aeo-overhaul

---

## Executive Summary

The StressGuru.ai website is a React SPA (Vite + tRPC + Tailwind CSS) deployed on AWS. All metadata is injected client-side via `react-helmet-async`, meaning crawlers that do not execute JavaScript receive a near-empty `<head>` with only the homepage title and description from `client/index.html`. The sitemap uses the wrong domain (`drnur.ai`), pricing is stale ($24.99/Prevention plan), several health claims are unverified, and AI Guru personas are presented with lived-experience language that violates the brand's own Terms of Service.

---

## Current Route Inventory

| Route | Title (from SEO component) | Canonical | Schema Types | Issues |
|-------|---------------------------|-----------|--------------|--------|
| `/` | StressGuru AI: Stress Relief & Burnout Prevention App... | window.location.href | Organization, SoftwareApp | Unverified claims in schema; stale pricing |
| `/how-it-works` | How StressGuru Works: AI Stress Detection... | window.location.href | HowTo | Unverified biometric claims |
| `/plans` | StressGuru Pricing: Free Anxiety Support & Premium... | window.location.href | SoftwareApp, FAQ | Stale $24.99 pricing |
| `/about` | About StressGuru AI: The Science Behind... | window.location.href | BreadcrumbList | Unverified biometric claims |
| `/contact` | Contact StressGuru Support | window.location.href | BreadcrumbList | Minimal |
| `/blogs` | StressGuru Blog | window.location.href | None | Generic title |
| `/blogs/:slug` | (dynamic) | window.location.href | BlogPosting | mainEntityOfPage incorrect |
| `/privacy-policy` | Privacy Policy | window.location.href | None | Minimal |
| `/terms-and-conditions` | Terms and Conditions | window.location.href | None | Minimal |
| `/books` | Books by StressGuru Experts | window.location.href | Book | Misleading AI author framing |
| `/quiz` | Find Your Guru Quiz | window.location.href | BreadcrumbList | Minimal |
| `/stress-profile` | Free Stress Assessment | window.location.href | BreadcrumbList | Diagnostic-adjacent language |
| `/gurus` | 8 AI Wellness Coaches | window.location.href | BreadcrumbList | Acceptable |
| `/gurus/*` (x8) | [Guru Name] | window.location.href | BreadcrumbList | "I Have Been There" AI persona issue |

---

## Critical Issues

### 1. Sitemap uses wrong domain

Every `<loc>` in `client/public/sitemap.xml` points to `https://www.drnur.ai/` instead of `https://stressguru.ai/`. Missing routes: `/blogs`, `/books`, `/quiz`, `/stress-profile`, all blog detail pages.

### 2. Client-side metadata only

The `client/index.html` shell has a single hardcoded homepage title. All route-specific metadata is injected by `react-helmet-async` after JS execution. Crawlers that do not render JS see only homepage metadata on every route.

### 3. Canonical URL uses window.location.href

`SEO.tsx` line 200 falls back to `window.location.href` which is unreliable for crawlers and may include query parameters or fragments.

### 4. Stale pricing throughout

Old "Prevention" plan at $24.99/month and $4.99 additional sessions appears in: `Plans.tsx`, `SEO.tsx`, `FAQSection.tsx`, `CostCalculator.tsx`, `PlanWizard.tsx`, `llms.txt`.

### 5. AI persona claims of lived experience

`GuruPage.tsx` line 173: "I Have Been There" heading with empathyStatement implying AI has personal memories.

### 6. Unverified health and product claims

"Real-time stress detection via Apple Watch", "Heart rate variability monitoring", "Proactive stress alerts", "detects stress through Apple Watch biometrics", "Stops panic attacks in seconds", "protect your long-term health", unsourced statistics (71%, 1 in 3, 60%).

### 7. Organization schema references nonexistent logo

`SEO.tsx` line 55: `/images/logo.png` does not exist. Actual logo is at `/favicon.png`.

### 8. Unverified testimonials

`StoriesCarousel` renders testimonial content without documented identity, consent, or typicality disclosures.

---

## Missing Routes (Required)

`/app`, `/books/sleep-again`, `/science-and-safety`, `/editorial-policy`, `/responsible-ai`, `/responsible-ai/limitations`, `/privacy/data-explained`, `/accessibility`, 8 pillar hubs, 152 content pages.

---

## robots.txt Assessment

Functional but needs: `Disallow: /account/`, `Disallow: /preview/`, explicit `OAI-SearchBot`, `Claude-SearchBot`, `Claude-User` entries.

---

## Limitations

Cannot verify server-side HTTP status codes from SPA. Cannot access Search Console, Bing Webmaster Tools, or GA4. Cannot confirm legal entity name without owner input.
