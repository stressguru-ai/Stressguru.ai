import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Sparkles,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/blogs", icon: FileText, label: "Blog Management" },
  { href: "/admin/blogs/new", icon: Sparkles, label: "Create Blog" },
  { href: "/admin/gurus", icon: Users, label: "Guru Management" },
  { href: "/admin/leads", icon: ClipboardList, label: "Stress Leads" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setUsername(data.username);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7BDDE5]"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7BDDE5]"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-semibold text-slate-900">Admin Panel</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/vAUAzXpzpBlwAtwK.png"
                alt="StressGuru"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-bold text-slate-900">StressGuru</div>
                <div className="text-xs text-slate-500">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              // Use exact match for most routes, but allow prefix match only for /admin/blogs (not /admin/blogs/new)
              const isActive = 
                location === item.href ||
                (item.href === "/admin/blogs" && location.startsWith("/admin/blogs") && !location.startsWith("/admin/blogs/new") && location !== "/admin/blogs/new");
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#7BDDE5]/10 text-[#7BDDE5]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#7BDDE5]/20 flex items-center justify-center">
                <span className="text-sm font-medium text-[#7BDDE5]">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {username || "Admin"}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  admin@stressguru.ai
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
