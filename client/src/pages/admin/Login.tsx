import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, Shield, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLocation("/admin");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7BDDE5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7BDDE5]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7BDDE5] to-[#5BC4CC] flex items-center justify-center shadow-lg shadow-[#7BDDE5]/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">StressGuru Admin</h1>
          <p className="text-slate-400">Blog Management System</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#7BDDE5] focus:ring-[#7BDDE5]/20"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#7BDDE5] focus:ring-[#7BDDE5]/20"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#7BDDE5] to-[#5BC4CC] hover:from-[#6BCCD4] hover:to-[#4AB3BB] text-slate-900 font-semibold py-5 rounded-lg transition-all duration-200 shadow-lg shadow-[#7BDDE5]/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Admin Panel Features:</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#7BDDE5] mt-0.5">•</span>
                  <span>Create and edit blog posts with rich content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7BDDE5] mt-0.5">•</span>
                  <span>Generate AI-powered blogs using StoryBrand framework</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7BDDE5] mt-0.5">•</span>
                  <span>Manage Gurus and their ICP problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7BDDE5] mt-0.5">•</span>
                  <span>AI-generate hero images for blog posts</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 StressGuru. All rights reserved.
        </p>
      </div>
    </div>
  );
}
