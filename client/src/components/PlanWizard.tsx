import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function PlanWizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0); // Higher score = Pro plan

  const questions = [
    {
      title: "What kind of support are you looking for this month?",
      options: [
        { text: "I want a free place to pause when a tough moment comes up.", value: 0 },
        { text: "I want regular wellness sessions as I manage a full month.", value: 1 },
      ],
    },
    {
      title: "What would make a session more useful?",
      options: [
        { text: "A short check-in when I need to think something through.", value: 0 },
        { text: "Saved context, so I can return to notes from an earlier session.", value: 1 },
      ],
    },
    {
      title: "How often do you expect to use StressGuru?",
      options: [
        { text: "I am exploring the app and want to start free.", value: 0 },
        { text: "I want several sessions each month for work, sleep, or relationship pressure.", value: 1 },
      ],
    },
  ];

  const handleOptionClick = (value: number) => {
    setScore(score + value);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // Move to result
    }
  };

  const resetWizard = () => {
    setStep(0);
    setScore(0);
    setOpen(false);
  };

  const isProRecommended = score >= 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300"
          onClick={() => { setStep(0); setScore(0); }}
        >
          <HelpCircleIcon className="w-4 h-4" />
          Not sure which plan fits? Compare your options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden gap-0">
        {step < questions.length ? (
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-[#008C99] uppercase tracking-wider bg-[#7BDDE5]/10 px-2 py-1 rounded-full">
                Step {step + 1} of {questions.length}
              </span>
            </div>
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
                {questions[step].title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {questions[step].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.value)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#7BDDE5] hover:bg-[#7BDDE5]/5 transition-all duration-200 group flex items-center justify-between"
                >
                  <span className="text-slate-700 font-medium group-hover:text-slate-900">
                    {option.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#008C99] opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Result Header */}
            <div className={`p-8 text-center ${isProRecommended ? "bg-[#7BDDE5]/10" : "bg-slate-50"}`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isProRecommended ? "bg-[#7BDDE5] text-[#008C99]" : "bg-slate-200 text-slate-500"}`}>
                {isProRecommended ? <Sparkles className="w-8 h-8 text-white" /> : <ShieldCheck className="w-8 h-8" />}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                A Good Starting Point: {isProRecommended ? "Balance" : "Relief"}
              </h3>
              <p className="text-slate-600 max-w-xs mx-auto">
                {isProRecommended 
                  ? "Balance includes five sessions each month and saved context for the topics you want to revisit."
                  : "Relief is free, so you can explore StressGuru before choosing a paid session pace."}
              </p>
            </div>

            {/* Result Details */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">What this plan includes</h4>
                {isProRecommended ? (
                  <>
                    <FeatureItem text="Saved context from prior Guru sessions" />
                    <FeatureItem text="Suggested next steps and techniques" />
                    <FeatureItem text="Five Guru sessions each month" />
                  </>
                ) : (
                  <>
                    <FeatureItem text="Access to the Anxiety Guru AI wellness persona" />
                    <FeatureItem text="Apple Watch connection and notifications" />
                    <FeatureItem text="A free way to explore StressGuru before choosing a paid plan" />
                  </>
                )}
              </div>

              <Button 
                className={`w-full h-12 text-lg font-bold rounded-full shadow-lg ${isProRecommended ? "bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 shadow-[#7BDDE5]/20" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                onClick={resetWizard}
              >
                Close and compare plans
              </Button>
              
              <button 
                onClick={resetWizard}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-4"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-green-600" />
      </div>
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
