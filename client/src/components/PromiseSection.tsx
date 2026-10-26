import { Moon, Zap, Heart } from "lucide-react";
import ScrollReveal from "@/components/oura/ScrollReveal";

export default function PromiseSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Background Image with Overlay - Standardized for all pages */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/NawFaahiPlGoVChp.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">
              Protect time for sleep, focus, and the people you love
            </h2>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mt-6">
              A full calendar can take over the hours that matter most. StressGuru gives you a place to pause, name the pressure, and choose a useful next step.
            </p>
            <div className="w-24 h-1.5 bg-[#B62427] mx-auto rounded-full opacity-80" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Better Sleep */}
          <ScrollReveal delay={0.1} width="100%">
            <div className="bg-white/40 backdrop-blur-md rounded-[2rem] p-10 text-center h-full shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/50 group">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/60 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Moon className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Make room for rest</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                When your brain keeps replaying tomorrow's list at 3 a.m., use a short session to begin a wind-down routine.
              </p>
            </div>
          </ScrollReveal>

          {/* Sharper Focus */}
          <ScrollReveal delay={0.2} width="100%">
            <div className="bg-white/40 backdrop-blur-md rounded-[2rem] p-10 text-center h-full shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/50 group">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/60 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Zap className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Return to the next task</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                After a tense call or a packed morning, take a pause before you open the next email or walk into the next meeting.
              </p>
            </div>
          </ScrollReveal>

          {/* Improved Relationships */}
          <ScrollReveal delay={0.3} width="100%">
            <div className="bg-white/40 backdrop-blur-md rounded-[2rem] p-10 text-center h-full shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/50 group">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/60 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Heart className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Keep more for your people</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                A few minutes between work and home can help you enter dinner, a call, or a hard conversation with more intention.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
