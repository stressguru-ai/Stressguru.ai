import { ArrowRight, BookOpen, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { getBookById } from "@/data/books";

export default function SleepAgain() {
  const book = getBookById("sleep-again");
  if (!book) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="Sleep Again | A 21-Day Guided Sleep Workbook"
        description="A 21-day workbook with daily prompts and routines for women who want a clearer plan for evenings when their thoughts keep going."
        canonicalUrl="https://stressguru.ai/books/sleep-again"
        keywords={["Sleep Again workbook", "21 day sleep plan", "guided sleep journal", "sleep workbook for overthinkers", "reclaim your rest", "sleep better when stressed"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Books", url: "/books" },
          { name: "Sleep Again", url: "/books/sleep-again" }
        ]}
        customJsonLd={[{
          "@context": "https://schema.org",
          "@type": "Book",
          "@id": "https://stressguru.ai/books/sleep-again#book",
          name: book.title + ": " + book.subtitle,
          url: "https://stressguru.ai/books/sleep-again",
          image: book.coverImage,
          description: book.shortDescription,
          isbn: book.isbn,
          bookFormat: "https://schema.org/Hardcover",
          numberOfPages: book.pages,
          inLanguage: book.language,
          datePublished: "2026-01-16",
          author: { "@type": "Person", name: book.author },
          publisher: { "@type": "Organization", name: "StressGuru.ai" }
        }]}
      />

      {/* HERO */}
      <section className="relative pt-44 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-0" />
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-indigo-400 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[#7BDDE5] text-sm font-medium mb-6">
                  <BookOpen className="w-4 h-4" />
                  From StressGuru's AI Wellness Library
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight text-white mb-4">
                  {book.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/70 font-light mb-2">
                  {book.subtitle}
                </p>
                <p className="text-white/50 mb-8">By {book.author}</p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                  When the lights are off but the meeting, errands, and unanswered texts keep playing back, tomorrow can feel smaller before it starts. This 21-day workbook contains prompts and routines to help you make an evening plan you can try tonight.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-10 py-6 text-lg bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold shadow-lg">
                    View Sleep Again on Amazon
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.3}>
              <div className="flex justify-center">
                <img
                  src={book.coverImage}
                  alt={`${book.title} book cover`}
                  className="w-64 md:w-80 rounded-lg shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* BOOK DETAILS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal width="100%">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Will Find</h2>
                <ul className="space-y-4">
                  {book.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7BDDE5] mt-0.5 shrink-0" />
                      <span className="text-slate-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal width="100%" delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Who May Find This Useful?</h2>
                <ul className="space-y-4">
                  {book.whoIsItFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-[#7BDDE5] mt-0.5 shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* BOOK METADATA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal width="100%">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Book Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Format</p>
                <p className="font-bold text-slate-900">{book.format}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Pages</p>
                <p className="font-bold text-slate-900">{book.pages}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Published</p>
                <p className="font-bold text-slate-900">{book.publicationDate}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Language</p>
                <p className="font-bold text-slate-900">{book.language}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COUNTRY AVAILABILITY */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <ScrollReveal width="100%">
            <Globe className="w-10 h-10 text-[#7BDDE5] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Available on Amazon</h2>
            <p className="text-slate-600 mb-8">
              Sleep Again is available as a hardcover through Amazon in the United States, Canada, and the United Kingdom. Choose the store that serves your location.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold px-6 py-3">
                  Amazon.com (US)
                </Button>
              </a>
              <a href="https://www.amazon.ca/dp/B0GJBR1PHD" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full border-slate-300 px-6 py-3">
                  Amazon.ca (Canada)
                </Button>
              </a>
              <a href="https://www.amazon.co.uk/dp/B0GJBR1PHD" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full border-slate-300 px-6 py-3">
                  Amazon.co.uk (UK)
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <ScrollReveal width="100%">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Give Tonight a Small Plan</h2>
            <p className="text-lg text-slate-600 mb-8">
              A hard night can make the next morning feel less manageable. Open to Day 1 and set aside time for its prompts. Sleep Again is a general wellness workbook, not medical advice or crisis care.
            </p>
            <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-10 py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
                View Sleep Again on Amazon
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <PromiseSection />
    </div>
  );
}
