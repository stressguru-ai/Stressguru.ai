import { useMemo } from "react";
import { ArrowLeft, Clock, Calendar, Share2, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

// Helper function to wrap Key Takeaway and Did You Know sections in callout boxes
function processCalloutBoxes(content: string): string {
  const patterns = [
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

// Helper to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, "");
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

interface BlogPreviewProps {
  blog: {
    title: string;
    excerpt: string;
    content: string;
    image?: string | null;
    category?: string | null;
    authorName?: string | null;
    authorRole?: string | null;
    authorImage?: string | null;
    createdAt?: Date | string;
    publishedAt?: Date | string | null;
  };
  trigger?: React.ReactNode;
}

export default function BlogPreview({ blog, trigger }: BlogPreviewProps) {
  const processedContent = useMemo(() => {
    if (!blog.content) return '';
    return processCalloutBoxes(blog.content);
  }, [blog.content]);

  const readTime = useMemo(() => {
    return estimateReadTime(blog.content || '');
  }, [blog.content]);

  const formattedDate = blog.publishedAt
    ? format(new Date(blog.publishedAt), "MMM d, yyyy")
    : blog.createdAt
      ? format(new Date(blog.createdAt), "MMM d, yyyy")
      : format(new Date(), "MMM d, yyyy");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Blog Preview</DialogTitle>
        </DialogHeader>

        {/* Preview Header Bar */}
        <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-[#7BDDE5]" />
            <span className="font-semibold">Preview Mode</span>
            <span className="text-slate-400 text-sm">This is how the article will appear on the public site</span>
          </div>
        </div>

        {/* Scrollable Preview Content */}
        <div className="overflow-y-auto h-full bg-white">
          {/* FULL WIDTH HERO SECTION */}
          <div className="relative min-h-[70vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={blog.image || "/images/sQgWLRzQAsPUBqhi.jpg"}
                alt={blog.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16">
              <div className="container mx-auto px-6 max-w-4xl">
                <Button variant="ghost" className="mb-6 pl-0 text-white hover:bg-transparent hover:text-[#7BDDE5] transition-colors pointer-events-none">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blogs
                </Button>

                <div className="flex items-center space-x-2 text-sm font-bold text-[#7BDDE5] uppercase tracking-wider mb-4">
                  <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-[#7BDDE5]/30">
                    {blog.category || "Uncategorized"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                  {blog.title || "Untitled Blog Post"}
                </h1>

                <div className="flex items-center justify-between border-t border-white/20 pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
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
                      <p className="text-base font-bold text-white drop-shadow-md">{blog.authorName || "Unknown Author"}</p>
                      <p className="text-sm text-white/80 font-medium">{blog.authorRole || "Contributor"}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center space-x-6 text-white/90 text-sm font-medium">
                    <span className="flex items-center drop-shadow-md"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</span>
                    <span className="flex items-center drop-shadow-md"><Clock className="w-4 h-4 mr-2" /> {readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="py-12 md:py-16">
            <div className="container mx-auto px-6 max-w-3xl">
              {/* Mobile Metadata (visible only on small screens) */}
              <div className="md:hidden flex items-center justify-between text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {readTime}</span>
              </div>

              {blog.content ? (
                <div
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-[#7BDDE5] prose-headings:font-extrabold prose-headings:mt-16 prose-headings:mb-8
                    prose-p:text-slate-700 prose-p:leading-[2.5] prose-p:text-lg prose-p:mb-10
                    prose-a:text-[#7BDDE5] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-li:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8
                    prose-blockquote:border-l-4 prose-blockquote:border-[#7BDDE5] prose-blockquote:bg-sky-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:rounded-r-lg prose-blockquote:my-8
                    [&_.callout-box]:bg-sky-50 [&_.callout-box]:border-l-4 [&_.callout-box]:border-[#7BDDE5] [&_.callout-box]:p-6 [&_.callout-box]:my-8 [&_.callout-box]:rounded-r-lg
                    [&_.callout-title]:text-[#7BDDE5] [&_.callout-title]:font-bold [&_.callout-title]:text-xl [&_.callout-title]:mb-2 [&_.callout-title]:not-italic
                    [&_.blog-callout-wrapper]:bg-sky-50 [&_.blog-callout-wrapper]:border-l-4 [&_.blog-callout-wrapper]:border-[#7BDDE5] [&_.blog-callout-wrapper]:p-6 [&_.blog-callout-wrapper]:my-8 [&_.blog-callout-wrapper]:rounded-r-lg
                    [&_.blog-callout-wrapper_h3]:text-[#7BDDE5] [&_.blog-callout-wrapper_h3]:font-bold [&_.blog-callout-wrapper_h3]:text-xl [&_.blog-callout-wrapper_h3]:mb-2 [&_.blog-callout-wrapper_h3]:mt-0
                    [&_.blog-callout-wrapper_p]:mb-0
                    [&>.lead]:text-xl [&>.lead]:text-slate-600 [&>.lead]:font-medium [&>.lead]:leading-loose [&>.lead]:mb-12"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-lg">No content to preview yet.</p>
                  <p className="text-sm mt-2">Start writing in the editor to see your blog here.</p>
                </div>
              )}

              {/* Share / CTA */}
              <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-slate-900">Share this article:</span>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-slate-50 hover:text-[#7BDDE5] border-slate-200 pointer-events-none">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button className="bg-[#7BDDE5] text-slate-900 hover:bg-[#6BCcD4] rounded-full px-8 py-6 text-lg font-bold shadow-lg pointer-events-none">
                  Try a Wellness Check-In with {blog.authorName || "StressGuru"}
                </Button>
              </div>
            </div>
          </article>

          {/* Footer placeholder */}
          <div className="bg-slate-100 py-8 text-center text-slate-500 text-sm">
            <p>Preview ends here. The actual page will include the full site footer.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
