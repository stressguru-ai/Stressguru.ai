import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/oura/ScrollReveal";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Getting Started",
    question: "What is StressGuru and how does it work?",
    answer: "StressGuru is an iPhone wellness app with eight AI wellness personas called Gurus. Open it when a hard meeting, crowded to-do list, sleepless hour, or tense conversation leaves you wanting a pause. Pick a Guru and use its prompts to sort through what is in front of you. If you connect an Apple Watch, its signals can offer context for a check-in. They do not diagnose, detect, prove, or predict stress or any health condition. StressGuru is a wellness app and does not replace therapy, healthcare, medical care, or crisis support."
  },
  {
    category: "Getting Started",
    question: "What is a Guru?",
    answer: "A Guru is an AI wellness persona in the StressGuru app. Each one is organized around a different kind of everyday pressure, such as work, sleep, relationships, calm, or meaning. Gurus are not clinicians, doctors, therapists, humans, or people with lived experience. Choose the Guru that best fits the moment you want to work through."
  },
  {
    category: "Getting Started",
    question: "Do I need an Apple Watch to use StressGuru?",
    answer: "No. You can open StressGuru on your iPhone whenever you want a wellness session. An Apple Watch is optional. If you connect one, its signals provide context that may prompt a check-in. They do not diagnose, detect, prove, or predict stress or a condition."
  },
  {
    category: "Getting Started",
    question: "Which iPhones and Apple Watch models are supported?",
    answer: "Check the current StressGuru listing in the App Store before you download. Apple updates device and operating-system compatibility over time."
  },
  {
    category: "Plans & Pricing",
    question: "What is included in the Relief plan?",
    answer: "Relief is the free StressGuru plan. It gives you a no-cost way to explore the app before choosing a paid plan. Review the current in-app plan details when you sign up."
  },
  {
    category: "Plans & Pricing",
    question: "What paid plans does StressGuru offer and how much do they cost?",
    answer: "Reset includes 2 sessions each month for $19.99 monthly or $199.99 yearly. Balance, marked Most Popular, includes 5 sessions each month for $49.99 monthly or $499.99 yearly. Thrive includes 20 sessions each month for $199.99 monthly or $1,999.99 yearly. Each annual plan equals two months free."
  },
  {
    category: "Plans & Pricing",
    question: "Can I buy additional sessions beyond my monthly allowance?",
    answer: "Yes. Extra sessions cost $12.99 each. Choose the plan that fits how often you want to use the app, then add a session when you need one."
  },
  {
    category: "Plans & Pricing",
    question: "How do I cancel my subscription?",
    answer: "For a subscription purchased through Apple, use your Apple subscription settings to review, change, or cancel it. Apple shows the renewal details there."
  },
  {
    category: "The Gurus",
    question: "What are the 8 Gurus and what does each one focus on?",
    answer: "StressGuru includes the Stress, Sleep, Anxiety, Resilience, Relationship, Happiness, Calm, and Spiritual Gurus. They are AI wellness personas organized around daily pressure, rest, worry, recovery, connection, joy, relaxation, and meaning. Select the one that matches what you want to reflect on or work through."
  },
  {
    category: "The Gurus",
    question: "Can I switch between Gurus during the same month?",
    answer: "You can choose the Guru that fits each session in your plan. A workday may call for the Stress Guru, while a restless evening may call for the Sleep Guru. Review your plan details in the app as you decide how to use your monthly sessions."
  },
  {
    category: "The Gurus",
    question: "How does the Relief plan work?",
    answer: "Relief is free. It is a low-pressure way to explore StressGuru and decide whether a paid session plan fits your needs. Check the current in-app plan details for what is available."
  },
  {
    category: "How It Works",
    question: "How do Apple Watch signals work in StressGuru?",
    answer: "When you choose to connect an Apple Watch, StressGuru can use Apple Watch signals as wellness context for a check-in. A notification can invite you to pause and decide whether to open a session. Those signals do not diagnose, detect, prove, or predict stress, a health condition, or what you should do next."
  },
  {
    category: "How It Works",
    question: "What happens in a session with a Guru?",
    answer: "A Guru is an AI wellness persona that uses conversation prompts to help you name what is pressing and consider a next step. You decide what to share and whether a prompt is useful. Gurus do not provide therapy, medical advice, diagnosis, or crisis care."
  },
  {
    category: "How It Works",
    question: "What does Guru Memory mean?",
    answer: "Review the current plan details in the app for available session-context features. You should always check what information is saved, how it is used, and what controls are available before sharing personal details."
  },
  {
    category: "Privacy & Security",
    question: "What should I consider before sharing personal information?",
    answer: "Read StressGuru's current privacy information and Apple App Store privacy label before you share personal details. Use your iPhone and app settings to review permissions and decide what you want the app to access."
  },
  {
    category: "Privacy & Security",
    question: "What happens to Apple Watch health information?",
    answer: "Apple Watch signals are optional wellness context. Review the app's current privacy information, Apple Health permissions, and your device settings to understand what you allow and how to change it."
  },
  {
    category: "Comparisons",
    question: "How is StressGuru different from other wellness apps?",
    answer: "Wellness apps offer different formats and plans. StressGuru centers on sessions with eight AI wellness personas, plus optional Apple Watch signals for context. Explore the app details and choose the format that helps you make space for the part of life you want to protect."
  },
  {
    category: "Comparisons",
    question: "Is StressGuru a replacement for therapy?",
    answer: "No. StressGuru is an AI wellness app for everyday moments, such as preparing for a hard conversation or winding down after work. It does not replace a licensed mental health professional, medical provider, emergency services, or crisis care. If you are in immediate danger, call 911. If you are in the United States and need crisis support, call or text 988 to reach the Suicide & Crisis Lifeline."
  },
  {
    category: "Comparisons",
    question: "How does StressGuru compare to traditional therapy in terms of cost?",
    answer: "StressGuru publishes its own wellness-session pricing: Reset is $19.99 monthly or $199.99 yearly for 2 sessions each month; Balance is $49.99 monthly or $499.99 yearly for 5; Thrive is $199.99 monthly or $1,999.99 yearly for 20. Extra sessions cost $12.99. StressGuru is not therapy or a substitute for professional care."
  },
  {
    category: "Conditions & Use Cases",
    question: "How can I use StressGuru around work pressure?",
    answer: "Open a session before a high-stakes presentation, after conflict with a colleague, or when your task list starts crowding out your attention. A Guru can help you pause, put the pressure into words, and choose a next step. StressGuru does not diagnose burnout or any health condition."
  },
  {
    category: "Conditions & Use Cases",
    question: "How can I use StressGuru as part of a bedtime routine?",
    answer: "Open the Sleep Guru when you want a quieter transition from the day to bed. You might use a session after late-night email, caregiving tasks, or a thought loop about tomorrow. StressGuru cannot treat insomnia or guarantee sleep."
  },
  {
    category: "Conditions & Use Cases",
    question: "What should I do if I need urgent help?",
    answer: "StressGuru is not crisis care, emergency support, or medical care. If you are in immediate danger, call 911. If you are in the United States and need crisis support, call or text 988 to reach the Suicide & Crisis Lifeline. For medical concerns, contact a qualified healthcare professional."
  }
];

const categories = Array.from(new Set(faqs.map(f => f.category)));

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-light text-center mb-6 text-slate-900 tracking-tight">
            Before you give up more of your <span className="font-bold">time.</span>
          </h2>
          <p className="text-lg text-slate-500 text-center mb-8 max-w-2xl mx-auto">
            Find clear answers about StressGuru, its plans, Apple Watch context, and when to seek care somewhere else.
          </p>
        </ScrollReveal>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All ({faqs.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat} ({faqs.filter(f => f.category === cat).length})
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredFaqs.map((faq, index) => (
              <ScrollReveal key={`${activeCategory}-${index}`} delay={Math.min(index * 0.05, 0.5)} width="100%">
                <AccordionItem value={`item-${index}`} className="border-b border-slate-100 last:border-0 px-4">
                  <AccordionTrigger className="text-lg md:text-xl font-medium text-slate-900 hover:text-[#7BDDE5] hover:no-underline py-6 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-lg text-slate-600 font-light leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

// Export FAQ data for use in SEO schema
export { faqs as faqData };
