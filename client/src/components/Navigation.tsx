import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  
  // Check if we are on the home page
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine text color based on scroll state and page location
  // On Home page: White when at top (transparent bg), Black when scrolled (white bg)
  // On other pages: Always Black (or theme color)
  const getTextColorClass = () => {
    if (isHomePage && !scrolled) {
      return "text-white hover:text-[#7BDDE5]";
    }
    // Add text-shadow for better contrast on light backgrounds if needed, but primarily rely on dark text
    return "text-slate-900 dark:text-white hover:text-[#7BDDE5] font-semibold";
  };

  const getLogoTextColorClass = () => {
    if (isHomePage && !scrolled) {
      return "text-white";
    }
    return "text-slate-900 dark:text-white";
  };

  const gurus = [
    { label: "Stress Guru", href: "/gurus/stress", icon: "/images/ckfNdeCXRAEriBpm.png" },
    { label: "Sleep Guru", href: "/gurus/sleep", icon: "/images/sDSBaqlRTTJBzglV.png" },
    { label: "Anxiety Guru", href: "/gurus/anxiety", icon: "/images/RjEvlDvMOtWTRzEq.png" },
    { label: "Motivation Guru", href: "/gurus/motivation", icon: "/images/dynzrWuhAjoaQmHN.png" },
    { label: "Relationship Guru", href: "/gurus/relationship", icon: "/images/RiYvCLRiSOOKHHcr.png" },
    { label: "Happiness Guru", href: "/gurus/happiness", icon: "/images/xSeUQcwBWbWGSnFH.jpg" },
    { label: "Calm Guru", href: "/gurus/calm", icon: "/images/GjrsMwPTDhrCwQjg.jpg" },
    { label: "Spiritual Guru", href: "/gurus/spiritual", icon: "/images/itZXkUHXnEimtTTz.png" },
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "How StressGuru Works", href: "/how-it-works" },
    { label: "Choose a Guru", href: "/gurus", hasDropdown: true },
    { label: "Plans", href: "/plans" },
    { label: "Books", href: "/books" },
    { label: "Explore", href: "/more", hasMoreDropdown: true },
  ];

  const moreItems = [
    { label: "Your Stress Profile", href: "/stress-profile", description: "Explore the stress patterns you want to change" },
    { label: "Find Your Guru", href: "/quiz", description: "Use a short quiz to choose a Guru" },
    { label: "About StressGuru", href: "/about", description: "Why we built this wellness app" },
    { label: "Articles", href: "/blogs", description: "For work pressure, sleep, and relationships" },
    { label: "The App", href: "/app", description: "See the iPhone and Apple Watch app" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm py-4" 
          : isHomePage 
            ? "bg-transparent py-6" 
            : "bg-white/50 backdrop-blur-sm py-6" // Add semi-transparent background for non-home pages when at top
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo - Oura Style: Minimalist */}
        <Link href="/">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img
              src="/images/vAUAzXpzpBlwAtwK.png"
              alt="StressGuru Logo"
              className="h-24 w-24 object-contain rounded-full"
            />
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight leading-none transition-colors ${getLogoTextColorClass()}`}>
                StressGuru
              </span>
              <span className="text-[10px] font-bold text-[#B62427] tracking-widest uppercase mt-0.5">
                A calmer next step
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - Oura Style: Clean, Spaced Out */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            item.hasDropdown ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <span 
                    className={`text-lg font-medium cursor-pointer transition-colors relative group flex items-center gap-1 ${
                      location.startsWith(item.href)
                        ? "text-[#7BDDE5]" 
                        : getTextColorClass()
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3 h-3 opacity-50 ${isHomePage && !scrolled ? "text-white" : ""}`} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[600px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-white/10 p-6 shadow-xl rounded-2xl mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {gurus.map((guru) => (
                      <Link key={guru.href} href={guru.href}>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-3 p-3 hover:bg-[#F9F9F9] dark:hover:bg-white/5 rounded-xl transition-colors group">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 group-hover:border-[#7BDDE5] transition-colors">
                            <img 
                              src={guru.icon} 
                              alt={guru.label} 
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <span className="font-medium text-base text-black dark:text-white group-hover:text-[#B62427] transition-colors">{guru.label}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E5E5E5] dark:border-white/10">
                    <Link href="/gurus">
                      <DropdownMenuItem className="cursor-pointer font-medium justify-center text-[#B62427] hover:text-[#901D1F] hover:bg-transparent">
                        Explore all Gurus →
                      </DropdownMenuItem>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.hasMoreDropdown ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <span 
                    className={`text-lg font-medium cursor-pointer transition-colors relative group flex items-center gap-1 ${
                      moreItems.some(m => location === m.href)
                        ? "text-[#7BDDE5]" 
                        : getTextColorClass()
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3 h-3 opacity-50 ${isHomePage && !scrolled ? "text-white" : ""}`} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[280px] bg-white dark:bg-black border border-[#E5E5E5] dark:border-white/10 p-3 shadow-xl rounded-2xl mt-2">
                  {moreItems.map((moreItem) => (
                    <Link key={moreItem.href} href={moreItem.href}>
                      <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-0.5 p-3 hover:bg-[#F9F9F9] dark:hover:bg-white/5 rounded-xl transition-colors group">
                        <span className="font-medium text-base text-black dark:text-white group-hover:text-[#B62427] transition-colors">{moreItem.label}</span>
                        <span className="text-sm text-slate-500">{moreItem.description}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link key={item.href} href={item.href}>
                <span 
                  className={`text-lg font-medium cursor-pointer transition-colors relative group ${
                    location === item.href 
                      ? "text-[#7BDDE5]" 
                      : getTextColorClass()
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          ))}
        </div>

        {/* CTA Button - Oura Style: Pill Shape, Solid Color */}
        <div className="hidden md:flex">
          <a
            href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#7BDDE5] hover:bg-[#5BC8D1] text-slate-900 rounded-full px-8 py-6 text-lg font-medium shadow-none transition-all hover:scale-105">
              Get the app
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition-colors ${isHomePage && !scrolled ? "text-white" : "text-foreground"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.hasDropdown ? (
                  <div className="space-y-2">
                    <Link href={item.href}>
                      <span
                        className={`font-medium cursor-pointer block py-2 px-4 rounded-lg transition-colors ${
                          location === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </span>
                    </Link>
                      <div className="pl-4 space-y-2 mt-2">
                      {gurus.map((guru) => (
                        <Link key={guru.href} href={guru.href}>
                          <div 
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                              location === guru.href
                                ? "bg-slate-100 dark:bg-slate-800"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <img 
                              src={guru.icon} 
                              alt={guru.label} 
                              className="w-8 h-8 rounded-full object-cover object-top border border-slate-200"
                            />
                            <span className={`text-sm font-medium ${
                              location === guru.href ? "text-[#7BDDE5]" : "text-slate-600 dark:text-slate-300"
                            }`}>
                              {guru.label}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : item.hasMoreDropdown ? (
                  <div className="space-y-2">
                    <span
                      className="font-medium block py-2 px-4 rounded-lg text-foreground"
                    >
                      {item.label}
                    </span>
                    <div className="pl-4 space-y-1">
                      {moreItems.map((moreItem) => (
                        <Link key={moreItem.href} href={moreItem.href}>
                          <span
                            className={`font-medium cursor-pointer block py-2 px-4 rounded-lg transition-colors text-sm ${
                              location === moreItem.href
                                ? "bg-primary/10 text-primary"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {moreItem.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href}>
                    <span
                      className={`font-medium cursor-pointer block py-2 px-4 rounded-lg transition-colors ${
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-border mt-2">
              <a
                href="https://apps.apple.com/us/app/stressguru-ai/id6748682052"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full btn-primary">
                  Get the app
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
