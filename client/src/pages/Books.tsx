import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";
import PromiseSection from "@/components/PromiseSection";

export default function Books() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="StressGuru Books | Guided Workbooks for Sleep and Everyday Stress"
        canonicalUrl="https://stressguru.ai/books"
        description="Explore guided workbooks from StressGuru, with practical prompts and a clear structure for nights when work and worries keep running."
        keywords={[
          "stress relief books",
          "sleep workbook",
          "everyday stress workbook",
          "guided wellness workbook",
          "StressGuru books",
          "sleep again workbook",
          "guided sleep journal",
          "workbook for busy women",
        ]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Books", url: "/books" },
        ]}
        customJsonLd={books.map((book) => ({
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          author: {
            "@type": "Person",
            name: book.author,
          },
          publisher: {
            "@type": "Organization",
            name: "StressGuru.ai",
          },
          datePublished: "2026-01-16",
          isbn: book.isbn,
          numberOfPages: book.pages,
          bookFormat: "https://schema.org/Hardcover",
          inLanguage: book.language,
          description: book.shortDescription,
          image: book.coverImage,
          url: book.amazonUrl,
        }))}
      />

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#7BDDE5] blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[#7BDDE5] text-sm font-medium mb-8">
                <BookOpen className="w-4 h-4" />
                From the StressGuru Library
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white mb-6">
                Practical Pages for an{" "}
                <span className="font-bold text-[#7BDDE5]">Overfull Mind.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light max-w-2xl mx-auto">
                You cannot always close every loop before bed. These guided workbooks give you a place to put the day down and choose one small next step. The Gurus are AI wellness personas, and the books are general wellness resources, not medical or crisis care.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* BOOKS LISTING */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-16">
            {books.map((book, i) => (
              <ScrollReveal key={book.id} delay={i * 0.1} width="100%">
                <BookCard book={book} variant="full" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION - for the first book */}
      {books.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
                What Is Inside{" "}
                <span className="text-[#7BDDE5]">{books[0].title}</span>
              </h2>
              <p className="text-lg text-slate-500 text-center mb-12 max-w-2xl mx-auto">
                The first workbook follows a 21-day structure. Look through it, choose a day, and set aside the time it asks for.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal width="100%">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-[#7BDDE5]" />
                    Key Highlights
                  </h3>
                  <ul className="space-y-4">
                    {books[0].highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#7BDDE5]/10 text-[#7BDDE5] flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                          {i + 1}
                        </div>
                        <span className="text-slate-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal width="100%" delay={0.2}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    Who May Find This Useful?
                  </h3>
                  <ul className="space-y-4">
                    {books[0].whoIsItFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-[#7BDDE5] flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <div className="text-center mt-12">
              <a
                href={books[0].amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full px-10 py-6 text-lg bg-[#FF9900] hover:bg-[#FF9900]/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold">
                  View This Workbook on Amazon
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* MORE BOOKS COMING SOON */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-[#7BDDE5]/5 to-blue-50 rounded-3xl p-12 border border-[#7BDDE5]/20">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                More Workbooks Are Being Planned
              </h2>
              <p className="text-lg text-slate-600 mb-2 leading-relaxed">
                Work, caregiving, and an inbox can fill every spare minute. StressGuru has 8 AI wellness personas, and we are building a growing library of guided workbooks around the wellness topics they cover, including sleep and relationships.
              </p>
              <p className="text-sm text-slate-400">
                Follow us on{" "}
                <a
                  href="https://www.instagram.com/Stress.Guru.AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7BDDE5] hover:underline"
                >
                  Instagram
                </a>{" "}
                for release announcements.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}
