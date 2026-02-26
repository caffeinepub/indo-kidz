import { Heart, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'indo-kidz');

  return (
    <footer className="bg-foreground text-background mt-16">
      {/* Wavy top decoration */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full h-12 fill-background">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-fredoka text-3xl mb-3 text-primary">INDO KIDZ</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Where every child's curiosity is celebrated and every day is an adventure in learning.
              Innovative methods, creative approaches, and genuine connections.
            </p>
            <div className="flex gap-2 mt-4">
              {['🌟', '🎨', '📚', '🎵', '🌈'].map((emoji, i) => (
                <span key={i} className="text-xl animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka text-xl mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <button
                  onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary hover:opacity-100 transition-colors"
                >
                  🏠 Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary hover:opacity-100 transition-colors"
                >
                  ℹ️ About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#location')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary hover:opacity-100 transition-colors"
                >
                  📍 Visit Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary hover:opacity-100 transition-colors"
                >
                  📞 Contact Us
                </button>
              </li>
              <li>
                <a href="/fees" className="hover:text-primary hover:opacity-100 transition-colors">
                  💳 Pay Fees
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-fredoka text-xl mb-4 text-primary">Find Us</h4>
            <div className="flex items-start gap-2 text-sm opacity-80">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">
                Beside Nikhil Ashram, Bahtrai,<br />
                Bilaspur, Chhattisgarh - 495006
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <p>© {year} INDO KIDZ. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
