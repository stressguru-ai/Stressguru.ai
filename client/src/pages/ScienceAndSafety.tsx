import { Shield, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import PromiseSection from "@/components/PromiseSection";
import { Link } from "wouter";

export default function ScienceAndSafety() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO
        title="StressGuru Science, Safety, and Responsible AI"
        description="Learn how StressGuru approaches wellness methods, AI limits, Apple Watch context, safety, privacy, and evidence-based claims."
        canonicalUrl="https://stressguru.ai/science-and-safety"
        keywords={["StressGuru safety", "responsible AI wellness", "StressGuru science", "AI wellness limitations", "crisis support policy"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Science and Safety", url: "/science-and-safety" }
        ]}
      />

      <section className="relative pt-44 pb-16 md:pt-48 md:pb-20 overflow-hidden bg-slate-900">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Science, Safety, and Responsible AI</h1>
            <p className="text-xl text-white/70 leading-relaxed">
              When sleep is short and work, caregiving, or a hard conversation needs your attention, you deserve clear limits from a wellness app. See how StressGuru approaches methods, AI, safety, and your data.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-3xl prose prose-slate prose-lg">
          <ScrollReveal width="100%">
            <h2>How We Choose Wellness Methods</h2>
            <p>
              A busy mind at 10 p.m. may call for a practical exercise, not a big promise. StressGuru's Gurus use prompts and exercises drawn from recognized wellness approaches, including cognitive behavioral techniques, mindfulness-based practices, acceptance and commitment principles, breathing exercises, progressive muscle relaxation, and positive psychology.
            </p>
            <p>
              We call these wellness methods because StressGuru is not a clinical service. Our team reviews methods against published research and professional guidance. When we describe a specific technique, we aim to cite the original research or a recognized professional body. Our editorial team reviews claims before publication.
            </p>

            <h2>Clear Limits</h2>
            <p>
              When advice appears on your phone at the end of a hard day, knowing where an app stops helps you choose the right next step.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 not-prose mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-slate-900 mb-2">Choose support that fits the moment</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>StressGuru is an iPhone and Apple Watch wellness app. It does not provide therapy, healthcare, diagnosis, treatment, crisis care, or medical-device functions.</li>
                    <li>It cannot replace care from a qualified mental health or healthcare professional.</li>
                    <li>The AI Gurus are wellness personas, not clinicians, doctors, therapists, or people with lived experience.</li>
                    <li>Apple Watch signals can add context. They do not diagnose, detect, prove, or predict stress or any health or mental health condition.</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>Crisis Support</h2>
            <p>
              If you may hurt yourself, are thinking about suicide, or are in immediate danger, contact emergency services or a crisis service now. StressGuru cannot assess an emergency or get help to you.
            </p>
            <ul>
              <li><strong>988 Suicide and Crisis Lifeline</strong> (US): Call or text 988</li>
              <li><strong>Crisis Text Line</strong>: Text HOME to 741741</li>
              <li><strong>Samaritans</strong> (UK): Call 116 123</li>
              <li><strong>Crisis Services Canada</strong>: Call 988</li>
            </ul>
            <p>
              StressGuru is for everyday wellness support. For urgent help or severe mental health concerns, contact local emergency services, a crisis line, or a qualified professional.
            </p>

            <h2>How the AI Gurus Work</h2>
            <p>
              If an AI response feels personal after a difficult meeting or a sleepless night, you should know what is behind it. The eight Gurus are AI wellness personas powered by large language models. They do not have personal experiences, emotions, professional credentials, or lived experience. When a Guru says, “I understand,” it signals an empathetic response style. It does not mean the AI has felt what you are feeling.
            </p>
            <p>
              Guru Memory, available on paid plans, stores your session history so the AI can provide continuity. This data is encrypted and private to you.
            </p>

            <h2>Privacy and Data</h2>
            <p>
              A late-night wellness check-in can include personal details. You deserve to know how we protect and use that information. Your conversations, health data, and personal information are encrypted in transit and at rest. We do not sell your data or share it with advertisers. Review our <Link href="/privacy-policy" className="text-sky-700 hover:underline">Privacy Policy</Link> to understand how your information is handled before you decide to use the app.
            </p>

            <h2>How We Review Claims</h2>
            <p>
              A wellness claim can affect your time, money, and choices. We keep an internal claims register for health, performance, and comparative claims on our website and in our app. Each claim is reviewed for evidence, source quality, and accuracy. We remove or revise claims we cannot support.
            </p>
            <p>
              If a claim on our website seems inaccurate or misleading, please <Link href="/contact" className="text-sky-700 hover:underline">contact us</Link>. Your report helps us check the wording and correct it when needed.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <PromiseSection />
    </div>
  );
}
