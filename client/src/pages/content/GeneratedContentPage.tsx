import ContentPageTemplate from "./ContentPageTemplate";
import type { ContentPageData } from "@/data/contentPages.generated";

function titleCaseSegment(segment: string) {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function GeneratedContentPage({ page }: { page: ContentPageData }) {
  const segments = page.url.split("/").filter(Boolean);
  const breadcrumbs = [
    { name: "Home", url: "/" },
    ...segments.map((segment, index) => ({
      name: index === segments.length - 1 ? page.h1 : titleCaseSegment(segment),
      url: `/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <ContentPageTemplate
      seo={{
        title: page.seoTitle,
        description: page.seoDescription,
        canonicalUrl: `https://stressguru.ai${page.url}`,
        keywords: page.keywords,
        breadcrumbs,
      }}
      hero={{
        eyebrow: page.eyebrow,
        h1: page.h1,
        answer: page.answer,
        summary: page.summary,
      }}
      meta={{
        author: page.author,
        published: page.published,
        readingTime: page.readingTime,
      }}
      quickAction={{ title: page.quickActionTitle, steps: page.quickActionSteps }}
      sections={page.sections}
      faq={page.faq}
      sources={page.sources}
      relatedGuides={page.relatedGuides}
      primaryCta={page.primaryCta}
      guruName={page.guruName}
      guruSlug={page.guruSlug}
    />
  );
}
