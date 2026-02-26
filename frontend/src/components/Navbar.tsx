import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsOwner, useRegisterOwner, useHasOwner } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About Us', href: '#about' },
  { label: 'Learning', href: '#learning' },
  { label: 'Connection', href: '#connection' },
  { label: 'Fees', href: '/fees' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { isOwner, isLoading: ownerLoading, isFetched: ownerFetched } = useIsOwner();
  const { data: hasOwner, isFetched: hasOwnerFetched } = useHasOwner();
  const registerOwner = useRegisterOwner();

  // Auto-register the first authenticated user as owner (one-time operation)
  const hasAttemptedRegistration = useRef(false);

  useEffect(() => {
    // Only attempt registration if:
    // 1. User is authenticated and actor is ready
    // 2. hasOwner query has completed and returned false (no owner yet)
    // 3. isOwner query has completed and returned false (caller is not already owner)
    // 4. We haven't already tried this session
    // 5. No pending registration
    if (
      isAuthenticated &&
      actor &&
      !actorFetching &&
      hasOwnerFetched &&
      hasOwner === false &&
      ownerFetched &&
      !isOwner &&
      !ownerLoading &&
      !hasAttemptedRegistration.current &&
      !registerOwner.isPending
    ) {
      hasAttemptedRegistration.current = true;
      registerOwner.mutate(undefined, {
        onError: () => {
          // If registration fails (owner already exists), that's fine
          // The hasOwner and isOwner queries will be refetched automatically
        },
      });
    }
  }, [
    isAuthenticated,
    actor,
    actorFetching,
    hasOwnerFetched,
    hasOwner,
    ownerFetched,
    isOwner,
    ownerLoading,
    registerOwner.isPending,
  ]);

  // Reset the registration attempt flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasAttemptedRegistration.current = false;
    }
  }, [isAuthenticated]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate({ to: '/' });
        setTimeout(() => {
          const el2 = document.querySelector(href);
          if (el2) el2.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  // Show "Customize Site" only when we're certain the user is the owner
  const showCustomizeButton = isAuthenticated && ownerFetched && isOwner;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-playful group-hover:scale-110 transition-transform">
            <img
              src="/assets/generated/indo-kidz-logo.dim_256x256.png"
              alt="INDO KIDZ Logo"
              className="w-8 h-8 object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-fredoka text-2xl text-foreground tracking-wide">
            INDO <span className="text-primary">KIDZ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 rounded-xl font-semibold text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 rounded-xl font-semibold text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}

          {/* Customize Site link — only for the owner */}
          {showCustomizeButton && (
            <Link
              to="/admin"
              className="ml-1 px-4 py-2 rounded-xl font-semibold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5 border border-primary/30"
            >
              <Settings2 size={14} />
              Customize Site
            </Link>
          )}
        </nav>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className="rounded-2xl font-bold"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 rounded-xl font-semibold text-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}

          {/* Customize Site — mobile, owner only */}
          {showCustomizeButton && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-2 border border-primary/30"
            >
              <Settings2 size={16} />
              Customize Site
            </Link>
          )}

          <Button
            onClick={() => { handleAuth(); setMenuOpen(false); }}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className="mt-2 rounded-2xl font-bold"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>
      )}
    </header>
  );
}
