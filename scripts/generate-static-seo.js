import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "public");
const baseTemplatePath = path.join(dist, "index.html");
const pristineTemplatePath = path.join(root, "dist", ".stressguru-seo-template.html");
const snapshotMarker = "<!-- stressguru-generated-seo-snapshot -->";
const pagesPath = path.join(root, "client", "src", "data", "contentPages.generated.json");
const blogsPath = path.join(root, "docs", "seo", "blogs.generated.json");
const baseUrl = "https://stressguru.ai";
const defaultImage = `${baseUrl}/images/og-stressguru.jpg`;
const corePages = [
  { route: "/", title: "Stop Stress Today. Prevent the Same Pattern Tomorrow | StressGuru", description: "Stop everyday stress from taking the rest of your day. StressGuru helps professional women pause now and plan how to prevent the same pressure from repeating.", h1: "Stop Stress Today.", answer: "StressGuru is an iPhone and Apple Watch wellness app for professional women who want to stop stress spillover now and prevent the same pattern from taking tomorrow. Choose one of eight AI Gurus for a short reflection or wellness practice. StressGuru is not therapy, medical care, a diagnostic tool, or crisis care." },
  { route: "/app", title: "StressGuru App: Stop Stress Now, Prevent the Next Repeat", description: "Use an AI wellness Guru to stop work pressure from taking the next hour, then plan how to prevent the same stress pattern from repeating.", h1: "Stop today's spillover. Protect tomorrow.", answer: "Open StressGuru on iPhone, or from an Apple Watch notification when available. Choose an AI Guru, take a short wellness pause, and identify one change that may help prevent the pressure from repeating. Wearable signals provide context only and do not diagnose stress." },
  { route: "/how-it-works", title: "How StressGuru Helps You Stop and Prevent Stress Patterns", description: "See how StressGuru helps you notice pressure, stop it from taking the next hour, and plan how to prevent the same pattern from repeating.", h1: "How StressGuru works", answer: "StressGuru follows three steps: notice the pressure, use an AI Guru to stop the spillover, and choose one practical change that may prevent the same pattern from repeating. You can start from your iPhone or an optional Apple Watch notification." },
  { route: "/plans", title: "StressGuru Plans and Pricing", description: "Compare Relief, Reset, Balance, and Thrive plans, monthly session allowances, annual prices, and the cost of additional paid-plan sessions.", h1: "Choose the StressGuru plan that fits your month", answer: "Relief is free. Reset includes two sessions per month for $19.99 monthly or $199.99 annually. Balance includes five for $49.99 monthly or $499.99 annually. Thrive includes 20 for $199.99 monthly or $1,999.99 annually. Additional paid-plan sessions cost $12.99." },
  { route: "/about", title: "About StressGuru", description: "Learn why StressGuru was built, how its eight AI wellness Gurus work, and where a wellness app fits alongside qualified professional support.", h1: "Why StressGuru exists", answer: "StressGuru was built to give busy people a short, private place to pause when work, sleep, relationships, or mental load begin taking over. Its eight Gurus are AI wellness personas, not people, clinicians, or crisis support." },
  { route: "/contact", title: "Contact StressGuru", description: "Contact the StressGuru team about the iPhone and Apple Watch wellness app, support questions, partnerships, privacy, or accessibility.", h1: "Contact StressGuru", answer: "Use the StressGuru contact page for product questions, support, partnerships, privacy, or accessibility. Do not use the form for urgent medical or crisis needs. In the United States, call or text 988 for crisis support and call 911 for immediate danger." },
  { route: "/blogs", title: "StressGuru Articles for Work Stress, Sleep, and Anxiety", description: "Read evidence-bounded articles for professional women managing work stress, burnout, anxiety, sleep disruption, caregiving, and mental load.", h1: "Practical articles for pressure that follows you home", answer: "StressGuru articles give direct answers, short practices, source links, and clear care boundaries for professional women managing work pressure, sleep disruption, anxiety, low mood, caregiving, relationships, and mental load." },
  { route: "/books", title: "StressGuru Books and Workbooks", description: "Explore StressGuru books and practical workbooks for sleep routines, racing thoughts, stress reflection, and everyday wellness habits.", h1: "StressGuru books and workbooks", answer: "StressGuru books provide structured prompts and practical routines for people who want more time to work through sleep, stress, and reflection topics. They are wellness resources and do not replace medical or mental health care." },
  { route: "/books/sleep-again", title: "Sleep Again: A 21-Day Workbook for Racing Thoughts", description: "Explore the Sleep Again workbook for evening routines, racing thoughts, and intentional rest, with clear wellness and care boundaries.", h1: "Sleep Again", answer: "Sleep Again is a 21-day wellness workbook with prompts for racing thoughts, evening routines, and more intentional rest. It is not a treatment for insomnia or another sleep condition. Persistent sleep problems deserve qualified medical support." },
  { route: "/quiz", title: "Find Your StressGuru", description: "Answer a few questions about the pressure you are carrying and find the AI wellness Guru style that best fits the moment.", h1: "Which AI Guru fits this moment?", answer: "The StressGuru quiz helps you choose among eight AI wellness personas based on the part of your day you want to work through. It is a product-matching tool, not a mental health assessment or diagnosis." },
  { route: "/stress-profile", title: "Free Stress Profile Assessment | StressGuru", description: "Use a two-minute reflection to notice current stress patterns and decide what deserves attention next. This is not a diagnostic screening tool.", h1: "What is adding to your stress right now?", answer: "The StressGuru stress profile is a short self-reflection that helps you notice patterns in work, sleep, energy, and relationships. It does not diagnose stress, anxiety, depression, burnout, or another condition." },
  { route: "/gurus", title: "Meet the Eight StressGuru AI Wellness Personas", description: "Meet the eight AI Gurus for stress, sleep, anxiety, motivation, relationships, happiness, calm, and spiritual reflection.", h1: "Eight AI Gurus. One clear place to start.", answer: "StressGuru includes eight AI wellness personas: Stress, Sleep, Anxiety, Motivation, Relationship, Happiness, Calm, and Spiritual Guru. Each offers a different reflection style. Gurus are software, not humans, therapists, doctors, or crisis support." },
  { route: "/gurus/stress", title: "Stress Guru | AI-Guided Everyday Stress Support", description: "Use Stress Guru for a short wellness pause when deadlines, meetings, or a crowded mental load begin spilling into the rest of your day.", h1: "Meet Stress Guru", answer: "Stress Guru is an AI wellness persona for short reflections and practical stress-management exercises. It can help you name the immediate pressure and choose a next step. It does not detect, diagnose, treat, or prevent a medical condition." },
  { route: "/gurus/sleep", title: "Sleep Guru | AI-Guided Wind-Down Support", description: "Use Sleep Guru for a short wind-down when work thoughts, tomorrow's list, or a restless evening make it hard to transition toward rest.", h1: "Meet Sleep Guru", answer: "Sleep Guru is an AI wellness persona for wind-down prompts, sleep-routine reflection, and low-stimulation next steps. It does not diagnose or treat insomnia or another sleep disorder." },
  { route: "/gurus/anxiety", title: "Anxiety Guru | AI-Guided Grounding Support", description: "Use Anxiety Guru for a brief grounding prompt when worry, overthinking, or meeting pressure begins taking up the room.", h1: "Meet Anxiety Guru", answer: "Anxiety Guru is an AI wellness persona for grounding, reflection, and short wellness practices during worry-filled moments. It does not diagnose or treat anxiety or panic disorders and is not crisis support." },
  { route: "/gurus/motivation", title: "Motivation Guru | AI-Guided Next-Step Support", description: "Use Motivation Guru when low energy, task pressure, or a crowded list makes it hard to choose a manageable next action.", h1: "Meet Motivation Guru", answer: "Motivation Guru is an AI wellness persona for task reflection and small next-step planning. It does not assess or treat depression, fatigue, attention problems, or another condition." },
  { route: "/gurus/relationship", title: "Relationship Guru | AI-Guided Conversation Reflection", description: "Use Relationship Guru to prepare for a hard conversation, name a boundary, or reflect on work stress that is following you home.", h1: "Meet Relationship Guru", answer: "Relationship Guru is an AI wellness persona for conversation preparation, boundary reflection, and repair prompts. It is not couples therapy, safety planning, or legal advice." },
  { route: "/gurus/happiness", title: "Happiness Guru | AI-Guided Everyday Joy Reflection", description: "Use Happiness Guru to notice meaningful moments, reconnect with values, and make room for small sources of everyday enjoyment.", h1: "Meet Happiness Guru", answer: "Happiness Guru is an AI wellness persona for gratitude, values, and everyday enjoyment prompts. It does not diagnose or treat depression, persistent low mood, or another condition." },
  { route: "/gurus/calm", title: "Calm Guru | AI-Guided Soothing Practices", description: "Use Calm Guru for short, optional grounding or breathing practices when noise, demands, or tension begin crowding your attention.", h1: "Meet Calm Guru", answer: "Calm Guru is an AI wellness persona for brief grounding, sensory, and breathing practices. You can stop, skip, or return to normal breathing if a practice feels uncomfortable. It is not medical or crisis care." },
  { route: "/gurus/spiritual", title: "Spiritual Guru | AI-Guided Meaning and Values Reflection", description: "Use Spiritual Guru for private reflection on values, meaning, gratitude, and the choices that matter during a demanding season.", h1: "Meet Spiritual Guru", answer: "Spiritual Guru is an AI wellness persona for values and meaning reflection. It does not represent a religion, spiritual authority, human teacher, therapist, or crisis resource." },
  { route: "/science-and-safety", title: "StressGuru Science, Safety, and Care Boundaries", description: "Review StressGuru's evidence standards, wearable limits, AI disclosure, professional-care boundaries, and U.S. crisis resources.", h1: "Science and safety without hidden fine print", answer: "StressGuru is a wellness app, not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care. Apple Watch signals provide context and do not diagnose emotional stress. Every Guru is an AI wellness persona." },
  { route: "/editorial-policy", title: "StressGuru Editorial Policy", description: "Read how StressGuru selects sources, reviews wellness claims, discloses AI involvement, corrects errors, and separates education from healthcare.", h1: "How StressGuru content is created", answer: "StressGuru content uses named sources, answer-first writing, AI disclosure, human editorial standards, and clear care boundaries. It does not present wellness information as diagnosis, treatment, or individualized medical advice." },
  { route: "/accessibility", title: "StressGuru Accessibility", description: "Read the StressGuru accessibility commitment and contact the team about barriers in the website, iPhone app, or published wellness content.", h1: "Access should not add another obstacle", answer: "StressGuru works to make its website, app, and educational content usable across devices and access needs. Contact the team if a page, control, image, or piece of content creates a barrier." },
  { route: "/privacy-policy", title: "StressGuru Privacy Policy", description: "Read how StressGuru describes the collection, use, protection, and choices related to account, conversation, wearable, and website information.", h1: "StressGuru Privacy Policy", answer: "The StressGuru Privacy Policy explains what information may be collected, why it is used, how it may be shared, how it is protected, and which choices may be available to users." },
  { route: "/terms-and-conditions", title: "StressGuru Terms and Conditions", description: "Read the terms that govern use of StressGuru, including AI limitations, wellness boundaries, account responsibilities, and acceptable use.", h1: "StressGuru Terms and Conditions", answer: "The StressGuru Terms and Conditions explain that Gurus are AI software, not human professionals, and that the service provides wellness support rather than medical advice, diagnosis, treatment, or crisis care." },
];

function requireFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required generated file: ${file}`);
}

function readPristineTemplate() {
  const current = fs.readFileSync(baseTemplatePath, "utf8");
  if (current.includes(snapshotMarker)) {
    if (!fs.existsSync(pristineTemplatePath)) {
      throw new Error("Generated homepage has no pristine SEO template. Run the existing clean production build before generating snapshots again.");
    }
    const pristine = fs.readFileSync(pristineTemplatePath, "utf8");
    if (pristine.includes(snapshotMarker) || /<noscript>\s*<main>\s*<article>/i.test(pristine)) {
      throw new Error("SEO template contains generated snapshot content. Run the existing clean production build.");
    }
    return pristine;
  }
  // Reject unmarked snapshots generated by older releases, not tracking noscript.
  if (/<noscript>\s*<main>\s*<article>/i.test(current)) {
    throw new Error("Legacy generated homepage cannot be used as a pristine template. Run the existing clean production build.");
  }
  // A fresh Vite build must refresh the saved asset hashes and original tracking.
  fs.writeFileSync(pristineTemplatePath, current);
  return current;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value = "") {
  return escapeHtml(value);
}

function absolute(value) {
  if (!value) return defaultImage;
  return value.startsWith("http") ? value : `${baseUrl}${value.startsWith("/") ? "" : "/"}${value}`;
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonScript(data) {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

function updateHead(template, { title, description, keywords, canonical, image, type, schemas }) {
  const fullTitle = title.includes("StressGuru") ? title : `${title} | StressGuru`;
  let output = template;
  output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  output = output.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttr(description)}" />`);
  output = output.replace(/<meta name="keywords"[^>]*>/i, `<meta name="keywords" content="${escapeAttr(keywords.join(", "))}" />`);
  output = output.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeAttr(canonical)}" />`);
  output = output.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`);
  output = output.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}" />`);
  output = output.replace(/<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="${type}" />`);
  output = output.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeAttr(canonical)}" />`);
  output = output.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeAttr(image)}" />`);
  output = output.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`);
  output = output.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  output = output.replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);
  const schemaMarkup = schemas.map(schema => `<script type="application/ld+json">${jsonScript(schema)}</script>`).join("\n    ");
  return output.replace("</head>", `    ${schemaMarkup}\n  </head>`);
}

function writeSnapshot(route, html) {
  const relative = route.replace(/^\//, "") || "index";
  const output = path.join(dist, `${relative}.html`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${snapshotMarker}\n${html}`);
  return output;
}

