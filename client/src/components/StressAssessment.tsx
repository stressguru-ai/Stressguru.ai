import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Sun, CloudRain, CloudLightning, 
  Battery, BatteryMedium, BatteryLow, BatteryWarning,
  Brain, Heart, Moon, Zap, Shield, Smile,
  ChevronRight, RefreshCw, Lock, AlertCircle, Sparkles, Coffee, Frown, UserMinus, Search, VolumeX,
  Mail, User, CheckCircle2, Loader2
} from 'lucide-react';
import BodyMap from './assessment/BodyMap';
import WeatherGrid from './assessment/WeatherGrid';
import BatteryGrid from './assessment/BatteryGrid';
import { trpc } from '@/lib/trpc';

// --- Types from provided script ---
export type Domain =
  | "stress"
  | "sleep"
  | "anxiety"
  | "relationship"
  | "motivation"
  | "calm"
  | "spiritual";

export type Guru =
  | "Happiness"
  | "Calm"
  | "Spiritual"
  | "Stress"
  | "Sleep"
  | "Anxiety"
  | "Relationship"
  | "Motivation";

export type TierId = 1 | 2 | 3 | 4;

export type QuestionType = "single" | "body_map";

export type SingleAnswer = { optionId: string };
export type BodyMapAnswer = { selectedAreas: string[]; skipped?: boolean };

export type Answer = SingleAnswer | BodyMapAnswer;

export type QuestionOption = {
  id: string;
  label: string;
  severity: 0 | 1 | 2 | 3;
  icon?: React.ReactNode; // Added for UI
};

export type QuestionConfig = {
  id: string;
  title: string;
  domain: Domain;
  type: QuestionType;
  options?: QuestionOption[];
  intro?: string; // Added for UI
};

export type AssessmentConfig = {
  version: string;
  questions: QuestionConfig[];
};

export type AssessmentInput = {
  answers: Record<string, Answer | undefined>;
};

export type AssessmentResult = {
  version: string;
  completedAtISO: string;
  finalScore10to100: number;
  stressLevel0to9: number;
  tier: {
    id: TierId;
    title: string;
    summary: string;
  };
  domainAverages: Record<Domain, number>;
  recommended: {
    primary: Guru;
    secondary?: Guru;
    cards: Guru[];
  };
  severitySum: number;
  maxSeverity: number;
};

