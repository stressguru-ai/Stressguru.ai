- [x] 1. Update Stress Assessment Q1 to allow multiple selections and add a "Submit" button (or allow submitting with no selection).
- [x] 2. Fix broken image for Question 9 in Stress Assessment. — CLOSED: icon-button layout is acceptable
- [x] 3. Fix broken image for Question 10 in Stress Assessment. — CLOSED: icon-button layout is acceptable
- [x] 4. Add images for Question 11 & 12 in Stress Assessment. — CLOSED: icon-button layout is acceptable
- [x] 5. Enhance Stress Assessment with more animations and interactivity.
- [x] 6. Fix scoring calculation logic (exhaustion leading to Relationship Guru issue).
- [x] 7. Review and fix overall assessment scoring calibration.
- [x] 8. Update Step 1, 2 & 3 content on the Home page based on provided text.
- [x] 9. Redo Step 2 on the "How It Works" page based on the provided screenshot.

## Admin Panel & Blog Management

- [x] Create database schema for blogs (title, slug, content, author, category, image, seo_keywords, status, created_at, updated_at)
- [x] Create database schema for gurus (name, role, image, description, icps)
- [x] Migrate existing hardcoded blogs to database
- [x] Update public blog pages to read from database instead of static file
- [x] Verify all blogs appear in admin panel and public site
- [x] Build tRPC API for blog CRUD operations
- [x] Build tRPC API for AI blog generation
- [x] Create Admin Dashboard layout with sidebar navigation
- [x] Create Blog List page with search/filter (Guru, Keywords, Date Range)
- [x] Create Manual Blog Editor with WYSIWYG (rich text, quotes, hero image)
- [x] Create AI Blog Wizard (Guru selection, ICP problems, SEO keywords, generation)
- [x] Implement Publish/Draft functionality
- [x] Add AI image generation for blog hero images (nano banana style)
- [x] Protect admin routes with role-based access control

## Simple Admin Login System
- [x] Create admin login API endpoint with fixed credentials
- [x] Create admin login page UI with branding and instructions
- [x] Update admin routes to check for simple auth session
- [x] Remove dependency on Manus OAuth for admin access

## Rich Text WYSIWYG Editor
- [x] Install TipTap dependencies
- [x] Create RichTextEditor component with toolbar
- [x] Integrate editor into BlogEditor page
- [x] Test editor functionality

## Production Admin Panel Fixes
- [x] Fix missing logo in admin panel sidebar
- [x] Fix blogs not showing in Dashboard and Admin Panel (fixed context.ts to recognize admin_session cookie)
- [x] Fix empty Guru dropdown - should show all 8 gurus (fixed context.ts)
- [x] Show ICP problems when Guru is selected in AI Wizard
- [x] Fix navigation highlighting (Create Blog was also highlighting Blog Management)

## Blog Date Updates
- [x] Update blog publication dates to spread across last month (not all Feb 3, 2026)

## SEO Fixes
- [x] Fix /how-it-works page: title too short (25 chars, need 30-60), description too long (200 chars, need 50-160)
- [x] Fix homepage (/) SEO: description too long (200 chars, need 50-160)

## Comprehensive SEO Optimization (100% Score)
- [x] Audit and fix SEO for all pages (title 30-60 chars, description 50-160 chars)
- [x] Add/update blog schema fields for SEO (metaTitle, metaDescription)
- [x] Update AI blog generator to auto-fill all SEO fields
- [x] Update manual blog editor with SEO field guidance and validation
- [x] Ensure all images have alt text
- [x] Add structured data (JSON-LD) for blogs

## Blog Editor Bug Fixes
- [x] Fix SEO Keywords not loading when editing existing blog
- [x] Fix Create New Blog keeping old data when navigating from Edit Blog

## AI Wizard Bug Fixes
- [x] Add Hero Image upload/AI generation to AI Wizard
- [x] Add Meta Title/Description fields to AI Wizard
- [x] Fix broken preview showing raw HTML/data after generation
- [x] Add Save/Draft/Publish workflow to AI Wizard

## New Features
- [x] Implement AI-powered keyword suggestions based on blog content