function coreSnapshot(template, page) {
  const canonical = `${baseUrl}${page.route}`;
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    headline: page.title,
    description: page.description,
    url: canonical,
    dateModified: "2026-09-19",
    publisher: { "@type": "Organization", name: "StressGuru", url: baseUrl },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-answer='true']", "h1"] },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: page.route === "/"
      ? [{ "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` }]
      : [
          { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: page.h1, item: canonical },
        ],
  };
  const schemas = [webPage, breadcrumb];
  if (page.route === "/" || page.route === "/app") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "StressGuru",
      url: `${baseUrl}/`,
      logo: `${baseUrl}/images/vAUAzXpzpBlwAtwK.png`,
      sameAs: ["https://apps.apple.com/us/app/stressguru-ai/id6748682052"],
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "StressGuru",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS, watchOS",
      description: page.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: `${baseUrl}/app`,
    });
  }
  const body = `<noscript><main><article><h1>${escapeHtml(page.h1)}</h1><p data-answer="true">${escapeHtml(page.answer)}</p><p>${escapeHtml(page.description)}</p><h2>Explore StressGuru topics</h2><ul><li><a href="/stress-relief">Stress relief</a></li><li><a href="/burnout-prevention">Burnout prevention</a></li><li><a href="/anxiety-support">Anxiety support</a></li><li><a href="/sleep-better">Sleep support</a></li><li><a href="/science-and-safety">Science and safety</a></li><li><a href="/blogs">Articles</a></li></ul></article></main></noscript>`;
  const withHead = updateHead(template, {
    title: page.title,
    description: page.description,
    keywords: ["StressGuru", "professional women", "work stress", "burnout", "anxiety", "sleep", "AI wellness Guru"],
    canonical,
    image: defaultImage,
    type: "website",
    schemas,
  });
  return withHead.replace('<div id="root"></div>', `${body}\n    <div id="root"></div>`);
}

