import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ScrollReveal from "@/components/oura/ScrollReveal";
import BookCard from "@/components/BookCard";
import { getBooksByGuru } from "@/data/books";

interface GuruBooksProps {
  guruSlug: string;
  guruName: string;
}

export default function GuruBooks({ guruSlug, guruName }: GuruBooksProps) {
  const guruBooks = getBooksByGuru(guruSlug);

  if (guruBooks.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#7BDDE5]/10 text-[#7BDDE5] px-5 py-2 rounded-full text-sm font-bold mb-4">
              <BookOpen className="w-4 h-4" />
              Published by {guruName}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Go Deeper with a{" "}
              <span className="text-[#7BDDE5]">Guided Workbook</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              The app gets you started. The book takes you further. A hands-on
              plan you can hold, write in, and follow at your own pace.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {guruBooks.map((book, i) => (
            <ScrollReveal key={book.id} delay={i * 0.1} width="100%">
              <BookCard book={book} variant="full" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center mt-10">
            <Link href="/books">
              <Button
                variant="outline"
                className="rounded-full px-8 py-5 text-base border-slate-200 hover:border-[#7BDDE5] hover:text-[#7BDDE5] transition-all"
              >
                View All Books
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
