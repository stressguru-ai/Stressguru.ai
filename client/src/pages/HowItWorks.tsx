import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Activity, Brain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";

/**
 * How It Works Page - StressGuru Redesign
 * 
 * Design Philosophy: Modern, Educational, Visual
 * Core Promise: "Prevent Stress Before It Steals Your Sleep, Focus, and Relationships"
 */

export default function HowItWorks() {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <SEO 
        title="How StressGuru Helps You Stop and Prevent Stress Patterns"
        description="See how StressGuru helps you notice pressure, stop it from taking the next hour, and plan how to prevent the same pattern from repeating."
        canonicalUrl="https://stressguru.ai/how-it-works"
        keywords={["how StressGuru works", "Apple Watch wellness app", "AI wellness Guru", "personalized wellness plan", "stress support steps", "burnout prevention steps"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "How It Works", url: "/how-it-works" }
        ]}
        howToSteps={[
          { name: "Notice", text: "Open the app when pressure builds, or view available Apple Watch signals as context for your check-in. Watch signals do not diagnose or prove stress." },
          { name: "Stop", text: "Pick the AI wellness Guru that fits the moment and use the session to stop the pressure from taking the next hour." },
          { name: "Prevent", text: "Use check-ins and session notes to identify what could help prevent the same pressure pattern from repeating." }
        ]}
      />
      
      {/* HERO SECTION - Standardized Layout */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/InSQSMQCIrtdZOJP.jpg"
            alt="Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                Stop the Spillover. <br />
                <span className="font-bold text-[#7BDDE5]">Prevent the Next Repeat.</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                When work follows you into dinner or a hard conversation is waiting, StressGuru gives you a place to pause, choose an AI wellness Guru, and decide what to do next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Preview - Choose Your Path */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-6">
              Choose the Setup That <span className="font-bold">Fits Your Day.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Use StressGuru with your iPhone. Add an Apple Watch if you want its available signals as extra context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Path 1: With Watch */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-fade-up">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-white">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I have an Apple Watch</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Adds available Watch signals to your check-in.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Shows heart rate variability context, never a diagnosis.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Brings sleep data context into view when available.</span>
                </li>
              </ul>
            </div>

            {/* Path 2: No Watch */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-[#7BDDE5] rounded-2xl flex items-center justify-center mb-6 text-slate-900">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I don't have a Watch</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Open a session when a tense moment shows up.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Use practical wellness prompts at your own pace.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                  <span>Notice patterns through your own check-ins.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Early Detection - Minimalist Layout */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 animate-fade-up bg-slate-50 rounded-[3rem] p-12 lg:p-20 flex items-center justify-center min-h-[500px]">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[#7BDDE5]/10 rounded-full blur-3xl" />
                <Activity className="w-48 h-48 text-[#7BDDE5] relative z-10" strokeWidth={1} />
                
                {/* Minimalist Data Cards */}
                <div className="absolute top-0 right-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-float">
                  <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">HRV Context</div>
                  <div className="text-2xl font-medium text-slate-900">Available</div>
                </div>
                <div className="absolute bottom-0 left-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-float" style={{ animationDelay: "1.5s" }}>
                  <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Check-In</div>
                  <div className="text-2xl font-medium text-[#B62427]">Your Note</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8 animate-fade-up pl-0 lg:pl-10">
              <div className="text-sm font-bold tracking-[0.2em] text-[#7BDDE5] uppercase">Step 01</div>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                Notice the <span className="font-bold">Moment.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-light">
                If your Apple Watch is connected, StressGuru can show available heart rate and heart rate variability context. Those signals do not detect, diagnose, or prove stress. Without a Watch, open the app when you notice tension building and check in on your own terms.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                {/* Column 1: With Smart Watch */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">With Apple Watch</h3>
                  <div className="space-y-3">
                    {[
                      "Heart Rate Context",
                      "Sleep Data Context"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#7BDDE5]/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7BDDE5]" />
                        </div>
                        <span className="text-base text-slate-700 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Manual Check-in */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Manual Check-in</h3>
                  <div className="space-y-3">
                    {[
                      "One-Tap Check-In",
                      "A Pause When Tension Rises"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#7BDDE5]/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7BDDE5]" />
                        </div>
                        <span className="text-base text-slate-700 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Intervention - Minimalist Layout */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-fade-up pr-0 lg:pr-10">
              <div className="text-sm font-bold tracking-[0.2em] text-[#7BDDE5] uppercase">Step 02</div>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                Choose an AI <span className="font-bold">Guru.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-light">
                Start a session before the next call, school pickup, or difficult conversation. Use a short practice to stop the pressure from taking the next hour. On eligible plans, Guru Memory can keep your notes and past session context, so you can return to a topic without repeating every detail.
              </p>

              <div className="pt-6">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Eight AI Wellness Gurus</div>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Stress", "Sleep", "Anxiety", 
                    "Motivation", "Relationship", "Happiness",
                    "Calm", "Spiritual"
                  ].map((guru, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">
                      {guru} Guru
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-fade-up bg-white rounded-[3rem] p-12 lg:p-20 flex items-center justify-center min-h-[500px] shadow-sm border border-slate-100">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[#7BDDE5]/5 rounded-full blur-3xl" />
                <ShieldCheck className="w-48 h-48 text-[#7BDDE5] relative z-10" strokeWidth={1} />
                
                {/* Chat Bubble UI */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs space-y-4">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm animate-fade-up">
                    <p className="text-sm text-slate-600">What is making this moment feel hard?</p>
                  </div>
                  <div className="bg-[#7BDDE5] p-4 rounded-2xl rounded-tr-none shadow-sm ml-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
                    <p className="text-sm text-slate-900 font-medium">Yes, I have a big presentation in 10 minutes.</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm animate-fade-up" style={{ animationDelay: "1s" }}>
                    <p className="text-sm text-slate-600">Try two minutes of box breathing before you open your slides.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Prevention - Minimalist Layout */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 animate-fade-up bg-slate-50 rounded-[3rem] p-12 lg:p-20 flex items-center justify-center min-h-[500px]">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-[#7BDDE5]/10 rounded-full blur-3xl" />
                <Brain className="w-48 h-48 text-[#7BDDE5] relative z-10" strokeWidth={1} />
                
                {/* Insight Card */}
                <div className="absolute bottom-10 left-10 right-10 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-float">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Weekly Notes</div>
                      <div className="text-xs text-slate-500">Notice what helped this week</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-[#7BDDE5] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8 animate-fade-up pl-0 lg:pl-10">
              <div className="text-sm font-bold tracking-[0.2em] text-[#7BDDE5] uppercase">Step 03</div>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                Build a <span className="font-bold">Useful Practice.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-light">
                Return for check-ins and session notes when you want to see what keeps pulling at your attention. Over time, you can keep the small practices that help you protect focus at work, rest at night, and connection at home.
              </p>
              
              <div className="pt-6">
                <Link href="/plans">
                  <Button size="lg" className="bg-[#7BDDE5] hover:bg-[#5FCcd6] text-slate-900 rounded-full px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Compare Plans and Pricing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}
