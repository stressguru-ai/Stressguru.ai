import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";

/**
 * Gurus Page - StressGuru
 * 
 * Design Philosophy: Visual Grid & Clear Navigation
 * Purpose: List all 8 Gurus so users can choose their specific path.
 */

export default function Gurus() {
  const gurus = [
    {
      name: "Stress Guru",
      role: "Reset Under Pressure",
      description: "For the moment a deadline, email, or family demand raises the pressure. Take a brief reset before choosing your next move.",
      image: "/images/ckfNdeCXRAEriBpm.png",
      link: "/gurus/stress",
      color: "bg-red-100 text-red-600"
    },
    {
      name: "Sleep Guru",
      role: "Wind Down for Rest",
      description: "When tomorrow is close and your mind is still at work, build a calmer wind-down routine after a packed day.",
      image: "/images/sDSBaqlRTTJBzglV.png",
      link: "/gurus/sleep",
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Anxiety Guru",
      role: "Step Out of Worry Loops",
      description: "When worry keeps circling one decision, use a grounding prompt and return to the task in front of you.",
      image: "/images/RiYvCLRiSOOKHHcr.png",
      link: "/gurus/anxiety",
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Motivation Guru",
      role: "Build Gentle Momentum",
      description: "For days when your task list feels heavier than your energy. Choose one manageable action and create a little forward motion.",
      image: "/images/dynzrWuhAjoaQmHN.png",
      link: "/gurus/motivation",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      name: "Relationship Guru",
      role: "Respond With Care",
      description: "When a small disagreement follows you through the house, pause before replying and find words that match what you mean.",
      image: "/images/RjEvlDvMOtWTRzEq.png",
      link: "/gurus/relationship",
      color: "bg-pink-100 text-pink-600"
    },
    {
      name: "Happiness Guru",
      role: "Make Room for Joy",
      description: "When responsibilities leave little room for lightness, notice one good moment and make time for something you enjoy.",
      image: "/images/xSeUQcwBWbWGSnFH.jpg",
      link: "/gurus/happiness",
      color: "bg-orange-100 text-orange-600"
    },
    {
      name: "Calm Guru",
      role: "Protect Quiet Time",
      description: "When alerts, conversations, and to-dos keep pulling at you, take a quiet pause and set one boundary around your time.",
      image: "/images/GjrsMwPTDhrCwQjg.jpg",
      link: "/gurus/calm",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      name: "Spiritual Guru",
      role: "Reflect on What Matters",
      description: "When work and family roles leave you asking what matters to you, make room to reflect on your values and next choice.",
      image: "/images/itZXkUHXnEimtTTz.png",
      link: "/gurus/spiritual",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <SEO 
        title="Meet 8 AI Wellness Personas for Stress, Sleep, Worry, and More | StressGuru"
        canonicalUrl="https://stressguru.ai/gurus"
        description="Explore StressGuru's AI wellness personas for pressure at work, bedtime worry, relationship tension, motivation, calm, and reflection. Choose one place to start."
        keywords={["AI wellness app", "stress reset app", "sleep routine app", "worry support app", "relationship communication app", "motivation app", "StressGuru gurus"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Meet Your Gurus", url: "/gurus" }
        ]}
      />
      
      {/* HERO SECTION - Standardized Layout */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/WHZoGnOCPWQCAOJf.jpg"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                Find a Guide for <br />
                <span className="font-bold text-[#7BDDE5]">This Moment</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                One busy day can follow you from the meeting room to 2 AM. Choose an AI wellness persona for what is taking up the most space, then start with one short session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gurus Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-24 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gurus.map((guru, index) => (
            <Link key={index} href={guru.link}>
              <div className="bg-white rounded-[2rem] p-8 h-full flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl border border-slate-100">
                <div className={`w-28 h-28 rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 ${guru.color} bg-opacity-20`}>
                  <img src={guru.image} alt={guru.name} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900 group-hover:text-[#7BDDE5] transition-colors">{guru.name}</h3>
                <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">{guru.role}</p>
                <p className="text-slate-600 text-base mb-8 flex-grow leading-relaxed">
                  {guru.description}
                </p>
                <Button variant="outline" className="w-full rounded-full border-slate-200 hover:bg-[#7BDDE5] hover:text-slate-900 hover:border-[#7BDDE5] transition-all font-semibold">
                  Explore {guru.name.split(" ")[0]}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* PROMISE SECTION */}
      <PromiseSection />
    </div>
  );
}
