import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Users, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";

/**
 * About Us Page - StressGuru Redesign
 *
 * Design Philosophy: Storytelling & Trust
 * Core Promise: "Make Space for a Pause Before a Full Calendar Follows You Home"
 */

export default function About() {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <SEO
        title="About StressGuru | AI Wellness Guidance for Busy Days"
        description="StressGuru is an iPhone and Apple Watch wellness app with AI wellness guidance for everyday stress. Apple Watch signals add context, not diagnoses."
        canonicalUrl="https://stressguru.ai/about"
        keywords={["about StressGuru", "iPhone wellness app", "Apple Watch wellness app", "AI wellness guidance", "everyday stress support"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" }
        ]}
      />

      {/* HERO SECTION - Standardized Layout */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/aOqDxvfiQVDAhXTK.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                Your Work Matters. <br />
                <span className="font-bold text-[#7BDDE5]">So Does Your Life Outside It.</span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                StressGuru helps you make room for a pause before a full calendar follows you home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why We Made StressGuru</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Stress can show up when you answer one more email after dinner, replay a meeting at 2 a.m., or lose patience because your mind never got a break.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  That cost is real, even when you keep performing. You deserve a moment to notice the pressure and choose what needs your attention next.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  StressGuru is an iPhone and Apple Watch wellness app with AI wellness personas for everyday guidance. Apple Watch signals can add context to a check-in. They cannot diagnose, detect, prove, or predict stress or any condition.
                </p>
              </div>
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute -inset-8 bg-gradient-to-tr from-[#7BDDE5]/30 to-orange-200/30 rounded-full blur-3xl opacity-70" />
                <div className="flex flex-col items-center gap-6 relative animate-float">
                  <img
                    src="/images/vAUAzXpzpBlwAtwK.png"
                    alt="StressGuru Logo"
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full drop-shadow-2xl bg-white p-4"
                  />
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                    StressGuru
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-4xl text-center animate-fade-up px-4">
          <h2 className="text-sm font-bold tracking-widest text-[#7BDDE5] uppercase mb-6">Our Mission</h2>
          <div className="text-2xl md:text-3xl lg:text-5xl font-light leading-tight text-slate-900">
            Help you protect your time, sleep, focus, and relationships with clear, general wellness guidance.
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">What Guides Our Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Make Space to Notice",
                desc: "A small pause can help you decide what needs your attention next."
              },
              {
                icon: Brain,
                title: "Clear Boundaries",
                desc: "Apple Watch signals offer context. They do not diagnose or predict."
              },
              {
                icon: Sparkles,
                title: "Guidance for Real Days",
                desc: "Consider AI wellness prompts around the schedule and responsibilities you already have."
              },
              {
                icon: Users,
                title: "Built for Your Devices",
                desc: "StressGuru is designed for iPhone and Apple Watch."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-10 text-center group hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="w-16 h-16 mx-auto bg-[#7BDDE5]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-[#7BDDE5]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/images/aOqDxvfiQVDAhXTK.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="container mx-auto max-w-4xl text-center relative z-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Vision</h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed mb-12 font-light">
            A full calendar should not get the final say over your sleep, focus, or closest relationships. We want more women to have practical support for the moments that shape their days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#7BDDE5] hover:bg-[#5FCcd6] text-slate-900 text-lg h-14 px-10 rounded-full font-semibold transition-all hover:scale-105 w-full sm:w-auto">
                Get StressGuru on the App Store
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}

function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  )
}
