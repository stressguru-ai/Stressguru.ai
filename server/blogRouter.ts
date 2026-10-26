import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getBlogCategories,
  getAllGurus,
  getGuruById,
  getGuruBySlug,
  createGuru,
  updateGuru,
} from "./db";

// Helper to generate a URL-friendly slug with timestamp for uniqueness
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 180);
  // Add timestamp suffix to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

// Helper to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ""); // Strip HTML
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}


function getBlogEditorialPrompt(guruName: string): string {
  return `You are writing for the StressGuru Editorial Team. ${guruName} is an AI wellness persona used as the article's content guide. It is software, not a clinician, therapist, doctor, human expert, friend, or person with lived experience.

AUDIENCE AND VOICE
Write for professional women ages 30 to 55 in the United States. Use specific work, sleep, caregiving, leadership, relationship, and mental-load moments without stereotypes. Use women, never females, in audience-facing copy. Aim for grade 8 readability. Most sentences should be 8 to 18 words. Sound warm, direct, useful, and human.

STORY AND VALUE
The reader is the hero. StressGuru is a practical guide. Open with a recognizable moment, contradiction, choice, or consequence connected to time, control, sleep, work, relationships, identity, or belonging. Give the direct answer before the long explanation. Show empathy, explain the problem, give a simple plan, name honest stakes, and end with one clear next step. Do not invent stories, client experiences, quotations, ratings, statistics, or testimonials.

SAFETY AND ACCURACY
- StressGuru is an iPhone and Apple Watch wellness app with eight AI wellness personas. It is not therapy, a healthcare provider, a medical device, a diagnostic tool, or crisis care.
- Apple Watch and HRV signals can provide context and can vary. Never say they diagnose, detect, predict, prove, prevent, or treat stress, burnout, anxiety, depression, sleep problems, or any condition.
- Burnout is an occupational phenomenon, not a medical diagnosis. Do not diagnose anxiety, depression, insomnia, menopause, panic disorder, trauma, or any condition.
- Treat work stress as partly structural. Do not imply self-care fixes unsafe, discriminatory, abusive, or unsustainable conditions.
- Do not provide legal, HR, medical, financial, medication, supplement, hormone, or employment advice.
- Encourage a licensed professional for severe, persistent, worsening, or function-impairing symptoms. When self-harm, suicide, hopelessness, or inability to stay safe is relevant, state: In the United States, call or text 988 or visit 988lifeline.org. For immediate danger, call 911.
- Attribute factual claims only to a source you can identify and link. Never invent a study, author, journal, date, number, mechanism, credential, or clinical observation.
- Prefer these official sources when relevant: CDC workplace stress, https://www.cdc.gov/niosh/healthcare/risk-factors/stress-burnout.html; NIMH mental health information, https://www.nimh.nih.gov/health; U.S. Office on Women's Health insomnia, https://womenshealth.gov/a-z-topics/insomnia; WHO burnout definition, https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon; NCCIH relaxation techniques, https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know.

NO-AI-SLOP RULES
Do not use the em dash character. Do not use: you are not alone; your nervous system is not broken; in today's fast-paced world; delve; unlock; empower; revolutionary; transformative; crucial; testament; journey; let's dive in; it is not about X, it is about Y; not just X but Y. Avoid generic recaps, fake-profound endings, repeated rhetorical questions, deliberate grammar mistakes, tangents, contrarian clickbait, and colon-reveal headlines.

AEO, GEO, AND HTML STRUCTURE
- Start with a 60 to 100 word direct-answer paragraph using <p class="lead" data-answer="true">.
- Use a specific title in the JSON title field, then six to eight descriptive <h2> sections.
- Include a two-to-five-minute practical exercise with safe opt-out language.
- Include four or five common questions under <h2>Questions people ask</h2>. Use <h3> for each question and a complete answer in the next <p>.
- Include <h2>Related StressGuru guides</h2> with relevant internal links when known, plus /app and /science-and-safety.
- End with <h2>Sources</h2> and a linked list of only the sources actually used.
- Use semantic HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, and <a>. Do not add scripts, styles, iframes, forms, or event handlers.
- Target 1,100 to 1,500 words. Make the title 45 to 75 characters, meta title 45 to 60 characters, and meta description 145 to 160 characters.
- Make the article specific to the exact query. Do not reuse a generic outline with swapped keywords.`;
}