function contentSnapshot(template, page) {
  const canonical = `${baseUrl}${page.url}`;
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.seoDescription,
    mainEntityOfPage: canonical,
    dateModified: "2026-09-19",
    author: { "@type": "Organization", name: "StressGuru Editorial Team", url: `${baseUrl}/editorial-policy` },
    publisher: { "@type": "Organization", name: "StressGuru", url: baseUrl },
    citation: page.sources.map(source => source.url),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-answer='true']", "h1"] },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: page.h1, item: canonical },
    ],
  };
  const sectionMarkup = page.sections.map(section => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></section>`).join("");
  const faqMarkup = page.faq.map(item => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("");
  const relatedMarkup = page.relatedGuides.map(link => `<li><a href="${escapeAttr(link.href)}">${escapeHtml(link.title)}</a></li>`).join("");
  const sourcesMarkup = page.sources.map(source => `<li>${escapeHtml(source.publisher)}: <a href="${escapeAttr(source.url)}">${escapeHtml(source.title)}</a></li>`).join("");
  const body = `<noscript><main><article><p>${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p data-answer="true">${escapeHtml(page.answer)}</p><p>${escapeHtml(page.summary)}</p><h2>${escapeHtml(page.quickActionTitle)}</h2><ol>${page.quickActionSteps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>${sectionMarkup}<h2>Stop now, then prevent the next repeat</h2><p>Use the short practice to stop the pressure from spreading through the next few minutes. Then identify one workload, trigger, boundary, or routine you can change to reduce the chance of the pattern repeating.</p><h2>Questions people ask</h2>${faqMarkup}<h2>Related StressGuru guides</h2><ul>${relatedMarkup}</ul><h2>Sources</h2><ul>${sourcesMarkup}</ul><p>StressGuru is a wellness app, not therapy, a medical device, a diagnosis, treatment, or crisis care. <a href="/science-and-safety">Read the safety guidance</a>.</p></article></main></noscript>`;
  const withHead = updateHead(template, {
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.keywords,
    canonical,
    image: defaultImage,
    type: "article",
    schemas: [article, faq, breadcrumb],
  });
  return withHead.replace('<div id="root"></div>', `${body}\n    <div id="root"></div>`);
}

function blogSnapshot(template, blog) {
  const canonical = blog.canonicalUrl || `${baseUrl}/blogs/${blog.slug}`;
  const image = absolute(blog.ogImage || blog.image);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blog.faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDescription || blog.excerpt,
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: String(blog.publishedAt).slice(0, 10),
    dateModified: "2026-09-19",
    image,
    author: { "@type": "Organization", name: "StressGuru Editorial Team", url: `${baseUrl}/editorial-policy` },
    contributor: { "@type": "SoftwareApplication", name: blog.authorName, applicationCategory: "HealthApplication" },
    publisher: { "@type": "Organization", name: "StressGuru", url: baseUrl },
    citation: blog.sources.map(source => source.url),
    articleBody: stripHtml(blog.content),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-answer='true']", "h1"] },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${baseUrl}/blogs` },
      { "@type": "ListItem", position: 3, name: blog.title, item: canonical },
    ],
  };
  const body = `<noscript><main><article><p>${escapeHtml(blog.category)}</p><h1>${escapeHtml(blog.title)}</h1><p>Published ${escapeHtml(String(blog.publishedAt).slice(0, 10))} by the StressGuru Editorial Team with ${escapeHtml(blog.authorName)} as an AI wellness content guide.</p>${blog.content}</article></main></noscript>`;
  const withHead = updateHead(template, {
    title: blog.metaTitle || `${blog.title} | StressGuru`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.seoKeywords,
    canonical,
    image,
    type: "article",
    schemas: [article, faq, breadcrumb],
  });
  return withHead.replace('<div id="root"></div>', `${body}\n    <div id="root"></div>`);
}

function main() {
  requireFile(baseTemplatePath);
  requireFile(pagesPath);
  requireFile(blogsPath);
  const template = readPristineTemplate();
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
  const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
  let count = 0;
  for (const page of corePages) {
    writeSnapshot(page.route, coreSnapshot(template, page));
    count += 1;
  }
  for (const page of pages) {
    writeSnapshot(page.url, contentSnapshot(template, page));
    count += 1;
  }
  for (const blog of blogs.filter(item => item.status === "published")) {
    writeSnapshot(`/blogs/${blog.slug}`, blogSnapshot(template, blog));
    count += 1;
  }
  console.log(`Generated ${count} static SEO/AEO/GEO HTML snapshots.`);
}

main();
