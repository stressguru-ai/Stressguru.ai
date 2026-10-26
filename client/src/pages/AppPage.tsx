import { ArrowRight, Shield, Clock, Heart, Smartphone, Watch, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { Link } from "wouter";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="StressGuru App: Stop Stress Now, Prevent the Next Repeat"
        description="Use an AI wellness Guru to stop work pressure from taking the next hour, then plan how to prevent the same stress pattern from repeating."
        canonicalUrl="https://stressguru.ai/app"
        keywords={["StressGuru app", "stress relief app iPhone", "Apple Watch wellness app", "AI wellness Guru app", "burnout prevention app", "anxiety support app iOS"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "App", url: "/app" }
        ]}
        includeSoftwareApp={true}
      />

      {/* HERO */}
      <section className="relative pt-44 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#7BDDE5] blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-blue-500 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white mb-6">
                Stop Today&apos;s Spillover.{" "}
                <span className="font-bold text-[#7BDDE5]">Protect Tomorrow.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl mb-8">
                When the meeting runs long, the group chat lights up, and sleep is already on your mind, choose an AI wellness Guru to stop the pressure from taking the next hour. Then name one change that may prevent the same pattern tomorrow.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-10 py-6 text-lg bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg">
                    Download Free on iOS
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <Link href="/plans">
                  <Button variant="outline" className="rounded-full px-10 py-6 text-lg border-white/30 text-white hover:bg-white/10">
                    See Plans
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHAT IS STRESSGURU */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal width="100%">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">A Wellness App for the Moment You Need It</h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                StressGuru is an AI wellness app for iPhone and Apple Watch. Choose from eight AI wellness personas with different focuses: stress, sleep, anxiety, motivation, relationships, happiness, calm, and spiritual wellness. Pick the Guru that fits the moment, start a session, and leave with practical ideas you can use. StressGuru is not therapy, medical care, or crisis care.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Smartphone, title: "iPhone App", desc: "Choose any of the eight AI Gurus when you want a moment to think through what is next." },
              { icon: Watch, title: "Apple Watch", desc: "See available heart rate variability context and receive notifications. Watch signals offer context only. They do not diagnose or prove stress." },
              { icon: Heart, title: "Guru Memory", desc: "Eligible plans can keep your notes and past session context, so you can return to a topic without retelling every detail." },
              { icon: Shield, title: "Your Information", desc: "Read the privacy policy to understand how StressGuru handles your conversations, health data, and personal information." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} width="100%">
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                  <item.icon className="w-8 h-8 text-[#7BDDE5] mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE 8 GURUS */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal width="100%">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">Eight AI Gurus, One Place to Start</h2>
            <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              Choose the AI wellness persona that fits the pressure you are carrying right now.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Stress Guru", focus: "When the day feels too full" },
              { name: "Sleep Guru", focus: "When a busy mind follows you to bed" },
              { name: "Anxiety Guru", focus: "When worry is taking up the room" },
              { name: "Motivation Guru", focus: "When you need a next step" },
              { name: "Relationship Guru", focus: "When a conversation matters" },
              { name: "Happiness Guru", focus: "When you want room for more good moments" },
              { name: "Calm Guru", focus: "When noise and demands pile up" },
              { name: "Spiritual Guru", focus: "When you want time for meaning and reflection" },
            ].map((guru, i) => (
              <ScrollReveal key={i} delay={i * 0.05} width="100%">
                <div className="bg-white rounded-xl p-5 text-center border border-slate-100 hover:border-[#7BDDE5]/50 transition-colors">
                  <h3 className="font-bold text-slate-900 mb-1">{guru.name}</h3>
                  <p className="text-sm text-slate-500">{guru.focus}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gurus">
              <Button variant="outline" className="rounded-full px-8 py-4 border-slate-300">
                Meet All 8 Gurus
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal width="100%">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Compatibility</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <ScrollReveal width="100%">
              <div className="p-6">
                <Smartphone className="w-10 h-10 text-[#7BDDE5] mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">iPhone</h3>
                <p className="text-slate-600 text-sm">Requires iOS 17.0 or later</p>
              </div>
            </ScrollReveal>
            <ScrollReveal width="100%" delay={0.1}>
              <div className="p-6">
                <Watch className="w-10 h-10 text-[#7BDDE5] mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Apple Watch</h3>
                <p className="text-slate-600 text-sm">Optional. Adds heart rate variability context and wrist notifications.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal width="100%" delay={0.2}>
              <div className="p-6">
                <Download className="w-10 h-10 text-[#7BDDE5] mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Free Download</h3>
                <p className="text-slate-600 text-sm">Start with Relief, the free plan, then compare paid plans when you want more sessions.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PRICING SUMMARY */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <ScrollReveal width="100%">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose the Session Pace That Fits Your Month</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Begin with free Relief. Reset includes two sessions a month, Balance includes five, and Thrive includes 20. Annual plans include two months free.
            </p>
            <Link href="/plans">
              <Button className="rounded-full px-10 py-6 text-lg bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg">
                Compare Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal width="100%">
            <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center text-white">
              <Shield className="w-12 h-12 text-[#7BDDE5] mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Know How Your Information Is Handled</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                Your conversations, health data, and personal information deserve care. Review StressGuru’s privacy policy for details about encryption, data sharing, and how information is used to improve your experience.
              </p>
              <Link href="/privacy-policy">
                <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                  Read Our Privacy Policy
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <ScrollReveal width="100%">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Stop the Spillover. Plan for Tomorrow.</h2>
            <p className="text-lg text-slate-600 mb-8">
              Download StressGuru on iOS, choose an AI Guru, and start with the pressure that is asking for your attention.
            </p>
            <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-10 py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
                Download Free on iOS
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <PromiseSection />
    </div>
  );
}
