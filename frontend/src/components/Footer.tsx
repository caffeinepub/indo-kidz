import { useNavigate } from "@tanstack/react-router";
import { GraduationCap, MapPin, Phone, Mail, Heart } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || "indo-kidz-school");

  return (
    <footer className="bg-gradient-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-fredoka text-2xl">INDO KIDZ</h3>
                <p className="text-white/70 text-xs">Where Little Minds Bloom into Big Dreams</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Nurturing young minds with world-class education, innovative teaching methods, and a caring environment since 2015.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <SiFacebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <SiInstagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <SiX className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Admissions", path: "/admissions" },
                { label: "Fee Structure", path: "/fee-structure" },
                { label: "Gallery", path: "/gallery" },
                { label: "Fee Payment", path: "/fees-payment" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="text-white/80 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-fredoka text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-white/80 text-sm">Beside Nikhil Ashram, 495006, Bilaspur, Chhattisgarh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-white/80 text-sm">+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-white/80 text-sm">indokidz@school.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/70 text-sm">
            © {year} INDO KIDZ. All rights reserved.
          </p>
          <p className="text-white/70 text-sm flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-white transition-colors font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
