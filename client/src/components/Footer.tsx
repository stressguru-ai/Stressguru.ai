import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent("StressGuru article updates");
    const body = encodeURIComponent(`Please add ${email.trim()} to the StressGuru article update list.`);
    window.location.href = `mailto:support@stressguru.ai?subject=${subject}&body=${body}`;
    setEmail("");
    toast.success("Opening your email app to send the request.");
  };
  const currentYear = 2026;

  return (
    <footer className="bg-[#F9F9F9] dark:bg-black text-black dark:text-white pt-24 pb-12 border-t border-[#E5E5E5] dark:border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
          {/* Brand & Newsletter - Oura Style: Clean, Left Aligned */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/">
              <div className="flex flex-col items-start cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/vAUAzXpzpBlwAtwK.png"
                    alt="StressGuru Logo"
                    className="h-20 w-20 object-contain rounded-full"
                  />
                  <span className="text-xl font-bold text-black dark:text-white tracking-tight leading-none">
                    StressGuru
                  </span>
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B62427]">
                  A calmer next step
                </span>
              </div>
            </Link>
            <p className="text-lg leading-relaxed max-w-md font-light text-black/80 dark:text-white/80">
              When work pressure follows you to dinner or a thought loop keeps you awake, choose your next step with care. StressGuru is an iPhone and Apple Watch wellness app with AI Guru sessions.
            </p>
            
            {/* Newsletter - Minimalist Input */}
            <div className="pt-4 max-w-sm">
              <h4 className="font-medium mb-4 text-black dark:text-white">Ask for StressGuru updates</h4>
              <p className="text-sm text-black/60 dark:text-white/60 mb-4 font-light">
                Get short notes about work pressure, sleep, relationships, and the mental load that follows you home.
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <Input 
                  type="email" 
                  placeholder="Email address"
                  className="bg-transparent border-b border-black/20 dark:border-white/20 rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-[#B62427] placeholder:text-black/40 dark:placeholder:text-white/40 transition-colors pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-[#B62427] transition-colors p-2"
                  aria-label="Subscribe to StressGuru updates"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links - Oura Style: Clean Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Gurus */}
            <div>
              <h4 className="font-medium mb-6 text-sm uppercase tracking-wider text-black/60 dark:text-white/60">Gurus</h4>
              <ul className="space-y-4">
                <li><Link href="/gurus/stress"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Stress Guru</span></Link></li>
                <li><Link href="/gurus/sleep"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Sleep Guru</span></Link></li>
                <li><Link href="/gurus/anxiety"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Anxiety Guru</span></Link></li>
                <li><Link href="/gurus/motivation"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Motivation Guru</span></Link></li>
                <li><Link href="/gurus/relationship"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Relationship Guru</span></Link></li>
                <li><Link href="/gurus/happiness"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Happiness Guru</span></Link></li>
                <li><Link href="/gurus/calm"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Calm Guru</span></Link></li>
                <li><Link href="/gurus/spiritual"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Spiritual Guru</span></Link></li>
              </ul>
            </div>

            {/* Topic Guides */}
            <div>
              <h4 className="font-medium mb-6 text-sm uppercase tracking-wider text-black/60 dark:text-white/60">Guides</h4>
              <ul className="space-y-4">
                <li><Link href="/stress-relief"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Stress relief</span></Link></li>
                <li><Link href="/burnout-prevention"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Burnout prevention</span></Link></li>
                <li><Link href="/anxiety-support"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Anxiety support</span></Link></li>
                <li><Link href="/sleep-better"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Sleep better</span></Link></li>
                <li><Link href="/motivation-and-energy"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Motivation & energy</span></Link></li>
                <li><Link href="/relationship-stress"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Relationship stress</span></Link></li>
                <li><Link href="/calm-and-mindfulness"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Calm & mindfulness</span></Link></li>
                <li><Link href="/meaning-and-spiritual-wellness"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Meaning & values</span></Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium mb-6 text-sm uppercase tracking-wider text-black/60 dark:text-white/60">Explore</h4>
              <ul className="space-y-4">
                <li><Link href="/about"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">About StressGuru</span></Link></li>
                <li><Link href="/how-it-works"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">How StressGuru works</span></Link></li>
                <li><Link href="/plans"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Plans & prices</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Contact</span></Link></li>
                <li><Link href="/blogs"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Articles</span></Link></li>
                <li><Link href="/books"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Books</span></Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-medium mb-6 text-sm uppercase tracking-wider text-black/60 dark:text-white/60">Help & policies</h4>
              <ul className="space-y-4">
                <li><a href="https://www.instagram.com/Stress.Guru.AI" target="_blank" rel="noopener noreferrer" className="hover:text-[#B62427] transition-colors font-light">Instagram</a></li>
                <li><a href="mailto:support@stressguru.ai" className="hover:text-[#B62427] transition-colors font-light">Support</a></li>
                <li><Link href="/privacy-policy"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Privacy Policy</span></Link></li>
                <li><Link href="/terms-and-conditions"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Terms & Conditions</span></Link></li>
                <li><Link href="/science-and-safety"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Safety information</span></Link></li>
                <li><Link href="/editorial-policy"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Editorial Policy</span></Link></li>
                <li><Link href="/accessibility"><span className="hover:text-[#B62427] cursor-pointer transition-colors font-light">Accessibility</span></Link></li>
              </ul>
              
              <div className="mt-8">
                <a
                  href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="rounded-full px-6 py-2 text-sm bg-[#7BDDE5] text-slate-900 hover:bg-[#5BC8D1] transition-colors w-full md:w-auto">
                    Get the app
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimalist */}
        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black/40 dark:text-white/40 text-sm font-light">
            © {currentYear} StressGuru. All rights reserved.
          </p>
          <p className="text-black/40 dark:text-white/40 text-sm font-light italic">
            Make room for sleep, focus, and connection.
          </p>
        </div>
      </div>
    </footer>
  );
}
