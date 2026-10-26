# StressGuru Daily Content Batch Playbook

## Context

This task is part of the StressGuru SEO/GEO/AEO overhaul. The initial 20 content pages have been built. This scheduled task creates 12 new content pages per day from the remaining 132-page backlog (delivery_sequence 21-152 in docs/seo/page-inventory.csv).

## Daily Execution Steps

1. Determine today's batch: Calculate which 12 pages to build based on the run number.
   - Run 1: pages 21-32
   - Run 2: pages 33-44
   - Run 3: pages 45-56
   - Run 4: pages 57-68
   - Run 5: pages 69-80
   - Run 6: pages 81-92
   - Run 7: pages 93-104
   - Run 8: pages 105-116
   - Run 9: pages 117-128
   - Run 10: pages 129-140
   - Run 11: pages 141-152

2. For each page in today's batch:
   - Read the row from docs/seo/page-inventory.csv to get: url, cluster, primary_query, intent, funnel_stage, primary_cta
   - Create a new .tsx file in client/src/pages/content/ using the ContentPageTemplate component
   - Follow the same pattern as the existing 20 content pages
   - Each page MUST include: SEO metadata with canonicalUrl, breadcrumbs, keywords, a quick action exercise, 5 content sections, FAQ, related guides, and appropriate CTA
   - Content MUST follow Donald Miller's StoryBrand framework
   - Mention the user's challenge at least 10 times per page
   - Do NOT make unverified health claims or fabricate testimonials
   - Include crisis resources (988 Lifeline) in the When to Seek Professional Help section

3. Add routes to App.tsx for all 12 new pages.

4. Run TypeScript check: npx tsc --noEmit must pass with zero errors.

5. Run build: pnpm build must succeed.

6. Run tests: pnpm test must pass.

7. Update the sitemap (client/public/sitemap.xml) to include the new URLs.

8. Update page-inventory.csv: Mark today's batch as status=complete.

9. Save a Manus checkpoint with a descriptive message including the date and page count.

10. Commit and push to GitHub on the seo-geo-aeo-overhaul branch.

11. Write a daily log to docs/seo/daily/YYYY-MM-DD.md.

## Quality Rules

- No em dashes in content
- No fabricated testimonials or reviews
- No unverified health claims
- Crisis signposting in every page that discusses mental health
- AI Gurus are described as AI wellness personas not as real people
- Pricing: Reset $19.99/mo ($199.99/yr), Balance $49.99/mo ($499.99/yr), Thrive $199.99/mo ($1,999.99/yr), additional sessions $12.99
- Annual billing provides two months free

## Project Location

- Project path: /home/ubuntu/drnur_website
- Content pages: client/src/pages/content/
- Template: client/src/pages/content/ContentPageTemplate.tsx
- Inventory: docs/seo/page-inventory.csv
- Branch: seo-geo-aeo-overhaul
- GitHub: zigroninc/StressGuru.ai
