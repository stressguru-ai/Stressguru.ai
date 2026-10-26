# StressGuru Browser QA

**Date:** September 19, 2026  
**Preview:** Production build served locally on port 4173

## Homepage

- Rendered successfully with the title **Stop Stress Today. Prevent the Same Pattern Tomorrow | StressGuru**.
- The hero shows the self-hosted local background image, readable overlay, updated Stop Now, Prevent Next promise, primary iOS CTA, and How It Works CTA.
- Navigation, Guru selector, plans, books, explore menu, use-case cards, source links, internal topic links, book strip, Promise section, and footer links were present in the rendered accessibility tree.
- All homepage images observed by the browser used `/images/` paths.
- Browser console: no output and no runtime errors.

## Generated Guide

The route `/anxiety-support/sunday-scaries` rendered as a full guide rather than a 404. Its Anxiety Guru hero image loaded from `/images/`, the H1 and direct-answer card were readable, the quick practice appeared immediately below the hero, and the page exposed named sources and internal links. A visual review identified one sentence with overly certain outcome language; the generator was corrected, all 160 pages were regenerated, the production bundle was rebuilt, and the browser then showed the qualified wording: “may lower the immediate sense of pressure.”

## Plans

The `/plans` route rendered all four tiers in one comparison: Relief free, Reset with two sessions per month at $19.99 monthly, Balance with five sessions per month at $49.99 monthly and the Most Popular label, and Thrive with 20 sessions per month at $199.99 monthly. The yearly toggle displayed Two Months Free, extra sessions displayed $12.99, and the page used Guru terminology throughout. The self-hosted hero and logo images loaded correctly.

