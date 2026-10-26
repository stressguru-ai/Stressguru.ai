import { Button } from "@/components/ui/button";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import PromiseSection from "@/components/PromiseSection";

/**
 * Contact Page - StressGuru
 * 
 * Design Philosophy: Modern Glassmorphism & Clean Layout
 * Features: Interactive form, social links, and direct contact info
 */

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative bg-white">
      <SEO 
        title="Contact StressGuru | App and Subscription Support"
        canonicalUrl="https://stressguru.ai/contact"
        description="Questions about the StressGuru iPhone or Apple Watch wellness app? Email us for help with app access, subscriptions, or website feedback."
        keywords={["contact StressGuru", "StressGuru support", "wellness app help", "app subscription support", "Apple Watch wellness app"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" }
        ]}
      />
      
      {/* HERO SECTION - Standardized Layout */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/BrEpZVklgXuxQzqX.jpg"
            alt=""
            className="w-full h-full object-cover object-[75%] md:object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-40">
          <div className="max-w-3xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg text-left">
                A Support Question Shouldn't <br />
                <span className="font-bold text-[#7BDDE5]">Take Over Your Afternoon.</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md text-left">
                Email StressGuru for help with app access, subscriptions, or website feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl relative z-10 -mt-10 pb-24 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-up h-full" style={{ animationDelay: "0.1s" }}>
            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl h-full border border-slate-100">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Get in Touch</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Questions about the app or your subscription? Email is the most direct way to reach us. StressGuru offers general wellness guidance and does not provide medical advice, diagnosis, therapy, or crisis care.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#7BDDE5]/10 flex items-center justify-center text-[#7BDDE5] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Email Support</h3>
                    <a href="mailto:support@StressGuru.ai" className="text-lg text-slate-600 hover:text-[#7BDDE5] transition-colors">
                      support@StressGuru.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Watch on YouTube</h3>
                    <a 
                      href="https://www.youtube.com/@stress_guru_wellness" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-slate-600 hover:text-[#FF0000] transition-colors"
                    >
                      @Stress_Guru_AI
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Follow StressGuru</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/Stress.Guru.Ai/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.373c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] p-10 shadow-xl animate-fade-up h-full border border-slate-100" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Make a Note Before You Email</h2>
            <p className="text-slate-600 leading-relaxed mb-8">This form helps you organize your question. It does not send a message. To contact support, email support@StressGuru.ai.</p>
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 h-full">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Email Support to Send Your Message</h3>
                <p className="text-lg text-slate-600 max-w-xs mx-auto">To make sure we receive your question, email support@StressGuru.ai. This form does not send messages.</p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-8 rounded-full px-8 border-slate-200 hover:bg-slate-50"
                >
                  Return to the Form
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-semibold text-slate-700 ml-1">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5] focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5] focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-topic" className="text-sm font-semibold text-slate-700 ml-1">Topic</label>
                  <select id="contact-topic" defaultValue="" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5] focus:border-transparent transition-all text-slate-600">
                    <option value="" disabled>Choose a topic</option>
                    <option value="general">General question</option>
                    <option value="support">App or subscription support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-question" className="text-sm font-semibold text-slate-700 ml-1">Your Question</label>
                  <textarea
                    id="contact-question"
                    placeholder="What would you like help with?"
                    required
                    rows={5}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="email-note"
                    required
                    className="w-5 h-5 rounded border-gray-300 text-[#7BDDE5] focus:ring-[#7BDDE5]"
                  />
                  <label htmlFor="email-note" className="text-sm text-slate-600 select-none cursor-pointer">
                    I understand this form does not send my message.
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#7BDDE5] hover:bg-[#5FCcd6] text-slate-900 font-bold py-6 rounded-xl text-lg transition-all hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Preparing Email Instructions..." : "Show Email Instructions"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* PROMISE SECTION */}
      <div className="mt-24">
        <PromiseSection />
      </div>
    </div>
  );
}
