import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import PlanWizard from "@/components/PlanWizard";
import PromiseSection from "@/components/PromiseSection";
import FAQSection, { faqData } from "@/components/FAQSection";
import CostCalculator from "@/components/CostCalculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Plans() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = {
    reset: { name: "Reset", monthly: 19.99, yearly: 199.99, sessions: 2 },
    balance: { name: "Balance", monthly: 49.99, yearly: 499.99, sessions: 5 },
    thrive: { name: "Thrive", monthly: 199.99, yearly: 1999.99, sessions: 20 },
  };

  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Apple Watch Connection & Notifications", free: true, reset: true, balance: true, thrive: true, tooltip: "Use available Apple Watch signals as context and choose notification settings. Watch signals do not diagnose or prove stress." },
        { name: "Anxiety Guru Access", free: true, reset: true, balance: true, thrive: true, tooltip: "Choose the Anxiety Guru AI wellness persona when worry is taking up the room." },
        { name: "Guru Sessions", free: "Relief access", reset: "2/month", balance: "5/month", thrive: "20/month", tooltip: "Paid plans include the listed number of AI Guru sessions each month." },
      ]
    },
    {
      category: "Ongoing Session Tools",
      items: [
        { name: "Saved Notes, Documents & Media", free: false, reset: true, balance: true, thrive: true, tooltip: "Keep the notes, documents, and media you choose to save for later reference." },
        { name: "Suggested Next Steps & Techniques", free: false, reset: true, balance: true, thrive: true, tooltip: "Finish a session with practical ideas to consider in your own routine." },
        { name: "Progress Dashboard", free: false, reset: true, balance: true, thrive: true, tooltip: "Review your check-ins and session activity in one place." },
        { name: "Conversation Context", free: false, reset: true, balance: true, thrive: true, tooltip: "Return to saved context in a later AI Guru session." },
        { name: "Schedule or Start a Session 24/7", free: false, reset: true, balance: true, thrive: true, tooltip: "Schedule a session or open one when it fits your day." },
        { name: "Extra Sessions ($12.99 each)", free: false, reset: true, balance: true, thrive: true, tooltip: "Add extra sessions for $12.99 each when you need more than your plan includes." },
      ]
    }
  ];

  type FeatureValue = boolean | string;

  const renderValue = (val: FeatureValue, accent: boolean = false) => {
    if (val === true) {
      return (
        <div className={`w-7 h-7 rounded-full ${accent ? "bg-[#7BDDE5]/20" : "bg-slate-100"} flex items-center justify-center`}>
          <Check className={`w-4 h-4 ${accent ? "text-[#008C99]" : "text-slate-900"}`} />
        </div>
      );
    } else if (val === false) {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 text-slate-300" />
        </div>
      );
    } else {
      return (
        <span className={`text-[11px] font-bold ${accent ? "text-[#008C99] bg-[#7BDDE5]/10 border border-[#7BDDE5]/20" : "text-slate-700 bg-slate-100"} px-2 py-0.5 rounded-full whitespace-nowrap`}>
          {val}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen relative bg-white overflow-x-hidden pb-24 md:pb-0">
      <SEO
        title="StressGuru Pricing: Reset, Balance and Thrive Plans"
        description="Compare free Relief, Reset with 2 sessions each month for $19.99, Balance with 5 for $49.99, and Thrive with 20 for $199.99. Annual plans include two months free."
        canonicalUrl="https://stressguru.ai/plans"
        keywords={["StressGuru pricing", "AI wellness app cost", "iPhone wellness app subscription", "free wellness app", "Apple Watch wellness app"]}
        includeSoftwareApp={true}
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Plans & Pricing", url: "/plans" }]}
        faqItems={faqData.map(f => ({ question: f.question, answer: f.answer }))}
      />

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pb-32">
        <div className="absolute inset-0 z-0">
          <img src="/images/iSOaWgmiqZJaJljJ.jpg" alt="Background" className="w-full h-full object-cover object-[75%] md:object-center" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container mx-auto px-6 relative z-10 pt-40 pb-16">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg">
              Keep a Pause in <br /><span className="font-bold text-[#7BDDE5]">Your Budget.</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md">
              Choose a session pace that leaves room for the work, sleep, and relationships you want to protect. Start with Relief free, then move up when more sessions fit your month.
            </p>
            <div className="pt-6 space-y-6">
              <div className="w-full max-w-md"><PlanWizard /></div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full inline-flex border border-white/20 w-fit">
                <button className={`font-medium transition-all duration-300 px-6 py-2.5 rounded-full text-base ${billingPeriod === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-white hover:bg-white/10"}`} onClick={() => setBillingPeriod("monthly")}>Monthly</button>
                <button className={`font-medium transition-all duration-300 px-6 py-2.5 rounded-full flex items-center gap-2 text-base ${billingPeriod === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-white hover:bg-white/10"}`} onClick={() => setBillingPeriod("yearly")}>
                  Yearly <span className="text-xs bg-[#7BDDE5] text-slate-900 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">Two Months Free</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE: Stacked Cards */}
      <div className="lg:hidden container mx-auto px-4 -mt-8 relative z-10 mb-24 space-y-6">
        {/* Free */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Relief</h3>
          <p className="text-sm text-slate-500 mb-4">A free place to start when you need a pause</p>
          <div className="text-3xl font-bold text-slate-900 mb-4">Free</div>
          <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full rounded-full border-slate-300 h-11">Get Relief Free</Button>
          </a>
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-600" /><span className="text-sm text-slate-700">Apple Watch connection and notifications</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-600" /><span className="text-sm text-slate-700">Access to Anxiety Guru</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-600" /><span className="text-sm text-slate-700">Free Relief plan access</span></div>
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Reset</h3>
          <p className="text-sm text-slate-500 mb-4">Two sessions each month, plus saved context</p>
          <div className="mb-4">
            {billingPeriod === "yearly" ? (
              <div>
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-slate-900">${plans.reset.yearly.toFixed(2)}</span><span className="text-slate-500 text-sm">/year</span></div>
                <p className="text-xs text-emerald-600 font-semibold">Two months free</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-slate-900">${plans.reset.monthly.toFixed(2)}</span><span className="text-slate-500 text-sm">/mo</span></div>
            )}
          </div>
          <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full rounded-full border-slate-300 h-11">Choose Reset in App Store</Button>
          </a>
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Two Guru sessions/month</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Saved Guru context</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Progress dashboard and 24/7 scheduling</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Extra sessions at $12.99 each</span></div>
          </div>
        </div>

        {/* Balance (Most Popular) */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#7BDDE5] relative p-6 pt-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#7BDDE5] text-slate-900 text-xs font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-wider">Most Popular</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Balance</h3>
          <p className="text-sm text-slate-500 mb-4">Five sessions each month, plus saved context</p>
          <div className="mb-4">
            {billingPeriod === "yearly" ? (
              <div>
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-slate-900">${plans.balance.yearly.toFixed(2)}</span><span className="text-slate-500 text-sm">/year</span></div>
                <p className="text-xs text-emerald-600 font-semibold">Two months free</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-slate-900">${plans.balance.monthly.toFixed(2)}</span><span className="text-slate-500 text-sm">/mo</span></div>
            )}
          </div>
          <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
            <Button className="w-full rounded-full bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg shadow-[#7BDDE5]/20 h-11">Choose Balance in App Store</Button>
          </a>
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Five Guru sessions/month</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Saved Guru context</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Progress dashboard and 24/7 scheduling</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#008C99]" /><span className="text-sm text-slate-700">Extra sessions at $12.99 each</span></div>
          </div>
        </div>

        {/* Thrive */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-6 text-white">
          <h3 className="text-2xl font-bold text-white mb-1">Thrive</h3>
          <p className="text-sm text-slate-300 mb-4">Twenty sessions each month, plus saved context</p>
          <div className="mb-4">
            {billingPeriod === "yearly" ? (
              <div>
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-white">${plans.thrive.yearly.toFixed(2)}</span><span className="text-slate-300 text-sm">/year</span></div>
                <p className="text-xs text-emerald-400 font-semibold">Two months free</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-white">${plans.thrive.monthly.toFixed(2)}</span><span className="text-slate-300 text-sm">/mo</span></div>
            )}
          </div>
          <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
            <Button className="w-full rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold h-11">Choose Thrive in App Store</Button>
          </a>
          <div className="mt-5 pt-5 border-t border-slate-700 space-y-3">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7BDDE5]" /><span className="text-sm text-slate-200">Twenty Guru sessions/month</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7BDDE5]" /><span className="text-sm text-slate-200">Saved Guru context</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7BDDE5]" /><span className="text-sm text-slate-200">Progress dashboard and 24/7 scheduling</span></div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7BDDE5]" /><span className="text-sm text-slate-200">Extra sessions at $12.99 each</span></div>
          </div>
        </div>
      </div>

      {/* DESKTOP: 5-Column Comparison Table */}
      <div className="hidden lg:block container mx-auto max-w-6xl px-4 -mt-8 relative z-10 mb-24">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="grid grid-cols-5 border-b border-slate-100">
            <div className="p-6 flex items-end pb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Features</span>
            </div>
            {/* Free */}
            <div className="p-5 text-center border-l border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Relief</h3>
              <p className="text-[11px] text-slate-500 mb-3 h-7">A free place to start</p>
              <div className="h-14 flex items-center justify-center mb-3"><span className="text-2xl font-bold text-slate-900">Free</span></div>
              <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full rounded-full border-slate-300 h-9 text-xs">Get Relief</Button>
              </a>
            </div>
            {/* Reset */}
            <div className="p-5 text-center border-l border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Reset</h3>
              <p className="text-[11px] text-slate-500 mb-3 h-7">2 sessions/month</p>
              <div className="h-14 flex flex-col items-center justify-center mb-3">
                {billingPeriod === "yearly" ? (<><span className="text-xl font-bold text-slate-900">${plans.reset.yearly.toFixed(2)}<span className="text-xs text-slate-500 font-normal">/yr</span></span><p className="text-[10px] text-emerald-600 font-semibold">Two months free</p></>) : (<span className="text-xl font-bold text-slate-900">${plans.reset.monthly.toFixed(2)}<span className="text-xs text-slate-500 font-normal">/mo</span></span>)}
              </div>
              <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full rounded-full border-slate-300 h-9 text-xs">Choose Reset</Button>
              </a>
            </div>
            {/* Balance */}
            <div className="p-5 text-center border-l border-slate-100 bg-[#7BDDE5]/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-[#7BDDE5] h-1.5" />
              <div className="absolute top-2 right-2 bg-[#7BDDE5] text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Most Popular</div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Balance</h3>
              <p className="text-[11px] text-slate-500 mb-3 h-7">5 sessions/month</p>
              <div className="h-14 flex flex-col items-center justify-center mb-3">
                {billingPeriod === "yearly" ? (<><span className="text-xl font-bold text-slate-900">${plans.balance.yearly.toFixed(2)}<span className="text-xs text-slate-500 font-normal">/yr</span></span><p className="text-[10px] text-emerald-600 font-semibold">Two months free</p></>) : (<span className="text-xl font-bold text-slate-900">${plans.balance.monthly.toFixed(2)}<span className="text-xs text-slate-500 font-normal">/mo</span></span>)}
              </div>
              <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded-full bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 font-bold shadow-lg shadow-[#7BDDE5]/20 h-9 text-xs">Choose Balance</Button>
              </a>
            </div>
            {/* Thrive */}
            <div className="p-5 text-center border-l border-slate-100 bg-slate-900">
              <h3 className="text-lg font-bold text-white mb-1">Thrive</h3>
              <p className="text-[11px] text-slate-300 mb-3 h-7">20 sessions/month</p>
              <div className="h-14 flex flex-col items-center justify-center mb-3">
                {billingPeriod === "yearly" ? (<><span className="text-xl font-bold text-white">${plans.thrive.yearly.toFixed(2)}<span className="text-xs text-slate-300 font-normal">/yr</span></span><p className="text-[10px] text-emerald-400 font-semibold">Two months free</p></>) : (<span className="text-xl font-bold text-white">${plans.thrive.monthly.toFixed(2)}<span className="text-xs text-slate-300 font-normal">/mo</span></span>)}
              </div>
              <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold h-9 text-xs">Choose Thrive</Button>
              </a>
            </div>
          </div>

          {/* Body */}
          <div className="divide-y divide-slate-100">
            {features.map((section, i) => (
              <div key={i}>
                <div className="bg-slate-50/80 px-6 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">{section.category}</div>
                {section.items.map((item, j) => (
                  <div key={j} className="grid grid-cols-5 hover:bg-slate-50/30 transition-colors">
                    <div className="p-4 flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <TooltipProvider><Tooltip><TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" /></TooltipTrigger><TooltipContent className="max-w-xs bg-slate-900 text-white border-slate-800"><p className="text-xs">{item.tooltip}</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <div className="p-4 border-l border-slate-100 flex items-center justify-center bg-slate-50/30">{renderValue(item.free)}</div>
                    <div className="p-4 border-l border-slate-100 flex items-center justify-center">{renderValue(item.reset, true)}</div>
                    <div className="p-4 border-l border-slate-100 flex items-center justify-center bg-[#7BDDE5]/5">{renderValue(item.balance, true)}</div>
                    <div className="p-4 border-l border-slate-100 flex items-center justify-center bg-slate-900/5">{renderValue(item.thrive, true)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COST CALCULATOR */}
      <section className="bg-slate-50"><CostCalculator /></section>

      {/* FAQ */}
      <FAQSection />

      {/* PROMISE */}
      <PromiseSection />
    </div>
  );
}
