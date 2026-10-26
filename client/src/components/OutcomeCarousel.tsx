import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Outcome {
  id: string;
  category: string;
  title: string;
  image: string;
  expandedContent: {
    title: string;
    description: string;
    testimonial?: {
      quote: string;
      author: string;
      role: string;
      image?: string;
    };
    stats?: {
      label: string;
      value: string;
      subtext?: string;
    }[];
    steps?: string[];
  };
}

interface OutcomeCarouselProps {
  outcomes: Outcome[];
}

export default function OutcomeCarousel({ outcomes }: OutcomeCarouselProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Hide swipe hint after 3 seconds or on scroll
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkScroll = () => {
    if (showSwipeHint && scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 10) {
      setShowSwipeHint(false);
    }
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // Use ceil for scrollLeft to handle sub-pixel rendering
      // Use a very tight threshold (1px) to ensure arrows stay visible until the very edge
      setCanScrollLeft(Math.ceil(scrollLeft) > 1);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [outcomes]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full py-12 relative group/carousel" ref={containerRef}>
      {/* Left Arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
            aria-label="Show previous outcomes"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right Arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
            aria-label="Show more outcomes"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Swipe Hint */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center md:hidden"
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 text-white">
              <motion.div
                animate={{ x: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Hand size={32} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar h-[650px] md:h-[600px] px-4 md:px-0"
      >
        {outcomes.map((outcome) => (
          <motion.div
            key={outcome.id}
            // layoutId={`card-${outcome.id}`} // Disabled for stability
            onClick={() => setSelectedId(outcome.id)}
            className="relative rounded-3xl overflow-hidden cursor-pointer group h-full shadow-lg min-w-[90vw] md:min-w-[400px] snap-center"
            aria-label={`Read more about ${outcome.title}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={outcome.image}
                alt={outcome.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-base font-semibold border border-white/10">
                  {outcome.category}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <Plus size={20} />
                </div>
              </div>

              <div>
                <h3 className="text-4xl md:text-4xl font-serif text-white leading-tight">
                  {outcome.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-6xl h-[90vh] md:h-[80vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-y-hidden"
            >
              {(() => {
                const outcome = outcomes.find((o) => o.id === selectedId)!;
                return (
                  <>
                    {/* Close Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(null);
                      }}
                      className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-slate-900 transition-colors"
                      aria-label="Close outcome details"
                    >
                      <X size={20} />
                    </button>

                    {/* Left Side: Image & Title */}
                    <div className="relative w-full md:w-1/2 min-h-[50vh] md:h-full shrink-0 flex flex-col justify-end">
                      <img
                        src={outcome.image}
                        alt={outcome.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                      
                        <div className="absolute top-0 left-0 p-8 md:p-12 z-10">
                          <span className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xl font-semibold border border-white/10">
                            {outcome.category}
                          </span>
                        </div>
                        <div className="relative z-10 p-8 md:p-12 w-full mt-auto">
                        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4">
                          {outcome.expandedContent.title}
                        </h2>
                        <p className="text-white/80 text-xl leading-relaxed max-w-md">
                          {outcome.expandedContent.description}
                        </p>
                        <div className="mt-8">
                          <Button 
                            className="bg-white text-slate-900 hover:bg-white/90 rounded-full px-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open("https://apps.apple.com/us/app/stressguru-ai/id6748682052", "_blank");
                            }}
                          >
                            Get StressGuru on iOS
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Details & Testimonial */}
                    <div className="w-full md:w-1/2 h-auto md:h-full bg-slate-900 p-6 md:p-12 flex flex-col justify-start md:justify-center relative z-20">
                      {outcome.expandedContent.testimonial && (
                        <div className="mb-12">
                          <div className="flex items-center gap-4 mb-6">
                            {outcome.expandedContent.testimonial.image && (
                              <img 
                                src={outcome.expandedContent.testimonial.image} 
                                alt={outcome.expandedContent.testimonial.author}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="text-white font-medium">
                                {outcome.expandedContent.testimonial.author}
                              </div>
                              <div className="text-white/50 text-base">
                                {outcome.expandedContent.testimonial.role}
                              </div>
                            </div>
                          </div>
                          <blockquote className="text-2xl md:text-4xl text-white/90 font-light italic leading-relaxed">
                            "{outcome.expandedContent.testimonial.quote}"
                          </blockquote>
                        </div>
                      )}

                      {outcome.expandedContent.stats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {outcome.expandedContent.stats.map((stat, index) => (
                            <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                              <div className="text-white/50 text-sm uppercase tracking-wider mb-2">
                                {stat.label}
                              </div>
                              <div className="text-4xl font-medium text-white mb-1">
                                {stat.value}
                              </div>
                              {stat.subtext && (
                                <div className="text-white/40 text-base">
                                  {stat.subtext}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {outcome.expandedContent.steps && (
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#7BDDE5] mb-5">
                            Try this next
                          </h3>
                          <ol className="space-y-4">
                            {outcome.expandedContent.steps.map((step, index) => (
                              <li key={step} className="flex items-start gap-4 text-white/80 text-lg leading-relaxed">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                          <p className="mt-8 text-sm leading-relaxed text-white/50">
                            StressGuru offers general wellness support. It does not diagnose conditions or replace professional care.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
