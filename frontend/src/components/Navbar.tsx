import { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useActor } from "../hooks/useActor";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings, LogIn, LogOut, GraduationCap, Copy, Check } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Admissions", path: "/admissions" },
  { label: "Fee Structure", path: "/fee-structure" },
  { label: "Gallery", path: "/gallery" },
  { label: "Fee Payment", path: "/fees-payment" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const principalId = identity ? identity.getPrincipal().toString() : null;

  // Show the Customize button only when:
  // 1. User is authenticated
  // 2. Admin status has been resolved (not loading)
  // 3. Actor is not being fetched (no stale state)
  // 4. isAdmin is confirmed true
  const showCustomize = isAuthenticated && !actorFetching && !isAdminLoading && isAdmin === true;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleCopyPrincipal = async () => {
    if (!principalId) return;
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = principalId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-card border-b border-border">
      {/* Principal ID Banner */}
      {isAuthenticated && principalId && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-amber-700">🔑 Your Principal ID:</span>
            <code className="text-xs font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded select-all break-all">
              {principalId}
            </code>
            <button
              onClick={handleCopyPrincipal}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-colors"
              title="Copy principal ID"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-green-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-playful group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-fredoka text-xl text-primary">INDO KIDZ</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Where Little Minds Bloom</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative group ${
                  currentPath === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
                {currentPath === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showCustomize && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/admin" })}
                className="hidden sm:flex items-center gap-1.5 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Customize</span>
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className={`flex items-center gap-1.5 ${
                isAuthenticated
                  ? "bg-muted text-foreground hover:bg-destructive hover:text-white"
                  : "bg-gradient-hero text-white hover:opacity-90"
              } transition-all`}
            >
              {isLoggingIn ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isAuthenticated ? (
                <LogOut className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isLoggingIn ? "Logging in..." : isAuthenticated ? "Logout" : "Login"}
              </span>
            </Button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate({ to: link.path }); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  currentPath === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </button>
            ))}
            {showCustomize && (
              <button
                onClick={() => { navigate({ to: "/admin" }); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-primary bg-primary/10 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize Site
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
