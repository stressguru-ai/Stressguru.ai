import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/oura/ScrollReveal";

interface QuizOption {
  id: string;
  text: string;
  guruId: string;
  guruName: string;
  guruPath: string;
  guruImage: string;
  guruColor: string;
}

const options: QuizOption[] = [
  {
    id: "stress",
    text: "Work pressure is spilling into the rest of my day.",
    guruId: "stress",
    guruName: "Stress Guru",
    guruPath: "/gurus/stress",
    guruImage: "/images/ckfNdeCXRAEriBpm.png",
    guruColor: "bg-red-100 text-red-600"
  },
  {
    id: "sleep",
    text: "I need help winding down before bed.",
    guruId: "sleep",
    guruName: "Sleep Guru",
    guruPath: "/gurus/sleep",
    guruImage: "/images/sDSBaqlRTTJBzglV.png",
    guruColor: "bg-blue-100 text-blue-600"
  },
  {
    id: "anxiety",
    text: "Worry keeps pulling my attention away.",
    guruId: "anxiety",
    guruName: "Anxiety Guru",
    guruPath: "/gurus/anxiety",
    guruImage: "/images/RjEvlDvMOtWTRzEq.png",
    guruColor: "bg-purple-100 text-purple-600"
  },
  {
    id: "mood",
    text: "Starting even a small task feels hard.",
    guruId: "mood",
    guruName: "Motivation Guru",
    guruPath: "/gurus/motivation",
    guruImage: "/images/dynzrWuhAjoaQmHN.png",
    guruColor: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "relationship",
    text: "A conversation at home feels tense or stuck.",
    guruId: "relationship",
    guruName: "Relationship Guru",
    guruPath: "/gurus/relationship",
    guruImage: "/images/RiYvCLRiSOOKHHcr.png",
    guruColor: "bg-pink-100 text-pink-600"
  },
  {
    id: "happiness",
    text: "I want more room for small moments I enjoy.",
    guruId: "happiness",
    guruName: "Happiness Guru",
    guruPath: "/gurus/happiness",
    guruImage: "/images/xSeUQcwBWbWGSnFH.jpg",
    guruColor: "bg-orange-100 text-orange-600"
  },
  {
    id: "calm",
    text: "Noise, notifications, or requests are crowding my head.",
    guruId: "calm",
    guruName: "Calm Guru",
    guruPath: "/gurus/calm",
    guruImage: "/images/GjrsMwPTDhrCwQjg.jpg",
    guruColor: "bg-indigo-100 text-indigo-600"
  },
  {
    id: "spiritual",
    text: "I want time to reflect on what matters to me.",
    guruId: "spiritual",
    guruName: "Spiritual Guru",
    guruPath: "/gurus/spiritual",
    guruImage: "/images/itZXkUHXnEimtTTz.png",
    guruColor: "bg-green-100 text-green-600"
  }
];

export default function FindYourGuruQuiz() {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (option: QuizOption) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsAnimating(false);
    }, 300);
  };

  const resetQuiz = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedOption(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12
">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Find Your Starting Point
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-light">
              Choose the moment that is taking up the most space right now. You will see an AI wellness persona to explore next.
            </p>
          </ScrollReveal>
        </div>

        <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
          {!selectedOption ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <ScrollReveal key={option.id} delay={index * 0.05} width="100%">
                  <button
                    onClick={() => handleSelect(option)}
                    className="w-full text-left p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                      {option.text}
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                  </button>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 text-center animate-fade-up">
              <div className="mb-8">
                <div className={`w-32 h-32 mx-auto rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-lg ${selectedOption.guruColor} bg-opacity-20`}>
                  <img 
                    src={selectedOption.guruImage} 
                    alt={selectedOption.guruName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                  Start with {selectedOption.guruName}
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                  You chose a real pressure point. Explore {selectedOption.guruName} to see how a short guided session can help you take one next step.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={selectedOption.guruPath}>
                    <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform">
                      Explore {selectedOption.guruName}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={resetQuiz}
                    className="rounded-full px-8 py-6 text-lg border-2"
                  >
                    <RefreshCw className="mr-2 w-5 h-5" />
                    Choose Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
