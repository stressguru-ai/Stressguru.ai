import SEO from "@/components/SEO";
import StressAssessment from "@/components/StressAssessment";
import ScrollReveal from "@/components/oura/ScrollReveal";
import { Activity, Brain, Shield } from "lucide-react";

export default function StressProfile() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="Stress Check-In | Free Wellness Reflection | StressGuru"
        canonicalUrl="https://stressguru.ai/stress-profile"
        description="Use this free two-minute check-in to reflect on stress patterns around sleep, focus, workload, and relationships, then explore a suggested AI Guru."
        keywords={[
          "stress assessment",
          "stress check-in",
          "wellness reflection",
          "sleep and stress",
          "workload stress",
          "relationship stress",
          "free wellness quiz",
          "StressGuru check-in",
        ]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Stress Check-In", url: "/stress-profile" },
        ]}
      />

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-16 md:pt-48 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#7BDDE5] blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-purple-500 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[#7BDDE5] text-sm font-medium mb-8">
                <Activity className="w-4 h-4" />
                Free 2-Minute Check-In
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white mb-6">
                Before Pressure Runs <br />
                <span className="font-bold text-[#7BDDE5]">Your Whole Week.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light max-w-2xl mx-auto mb-8">
                A full calendar can hide the strain until sleep, focus, or patience starts to slip. Use these questions to notice what is taking the most out of you and see an AI wellness Guru suggestion.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#7BDDE5]" />
                  <span>Questions from everyday moments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7BDDE5]" />
                  <span>Your answers guide the result</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#7BDDE5]" />
                  <span>Results shown on screen</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STRESS ASSESSMENT */}
      <section className="py-12 bg-[#7BDDE5]/5">
        <StressAssessment />
      </section>

      {/* WHY TAKE THIS ASSESSMENT */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">
              Protect What Pressure Can Crowd Out
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal width="100%">
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-7 h-7 text-[#7BDDE5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Name What Is Pulling at You</h3>
                <p className="text-slate-600">
                  Notice the moments that drain your attention, from a morning already behind to a work message during family time.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.2}>
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-[#7BDDE5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Choose a Starting Point</h3>
                <p className="text-slate-600">
                  Your answers suggest an AI wellness Guru to explore, so you can choose a focus that fits your life right now.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.4}>
              <div className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[#7BDDE5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Leave With One Clear Next Step</h3>
                <p className="text-slate-600">
                  See a short summary of your responses and use it to decide where you want to begin in StressGuru.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