export const blogRouter = router({
  // ==================== PUBLIC ENDPOINTS ====================
  
  // Get all published blogs (for public blog listing)
  listPublished: publicProcedure.query(async () => {
    return getPublishedBlogs();
  }),

  // Get a single blog by slug (for public blog detail)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const blog = await getBlogBySlug(input.slug);
      if (!blog || blog.status !== "published") {
        return null;
      }
      return blog;
    }),

  // Get all gurus (for public display)
  listGurus: publicProcedure.query(async () => {
    return getAllGurus();
  }),

  // ==================== ADMIN ENDPOINTS ====================

  // Get all blogs with filters (admin only)
  list: adminProcedure
    .input(
      z.object({
        guruId: z.number().optional(),
        status: z.enum(["draft", "published"]).optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const filters = input ? {
        ...input,
        dateFrom: input.dateFrom ? new Date(input.dateFrom) : undefined,
        dateTo: input.dateTo ? new Date(input.dateTo) : undefined,
      } : undefined;
      return getAllBlogs(filters);
    }),

  // Get a single blog by ID (admin only)
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getBlogById(input.id);
    }),

  // Get all categories
  getCategories: adminProcedure.query(async () => {
    return getBlogCategories();
  }),

  // Create a new blog manually
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        image: z.string().optional(),
        category: z.string().optional(),
        guruId: z.number(),
        seoKeywords: z.array(z.string()).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const guru = await getGuruById(input.guruId);
      if (!guru) {
        throw new Error("Guru not found");
      }

      const slug = generateSlug(input.title);
      const readTime = estimateReadTime(input.content);

      const id = await createBlog({
        slug,
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        image: input.image || null,
        category: input.category || null,
        guruId: input.guruId,
        authorName: guru.name,
        authorRole: guru.role,
        authorImage: guru.image,
        seoKeywords: input.seoKeywords || [],
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        readTime,
        status: "draft",
        createdBy: "manual",
      });

      return { id, slug };
    }),

  // Update an existing blog
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        excerpt: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        guruId: z.number().optional(),
        seoKeywords: z.array(z.string()).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      
      // If guruId is being updated, also update author info
      if (updates.guruId) {
        const guru = await getGuruById(updates.guruId);
        if (guru) {
          (updates as any).authorName = guru.name;
          (updates as any).authorRole = guru.role;
          (updates as any).authorImage = guru.image;
        }
      }

      // Recalculate read time if content changed
      if (updates.content) {
        (updates as any).readTime = estimateReadTime(updates.content);
      }

      // Regenerate slug if title changed
      if (updates.title) {
        (updates as any).slug = generateSlug(updates.title);
      }

      await updateBlog(id, updates);
      return { success: true };
    }),

  // Delete a blog
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteBlog(input.id);
      return { success: true };
    }),

  // Publish a blog
  publish: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await publishBlog(input.id);
      return { success: true };
    }),

  // Unpublish a blog
  unpublish: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await unpublishBlog(input.id);
      return { success: true };
    }),

  // ==================== AI GENERATION ENDPOINTS ====================

  // Get ICP problems for a guru
  getGuruProblems: adminProcedure
    .input(z.object({ guruId: z.number() }))
    .query(async ({ input }) => {
      const guru = await getGuruById(input.guruId);
      if (!guru) {
        throw new Error("Guru not found");
      }
      return {
        guru,
        problems: guru.icpProblems || [],
      };
    }),

  // Generate a blog using AI
  generateBlog: adminProcedure
    .input(
      z.object({
        guruId: z.number(),
        problem: z.string().min(1),
        seoKeywords: z.array(z.string()).optional(),
        additionalContext: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const guru = await getGuruById(input.guruId);
      if (!guru) {
        throw new Error("Guru not found");
      }

      const seoKeywordsText = input.seoKeywords?.length 
        ? `\n\nSEO Keywords to naturally incorporate: ${input.seoKeywords.join(", ")}`
        : "";

      const additionalContextText = input.additionalContext
        ? `\n\nAdditional context from the admin: ${input.additionalContext}`
        : "";

      const systemPrompt = getBlogEditorialPrompt(guru.name);

      const userPrompt = `Write a comprehensive blog post addressing this problem: "${input.problem}"

The blog should:
- Have an attention-grabbing title that speaks to the reader's pain
- Include a compelling excerpt (2-3 sentences) for the blog listing
- Be written in HTML format with proper semantic tags
- Flow naturally without any framework labels
- Be 1,100-1,500 words${seoKeywordsText}${additionalContextText}

Return your response in this exact JSON format:
{
  "title": "The blog title",
  "excerpt": "A 2-3 sentence compelling excerpt",
  "content": "The full HTML content of the blog",
  "suggestedCategory": "A category like 'Stress Management', 'Sleep & Recovery', 'Anxiety Relief', etc.",
  "metaTitle": "SEO meta title (30-60 characters, include main keyword)",
  "metaDescription": "SEO meta description (50-160 characters, compelling summary with call to action)"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "blog_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string", description: "The blog title" },
                excerpt: { type: "string", description: "A 2-3 sentence excerpt" },
                content: { type: "string", description: "The full HTML content" },
                suggestedCategory: { type: "string", description: "The blog category" },
                metaTitle: { type: "string", description: "SEO meta title 30-60 chars" },
                metaDescription: { type: "string", description: "SEO meta description 50-160 chars" },
              },
              required: ["title", "excerpt", "content", "suggestedCategory", "metaTitle", "metaDescription"],
              additionalProperties: false,
            },
          },
        },
      });

      const generatedContent = JSON.parse(response.choices[0].message.content as string);

      // Create the blog as a draft
      const slug = generateSlug(generatedContent.title);
      const readTime = estimateReadTime(generatedContent.content);

      const id = await createBlog({
        slug,
        title: generatedContent.title?.substring(0, 512),
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        category: generatedContent.suggestedCategory?.substring(0, 128),
        guruId: input.guruId,
        authorName: guru.name,
        authorRole: guru.role,
        authorImage: guru.image,
        seoKeywords: input.seoKeywords || [],
        metaTitle: generatedContent.metaTitle?.substring(0, 70),
        metaDescription: generatedContent.metaDescription?.substring(0, 170),
        readTime,
        status: "draft",
        createdBy: "ai",
      });

      return {
        id,
        slug,
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        category: generatedContent.suggestedCategory,
      };
    }),

  // Generate a hero image for a blog using AI
  generateHeroImage: adminProcedure
    .input(
      z.object({
        blogId: z.number().optional(),
        title: z.string(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Create a prompt for generating an ultra-realistic, HIGHLY RELEVANT hero image
      const imagePrompt = `ULTRA-REALISTIC PHOTOGRAPH for a mental wellness blog article.

####### ABSOLUTE TOP PRIORITY - RELEVANCE (NO COMPROMISE) #######
The image MUST directly and specifically depict the exact topic of this blog:
BLOG TITLE: "${input.title}"
${input.category ? `CATEGORY: ${input.category}` : ""}

Analyze the blog title carefully and create an image that:
1. DIRECTLY ILLUSTRATES the specific problem, solution, or concept mentioned in the title
2. Shows a SPECIFIC SCENARIO that someone reading this blog would immediately recognize and relate to
3. If the title mentions sleep → show someone in bed/bedroom setting
4. If the title mentions work stress → show office/work environment
5. If the title mentions anxiety → show the physical manifestation or relief of anxiety
6. If the title mentions relationships → show people interacting
7. If the title mentions meditation/calm → show someone meditating or in peaceful practice
8. The viewer should look at the image and IMMEDIATELY understand what the blog is about

DO NOT create generic "wellness" or "peaceful" images that could apply to any article.
The image must be SO SPECIFIC to this title that it would NOT work for any other blog.
####### END RELEVANCE REQUIREMENTS #######

####### CRITICAL FRAMING REQUIREMENT - NO CUTOFFS (ABSOLUTE RULE) #######
- EVERY person in the image MUST be COMPLETELY VISIBLE from head to toe
- NEVER crop, cut off, or partially hide ANY person's head, face, hair, or any body part
- Frame the shot with GENEROUS HEADROOM - leave at least 15% empty space above the tallest person's head
- Use a WIDE ANGLE composition that captures ALL people fully within the frame
- If multiple people, ensure ALL of them are 100% visible - no partial figures at edges
- Shoot from a distance that allows full-body framing with room to spare
- Think "group photo" framing where everyone fits completely in the shot
- REJECT any composition where heads touch or exceed the top edge of the frame
####### END FRAMING REQUIREMENT #######

PHOTOGRAPHIC REQUIREMENTS:
- Must look like a REAL PHOTOGRAPH taken with a professional DSLR camera (Canon 5D Mark IV)
- Feature REAL, AUTHENTIC-LOOKING HUMANS with natural skin texture, pores, and imperfections
- Include DIVERSE representation: Black, Asian, Hispanic, Middle Eastern, and Caucasian individuals
- Show people in NATURAL, CANDID poses - not posed or artificial looking
- Natural facial expressions showing genuine emotion relevant to the topic

TECHNICAL STYLE:
- Shot on 35mm or 50mm wide-angle lens to capture full scenes with people
- Camera positioned to show full bodies with headroom above
- Golden hour or soft diffused natural lighting
- High-end lifestyle/editorial photography aesthetic
- Warm, inviting color palette with natural tones
- 8K resolution quality, sharp focus on subjects
- NO artistic filters, NO painterly effects, NO fantasy elements
- NO text, logos, or watermarks
- NO cropped or partial human figures`;

      const result = await generateImage({
        prompt: imagePrompt,
      });

      // If a blogId was provided, update the blog with the new image
      if (input.blogId && result.url) {
        await updateBlog(input.blogId, { image: result.url });
      }

      return { url: result.url };
    }),

  // Upload a hero image
  uploadHeroImage: adminProcedure
    .input(
      z.object({
        blogId: z.number().optional(),
        base64: z.string(),
        mimeType: z.string(),
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const key = `blog-images/${Date.now()}-${input.filename}`;
      
      const { url } = await storagePut(key, buffer, input.mimeType);

      // If a blogId was provided, update the blog with the new image
      if (input.blogId && url) {
        await updateBlog(input.blogId, { image: url });
      }

      return { url };
    }),

  // ==================== GURU MANAGEMENT ====================

  // Get all gurus (admin)
  listGurusAdmin: adminProcedure.query(async () => {
    return getAllGurus();
  }),

  // Create a new guru
  createGuru: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        role: z.string().min(1),
        image: z.string().min(1),
        description: z.string().optional(),
        icpProblems: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createGuru({
        slug: input.slug,
        name: input.name,
        role: input.role,
        image: input.image,
        description: input.description || null,
        icpProblems: input.icpProblems || [],
      });
      return { id };
    }),

  // Update a guru
  updateGuru: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.string().optional(),
        image: z.string().optional(),
        description: z.string().optional(),
        icpProblems: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await updateGuru(id, updates);
      return { success: true };
    }),

  // ==================== AI KEYWORD SUGGESTIONS ====================

  // Suggest SEO keywords based on title and content
  suggestKeywords: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `You are an SEO expert specializing in mental wellness and stress management content. Your task is to suggest highly relevant SEO keywords that will help blog posts rank well in search engines.

Target audience: Professional women aged 35-55 and students dealing with stress, anxiety, sleep issues, and burnout.

Keyword guidelines:
1. Include a mix of short-tail (1-2 words) and long-tail (3-5 words) keywords
2. Focus on search intent - what would someone type to find this content?
3. Include related terms and synonyms
4. Consider question-based keywords (how to, what is, why does)
5. Include emotional/benefit-focused keywords
6. Avoid overly generic terms`;

      const contentPreview = input.content 
        ? input.content.replace(/<[^>]*>/g, "").substring(0, 500) 
        : "";

      const userPrompt = `Suggest 8-10 highly relevant SEO keywords for a blog post with:

Title: "${input.title}"
${input.category ? `Category: ${input.category}` : ""}
${contentPreview ? `Content preview: ${contentPreview}...` : ""}

Return your response as a JSON object with a "keywords" array containing the suggested keywords as strings.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "keyword_suggestions",
            strict: true,
            schema: {
              type: "object",
              properties: {
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Array of suggested SEO keywords",
                },
              },
              required: ["keywords"],
              additionalProperties: false,
            },
          },
        },
      });

      const result = JSON.parse(response.choices[0].message.content as string);
      return { keywords: result.keywords as string[] };
    }),

  // Regenerate an existing blog's content with the new human-like prompt
  regenerateBlog: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // Get the existing blog
      const blog = await getBlogById(input.id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      // Get the guru for this blog
      const guru = blog.guruId ? await getGuruById(blog.guruId) : null;
      if (!guru) {
        throw new Error("Guru not found for this blog");
      }

      // Extract the problem/topic from the existing title
      const problem = blog.title;

      const seoKeywordsText = blog.seoKeywords?.length 
        ? `\n\nSEO Keywords to naturally incorporate: ${blog.seoKeywords.join(", ")}`
        : "";

      const systemPrompt = getBlogEditorialPrompt(guru.name);

      const userPrompt = `Rewrite and improve this blog post about: "${problem}"

The blog should:
- Keep the same general topic and message but with completely fresh, human-like writing
- Have an attention-grabbing title that speaks to the reader's pain
- Include a compelling excerpt (2-3 sentences) for the blog listing
- Be written in HTML format with proper semantic tags
- Flow naturally without any framework labels
- Be 1,100-1,500 words${seoKeywordsText}

Return your response in this exact JSON format:
{
  "title": "The blog title",
  "excerpt": "A 2-3 sentence compelling excerpt",
  "content": "The full HTML content of the blog",
  "suggestedCategory": "A category like 'Stress Management', 'Sleep & Recovery', 'Anxiety Relief', etc.",
  "metaTitle": "SEO meta title (30-60 characters, include main keyword)",
  "metaDescription": "SEO meta description (50-160 characters, compelling summary with call to action)"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "blog_content",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string", description: "The blog title" },
                excerpt: { type: "string", description: "A 2-3 sentence excerpt" },
                content: { type: "string", description: "The full HTML content" },
                suggestedCategory: { type: "string", description: "The blog category" },
                metaTitle: { type: "string", description: "SEO meta title 30-60 chars" },
                metaDescription: { type: "string", description: "SEO meta description 50-160 chars" },
              },
              required: ["title", "excerpt", "content", "suggestedCategory", "metaTitle", "metaDescription"],
              additionalProperties: false,
            },
          },
        },
      });

      const generatedContent = JSON.parse(response.choices[0].message.content as string);

      // Calculate new read time
      const readTime = estimateReadTime(generatedContent.content);

      // Update the blog with new content while preserving metadata
      await updateBlog(input.id, {
        title: generatedContent.title?.substring(0, 512),
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        category: generatedContent.suggestedCategory?.substring(0, 128),
        metaTitle: generatedContent.metaTitle?.substring(0, 70),
        metaDescription: generatedContent.metaDescription?.substring(0, 170),
        readTime,
        // Preserve: slug, image, guruId, authorName, authorRole, authorImage, seoKeywords, status, createdAt
      });

      return {
        id: input.id,
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        category: generatedContent.suggestedCategory,
        success: true,
      };
    }),
});