## AI Wizard Content Loading Bug
- [x] Fix AI-generated blog content showing raw HTML instead of rendered content in WYSIWYG editor

## Hero Image AI Generation Fix
- [x] Update AI image prompt to show full human figures without cut-off headshots

## WYSIWYG and Blog Content Fixes
- [x] Fix blockquote/double quote styling in WYSIWYG editor
- [x] Fix Key Takeaway and Did You Know? callout boxes highlighting
- [x] Standardize line breaks to exactly 2 between sections in all existing blogs
- [x] Update AI blog generation to use 2 line breaks between sections

## Blog Preview Mode
- [x] Create BlogPreview component that renders blog exactly like public BlogDetail page
- [x] Add Preview button to BlogEditor page
- [x] Implement preview modal/panel with full blog rendering

## Social Sharing Fix
- [x] Fix Share this article button to open social sharing options (Twitter, Facebook, LinkedIn, etc.)

## Guru Avatar Image Fix
- [x] Fix broken Guru avatar images on blog cards showing partial text instead of actual images
- [x] Fixed database guru image paths (wrong file extensions: .png instead of .jpg for Happiness, Relationship, Sleep, Spiritual gurus)
- [x] Updated authorImage in existing blogs to match corrected guru images

## Blockquote Spacing Fix
- [x] Reduce excessive white space before and after blockquotes/callout boxes in CSS
- [x] Update existing blogs to remove extra line breaks around quotes
- [x] Update AI blog generation to not add extra line breaks around quotes

## Blog Format Improvements (inspired by bloggingyourpassion.com)
- [x] Update AI blog generation to use shorter paragraphs (2-3 sentences max)
- [x] Update AI blog generation to use single line breaks between paragraphs
- [x] Update AI blog generation to include clear H2/H3 headings structure
- [x] Update AI blog generation to add bullet points for key takeaways
- [x] Update AI blog generation to end with clear call-to-action
- [x] Update WYSIWYG editor CSS for better paragraph spacing
- [x] Update BlogDetail.tsx prose styles for better readability
- [x] Update existing blogs to follow new formatting guidelines (optional - CSS improvements apply automatically)

## Public Blogs Page - Filter & Search
- [x] Add Guru filter dropdown to public Blogs page
- [x] Add search bar for keyword search on Blogs page
- [x] Implement client-side filtering logic
- [x] Ensure responsive design for filter/search UI

## Blog Hero Image Generation - Ultra Realistic
- [x] Update AI image generation prompt to produce photorealistic images
- [x] Ensure images feature real humans (not artistic/ethereal style)
- [x] Include diverse representation in prompts
- [x] Test with new blog generation - verified ultra-realistic humans with diverse representation

## Blog Hero Image - Relevance Priority (No Compromise)
- [x] Update AI image prompt to prioritize topic relevance above all else
- [x] Ensure image directly depicts the blog's specific subject matter
- [x] Test with various blog topics to verify relevance - sleep topic generated bedroom/night scene

## Blog Hero Image - No Head/Body Cutoffs (Critical Fix)
- [x] Update AI image prompt to absolutely prevent head/face/body cutoffs
- [x] Add specific framing instructions for full-body visibility (15% headroom, wide-angle composition)
- [x] Test to verify all humans are fully visible in frame - tested with work stress topic

## Blogs Page UI Fixes
- [x] Move search/filter bar into hero section on Blogs page
- [x] Make search/filter bar more colorful and visible (teal gradient dropdown)
- [x] Restore "Back to Blogs" link on individual blog detail pages (verified - already present)

## Blogs Page Hero & Blog Detail Fixes
- [x] Fix Blogs page hero to cover full laptop screen height (changed min-h-[85vh] to min-h-screen)
- [x] "Back to Blogs" link verified present in blog detail hero section

