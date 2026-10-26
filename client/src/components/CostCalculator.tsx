import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/oura/ScrollReveal";

export default function CostCalculator() {
  const [therapyCost, setTherapyCost] = useState(150); // Current support-session cost
  const [sessionsPerMonth, setSessionsPerMonth] = useState(4); // Current support sessions per month

  const monthlyTherapyCost = therapyCost * sessionsPerMonth;
  const stressGuruCost = 49.99; // Balance plan (Most Popular)
  const monthlySavings = monthlyTherapyCost - stressGuruCost;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
              See the Cost <span className="font-bold">Side by Side.</span>
            </h2>
            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
              When your budget already carries a lot, use this estimate to compare the monthly cost you enter with Balance at $49.99 per month. StressGuru is an AI wellness app, not therapy or healthcare.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Calculator Section (Takes up 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Inputs */}
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium text-slate-700">Your Current Support Cost per Session</label>
                    <span className="text-2xl font-bold text-slate-900">${therapyCost}</span>
                  </div>
                  <Slider
                    value={[therapyCost]}
                    onValueChange={(value) => setTherapyCost(value[0])}
                    min={50}
                    max={300}
                    step={10}
                    className="py-4"
                  />
                  <p className="text-sm text-slate-400 mt-2">Enter the amount you want to compare.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium text-slate-700">Support Sessions per Month</label>
                    <span className="text-2xl font-bold text-slate-900">{sessionsPerMonth}</span>
                  </div>
                  <Slider
                    value={[sessionsPerMonth]}
                    onValueChange={(value) => setSessionsPerMonth(value[0])}
                    min={1}
                    max={8}
                    step={1}
                    className="py-4"
                  />
                  <p className="text-sm text-slate-400 mt-2">Choose the number that fits your current schedule.</p>
                </div>
              </div>

              {/* Results */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#7BDDE5] rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Comparison</div>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                      <span className="text-slate-300">Your entered estimate</span>
                      <span className="text-2xl font-bold text-red-400">${monthlyTherapyCost}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[#7BDDE5] font-bold">StressGuru Balance</span>
                      <span className="text-2xl font-bold text-[#7BDDE5]">${stressGuruCost}</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Difference From Your Estimate</div>
                    <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                      ${monthlySavings.toFixed(0)}<span className="text-2xl text-slate-400 font-medium">/mo</span>
                    </div>
                    <div className="text-lg text-[#7BDDE5] font-medium">
                      ${yearlySavings.toLocaleString()} across 12 months
                    </div>
                  </div>
                  
                  <div className="mt-8">
                     <a href="https://apps.apple.com/us/app/stressguru-ai/id6748682052" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold">
                        View Balance in the App Store
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Guidance (Takes up 1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Choose Based on How Often You Want to Check In</h3>
                <p className="text-slate-600 leading-relaxed">
                  Balance includes five Guru sessions each month for $49.99. It can suit a month when deadlines, caregiving, or a hard relationship conversation leave little space to reset.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Start Free if You Want to Try the App First</h3>
                <p className="text-slate-600 leading-relaxed">
                  Relief is free. You can explore the app before deciding whether Reset, Balance, or Thrive matches the session pace you want. Annual paid plans include two months free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
