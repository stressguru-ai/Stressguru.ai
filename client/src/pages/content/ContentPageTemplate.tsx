import { ArrowRight, Clock, Calendar, User, BookOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { Link } from "wouter";

export interface ContentPageProps {
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: readonly string[];
    breadcrumbs: readonly { name: string; url: string }[];
  };
  hero: {
    eyebrow: string;
    h1: string;
    answer?: string;
    summary: string;
  };
  meta: {
    author: string;
    published: string;
    readingTime: string;
  };
  quickAction?: {
    title: string;
    steps: readonly string[];
  };
  sections: readonly {
    heading: string;
    content: string;
  }[];
  faq?: readonly { question: string; answer: string }[];
  sources?: readonly { publisher: string; title: string; url: string }[];
  relatedGuides?: readonly { title: string; href: string }[];
  primaryCta: "app" | "book" | "both";
  guruName?: string;
  guruSlug?: string;
}

export default function ContentPageTemplate({
  seo,
  hero,
  meta,
  quickAction,
  sections,
  faq,
  sources,
  relatedGuides,
  primaryCta,
  guruName,
  guruSlug,
}: ContentPageProps) {
  const heroBackgrounds: Record<string, string> = {
    stress: "/images/VcxLCAagBZORQRuf.jpg",
    sleep: "/images/sAlmVdkOmkUzIASt.jpg",
    anxiety: "/images/cbBkKzHOhCgwDsEl.jpg",
    motivation: "/images/UpkHzaTosKNvBsyv.jpg",
    relationship: "/images/xzxYBEiYFEVfANIo.jpg",
    happiness: "/images/zZcPWlwWYxNGpiqJ.jpg",
    calm: "/images/UOZELxgaoZBIBJSe.jpg",
    spiritual: "/images/oyHVHoAzUuRseQEe.jpg",
  };
  const heroBackground = heroBackgrounds[guruSlug ?? "stress"] ?? heroBackgrounds.stress;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${seo.canonicalUrl}#webpage`,
    url: seo.canonicalUrl,
    name: seo.title,
    description: seo.description,
    dateModified: "2026-09-19",
    reviewedBy: {
      "@type": "Organization",
      name: "StressGuru Editorial Team",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-answer-first='true']", "[data-faq-answer='true']"],
    },
    citation: sources?.map(source => source.url) ?? [],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalUrl={seo.canonicalUrl}
        keywords={[...seo.keywords]}
        breadcrumbs={[...seo.breadcrumbs]}
        faqItems={faq ? [...faq] : undefined}
        customJsonLd={pageSchema}
      />

      <section className="relative pt-44 pb-12 md:pt-48 md:pb-16 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroBackground} alt="" className="h-full w-full object-cover object-[72%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/35" />
        </div>
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="max-w-3xl">
          <ScrollReveal width="100%">
            <p className="text-sm font-medium text-[#008C99] uppercase tracking-wider mb-4">{hero.eyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{hero.h1}</h1>
            {hero.answer && (
              <div className="mb-6 rounded-2xl border border-[#7BDDE5]/40 bg-white p-6 shadow-sm" data-answer-first="true">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#008C99] mb-3">
                  <Quote className="h-4 w-4" />
                  Direct answer
                </div>
                <p className="text-lg font-medium leading-relaxed text-slate-800">{hero.answer}</p>
              </div>
            )}
            <p className="text-lg text-slate-600 leading-relaxed">{hero.summary}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} width="100%">
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {meta.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {meta.published}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {meta.readingTime}</span>
            </div>
          </ScrollReveal>
          </div>
        </div>
      </section>

      {quickAction && (
        <section className="py-10 bg-[#7BDDE5]/5 border-y border-[#7BDDE5]/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal width="100%">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{quickAction.title}</h2>
              <ol className="space-y-3">
                {quickAction.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7BDDE5]/20 text-[#006D76] flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          {sections.map((section, i) => (
            <ScrollReveal key={section.heading} width="100%">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-14 bg-slate-900 text-white" aria-labelledby="stop-prevent-heading">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal width="100%">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7BDDE5] mb-3">Stop first. Prevent next.</p>
              <h2 id="stop-prevent-heading" className="text-3xl md:text-4xl font-bold">Make room now, then protect tomorrow</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-7">
                <h3 className="text-2xl font-bold text-[#7BDDE5] mb-3">1. Stop the pressure from spreading</h3>
                <p className="text-slate-200 leading-relaxed">Use the short practice on this page to interrupt the next few minutes. The goal is not perfect calm. It is enough space to choose one safer, clearer action.</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-7">
                <h3 className="text-2xl font-bold text-[#7BDDE5] mb-3">2. Prevent the same pattern from taking over again</h3>
                <p className="text-slate-200 leading-relaxed">Notice the trigger, workload, boundary, or routine that keeps repeating. Choose one change you can test, and involve a qualified person when the problem needs more than a wellness tool.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {guruName && guruSlug && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <ScrollReveal width="100%">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Use {guruName} for a Short Wellness Check-In</h2>
              <p className="text-lg text-slate-600 mb-6">
                {guruName} is an AI wellness persona inside StressGuru. It can guide a brief reflection or practice based on what you choose to share. It does not diagnose conditions or replace professional care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-8 py-5 text-base bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg">
                    Download StressGuru Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href={`/gurus/${guruSlug}`}>
                  <Button variant="outline" className="rounded-full px-8 py-5 text-base border-slate-300">
                    See How {guruName} Works
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {!guruName && primaryCta !== "book" && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <ScrollReveal width="100%">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Take One Small Step Before Stress Takes the Evening</h2>
              <p className="text-lg text-slate-600 mb-6">
                Open StressGuru for a short, private wellness check-in. Choose the AI Guru that fits the moment, then try one practical next step.
              </p>
              <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full px-8 py-5 text-base bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg">
                  Download StressGuru Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}

      {(primaryCta === "book" || primaryCta === "both") && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <ScrollReveal width="100%">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Give Tonight a Clearer Ending</h2>
              <p className="text-lg text-slate-600 mb-6">
                The Sleep Again workbook offers 21 days of prompts for racing thoughts, evening routines, and more intentional rest. It is a wellness workbook, not medical treatment.
              </p>
              <a href="https://www.amazon.com/dp/B0GJBR1PHD" target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full px-8 py-5 text-base bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold shadow-lg">
                  See Sleep Again on Amazon
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}

      {faq && faq.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal width="100%">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Questions People Ask</h2>
              <div className="space-y-6">
                {faq.map(item => (
                  <div key={item.question} className="bg-white rounded-xl p-6 border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">{item.question}</h3>
                    <p className="text-slate-600" data-faq-answer="true">{item.answer}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {sources && sources.length > 0 && (
        <section className="py-12 bg-white" aria-labelledby="sources-heading">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal width="100%">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="h-5 w-5 text-[#008C99]" />
                <h2 id="sources-heading" className="text-2xl font-bold text-slate-900">Sources</h2>
              </div>
              <ul className="space-y-3 text-slate-600">
                {sources.map(source => (
                  <li key={source.url}>
                    <span className="font-semibold text-slate-800">{source.publisher}:</span>{" "}
                    <a className="text-[#007680] underline underline-offset-4 hover:text-[#00565d]" href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>
      )}

      {relatedGuides && relatedGuides.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal width="100%">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Next Guide</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedGuides.map(guide => (
                  <Link key={guide.href} href={guide.href}>
                    <div className="bg-white rounded-xl p-5 border border-slate-100 hover:border-[#7BDDE5]/70 transition-colors cursor-pointer h-full">
                      <span className="font-medium text-slate-900">{guide.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#008C99] mt-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <PromiseSection />
    </div>
  );
}
