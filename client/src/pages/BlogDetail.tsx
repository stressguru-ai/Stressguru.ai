import { useRoute, Link } from "wouter";
import { ArrowLeft, Clock, Calendar, Share2, Loader2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";

// Social Share Buttons Component
function SocialShareButtons({ title, excerpt, slug }: { title: string; excerpt: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blogs/${slug}`
    : `/blogs/${slug}`;

  const shareText = `${title} - ${excerpt.substring(0, 100)}...`;

  const handleShare = useCallback((platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(title);

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  }, [shareUrl, shareText, title]);

  return (
    <div className="flex items-center space-x-4">
      <span className="font-bold text-slate-900">Share this article</span>
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-slate-50 hover:text-[#7BDDE5] border-slate-200"
          onClick={() => setShowOptions(!showOptions)}
          aria-label="Open sharing options"
        >
          <Share2 className="w-4 h-4" />
        </Button>

        {showOptions && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 flex items-center space-x-1 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-sky-50 hover:text-[#1DA1F2] w-10 h-10"
              onClick={() => handleShare('twitter')}
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50 hover:text-[#4267B2] w-10 h-10"
              onClick={() => handleShare('facebook')}
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50 hover:text-[#0A66C2] w-10 h-10"
              onClick={() => handleShare('linkedin')}
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${copied ? 'bg-green-50 text-green-600' : 'hover:bg-slate-50 hover:text-slate-700'}`}
              onClick={() => handleShare('copy')}
              title={copied ? 'Link copied' : 'Copy link'}
            >
              {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to wrap Key Takeaway and Did You Know sections in callout boxes
function processCalloutBoxes(content: string): string {
  // Pattern to match h3 with Key Takeaway or Did You Know followed by a paragraph
  // This handles the format: <h3>Key Takeaway</h3><p>...</p>
  const patterns = [
    // Pattern for: </h3><p><br><br></p><h3>Key Takeaway</h3><p>content</p>
    /(<h3>(?:Key Takeaway|Did You Know\??)<\/h3>)(<p>(?:(?!<h[23]>).)*?<\/p>)/gi,
  ];

  let processedContent = content;

  patterns.forEach(pattern => {
    processedContent = processedContent.replace(pattern, (match, h3, p) => {
      return `<div class="blog-callout-wrapper">${h3}${p}</div>`;
    });
  });

  return processedContent;
}

export default function BlogDetail() {
  const [, params] = useRoute("/blogs/:slug");
  const slug = params?.slug || "";

  const { data: blog, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Process content to wrap Key Takeaway and Did You Know sections in callout boxes
  // Must be called before any early returns to comply with React hooks rules
  const processedContent = useMemo(() => {
    if (!blog?.content) return '';
    return processCalloutBoxes(blog.content);
  }, [blog?.content]);

  const structuredContent = useMemo(() => {
    if (!blog?.content || typeof window === "undefined") {
      return { faqItems: [] as { question: string; answer: string }[], citations: [] as string[] };
    }

    const documentFragment = new DOMParser().parseFromString(blog.content, "text/html");
    const headings = Array.from(documentFragment.querySelectorAll("h2"));
    const faqHeading = headings.find(heading => heading.textContent?.trim().toLowerCase() === "questions people ask");
    const sourceHeading = headings.find(heading => heading.textContent?.trim().toLowerCase() === "sources");
    const faqItems: { question: string; answer: string }[] = [];

    let node = faqHeading?.nextElementSibling ?? null;
    while (node && node !== sourceHeading) {
      if (node.tagName === "H3") {
        const answerNode = node.nextElementSibling;
        if (answerNode?.tagName === "P") {
          faqItems.push({
            question: node.textContent?.trim() ?? "",
            answer: answerNode.textContent?.trim() ?? "",
          });
          node = answerNode;
        }
      }
      node = node.nextElementSibling;
    }

    const citations = sourceHeading?.nextElementSibling
      ? Array.from(sourceHeading.nextElementSibling.querySelectorAll("a[href]"))
          .map(link => link.getAttribute("href") ?? "")
          .filter(Boolean)
      : [];

    return { faqItems, citations };
  }, [blog?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
        <span className="ml-3 text-slate-600">Opening article...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">This article isn’t available</h1>
          <p className="text-slate-600 mb-8">It may have moved or been removed. Browse the article library for another useful next step.</p>
          <Link href="/blogs">
            <Button>Browse articles</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = blog.publishedAt
    ? format(new Date(blog.publishedAt), "MMM d, yyyy")
    : format(new Date(blog.createdAt), "MMM d, yyyy");
  const canonicalUrl = (blog as any).canonicalUrl || `https://stressguru.ai/blogs/${blog.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={(blog as any).metaTitle || `${blog.title} | StressGuru Blog`}
        description={(blog as any).metaDescription || blog.excerpt}
        canonicalUrl={canonicalUrl}
        keywords={[blog.category || "mental health", "stress relief", blog.authorName || "StressGuru", ...((blog as any).seoKeywords || [])]}
        ogType="article"
        ogImage={blog.image || undefined}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
          { name: blog.title, url: `/blogs/${blog.slug}` }
        ]}
        faqItems={structuredContent.faqItems}
        blogArticle={{
          url: canonicalUrl,
          headline: blog.title,
          description: (blog as any).metaDescription || blog.excerpt,
          authorName: blog.authorName || "StressGuru",
          datePublished: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : new Date(blog.createdAt).toISOString().split('T')[0],
          dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : undefined,
          image: blog.image || undefined
        }}
        customJsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: blog.title,
          description: (blog as any).metaDescription || blog.excerpt,
          citation: structuredContent.citations,
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["[data-answer='true']", "h1"],
          },
        }}
      />

      {/* FULL WIDTH HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={blog.image || "/images/sQgWLRzQAsPUBqhi.jpg"}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-6 max-w-3xl pt-40">
            <Link href="/blogs">
              <Button variant="ghost" className="mb-8 pl-0 text-white hover:bg-transparent hover:text-[#7BDDE5] transition-colors">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to articles
              </Button>
            </Link>

            <div className="flex items-center space-x-2 text-sm font-bold text-[#7BDDE5] uppercase tracking-wider mb-6">
              <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-[#7BDDE5]/30">{blog.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between border-t border-white/20 pt-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                  <img
                    src={blog.authorImage || "/images/vAUAzXpzpBlwAtwK.png"}
                    alt={blog.authorName || "Author"}
                    className={`w-full h-full object-cover ${
                      ["Spiritual Guru", "Calm Guru", "Happiness Guru"].includes(blog.authorName || "")
                        ? "object-center"
                        : "object-top"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-white drop-shadow-md">{blog.authorName}</p>
                  <p className="text-sm text-white/80 font-medium">{blog.authorRole}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6 text-white/90 text-sm font-medium">
                <span className="flex items-center drop-shadow-md"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</span>
                <span className="flex items-center drop-shadow-md"><Clock className="w-4 h-4 mr-2" /> {blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Mobile Metadata (visible only on small screens) */}
          <div className="md:hidden flex items-center justify-between text-slate-500 text-sm mb-8 pb-8 border-b border-slate-100">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {blog.readTime}</span>
          </div>

          <div
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-[#7BDDE5] prose-headings:font-extrabold prose-headings:mt-10 prose-headings:mb-4
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:text-slate-800 prose-h3:mt-8
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-4 prose-p:mt-0
              prose-a:text-[#7BDDE5] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-4 prose-li:mb-2 prose-li:text-slate-700
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-4
              prose-blockquote:border-l-4 prose-blockquote:border-[#7BDDE5] prose-blockquote:bg-sky-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              [&_.callout-box]:bg-sky-50 [&_.callout-box]:border-l-4 [&_.callout-box]:border-[#7BDDE5] [&_.callout-box]:p-6 [&_.callout-box]:my-6 [&_.callout-box]:rounded-r-lg
              [&_.callout-title]:text-[#7BDDE5] [&_.callout-title]:font-bold [&_.callout-title]:text-xl [&_.callout-title]:mb-2 [&_.callout-title]:not-italic
              [&>.lead]:text-xl [&>.lead]:text-slate-600 [&>.lead]:font-medium [&>.lead]:leading-loose [&>.lead]:mb-8
              [&_p+p]:mt-4"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Share / CTA */}
          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <SocialShareButtons
              title={blog.title}
              excerpt={blog.excerpt}
              slug={slug}
            />

            <Link href="/plans">
              <Button className="bg-[#7BDDE5] text-slate-900 hover:bg-[#6BCcD4] rounded-full px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                See plans and session options
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}
