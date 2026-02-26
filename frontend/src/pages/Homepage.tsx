import { useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetHomepageContent, useGetFeeCategories } from '../hooks/useQueries';
import { Heart, Star, MapPin, Phone, Mail } from 'lucide-react';

const DEFAULT_CONTENT = {
  heroText: 'Where Learning Meets Joy!',
  tagline: "Innovative methods, creative approaches, and genuine connections — building tomorrow's leaders today.",
  aboutUs:
    'INDO KIDZ is a pioneering school from India that believes every child is a unique learner. We combine innovative teaching methods with a warm, nurturing environment to help each student discover their full potential. Our dedicated teachers build real connections with students, making school a place they love to be.',
  schoolAddress: 'Beside Nikhil Ashram, Bahtrai, Bilaspur, Chhattisgarh - 495006',
  contactInfo: 'Email: indokidz@school.in | Phone: +91-XXXXXXXXXX',
};

export default function Homepage() {
  const navigate = useNavigate();
  const { data: content, isLoading } = useGetHomepageContent();
  const { data: feeCategories } = useGetFeeCategories();

  const c = content || DEFAULT_CONTENT;
  const address = c.schoolAddress || DEFAULT_CONTENT.schoolAddress;
  const contactInfo = (c as typeof DEFAULT_CONTENT).contactInfo || DEFAULT_CONTENT.contactInfo;

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/school-hero.dim_1200x500.png"
            alt="INDO KIDZ School"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-accent/30 blur-xl" />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Star size={14} className="text-primary fill-primary" />
              <span className="text-sm font-bold text-primary">India's Most Innovative School</span>
            </div>

            {isLoading ? (
              <>
                <Skeleton className="h-16 w-3/4 mb-4 rounded-2xl" />
                <Skeleton className="h-6 w-full mb-2 rounded-xl" />
                <Skeleton className="h-6 w-5/6 rounded-xl" />
              </>
            ) : (
              <>
                <h1 className="font-fredoka text-5xl md:text-7xl text-foreground leading-tight mb-6">
                  {c.heroText || DEFAULT_CONTENT.heroText}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {c.tagline || DEFAULT_CONTENT.tagline}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-2xl font-bold text-base px-8 shadow-playful hover:shadow-playful-lg transition-shadow"
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Discover More 🚀
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl font-bold text-base px-8 border-2"
                onClick={() => navigate({ to: '/fees' })}
              >
                Pay Fees 💳
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Us Section ── */}
      <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
                <Heart size={14} className="text-accent-foreground" />
                <span className="text-sm font-bold text-accent-foreground">About INDO KIDZ</span>
              </div>
              <h2 className="font-fredoka text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                A School That Truly Cares 💛
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded-xl" />
                  <Skeleton className="h-4 w-5/6 rounded-xl" />
                  <Skeleton className="h-4 w-4/5 rounded-xl" />
                  <Skeleton className="h-4 w-full rounded-xl" />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {c.aboutUs || DEFAULT_CONTENT.aboutUs}
                </p>
              )}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: '🎯', text: 'Goal-Oriented' },
                  { icon: '🌱', text: 'Nurturing Growth' },
                  { icon: '🤗', text: 'Inclusive Community' },
                  { icon: '✨', text: 'Excellence in Education' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-playful-lg border-4 border-primary/20">
                <img
                  src="/assets/generated/kids-learning.dim_800x400.png"
                  alt="Kids Learning at INDO KIDZ"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-2xl px-5 py-3 shadow-playful font-bold text-sm">
                🏆 Award-Winning School
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-2xl px-4 py-2 shadow-playful font-bold text-sm">
                ⭐ Top Rated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner Decoration ── */}
      <div className="w-full overflow-hidden h-40 relative">
        <img
          src="/assets/generated/banner-decoration.dim_1200x300.png"
          alt="Decorative Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="font-fredoka text-3xl md:text-4xl text-white drop-shadow-lg text-center px-4">
            🌈 Learning is an Adventure! 🌈
          </h3>
        </div>
      </div>

      {/* ── Visit Us / Location Section ── */}
      <section id="location" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MapPin size={14} className="text-primary" />
              <span className="text-sm font-bold text-primary">Find Us</span>
            </div>
            <h2 className="font-fredoka text-4xl md:text-5xl text-foreground mb-6">
              Visit Us 📍
            </h2>
            {isLoading ? (
              <Skeleton className="h-20 w-full rounded-2xl" />
            ) : (
              <div className="bg-background rounded-3xl border-2 border-primary/20 shadow-playful px-8 py-7 inline-flex items-start gap-4 text-left w-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-base mb-1">INDO KIDZ School</p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact Us Section ── */}
      <section id="contact" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
              <Phone size={14} className="text-accent-foreground" />
              <span className="text-sm font-bold text-accent-foreground">Get In Touch</span>
            </div>
            <h2 className="font-fredoka text-4xl md:text-5xl text-foreground mb-6">
              Contact Us 📞
            </h2>
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-2xl" />
            ) : (
              <div className="bg-card rounded-3xl border-2 border-accent/30 shadow-playful px-8 py-7 text-left w-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={22} className="text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-base mb-2">INDO KIDZ School</p>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {contactInfo}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Fees Preview Section ── */}
      {feeCategories && feeCategories.length > 0 && (
        <section id="fees-preview" className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-fredoka text-4xl md:text-5xl text-foreground mb-4">
              School Fees 💳
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Transparent and affordable fee structure for all families.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              {feeCategories.slice(0, 3).map((fee) => (
                <div key={fee.title} className="bg-card rounded-3xl p-6 border-2 border-primary/20 shadow-playful">
                  <div className="font-fredoka text-xl text-foreground mb-2">{fee.title}</div>
                  <div className="text-3xl font-bold text-primary">
                    ₹ {Number(fee.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="rounded-2xl font-bold text-base px-10 shadow-playful"
              onClick={() => (window.location.href = '/fees')}
            >
              View All & Pay Now 💳
            </Button>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-fredoka text-4xl md:text-5xl mb-4">
            Ready to Join the INDO KIDZ Family? 🎉
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Give your child the gift of joyful, innovative learning. Enroll today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-2xl font-bold text-base px-10 shadow-playful"
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More 📚
            </Button>
            <Button
              size="lg"
              className="rounded-2xl font-bold text-base px-10 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => (window.location.href = '/fees')}
            >
              Pay Fees Now 💳
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
