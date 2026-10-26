import ScrollReveal from "@/components/oura/ScrollReveal";
import { Shield, Lock, Star, Clock, Apple } from "lucide-react";

/**
 * TrustSignals - Social proof and trust badges section
 * 
 * Designed following Donald Miller's StoryBrand framework:
 * The Guide (StressGuru) demonstrates authority and empathy through
 * concrete evidence of trustworthiness and capability.
 */
export default function TrustSignals() {
  const trustItems = [
    {
      icon: Apple,
      label: "Built for iPhone",
      sublabel: "Optional Apple Watch context"
    },
    {
      icon: Shield,
      label: "Everyday wellness support",
      sublabel: "For everyday pressure and routines"
    },
    {
      icon: Lock,
      label: "Review privacy details",
      sublabel: "Before you share personal information"
    },
    {
      icon: Clock,
      label: "Use it on your schedule",
      sublabel: "Open a session when you want one"
    },
    {
      icon: Star,
      label: "8 AI wellness Gurus",
      sublabel: "Choose the support that fits the moment"
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4">
        <ScrollReveal width="100%">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-[#7BDDE5]/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#7BDDE5]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