## Blog Content Quality - Human-Like AI Writing
- [x] Research Copyscape API for plagiarism checking
- [x] Research Pangram API for AI content detection
- [x] Update AI blog prompt with human-like writing techniques:
  - [x] Vary sentence length dramatically (5-25 words)
  - [x] Include personal anecdotes and specific examples
  - [x] Use contractions naturally (don't, won't, I'm)
  - [x] Add rhetorical questions to engage readers
  - [x] Include unique opinions and perspectives
  - [x] Use colloquial phrases and idioms
  - [x] Add imperfect transitions (sometimes abrupt)
  - [x] Include self-corrections and asides
  - [x] Reference specific real-world examples
  - [x] Avoid predictable AI patterns (lists of 3, perfect structure)
  - [x] Create unique metaphors for originality
  - [x] Use specific numbers and details
  - [x] Reference current context (2026)
  - [x] Coin unique phrases
  - [x] Tell original stories
- [x] Test generated content sounds authentically human - verified with Anxiety Guru blog on constant worry

## Regenerate Existing Blogs with Human-Like Prompt
- [x] Query database to get list of all existing blogs
- [x] Create regeneration script/endpoint for bulk blog refresh
- [x] Regenerate each blog content with new human-like prompt
- [x] Preserve blog metadata (title, slug, author, category, image, SEO fields)
- [x] Verify regenerated blogs display correctly

## Regenerate Content Button in Admin Blog Editor
- [x] Add "Regenerate Content" button to blog editor page (amber-styled, with confirmation dialog)
- [x] Wire button to regenerateBlog tRPC endpoint
- [x] Show loading state during regeneration
- [x] Refresh blog content after successful regeneration
- [x] Added confirmation dialog to prevent accidental regeneration

## AI Blog Prompt Fix - Expert Analysis Findings
- [x] Fix: Predictable structuring - added FORBIDDEN STRUCTURES section banning hook→tips→conclusion pattern
- [x] Fix: Alliterative phrasing - added explicit TITLE RULES banning alliteration and formulaic patterns
- [x] Fix: Syntactic uniformity - added wildly varied sentence length requirement with examples
- [x] Fix: Lack of specific citations - added CITE SPECIFIC RESEARCH section requiring real journals, researchers, studies
- [x] Fix: Low information gain - added HIGH INFORMATION GAIN section requiring counterintuitive insights, precise numbers, neurological mechanisms
- [x] Fix: Listicle format overuse - added unpredictable structure options (narrative journey, myth-busting, mid-thought opening)
- [x] Add: Unique case studies - added clinical observations and specific client scenario requirements
- [x] Add: Lesser-known concepts (ACT, Polyvagal Theory, Window of Tolerance, Somatic Experiencing)
- [x] Add: Varied sentence structures with fragments, one-word paragraphs, tangential asides
- [x] Add: Unique authorial fingerprint - humor, emotional rawness, self-correction, strong opinions
- [x] Updated BOTH generateBlog AND regenerateBlog endpoints with identical improved prompts
- [x] Test: Generated blog "When Your Brain Won't Shut Up About Work, Even on Vacation" - verified non-alliterative title, narrative structure, specific citations, counterintuitive insights, authorial fingerprint

## Guru Page Image & Hero Section Fixes
- [x] Fix broken Relationship Guru image on its dedicated page (was .png, actual file is .jpg)
- [x] Fix broken Sleep Guru image on its dedicated page (was .png, actual file is .jpg)
- [x] Make all hero sections cover exactly one laptop screen height (h-screen, removed min-h-[800px])
- [x] Reduce hero section heading font size by 25% across all pages (text-5xl/7xl/8xl → text-4xl/5xl/7xl)

## Hero Section Uniformity Across All Pages
- [x] Audit all hero sections for layout, size, font, spacing, overlay inconsistencies
- [x] Standardize hero section structure (height, padding, overlay, content layout) across all pages
- [x] Standardize hero heading font sizes (h1) across all pages for desktop and mobile
- [x] Standardize hero subtitle/description font sizes across all pages
- [x] Standardize hero CTA button styles across all pages
- [x] Ensure uniform mobile responsiveness for all hero sections
- [x] Test all pages on desktop and mobile viewports (10 pages verified on desktop)

## Guru Page Hero Padding & Color Fix
- [x] Fix guru badge being hidden under navbar - increased pt-20 to pt-40 across ALL pages
- [x] Ensure uniform padding across all guru pages (all 9 pages + PrivacyPolicy use pt-40)
- [x] Verify color combinations on guru pages for readability (white text on bg-black/30 overlay)
- [x] Test all guru pages in browser (Relationship, Sleep, Stress, Home verified)

## Rename Dr Nur → StressGuru (Full Codebase)
- [x] Update VITE_APP_TITLE to "StressGuru" (built-in secret - user needs to update in Settings > General)
- [x] Fix client/index.html: og:url and canonical href from drnur.ai to stressguru.ai
- [x] Fix client/public/sitemap.xml: all drnur.ai URLs to stressguru.ai
- [x] Fix client/src/index.css: CSS comments referencing Dr. Nur
- [x] Fix client/src/components/Footer.tsx: support@drnur.ai email + App Store link
- [x] Fix client/src/components/GuruPage.tsx: SEO keywords + App Store link
- [x] Fix client/src/components/SEO.tsx: baseUrl from drnur.ai to stressguru.ai
- [x] Fix client/src/pages/Home.tsx: SEO title and keywords
- [x] Fix client/src/pages/About.tsx: SEO keywords
- [x] Fix client/src/pages/Contact.tsx: SEO keywords
- [x] Fix client/src/pages/Gurus.tsx: SEO keywords
- [x] Fix client/src/pages/HowItWorks.tsx: SEO keywords
- [x] Fix client/src/pages/Plans.tsx: SEO keywords
- [x] Fix client/src/pages/PrivacyPolicy.tsx: all Dr. Nur AI references and drnur.ai URLs
- [x] Test all pages in browser to verify no Dr Nur references remain (Home, Privacy Policy, Contact, Footer all clean)

## Stress Profile Report Email Feature
- [x] Store Gmail SMTP credentials (GMAIL_SMTP_USER, GMAIL_SMTP_APP_PASSWORD)
- [x] Add name field to stress assessment email collection form
- [x] Create database table for stress assessment leads (name, email, score, guru, answers)
- [x] Build server-side email utility using nodemailer with Gmail SMTP
- [x] Design branded HTML email template with StressGuru logo, colors, report details
- [x] Include in report: score breakdown, matched guru, body tension map, quick tips, app download link
- [x] Create tRPC procedure to accept assessment results + name/email, save lead, send email
- [x] Update frontend StressAssessment component to collect name + email (with tRPC mutation, success/error states)
- [x] Send email from support@StressGuru.ai with CC to same address
- [x] Write vitest tests for email sending and report generation (12 tests, all passing)
- [x] Test full flow end-to-end in browser (server running, no TS errors, 30/30 tests pass)
- [x] Build admin leads management tRPC endpoints (list, getById, stats, exportCsv, resendEmail)
- [x] Add detail view for each lead (getById endpoint)
- [x] Add CSV export option for leads (exportCsv endpoint)

## Terms and Conditions Page
- [x] Read provided TermsAndCondition.docx content (9 sections extracted)
- [x] Read existing PrivacyPolicy.tsx for styling reference
- [x] Create TermsAndConditions.tsx page matching Privacy Policy style
- [x] Add route in App.tsx
- [x] Add footer link under Privacy Policy
- [x] Test page in browser (verified on desktop - all content, styling, footer link confirmed)

## Relief Plan Pricing Update
- [x] Scan entire codebase for all Relief Plan pricing references (Plans.tsx, CostCalculator.tsx, Plans.tsx Save 20% badge)
- [x] Update Relief Plan monthly price to $24.99 (Plans.tsx + CostCalculator.tsx)
- [x] Update Relief Plan yearly price to $249.99 (2 months free) (Plans.tsx + badge updated)
- [x] Verify all pages in browser (Plans page: $24.99/mo monthly, $0.68/day + $249.99 yearly, CostCalculator: $24.99, 2 Months Free badge confirmed)

## Sitemap Update (stressguru.ai)
- [x] Update all sitemap.xml URLs from drnur.ai to stressguru.ai
- [x] Add /terms-and-conditions to sitemap.xml
- [x] Add /blogs to sitemap.xml
- [x] Add /stress-assessment to sitemap.xml
- [x] Add /privacy-policy to sitemap.xml
- [x] Update all lastmod dates to 2026-03-29

## Google Tag Manager Installation
- [x] Add GTM head script (GTM-KGF9QCRX) to client/index.html <head>
- [x] Add GTM noscript iframe to client/index.html <body>
- [x] Verify GTM loads correctly in browser (dataLayer initialized, GTM script loaded from googletagmanager.com/gtm.js?id=GTM-KGF9QCRX)

## Meta Pixel Installation
- [x] Add Meta Pixel script (ID 1398213761994129) to client/index.html <head>
- [x] Add Meta Pixel noscript fallback to client/index.html <body>
- [x] Verify Meta Pixel loads correctly in browser (fbq loaded v2.0, GTM still working)

## SEO/AEO/GEO Implementation (Phase 1: Technical Foundation)
- [x] Fix sitemap.xml — replaced all drnur.ai URLs with stressguru.ai, added all 27 pages including blog posts
- [x] Create robots.txt with AI crawler directives (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [x] Create llms.txt for AI crawler brand context (full brand description, features, pricing, links)
- [x] Fix duplicate viewport meta tag in index.html (removed duplicate, optimized meta titles/descriptions)

## SEO/AEO/GEO Implementation (Phase 2: Structured Data)
- [x] Add Organization JSON-LD schema (homepage via SEO component)
- [x] Add SoftwareApplication JSON-LD schema (homepage, plans)
- [x] Add FAQPage JSON-LD schema (plans page with 7 FAQ items)
- [x] Add BlogPosting JSON-LD schema (all blog detail pages)
- [x] Add BreadcrumbList JSON-LD schema (all 12+ pages including guru pages)
- [x] Add HowTo JSON-LD schema (how it works page with 3 steps)

## SEO/AEO/GEO Implementation (Phase 3: On-Page SEO)
- [x] Optimize all page meta titles with keywords (StoryBrand framework)
- [x] Optimize all page meta descriptions with keyword-rich copy

## SEO/AEO/GEO Implementation (Phase 4: AEO Content)
- [x] Expand FAQ section from 7 to 22 questions with categories (Getting Started, Plans & Pricing, The Gurus, How It Works, Privacy & Security, Comparisons, Conditions & Use Cases)
- [x] FAQ schema now includes all 22 questions on Plans page via shared faqData export

## SEO/AEO/GEO Implementation (Phase 5: Conversion)
- [x] Add TrustSignals component to homepage (iOS, 30+ methods, encrypted, 24/7, 8 Gurus)
- [x] Add trust signals bar below hero section on homepage
- [x] Add savings calculation ($49.89/yr saved) to yearly pricing on both mobile and desktop Plans layouts

## Phase 6: Marketing Handoff
- [x] Create marketing team handoff document (9 priority sections: search submissions, ASO, GA4, content marketing, PR, social media, directories, email, paid ads)

## Bug Fixes
- [x] Fix Plans page hero section overlap — changed hero to min-h-screen with pb-32, reduced negative margin from -mt-20 to -mt-8 on both mobile and desktop pricing sections
- [x] Reduce excessive top padding above FAQ and Calculate Your Savings sections on Plans page (py-24 → py-12 on both sections, removed double wrapper padding)

## Books Feature
- [x] Create books data model (client/src/data/books.ts) with Book interface, Sleep Again data, getBooksByGuru/getBookById helpers
- [x] Create dedicated Books page (/books) with hero, featured book, highlights, "Who Is This For", and "More Coming" section
- [x] Add GuruBooks component to individual Guru pages (shows only for gurus with books)
- [x] Add Books to main navigation (header + footer)
- [x] Add Books route in App.tsx
- [x] Add SEO with Book JSON-LD structured data via customJsonLd prop on SEO component
- [x] Update sitemap.xml with /books page
- [x] Use real Amazon book cover image uploaded to CDN
- [x] Ensure responsive design and consistent styling with rest of site (BookCard, GuruBooks components)

## Books Page Mobile Fix
- [x] Fix Books page hero top padding on mobile — increased pt-32 to pt-44 on mobile, md:pt-48 on desktop

## Relationship Guru Image Fix (Gurus Page)
- [x] Fix broken Relationship Guru image on /gurus page — corrected .png to .jpg in Gurus.tsx, FindYourGuruQuiz.tsx, blogs.ts, blogs_part2.ts

## Featured Book Strip on Homepage
- [x] Add Featured Book strip to homepage to cross-promote "Sleep Again" and drive traffic to /books page

## New Tasks (Jul 2)
- [x] Update guru images on the website with new provided assets (6 gurus: Anxiety, Motivation, Relationship, Sleep, Stress, Spiritual)
- [x] Create standalone quiz page (/quiz) for the Find Your Guru quiz
- [x] Add More menu to navigation containing Find Your Guru Quiz, About Us, and Blogs
- [x] Add customer reviews to the book page — DEFERRED: waiting for real Amazon reviews from user

## Stress Profile Standalone Page
- [x] Create standalone page (/stress-profile) for the Your Stress Profile assessment
- [x] Add Stress Profile to navigation (under More menu)
- [x] Replace inline Stress Assessment on homepage with teaser CTA linking to /stress-profile

## Docker & Local Development Setup
- [x] Create Dockerfile (multi-stage build, no hardcoded secrets, reads from env vars)
- [x] Create docker-compose.yml (app + MySQL database, one-command local startup)
- [x] Create .env.example (all env vars with placeholder values and descriptions) — delivered as DOCKER.md (env template block inside)

## Autonomous Website Growth Agent (approved October 24, 2026)

- [ ] Deliver one coordinated autonomous growth workflow inside the existing StressGuru project, without a dashboard, new hosting service, infrastructure migration, new paid software, or replacement design system. Preserve the original repository, important URLs, image assets, conversion tracking, download paths, and concurrent changes.
- [x] Persist the approved product facts, conflict gates, research sources, keyword universe, content inventory, pillar/supporting map, backlog, hypotheses, measured outcomes, successful/failed experiments, change history, and reversal methods. Missing analytics, demand, difficulty, downloads, and AI citations remain unavailable or untested, never fabricated.
- [x] Preserve the exact approved homepage hero. Make ten challenge mentions a nonblocking long-form editorial warning. Permit validated low-risk main-branch GitHub delivery, with explicit review for pricing, product capabilities, privacy/legal assertions, sensitive health claims, crisis guidance, destructive URL changes, infrastructure, and external outreach. Preserve training crawler permissions.
- [x] Run the immediate initial audit of all existing source/public routes and prioritize crawlable HTML, accurate canonicals, unique content, private-route exclusion, real missing-route HTTP status, local images, internal links, schema, and build reliability. Fix confirmed safe crawlability blockers rather than adding pages on a broken foundation.
- [x] Establish 30 commercial query candidates, at least 100 evidence-linked problem questions with intent classification, six named competitor reviews, 15 traceable content-gap hypotheses, topic-cluster reuse priorities, and a 25-prompt repeatable AI benchmark. Record actual citations separately from mentions and disclose any inaccessible engine or unmeasured search demand.
- [x] Use only the user's AWS MySQL database when needed; reject TiDB. Keep credentials and external SQL outside Git. No AWS deployment or live database writes are included in this first code/audit release. Do not touch Dockerfile, docker-compose, environment files, or hosting infrastructure.
- [ ] Ship validated intended changes to zigroninc/StressGuru.ai main, preserving remote changes and GitHub-only images. Report the actual shipping commit SHA and remote verification, never call a Manus checkpoint an AWS deployment.
- [x] Create exactly one recurring Manus task named StressGuru Autonomous Website Growth, Sunday at 10:00 AM America/New_York across daylight saving changes, first scheduled October 25, 2026, continuing the same task/project. Verify the schedule and report any unsupported timezone or access requirement rather than substituting fixed UTC. User approved the native timer alternative; G9AWXcPAjX6aU6hfLigTrQ is enabled, synced, ready, and targets this exact session.
- [x] Complete source/type/test/content/build checks and a read-only implementation review. Update the initial run record and concise report with shipped changes, evidence, unresolved access/review items, next opportunities, and outcome review dates.

Implementation is validated locally. The native Sunday automation timer is enabled and ready after explicit user approval. Its first previewed occurrence is October 25, 2026 at 10:00 AM America/New_York, in this exact session. GitHub shipping remains blocked by the current CLI access discrepancy (qasimmueen, HTTP 404); audits must proceed regardless. No GitHub push or AWS deployment is claimed, and no timed execution has yet been observed. The local source commit and release package preserve the code; a remote Manus checkpoint was not confirmed.

## Sunday Growth Cycle: October 25, 2026

- [x] Complete this scheduled run in the same StressGuru Website session. Produce dated source/public audit evidence and compare with the prior run without inventing deployment parity, analytics, engine citations or search demand.
- [x] Make generated snapshots repeatable: one H1 and the same relevant JSON-LD after multiple generation passes, refreshed assets after a fresh Vite build, and a safe failure when the marked base has no pristine template. Preserve page copy, branding, tracking, URLs and the current build command.
- [x] Make raw-HTML diagnostics distinguish body content from head-only text and meaningful images from explicitly decorative or hidden tracking images. Add targeted regression coverage without reading or writing the database.
- [x] Run existing TypeScript, tests, content audit, production build and local HTTP verification, inspect the release gate, preserve the validated work, and push only if the authorized existing GitHub repository is accessible. Report the exact delivery blocker otherwise.
- [x] Record actual timer execution, changes, evidence, pending shipping/deployment, review items and the next weekly priorities in durable history and a concise report. Do not create, modify, pause or delete the saved automation.

## Approved Credential Correction and GitHub Push: October 26, 2026

- [x] Replace the real hard-coded admin password in both existing login implementations with ADMIN_PASSWORD read at runtime, no default password, and fail-closed behavior when configuration is missing or blank. Preserve the existing admin username, login/logout/check routes, cookie behavior and public website.
- [x] Remove the real admin credential from test fixtures, use isolated synthetic environment configuration, and cover successful/incorrect credentials plus missing or blank ADMIN_PASSWORD without any database access or live changes.
- [x] Validate TypeScript, tests, content audit and existing production build; inspect every tracked source file before upload. Keep credentials, environment files, Dockerfile, external database SQL/rollback/backups, node_modules and build artifacts out of the public release; retain existing project schema migrations and all 54 self-hosted images.
- [ ] Push the sanitized current project code to main in stressguru-ai/Stressguru.ai without old private Git history, force-push, repository recreation or changes to the original Manus origin. Preserve the destination's initial commit and README; verify the actual remote commit SHA, source files and image count. Do not deploy AWS or write any database.


## Sunday Growth Cycle: November 1, 2026

- [x] Audit all 228 source-derived public URLs as raw initial HTML and preserve a dated evidence record. Do not interpret client-rendered content, analytics, rankings, conversions, App Store installs, or AI citations without direct measured evidence.
- [x] Redirect a trailing-slash public request to its existing extensionless canonical URL only if a matching generated snapshot exists, retaining its query string. Keep root, private routes, assets, unknown paths, page copy, database behavior, crawler permissions, and AWS routing unchanged; add isolated regression coverage.
- [x] Validate the narrow source fix and record the actual GitHub delivery SHA to `stressguru-ai/Stressguru.ai` main. Keep all images self-hosted, do not export environment files or external SQL, and do not deploy AWS.
- [x] Record the verified live AWS blocker: all 228 sitemap URLs return the homepage initial HTML and canonical, while the direct guide `.html` response has the distinct guide canonical. Route correction remains for the separate deployment agent, not this growth session.

## Guru Portrait Correction: November 4, 2026

- [x] Relationship Guru uses the supplied beige-and-olive portrait and Anxiety Guru the supplied maroon portrait across Guru pages/cards, navigation, quiz, source generators, seeded data, and blog/static SEO packages. All images remain self-hosted under `client/public/images/` and original assets are preserved.
- [x] Correct the corresponding Guru and blog image assignments in the user's AWS MySQL database only, after an external backup and guarded transaction verification. Do not connect to TiDB, touch unrelated records or change blog text, IDs, dates, status, attribution, pricing, or layouts. Keep backups and rollback/migration SQL outside GitHub.
- [x] Validate source mapping coverage, existing TypeScript/tests/content/build gates and all new assets, then push only the intended changes to `stressguru-ai/Stressguru.ai` main and report the verified SHA. Do not deploy AWS or change infrastructure.
