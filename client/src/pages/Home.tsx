import { Link } from "wouter";
import { ArrowRight, CheckCircle2, PlayCircle, Activity, Moon, AlertTriangle, ShieldCheck, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import FindYourGuruQuiz from "@/components/FindYourGuruQuiz";
import { Button } from "@/components/ui/button";
import PromiseSection from "@/components/PromiseSection";
import StoriesCarousel from "@/components/StoriesCarousel";
import ScrollReveal from "@/components/oura/ScrollReveal";
import OutcomeCarousel from "@/components/OutcomeCarousel";
import { homeOutcomes } from "@/data/outcomes";
import TrustSignals from "@/components/TrustSignals";
import { books } from "@/data/books";


export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 font-sans selection:bg-primary/20 bg-white">
      <SEO 
        title="Stop Stress Today. Prevent the Same Pattern Tomorrow | StressGuru"
        description="Stop everyday stress from taking the rest of your day. StressGuru helps professional women pause now and plan how to prevent the same pressure from repeating."
        canonicalUrl="https://stressguru.ai/"
        keywords={["stress relief app", "wellness app iPhone", "Apple Watch wellness app", "sleep routine app", "stress management", "AI wellness Guru app", "work stress support", "StressGuru"]}
        includeOrganization={true}
        includeSoftwareApp={true}
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />
      {/* HERO SECTION - Oura Style: Clean, Bold, Immersive */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/sQgWLRzQAsPUBqhi.jpg"
            alt=""
            className="w-full h-full object-cover object-[75%] md:object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                  Stop Stress <br />
                  <span className="font-bold text-[#7BDDE5]">Today.</span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                  Prevent burnout before it steals your sleep, focus and relationships.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-8">
                  <a
                    href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto rounded-full px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform bg-white text-slate-900 hover:bg-slate-100 border-none">
                      Download StressGuru on iOS
                      <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </a>
                  <Link href="/how-it-works" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50"
                    >
                      <PlayCircle className="mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                      See how it works
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                  <div className="flex flex-wrap gap-8 pt-8 text-base font-medium text-white/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7BDDE5]" />
                    <span>Free Relief plan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7BDDE5]" />
                    <span>8 AI wellness Gurus</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS BAR */}
      <TrustSignals />

      {/* STRESS ASSESSMENT TEASER */}
      <section className="bg-[#7BDDE5]/10 py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal width="100%">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                See what is adding to your mental load
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Take the free two-minute assessment. See the patterns you want to work on, then choose an AI Guru that fits the moment.
              </p>
              <div className="flex justify-center">
                <Link href="/stress-profile">
                  <Button className="rounded-full px-10 py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold">
                    Take the free assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FIND YOUR GURU QUIZ */}
      <section className="bg-white">
        <FindYourGuruQuiz />
      </section>

      {/* OUTCOMES CAROUSEL - Oura Style */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
              Make room for what matters to you
            </h2>
            <p className="text-xl text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Explore everyday moments where a short wellness session can help you pause, sort through the pressure, and pick a next step.
            </p>
          </ScrollReveal>
          <OutcomeCarousel outcomes={homeOutcomes} />
        </div>
      </section>

      {/* EVIDENCE CONTEXT */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal width="100%">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="text-center px-6 py-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Workload is not a personal flaw</h3>
                <p className="text-lg text-slate-600">The CDC notes that workload, control, support, and work design can affect worker well-being. A personal reset cannot repair an unsafe system.</p>
                <a className="inline-block mt-4 text-sm font-bold text-[#007680] underline underline-offset-4" href="https://www.cdc.gov/niosh/healthcare/risk-factors/stress-burnout.html" target="_blank" rel="noopener noreferrer">Read the CDC guidance</a>
              </div>
              <div className="text-center px-6 py-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Sleep problems deserve attention</h3>
                <p className="text-lg text-slate-600">A wind-down practice may help you create a calmer evening. Persistent insomnia or daytime impairment deserves support from a qualified health professional.</p>
                <a className="inline-block mt-4 text-sm font-bold text-[#007680] underline underline-offset-4" href="https://womenshealth.gov/a-z-topics/insomnia" target="_blank" rel="noopener noreferrer">Read the U.S. women's health guidance</a>
              </div>
              <div className="text-center px-6 py-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Support should match the need</h3>
                <p className="text-lg text-slate-600">StressGuru offers general wellness support. Severe, persistent, or worsening symptoms call for a licensed professional, not a stronger app routine.</p>
                <Link href="/science-and-safety" className="inline-block mt-4 text-sm font-bold text-[#007680] underline underline-offset-4">Review our care boundaries</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CYCLE SECTION - Visual Storytelling */}
      <section className="py-32 container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">When pressure starts setting the pace</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-2xl text-slate-600 font-light">
              A packed day can leave less room for rest, good work, and the people you care about. Notice the moment, then choose your next move.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Without StressGuru */}
          <ScrollReveal width="100%">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl h-full relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <AlertTriangle className="w-64 h-64 text-red-500" />
              </div>
              
              <h3 className="text-3xl font-bold text-red-600 mb-12 flex items-center gap-4">
                <AlertTriangle className="w-8 h-8" />
                When the pressure keeps building
              </h3>

              <div className="flex-1 flex flex-col justify-between gap-8 relative z-10">
                {[
                  { stage: 1, text: "The workday ends, but your mind stays on." },
                  { stage: 2, text: "A late-night thought loop cuts into your rest." },
                  { stage: 3, text: "You reread the same message to find your focus." },
                  { stage: 4, text: "A small request gets a sharper answer than you intended." },
                  { stage: 5, text: "You finish the list with little left for yourself." }
                ].map((item) => (
                  <div key={item.stage} className="flex items-start gap-6 group/item min-h-[4rem]">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg shrink-0 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300 mt-1">
                      {item.stage}
                    </div>
                    <p className="text-xl text-slate-600 font-medium pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* With StressGuru */}
          <ScrollReveal width="100%" delay={0.2}>
            <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl h-full relative overflow-hidden group text-white flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <ShieldCheck className="w-64 h-64 text-primary" />
              </div>

              <h3 className="text-3xl font-bold text-primary mb-12 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8" />
                With a clear next step
              </h3>

              <div className="flex-1 flex flex-col justify-between gap-8 relative z-10">
                {[
                  { stage: 1, text: "You notice a hard moment and take a pause." },
                  { stage: 2, text: "You choose a wind-down step before bed." },
                  { stage: 3, text: "You return to the next task with a clearer plan." },
                  { stage: 4, text: "You enter a conversation with more room to listen." },
                  { stage: 5, text: "You protect a small part of your day for yourself." }
                ].map((item) => (
                  <div key={item.stage} className="flex items-start gap-6 group/item min-h-[4rem]">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300 mt-1">
                      {item.stage}
                    </div>
                    <p className="text-xl text-slate-300 font-medium pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STORIES OF CHANGE CAROUSEL */}
      <StoriesCarousel />

      {/* HOW IT WORKS PREVIEW - Minimalist & Clean */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-slate-900 tracking-tight">
                Stop the spillover now. <br/>
                <span className="font-bold">Prevent the next repeat.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                StressGuru gives you a simple way to pause after a hard moment, before bed, or whenever your mind feels crowded.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            {[
              {
                step: "01",
                title: "Notice the pattern",
                desc: "Connect your Apple Watch if you use one. Its signals offer context that may prompt a check-in, but they do not diagnose, detect, prove, or predict stress or any condition. You can also open the app whenever you want a pause.",
                icon: Activity
              },
              {
                step: "02",
                title: "Stop the spillover",
                desc: "Start a session from the app or an Apple Watch notification. Choose from eight AI wellness personas and use one short practice to create room for a clearer next action. Gurus are AI, not therapists or crisis support.",
                icon: ShieldCheck
              },
              {
                step: "03",
                title: "Prevent the next repeat",
                desc: "Name the trigger, workload, boundary, or routine that keeps repeating. Choose one change to test before the same pressure takes over another evening. You stay in control of what you share and what you do.",
                icon: Moon
              }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.2} width="100%">
                <div className="group">
                  <div className="mb-8 relative">
                    <div className="w-16 h-16 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center text-[#7BDDE5] mb-6 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">Step {item.step}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BOOK STRIP */}
      {books.length > 0 && (() => {
        const featuredBook = books[0];
        return (
          <section className="py-20 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
              <ScrollReveal width="100%">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  {/* Book cover */}
                  <div className="flex-shrink-0 relative">
                    <div className="absolute -inset-4 bg-[#7BDDE5]/10 rounded-3xl blur-2xl" />
                    <img
                      src={featuredBook.coverImage}
                      alt={`${featuredBook.title} book cover`}
                      className="relative w-48 md:w-56 lg:w-64 rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-[#7BDDE5]/10 text-[#7BDDE5] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                      <BookOpen className="w-3.5 h-3.5" />
                      From the Sleep Guru
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                      {featuredBook.title}
                    </h2>
                    <p className="text-lg text-[#7BDDE5] font-medium mb-6">
                      {featuredBook.subtitle}
                    </p>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                      {featuredBook.shortDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <a
                        href={featuredBook.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#7BDDE5] text-slate-900 font-bold rounded-full hover:bg-[#6ACCD4] transition-all hover:scale-105 shadow-lg shadow-[#7BDDE5]/20"
                      >
                        View on Amazon
                        <ArrowRight className="w-5 h-5" />
                      </a>
                      <Link href="/books">
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20">
                          <BookOpen className="w-5 h-5" />
                          View book details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        );
      })()}

      {/* PROMISE SECTION */}
      <PromiseSection />

    </div>
  );
}
