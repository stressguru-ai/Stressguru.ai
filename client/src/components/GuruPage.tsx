import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ScrollReveal from "@/components/oura/ScrollReveal";
import AccordionItem from "@/components/oura/AccordionItem";
import ParallaxImage from "@/components/oura/ParallaxImage";
import OutcomeCarousel from "@/components/OutcomeCarousel";
import { guruOutcomes } from "@/data/outcomes";
import PromiseSection from "@/components/PromiseSection";
import GuruBooks from "@/components/GuruBooks";


interface PlanStep {
  title: string;
  description: string;
}

interface GuruPageProps {
  guruName: string;
  guruTitle: string | React.ReactNode;
  heroImage: string;

  avatarImage: string;
  problemHeadline: string;
  problemDescription: string;
  challenges: string[];
  empathyStatement: string;
  authorityStatement: string;
  planSteps: PlanStep[];
  successOutcomes: string[];
  failureOutcomes: string[];
  ctaText?: string;
  ctaLink?: string;
  children?: React.ReactNode;
}

export default function GuruPage({
  guruName,
  guruTitle,
  heroImage,

  avatarImage,
  problemHeadline,
  problemDescription,
  challenges,
  empathyStatement,
  authorityStatement,
  planSteps,
  successOutcomes,
  failureOutcomes,
  ctaText = "Try StressGuru Free",
  ctaLink = "https://apps.apple.com/us/app/stressguru-ai/id6748682052",
  children,
}: GuruPageProps) {
  // SEO title: 30-60 chars, description: 50-160 chars
  const guruSlug = guruName.toLowerCase().replace(' guru', '');
  const seoTitle = `${guruName}: AI Wellness Support | StressGuru`;
  const truncatedDesc = problemDescription.length > 140 ? problemDescription.substring(0, 137) + '...' : problemDescription;
  const seoDescription = truncatedDesc;
  
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={[guruName, `${guruName.replace(' Guru', '')} relief`, `${guruName.replace(' Guru', '')} support`, "AI wellness Guru", "StressGuru", "wellness app", `${guruName.replace(' Guru', '')} help`]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Meet Your Gurus", url: "/gurus" },
          { name: guruName, url: `/gurus/${guruSlug}` }
        ]}
      />
      
      {/* HERO SECTION - Standardized Layout */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={guruName}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <ScrollReveal>
                <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg mb-8">
                  <img src={avatarImage} alt={guruName} className="w-10 h-10 rounded-full object-cover object-top border-2 border-primary" />
                  <span className="font-semibold text-slate-800">{guruName}</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                  {guruTitle}
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={0.4}>
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 border-none">
                    {ctaText}
                  </Button>
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION - Clean typography, centered */}
      <section className="py-24 md:py-32 container mx-auto px-4 max-w-4xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-slate-900">
            {problemHeadline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed">
            {problemDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* CHALLENGES - Oura Style: Alternating Layout with Visuals */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                 {/* Re-using hero image cropped or a secondary image if available, for now re-using hero for visual consistency */}
                <img src={heroImage} alt="Struggle" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </ScrollReveal>
            
            <div>
              <ScrollReveal>
                  <h3 className="text-3xl font-bold mb-8">Does this sound familiar?</h3>
              </ScrollReveal>
              <div className="space-y-4">
                {challenges.slice(0, 5).map((challenge, i) => (
                  <ScrollReveal key={i} delay={i * 0.1} width="100%">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <p className="text-lg text-slate-700">{challenge}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMPATHY & AUTHORITY - The Guide */}
      <section className="py-32 container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4">
             <ScrollReveal>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-110" />
                <img src={avatarImage} alt={guruName} className="relative w-full rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 object-top" />
              </div>
             </ScrollReveal>
          </div>
          <div className="md:col-span-8 space-y-8">
            <ScrollReveal>
                  <h3 className="text-3xl font-bold text-primary">Start with what is happening</h3>
              <p className="text-xl text-slate-600 mt-4 leading-relaxed border-l-4 border-primary/30 pl-6">
                {empathyStatement}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h3 className="text-3xl font-bold text-slate-900">Choose a practical next step</h3>
              <p className="text-lg text-slate-600 mt-4 leading-relaxed">
                {authorityStatement}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* THE PLAN - Oura Style: Accordion */}
      <section className="py-32 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Stop this pattern now. Prevent the next repeat.</h2>
          </ScrollReveal>
          
          <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl">
            {planSteps.map((step, i) => (
              <AccordionItem key={i} title={`${i + 1}. ${step.title}`} defaultOpen={i === 0}>
                {step.description}
              </AccordionItem>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 py-8 text-xl font-bold shadow-lg hover:scale-105 transition-transform w-full sm:w-auto">
                Try the free Relief plan
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* OUTCOMES CAROUSEL */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
              Ways to use {guruName}
            </h2>
            <p className="text-xl text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Choose a short AI-guided wellness exercise that fits the moment you are in.
            </p>
          </ScrollReveal>
          <OutcomeCarousel outcomes={guruOutcomes[guruName] || guruOutcomes["default"]} />
        </div>
      </section>

      {/* SUCCESS vs FAILURE - Visual Comparison */}
      {children ? (
        children
      ) : (
        <section className="py-32 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-900">What could feel different next</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-600 font-light">
                A wellness session cannot control the outcome. It can help you pause, reflect, and choose your next action.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Without Action */}
            <ScrollReveal width="100%">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <AlertTriangle className="w-32 h-32 md:w-64 md:h-64 text-red-500" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-8 md:mb-12 flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
                  When the pattern keeps running
                </h3>

                <div className="space-y-6 md:space-y-8 relative z-10">
                  {failureOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-4 md:gap-6 group/item">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg shrink-0 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors duration-300">
                        <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <p className="text-lg md:text-xl text-slate-600 font-medium pt-1">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* With Guru */}
            <ScrollReveal width="100%" delay={0.2}>
              <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl h-full relative overflow-hidden group text-white ">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <ShieldCheck className="w-32 h-32 md:w-64 md:h-64 text-primary" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-12 flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                  With a clear next step
                </h3>

                <div className="space-y-6 md:space-y-8 relative z-10">
                  {successOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-4 md:gap-6 group/item">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <p className="text-lg md:text-xl text-slate-300 font-medium pt-1">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* BOOKS BY THIS GURU */}
      <GuruBooks guruSlug={`${guruName.toLowerCase().replace(' ', '-')}`} guruName={guruName} />

      {/* PROMISE SECTION */}
      <div className="bg-slate-50">
        <PromiseSection />
      </div>
    </div>
  );
}