// --- Configuration ---
export const STRESS_ASSESSMENT_V1: AssessmentConfig = {
  version: "stress_assessment_v1",
  questions: [
    {
      id: "q1_body_map",
      title: "Where Tension Shows Up",
      domain: "stress",
      type: "body_map",
      intro: "Pause for a second. Where do you notice tension in your body right now? Select any areas that stand out, or continue when you are ready."
    },
    {
      id: "q2_mental_weather",
      title: "Your Mind Right Now",
      domain: "anxiety",
      type: "single",
      intro: "If your thoughts were a weather report today, which one fits best?",
      options: [
        { id: "clear_skies", label: "Clear and steady", severity: 0, icon: <Sun className="w-6 h-6 text-yellow-500" /> },
        { id: "partly_cloudy", label: "A few clouds", severity: 1, icon: <Cloud className="w-6 h-6 text-blue-400" /> },
        { id: "thunderstorms", label: "Stormy and reactive", severity: 2, icon: <CloudLightning className="w-6 h-6 text-purple-500" /> },
        { id: "dense_fog", label: "Foggy and hard to sort through", severity: 3, icon: <CloudRain className="w-6 h-6 text-gray-500" /> },
      ],
    },
    {
      id: "q3_recovery_check",
      title: "How You Wake Up",
      domain: "sleep",
      type: "single",
      intro: "When you wake up, what is most often true?",
      options: [
        { id: "refreshed", label: "I wake up ready to begin the day.", severity: 0, icon: <Sun className="w-5 h-5 text-orange-400" /> },
        { id: "coffee", label: "I am tired, then coffee helps me get moving.", severity: 1, icon: <Coffee className="w-5 h-5 text-brown-500" /> },
        { id: "multiple_wakes", label: "I wake several times and my mind keeps working.", severity: 2, icon: <Brain className="w-5 h-5 text-purple-400" /> },
        { id: "exhausted", label: "I wake worn out, even after enough time in bed.", severity: 3, icon: <BatteryWarning className="w-5 h-5 text-red-500" /> },
      ],
    },
    {
      id: "q4_power_grid",
      title: "Energy for the Day",
      domain: "motivation",
      type: "single",
      intro: "How much energy do you have for the work, care, and decisions on your list today?",
      options: [
        { id: "fully_charged", label: "Plenty to work with", severity: 0, icon: <Battery className="w-6 h-6 text-green-500" /> },
        { id: "sufficient", label: "Enough once I get moving", severity: 1, icon: <BatteryMedium className="w-6 h-6 text-yellow-500" /> },
        { id: "low_battery", label: "Running low", severity: 2, icon: <BatteryLow className="w-6 h-6 text-orange-500" /> },
        { id: "critically_low", label: "Nearly spent", severity: 3, icon: <BatteryWarning className="w-6 h-6 text-red-500" /> },
      ],
    },
    {
      id: "q5_fuse_test",
      title: "When One More Thing Goes Wrong",
      domain: "stress",
      type: "single",
      intro: "A delayed train, a spilled coffee, or a message at dinner. How do you usually react?",
      options: [
        { id: "patient", label: "I reset and keep perspective.", severity: 0, icon: <Smile className="w-5 h-5 text-green-500" /> },
        { id: "brief_annoyance", label: "I feel annoyed, then move on.", severity: 1, icon: <AlertCircle className="w-5 h-5 text-yellow-500" /> },
        { id: "surge_heat", label: "The irritation sticks with me for a while.", severity: 2, icon: <Zap className="w-5 h-5 text-orange-500" /> },
        { id: "snap_breakdown", label: "I am close to snapping at whoever is nearby.", severity: 3, icon: <CloudLightning className="w-5 h-5 text-red-500" /> },
      ],
    },
    {
      id: "q6_survival_gauge",
      title: "Looking at the Week Ahead",
      domain: "anxiety",
      type: "single",
      intro: "When you look at the calendar, how does the week ahead feel?",
      options: [
        { id: "curiosity", label: "I feel curious or interested.", severity: 0, icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
        { id: "neutrality", label: "It feels like another normal week.", severity: 1, icon: <Shield className="w-5 h-5 text-blue-400" /> },
        { id: "anxiety_tasks", label: "I am bracing for everything I need to get through.", severity: 2, icon: <AlertCircle className="w-5 h-5 text-orange-400" /> },
        { id: "pure_dread", label: "I feel dread before the week has even started.", severity: 3, icon: <Lock className="w-5 h-5 text-red-500" /> },
      ],
    },
    {
      id: "q7_three_am_test",
      title: "Your Nights Lately",
      domain: "sleep",
      type: "single",
      intro: "When your head hits the pillow, what usually happens?",
      options: [
        { id: "sanctuary", label: "I sleep deeply and wake up ready for the day.", severity: 0, icon: <Moon className="w-5 h-5 text-indigo-400" /> },
        { id: "bit_tired", label: "I am a bit tired, but I usually sleep okay.", severity: 1, icon: <Cloud className="w-5 h-5 text-blue-300" /> },
        { id: "tossing_turning", label: "I toss and turn, replaying the day or planning tomorrow.", severity: 2, icon: <RefreshCw className="w-5 h-5 text-orange-400" /> },
        { id: "dread_night", label: "I put off bedtime because my thoughts keep going.", severity: 3, icon: <Brain className="w-5 h-5 text-red-400" /> },
      ],
    },
    {
      id: "q8_mountain_factor",
      title: "Your List Today",
      domain: "motivation",
      type: "single",
      intro: "How does the list of work, care, and life tasks feel right now?",
      options: [
        { id: "capable", label: "I can see a way through it.", severity: 0, icon: <Shield className="w-5 h-5 text-green-500" /> },
        { id: "checking_off", label: "It is a lot, but I am getting through it.", severity: 1, icon: <RefreshCw className="w-5 h-5 text-blue-400" /> },
        { id: "climb_mountain", label: "Every task feels harder than it should.", severity: 2, icon: <CloudRain className="w-5 h-5 text-gray-500" /> },
        { id: "hide_covers", label: "I want to avoid the whole list.", severity: 3, icon: <Lock className="w-5 h-5 text-gray-700" /> },
      ],
    },
    {
      id: "q9_the_wall",
      title: "Connection With Others",
      domain: "relationship",
      type: "single",
      intro: "How connected do you feel to the people who matter most to you?",
      options: [
        { id: "connected", label: "Connected and supported. We work as a team.", severity: 0, icon: <Heart className="w-5 h-5 text-pink-500" /> },
        { id: "fine_grumpy", label: "Mostly fine, with a few tense moments.", severity: 1, icon: <Frown className="w-5 h-5 text-yellow-500" /> },
        { id: "eggshells", label: "I watch what I say to avoid another conflict.", severity: 2, icon: <AlertCircle className="w-5 h-5 text-orange-500" /> },
        { id: "wall_between", label: "I feel distant, even when we are in the same room.", severity: 3, icon: <UserMinus className="w-5 h-5 text-red-500" /> },
      ],
    },
    {
      id: "q10_sniffing_out_joy",
      title: "Room for Enjoyment",
      domain: "motivation",
      type: "single",
      intro: "How often do you have a moment that feels light, fun, or your own?",
      options: [
        { id: "all_time", label: "Often. I still notice small moments I enjoy.", severity: 0, icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
        { id: "sometimes", label: "Sometimes, when the day goes my way.", severity: 1, icon: <Smile className="w-5 h-5 text-blue-400" /> },
        { id: "rarely", label: "Rarely. Most days feel like a long list.", severity: 2, icon: <Cloud className="w-5 h-5 text-gray-400" /> },
        { id: "never", label: "Almost never. Small pleasures feel far away.", severity: 3, icon: <Frown className="w-5 h-5 text-gray-600" /> },
      ],
    },
    {
      id: "q11_sunbeam_search",
      title: "A Moment of Quiet",
      domain: "calm",
      type: "single",
      intro: "When did you last have a few minutes without bracing for the next demand?",
      options: [
        { id: "today_quiet", label: "Today. I can find a quiet moment when I need one.", severity: 0, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
        { id: "this_week_loud", label: "This week, though my day is still noisy.", severity: 1, icon: <VolumeX className="w-5 h-5 text-blue-400" /> },
        { id: "constantly_rushing", label: "I keep rushing and cannot remember the last real pause.", severity: 2, icon: <RefreshCw className="w-5 h-5 text-orange-500" /> },
        { id: "peace_impossible", label: "Quiet feels out of reach because my thoughts keep going.", severity: 3, icon: <CloudLightning className="w-5 h-5 text-red-500" /> },
      ],
    },
    {
      id: "q12_ceiling_conversation",
      title: "A Sense of Meaning",
      domain: "spiritual",
      type: "single",
      intro: "Does your life feel connected to your values, faith, or sense of purpose?",
      options: [
        { id: "guided", label: "I feel rooted in what matters to me.", severity: 0, icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
        { id: "searching", label: "I am looking for more clarity about what matters.", severity: 1, icon: <Search className="w-5 h-5 text-blue-400" /> },
        { id: "motions_empty", label: "I am going through the motions without much meaning.", severity: 2, icon: <Cloud className="w-5 h-5 text-gray-400" /> },
        { id: "talking_ceiling", label: "I feel disconnected from meaning or purpose right now.", severity: 3, icon: <Moon className="w-5 h-5 text-gray-600" /> },
      ],
    },
  ],
};

// --- Logic Helpers ---

function clampInt(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function severityForBodyMap(answer: BodyMapAnswer | undefined): 0 | 1 | 2 | 3 {
  if (!answer) return 0;
  if (answer.skipped) return 0;
  const count = Array.isArray(answer.selectedAreas) ? answer.selectedAreas.length : 0;
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

function computeTier(finalScore10to100: number): { id: TierId; title: string; summary: string } {
  if (finalScore10to100 <= 30) {
    return {
      id: 1,
      title: "Steady",
      summary: "Your answers point to a steadier stretch. Keep protecting the routines and boundaries that support your energy and attention.",
    };
  }
  if (finalScore10to100 <= 60) {
    return {
      id: 2,
      title: "Early Signals",
      summary: "Your answers suggest some pressure is building. A few small resets now may protect your sleep, focus, and patience.",
    };
  }
  if (finalScore10to100 <= 85) {
    return {
      id: 3,
      title: "High Load",
      summary: "Your answers point to a heavy load right now. Make room for recovery and choose one support step you can keep this week.",
    };
  }
  return {
    id: 4,
    title: "Overextended",
    summary: "Your answers point to a lot on your plate right now. Start with one small support step that gives you more room to breathe.",
  };
}

function computeDomainAverages(
  config: AssessmentConfig,
  severitiesByQuestion: Record<string, number>
): Record<Domain, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const q of config.questions) {
    const sev = severitiesByQuestion[q.id] ?? 0;
    sums[q.domain] = (sums[q.domain] || 0) + sev;
    counts[q.domain] = (counts[q.domain] || 0) + 1;
  }

  const averages = {} as Record<Domain, number>;
  const allDomains: Domain[] = ["stress", "sleep", "anxiety", "relationship", "motivation", "calm", "spiritual"];
  
  for (const d of allDomains) {
    const s = sums[d] || 0;
    const c = counts[d] || 0;
    averages[d] = c > 0 ? s / c : 0;
  }
  return averages;
}

function recommendGurus(
  tierId: TierId,
  domainAverages: Record<Domain, number>
): { primary: Guru; secondary?: Guru; cards: Guru[] } {
  // Tier 1 (Flourishing) -> Happiness / Spiritual
  if (tierId === 1) {
    return {
      primary: "Happiness",
      secondary: "Spiritual",
      cards: ["Happiness", "Spiritual", "Motivation"],
    };
  }

  // Tier 4 (Stabilization) -> Calm / Stress
  if (tierId === 4) {
    return {
      primary: "Calm",
      secondary: "Stress",
      cards: ["Calm", "Stress", "Sleep"],
    };
  }

  // Tiers 2 & 3 -> Domain specific
  const mapping: Array<{ domain: Domain; guru: Guru }> = [
    { domain: "sleep", guru: "Sleep" },
    { domain: "anxiety", guru: "Anxiety" },
    { domain: "relationship", guru: "Relationship" },
    { domain: "motivation", guru: "Motivation" },
    { domain: "stress", guru: "Stress" },
  ];

  // Sort by severity desc
  const sorted = mapping.sort((a, b) => {
    const valA = domainAverages[a.domain];
    const valB = domainAverages[b.domain];
    return valB - valA; // desc
  });

  const primary = sorted[0].guru;
  const secondary = sorted[1].guru;

  return {
    primary,
    secondary,
    cards: [primary, secondary, "Stress"],
  };
}

function computeStressAssessmentResult(
  config: AssessmentConfig,
  input: AssessmentInput
): AssessmentResult {
  const severitiesByQuestion: Record<string, number> = {};
  let severitySum = 0;

  for (const q of config.questions) {
    const ans = input.answers[q.id];
    let sev: number;

    if (q.type === "body_map") {
      sev = severityForBodyMap(ans as BodyMapAnswer);
    } else {
      const single = ans as SingleAnswer;
      if (!single || !single.optionId) {
        sev = 0;
      } else {
        const opt = q.options?.find((o) => o.id === single.optionId);
        if (!opt) sev = 0;
        else sev = opt.severity;
      }
    }

    severitiesByQuestion[q.id] = sev;
    severitySum += sev;
  }

  const N = config.questions.length;
  const maxSeverity = 3 * N;

  // Normalized ratio 0..1
  const ratio = maxSeverity > 0 ? severitySum / maxSeverity : 0;

  // Final score 10..100 (integer)
  const finalScore10to100 = clampInt(10 + ratio * 90, 10, 100);

  // Secondary 0..9 (integer)
  const stressLevel0to9 = clampInt(((finalScore10to100 - 10) / 90) * 9, 0, 9);

  const tier = computeTier(finalScore10to100);
  const domainAverages = computeDomainAverages(config, severitiesByQuestion);
  const recommended = recommendGurus(tier.id, domainAverages);

  return {
    version: config.version,
    completedAtISO: new Date().toISOString(),
    finalScore10to100,
    stressLevel0to9,
    tier,
    domainAverages,
    recommended,
    severitySum,
    maxSeverity,
  };
}

// --- Component ---

export default function StressAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const submitMutation = trpc.stressLeads.submit.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      if (data.emailSent) {
        setEmailSent(true);
        setEmailError(null);
      } else {
        setEmailSent(true);
        setEmailError("We saved your results, but the email did not send. Please try again later.");
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      setEmailError(error.message || "We could not save your request. Please try again.");
    },
  });

  const currentQuestion = STRESS_ASSESSMENT_V1.questions[currentQuestionIndex];
  const totalQuestions = STRESS_ASSESSMENT_V1.questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  const handleAnswer = (answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    
    // Auto-advance for single choice questions
    if (currentQuestion.type === 'single') {
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          finishAssessment({ ...answers, [currentQuestion.id]: answer });
        }
      }, 300);
    }
  };

  const handleBodyMapNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishAssessment(answers);
    }
  };

  const finishAssessment = (finalAnswers: Record<string, Answer | undefined>) => {
    const res = computeStressAssessmentResult(STRESS_ASSESSMENT_V1, { answers: finalAnswers });
    setResult(res);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setIsSubmitting(true);
    setEmailError(null);

    // Collect body map areas
    const bodyMapAnswer = answers['q1_body_map'] as BodyMapAnswer | undefined;
    const bodyMapAreas = bodyMapAnswer?.selectedAreas || [];

    // Convert domain averages to Record<string, number>
    const domainAvgs: Record<string, number> = {};
    for (const [key, val] of Object.entries(result.domainAverages)) {
      domainAvgs[key] = val;
    }

    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      score: result.finalScore10to100,
      stressLevel: result.stressLevel0to9,
      tierTitle: result.tier.title,
      tierId: result.tier.id,
      tierSummary: result.tier.summary,
      primaryGuru: result.recommended.primary,
      secondaryGuru: result.recommended.secondary,
      domainAverages: domainAvgs,
      answers: answers as Record<string, any>,
      bodyMapAreas,
    });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        {result.tier.id === 4 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-800 text-sm">
            <strong>Pause and get immediate help if you need it.</strong> This check-in cannot tell you what care you need. If you feel unsafe or at risk of harming yourself or someone else, call 911 or your local emergency number now.
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Your Check-In Results</h2>
          <p className="text-xl text-gray-500 mb-12">Use this response-based summary to decide what deserves your attention. This check-in does not diagnose stress or any condition.</p>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#B62427] to-[#D9383C]"></div>
            
            <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Your Response Score</div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.finalScore10to100 / 100)}
                    className="text-[#B62427]"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-5xl font-black text-gray-900 block">{result.finalScore10to100}</span>
                  <span className="text-sm font-bold text-gray-400 uppercase">Score</span>
                </div>
              </div>
              
              <div className="text-center md:text-left max-w-xs">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{result.tier.title}</h3>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600 mb-4">
                  Response level: {result.stressLevel0to9}/9
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {result.tier.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-8 mb-12 text-center">
          {emailSent ? (
            <div className="py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your report is on its way</h3>
              <p className="text-gray-500 text-sm">
                Check <strong>{email}</strong> for a copy of your check-in results and AI Guru suggestion.
              </p>
              {emailError && (
                <p className="text-amber-600 text-sm mt-3">{emailError}</p>
              )}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-[#7BDDE5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#7BDDE5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send Yourself a Copy</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Enter your name and email to receive this response summary and your suggested AI wellness Guru.
              </p>
              {emailError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                  {emailError}
                </div>
              )}
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5]/30 focus:border-[#7BDDE5]"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5]/30 focus:border-[#7BDDE5]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#7BDDE5] text-gray-900 font-bold rounded-full hover:bg-[#6ACCD4] transition-colors disabled:opacity-50 shadow-lg shadow-[#7BDDE5]/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing Your Report...
                    </>
                  ) : (
                    'Email My Results'
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2">Enter your email to receive the report shown here.</p>
              </form>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`/gurus/${result.recommended.primary.toLowerCase()}`}
            className="px-8 py-4 bg-[#7BDDE5] text-gray-900 font-bold rounded-full hover:bg-[#6ACCD4] transition-colors shadow-lg shadow-[#7BDDE5]/20"
          >
            Explore {result.recommended.primary} Guru
          </a>
          <button
            onClick={() => {
              setResult(null);
              setCurrentQuestionIndex(0);
              setAnswers({});
            }}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors"
          >
            Start Again
          </button>
        </div>
        
        {result.recommended.secondary && (
          <p className="text-center mt-6 text-gray-500 text-sm">
            You may also want to explore <a href={`/gurus/${result.recommended.secondary.toLowerCase()}`} className="text-gray-900 font-bold hover:underline">{result.recommended.secondary} Guru</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Notice What Is Asking for Your Attention</h2>
        <p className="text-xl text-gray-500">Twelve quick questions can help you spot the pressure affecting your sleep, focus, energy, or relationships.</p>
      </div>

      <div className="relative mb-16 px-2">
        <div className="flex justify-between text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
          <span>First question</span>
          <span>Your results</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#B62427] to-[#D9383C]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div 
          className="absolute top-6 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transition-all duration-500"
          style={{ left: `${Math.max(5, Math.min(95, progress))}%` }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {currentQuestion.title}
          </h3>
          <p className="text-gray-600 text-center mb-8 text-lg">
            {currentQuestion.intro}
          </p>

          {currentQuestion.type === 'body_map' ? (
            <div className="flex flex-col items-center">
              <BodyMap 
                onSelect={(areas) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: { selectedAreas: areas } }))}
                selectedParts={(answers[currentQuestion.id] as BodyMapAnswer)?.selectedAreas || []}
              />
              <button
                onClick={handleBodyMapNext}
                className="mt-8 px-8 py-3 bg-[#7BDDE5] text-gray-900 font-bold rounded-full hover:bg-[#6ACCD4] transition-colors shadow-lg shadow-[#7BDDE5]/20"
              >
                Next question
              </button>
            </div>
          ) : currentQuestion.id === 'q2_mental_weather' ? (
            <WeatherGrid 
              onSelect={(optionId) => handleAnswer({ optionId })}
              selectedOptionId={(answers[currentQuestion.id] as SingleAnswer)?.optionId}
            />
          ) : currentQuestion.id === 'q4_power_grid' ? (
            <BatteryGrid 
              onSelect={(optionId) => handleAnswer({ optionId })}
              selectedOptionId={(answers[currentQuestion.id] as SingleAnswer)?.optionId}
            />
          ) : (
            <div className="grid gap-4">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer({ optionId: option.id })}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 group
                    ${(answers[currentQuestion.id] as SingleAnswer)?.optionId === option.id
                      ? 'border-brand-primary bg-brand-primary text-white ring-2 ring-brand-primary/20'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-brand-primary/50 hover:shadow-md hover:text-gray-900'
                    }`}
                >
                  <div className={`p-3 rounded-full transition-colors
                    ${(answers[currentQuestion.id] as SingleAnswer)?.optionId === option.id
                      ? 'bg-white shadow-sm'
                      : 'bg-gray-50 group-hover:bg-white'
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span className={`text-lg font-medium transition-colors
                    ${(answers[currentQuestion.id] as SingleAnswer)?.optionId === option.id
                      ? 'text-white'
                      : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                    {option.label}
                  </span>
                  <ChevronRight className={`ml-auto w-5 h-5 transition-opacity
                    ${(answers[currentQuestion.id] as SingleAnswer)?.optionId === option.id
                      ? 'text-white opacity-100'
                      : 'text-gray-300 opacity-0 group-hover:opacity-100'
                    }`} 
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
