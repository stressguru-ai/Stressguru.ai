import { ArrowRight, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/data/books";

interface BookCardProps {
  book: Book;
  variant?: "full" | "compact";
}

export default function BookCard({ book, variant = "full" }: BookCardProps) {
  if (variant === "compact") {
    return (
      <a
        href={book.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1">
          <div className="flex gap-6 p-6">
            <div className="w-28 flex-shrink-0">
              <img
                src={book.coverImage}
                alt={`${book.title} book cover`}
                className="w-full rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
              />
            </div>
            <div className="flex flex-col justify-between min-w-0">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-[#7BDDE5] mb-1">
                  By {book.guruName}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#7BDDE5] transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500 mb-2">{book.subtitle}</p>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {book.shortDescription}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {book.format}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {book.pages} pages
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Book Cover Side */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#7BDDE5] blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500 blur-3xl" />
          </div>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
          >
            <img
              src={book.coverImage}
              alt={`${book.title} book cover`}
              className="w-56 md:w-64 rounded-lg shadow-2xl group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold bg-black/50 px-4 py-2 rounded-full text-sm">
                View on Amazon
              </span>
            </div>
          </a>
        </div>

        {/* Book Details Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#7BDDE5]/10 text-[#7BDDE5] px-4 py-1.5 rounded-full text-sm font-bold mb-4 w-fit">
            <BookOpen className="w-4 h-4" />
            By {book.guruName}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {book.title}
          </h3>
          <p className="text-lg text-slate-500 mb-4">{book.subtitle}</p>

          <p className="text-slate-600 leading-relaxed mb-6">
            {book.shortDescription}
          </p>

          {/* Book Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Format
              </p>
              <p className="font-semibold text-slate-800">{book.format}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Pages
              </p>
              <p className="font-semibold text-slate-800">{book.pages}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Published
              </p>
              <p className="font-semibold text-slate-800">
                {book.publicationDate}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Language
              </p>
              <p className="font-semibold text-slate-800">{book.language}</p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full rounded-full px-8 py-6 text-lg bg-[#FF9900] hover:bg-[#FF9900]/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold">
              Buy on Amazon
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
          <p className="text-xs text-center text-slate-400 mt-3">
            Available on Amazon.com, Amazon.ca & Amazon.co.uk
          </p>
        </div>
      </div>
    </div>
  );
}
