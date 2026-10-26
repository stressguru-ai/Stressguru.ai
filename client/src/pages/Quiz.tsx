import SEO from "@/components/SEO";
import FindYourGuruQuiz from "@/components/FindYourGuruQuiz";
import ScrollReveal from "@/components/oura/ScrollReveal";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Quiz() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Find Your AI Guru | 30-Second Wellness Quiz | StressGuru"
        canonicalUrl="https://stressguru.ai/quiz"
        description="Take this free 30-second quiz to find an AI wellness Guru for the stress, sleep, relationship, or focus pattern you want to work on."
        keywords={[
          "stress quiz",
          "AI wellness quiz",
          "wellness check-in",
          "sleep and stress quiz",
          "workload and stress quiz",
          "relationship stress quiz",
          "stress support app",
          "StressGuru AI",
        ]}
      />

      {/* Hero Section */}
      <section className="pt-40 pb-16 bg-gradient-to-b from-[#7BDDE5]/10 to-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-[#7BDDE5]/20 text-[#2A9DA6] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Free 30-Second Check-In
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Find the AI Guru for <br />
              <span className="text-[#7BDDE5]">Your Next Hard Moment.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              When your calendar follows you into dinner or tomorrow's list is still running at 3 a.m., a clear place to start can protect your time and attention. Answer a few questions to find an AI wellness Guru for the pattern you want to work on.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                <span>About 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                <span>Free to take</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7BDDE5]" />
                <span>A suggested AI Guru</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="pb-16">
        <FindYourGuruQuiz />
      </section>

      {/* Why Take the Quiz Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
              Start With What Is Taking Your Time
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                <div className="w-12 h-12 bg-[#7BDDE5]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Match the Moment
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  A packed week can look different from a restless night or a tense conversation. Use the quiz to name the area you want to address and choose an AI wellness Guru to explore.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                <div className="w-12 h-12 bg-[#7BDDE5]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Skip the Blank-Page Feeling
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  When you are tired, deciding where to begin can take more energy than you have. A Guru suggestion gives you a clearer first step without asking you to solve everything at once.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                <div className="w-12 h-12 bg-[#7BDDE5]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Keep the Choice in Your Hands
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Your answers help you focus on what matters now, whether that is sleep before a presentation, patience at dinner, or space to think between meetings.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Give the Next 30 Seconds a Job
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Take the quiz, see your AI Guru suggestion, then download StressGuru on iPhone when you are ready to begin a wellness session.
            </p>
            <a
              href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 rounded-full px-10 py-7 text-xl font-medium shadow-none transition-all hover:scale-105">
                Get StressGuru for iPhone
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
