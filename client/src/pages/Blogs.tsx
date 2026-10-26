import { Link } from "wouter";
import { ArrowRight, Clock, Calendar, Loader2, Search, X, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Blogs Page - StressGuru
 *
 * Design Philosophy: Clean, Readable, and Inspiring
 * Purpose: Share StoryBrand-style content to engage users and improve SEO.
 */

// List of all Gurus for filtering
const GURUS = [
  { value: "all", label: "All Gurus" },
  { value: "Stress Guru", label: "Stress Guru" },
  { value: "Sleep Guru", label: "Sleep Guru" },
  { value: "Anxiety Guru", label: "Anxiety Guru" },
  { value: "Motivation Guru", label: "Motivation Guru" },
  { value: "Relationship Guru", label: "Relationship Guru" },
  { value: "Happiness Guru", label: "Happiness Guru" },
  { value: "Calm Guru", label: "Calm Guru" },
  { value: "Spiritual Guru", label: "Spiritual Guru" },
];

export default function Blogs() {
  const { data: blogs, isLoading, error } = trpc.blog.listPublished.useQuery();

  // Filter and search state
  const [selectedGuru, setSelectedGuru] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on selected guru and search query
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];

    return blogs.filter((blog) => {
      // Filter by Guru
      const matchesGuru = selectedGuru === "all" || blog.authorName === selectedGuru;

      // Filter by search query (search in title, excerpt, and category)
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower ||
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        (blog.category && blog.category.toLowerCase().includes(searchLower)) ||
        (blog.authorName && blog.authorName.toLowerCase().includes(searchLower));

      return matchesGuru && matchesSearch;
    });
  }, [blogs, selectedGuru, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedGuru("all");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedGuru !== "all" || searchQuery.trim() !== "";

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <SEO
        title="StressGuru Articles | Work, Sleep, and Stress Support"
        canonicalUrl="https://stressguru.ai/blogs"
        description="Practical articles for the moments when work pressure, poor sleep, or a hard conversation takes up too much space. Find a clear next step."
        keywords={["stress support articles", "work stress", "sleep support", "relationship stress", "mental load", "wellness app"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" }
        ]}
      />

      {/* HERO SECTION WITH INTEGRATED SEARCH */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/mqKgofdmDgvek7j6pcif2I_1770146810514_na1fn_YmxvZ19saXN0aW5nX2hlcm8.png"
            alt="A group of women outdoors"
            className="w-full h-full object-cover object-center object-[50%_25%]"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                When the day follows you <br />
                <span className="font-bold text-[#7BDDE5]">into the night</span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                Read practical ideas for the full inbox, the hard conversation, and the thought loop that steals your sleep.
              </p>

              {/* COLORFUL SEARCH & FILTER IN HERO */}
              <div className="mt-8 max-w-3xl">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7BDDE5]" />
                      <Input
                        type="text"
                        placeholder="Search work, sleep, relationships..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-10 h-14 bg-slate-50 border-2 border-slate-200 focus:border-[#7BDDE5] focus:ring-[#7BDDE5]/30 rounded-xl text-lg placeholder:text-slate-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Guru Filter Dropdown */}
                    <div className="flex items-center gap-3">
                      <Select value={selectedGuru} onValueChange={setSelectedGuru}>
                        <SelectTrigger className="w-full md:w-[200px] h-14 bg-gradient-to-r from-[#7BDDE5] to-[#5BBDC5] border-0 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                          <Filter className="w-5 h-5 mr-2" />
                          <SelectValue placeholder="All Gurus" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {GURUS.map((guru) => (
                            <SelectItem key={guru.value} value={guru.value} className="py-3">
                              {guru.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Clear Filters Button */}
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={clearFilters}
                          className="h-14 w-14 rounded-xl border-2 border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all"
                          title="Clear search and filter"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-slate-600 font-medium">
                        Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
                      </span>
                      {selectedGuru !== "all" && (
                        <span className="bg-gradient-to-r from-[#7BDDE5] to-[#5BBDC5] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {selectedGuru}
                        </span>
                      )}
                      {searchQuery && (
                        <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          "{searchQuery}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOGS GRID */}
      <div className="container mx-auto max-w-7xl px-4 py-16 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
            <span className="ml-3 text-slate-600">Finding articles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">We couldn’t load the articles. Please try again in a few minutes.</p>
          </div>
        ) : filteredBlogs && filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group cursor-pointer">
                  {/* Blog Image */}
                  <div className="h-48 relative overflow-hidden">
                     <img
                      src={blog.image || "/images/sQgWLRzQAsPUBqhi.jpg"}
                      alt={blog.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-[#7BDDE5] uppercase tracking-wider mb-4">
                      <span>{blog.category}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#7BDDE5] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
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
                          <p className="text-sm font-bold text-slate-900">{blog.authorName}</p>
                          <div className="flex items-center text-xs text-slate-500 space-x-2">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {blog.publishedAt ? format(new Date(blog.publishedAt), "MMM d, yyyy") : format(new Date(blog.createdAt), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {blog.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : hasActiveFilters ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Nothing matches that search</h3>
            <p className="text-slate-500 mb-6">Try another word or Guru, or clear the filters to see every article.</p>
            <Button onClick={clearFilters} variant="outline">
              Show all articles
            </Button>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">There are no articles to show right now. Please check back soon.</p>
          </div>
        )}
      </div>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}
