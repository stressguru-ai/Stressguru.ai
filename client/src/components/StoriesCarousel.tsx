import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, ChevronLeft, ChevronRight, HeartHandshake, Moon, Presentation } from "lucide-react";
import { Link } from "wouter";

const moments = [
  {
    label: "After a hard meeting",
    title: "The call ended. Your body did not get the message.",
    description: "Take a short pause before the next meeting. Name what happened, decide what needs action, and leave the rest out of the next room.",
    action: "Try the two-minute work reset",
    href: "/exercises/2-minute-stress-reset",
    icon: Presentation,
  },
  {
    label: "When work follows you home",
    title: "Your laptop is closed, but the list keeps running.",
    description: "Give unfinished work a place to wait. Capture the next action, choose a boundary for tonight, and protect time for the people and rest that matter.",
    action: "Learn how to switch off after work",
    href: "/stress-relief/cant-switch-off-after-work",
    icon: BriefcaseBusiness,
  },
  {
    label: "At 3 A.M.",
    title: "Tomorrow's problems feel louder in the dark.",
    description: "Use a low-stimulation reset that avoids email, clock-watching, and forced sleep. Persistent sleep problems deserve support from a qualified health professional.",
    action: "Read the 3 A.M. waking guide",
    href: "/sleep-better/waking-at-3am",
    icon: Moon,
  },
  {
    label: "When the mental load is invisible",
    title: "Doing the task is only half the work.",
    description: "Prepare a conversation about remembering, planning, and follow-up. Ask for shared ownership without turning the whole household into one impossible discussion.",
    action: "Prepare a mental-load conversation",
    href: "/relationship-stress/mental-load",
    icon: HeartHandshake,
  },
];

export default function StoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => setCurrentIndex(previous => Math.min(previous + 1, moments.length - 1));
  const previousSlide = () => setCurrentIndex(previous => Math.max(previous - 1, 0));

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentIndex(previous => previous === moments.length - 1 ? 0 : previous + 1);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#008C99] mb-4">Choose the moment you are in</p>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
            Do not let one hard hour <span className="font-bold">take the rest of the day.</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
            These are common use cases, not customer testimonials or promised outcomes. Pick the one that feels closest to today.
          </p>
        </div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-[3rem] bg-white shadow-xl border border-slate-100 relative min-h-[440px] md:min-h-[360px] flex items-center">
            <div
              className="flex transition-transform duration-700 ease-in-out w-full h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {moments.map(moment => {
                const Icon = moment.icon;
                return (
                  <div key={moment.href} className="w-full flex-shrink-0 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-[#7BDDE5]/15 flex items-center justify-center text-[#007680]">
                        <Icon className="w-10 h-10" />
                      </div>
                      <span className="text-sm font-bold tracking-widest uppercase text-slate-400 text-center">
                        {moment.label}
                      </span>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-5">
                        {moment.title}
                      </h3>
                      <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
                        {moment.description}
                      </p>
                      <Link href={moment.href} className="inline-flex items-center gap-2 font-bold text-[#007680] hover:text-[#00565d]">
                        {moment.action}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentIndex > 0 && (
              <button
                onClick={previousSlide}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#008C99] transition-all z-20"
                aria-label="Show previous use case"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {currentIndex < moments.length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#008C99] transition-all z-20"
                aria-label="Show next use case"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {moments.map((moment, index) => (
              <button
                key={moment.href}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-[#008C99] w-8" : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Show use case ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
