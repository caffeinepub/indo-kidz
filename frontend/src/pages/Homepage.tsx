import { useHomeHeroSection, useGetFeeCategories, useAnnouncements } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Users, BookOpen, Star, MapPin, ChevronRight,
  Megaphone, Sparkles, Heart, Shield
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all">
      <Icon className="w-8 h-8 text-accent mb-2" />
      <span className="font-fredoka text-4xl text-white">{value}</span>
      <span className="text-white/80 text-sm font-medium mt-1">{label}</span>
    </div>
  );
}

function HighlightCard({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
  return (
    <div className={`p-6 rounded-2xl border-2 ${color} bg-white card-hover`}>
      <Icon className="w-8 h-8 mb-3 text-primary" />
      <p className="font-semibold text-foreground leading-snug">{title}</p>
    </div>
  );
}

export default function Homepage() {
  const navigate = useNavigate();
  const { data: hero, isLoading: heroLoading } = useHomeHeroSection();
  const { data: fees } = useGetFeeCategories();
  const { data: announcements } = useAnnouncements();

  const defaultHero = {
    schoolName: "INDO KIDZ",
    tagline: "Where Little Minds Bloom into Big Dreams",
    address: "Beside Nikhil Ashram, 495006, Bilaspur, Chhattisgarh",
    heroStats: { studentsEnrolled: BigInt(250), yearsOfExcellence: BigInt(9), facultyCount: BigInt(15) },
    schoolHighlights: {
      highlight1: "Spacious 3-acre campus in prime city location",
      highlight2: "Vast playground, digital classrooms, smart library",
      highlight3: "Highly qualified 1-to-15 teacher ratio",
    },
    testimonials: [
      { name: "Rakesh Sharma", designation: "Parent", feedback: "Excellent caring teachers, top city facilities, holistic child development." },
      { name: "Pooja Singh", designation: "Parent", feedback: "State-of-the-art technology aids in child growth and creativity." },
      { name: "Sunita Mishra", designation: "Local Principal", feedback: "Impressive focus on learning, critical thinking and individual development." },
    ],
  };

  const h = hero || defaultHero;

  const highlightIcons = [Sparkles, Heart, Shield];
  const highlightColors = ["border-primary/20", "border-accent/30", "border-success/20"];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-hero animate-gradient"
          style={{ backgroundSize: "200% 200%" }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/generated/school-hero.dim_1200x500.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Floating decorations */}
        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-accent/30 animate-float" />
        <div className="absolute bottom-32 left-10 w-14 h-14 rounded-full bg-white/20 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-40 left-1/4 w-8 h-8 rounded-full bg-white/15 animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl animate-slide-up">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 text-sm px-4 py-1">
              🌟 Bilaspur's Premier School
            </Badge>
            {heroLoading ? (
              <Skeleton className="h-16 w-3/4 mb-4 bg-white/20" />
            ) : (
              <h1 className="font-fredoka text-5xl sm:text-6xl lg:text-7xl text-white mb-4 leading-tight">
                {h.schoolName}
              </h1>
            )}
            {heroLoading ? (
              <Skeleton className="h-8 w-2/3 mb-6 bg-white/20" />
            ) : (
              <p className="text-xl sm:text-2xl text-white/90 font-semibold mb-6 leading-relaxed">
                {h.tagline}
              </p>
            )}
            <div className="flex items-center gap-2 text-white/80 mb-8">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm sm:text-base">{h.address}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ to: "/admissions" })}
                className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-warm flex items-center gap-2"
              >
                Apply Now <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate({ to: "/contact" })}
                className="px-8 py-3 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-all border border-white/30 backdrop-blur-sm"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Stats — only Students Enrolled and Expert Faculty */}
          <div className="grid grid-cols-2 gap-4 mt-12 max-w-md">
            <StatCard value={`${h.heroStats.studentsEnrolled}+`} label="Students Enrolled" icon={Users} />
            <StatCard value={`${h.heroStats.facultyCount}+`} label="Expert Faculty" icon={GraduationCap} />
          </div>
        </div>
      </section>

      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <section className="bg-accent/10 border-y border-accent/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
                <Megaphone className="w-4 h-4" />
                News
              </div>
              <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                {announcements.map((ann, i) => (
                  <span key={i} className="text-sm font-medium text-foreground/80 whitespace-nowrap">
                    📢 <strong>{ann.title}</strong>: {ann.body}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why INDO KIDZ */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Why Choose Us</Badge>
            <h2 className="font-fredoka text-4xl sm:text-5xl text-foreground mb-4">
              Why INDO KIDZ Stands Out
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We believe every child is unique. Our holistic approach ensures academic excellence, character building, and joyful learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[h.schoolHighlights.highlight1, h.schoolHighlights.highlight2, h.schoolHighlights.highlight3].map((hl, i) => (
              <HighlightCard key={i} icon={highlightIcons[i]} title={hl} color={highlightColors[i]} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30">About INDO KIDZ</Badge>
              <h2 className="font-fredoka text-4xl sm:text-5xl text-foreground mb-6">
                Shaping Tomorrow's Leaders Today
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                INDO KIDZ is Bilaspur's most trusted educational institution, dedicated to nurturing young minds with a perfect blend of academics, arts, sports, and values. Our state-of-the-art campus provides an inspiring environment where curiosity thrives.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our dedicated faculty, innovative curriculum, and supportive community make INDO KIDZ the first choice for parents who want the best for their children.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: "CBSE Curriculum", desc: "Nationally recognized" },
                  { icon: Heart, label: "Holistic Growth", desc: "Mind, body & soul" },
                  { icon: Star, label: "Award Winning", desc: "State recognized" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/kids-learning.dim_800x400.png"
                alt="Students learning at INDO KIDZ"
                className="rounded-3xl shadow-playful w-full object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground p-4 rounded-2xl shadow-warm">
                <p className="font-fredoka text-2xl">250+</p>
                <p className="text-xs font-semibold">Happy Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Preview */}
      {fees && fees.length > 0 && (
        <section className="py-20 bg-gradient-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Transparent Pricing</Badge>
              <h2 className="font-fredoka text-4xl sm:text-5xl text-foreground mb-4">Fee Structure</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Affordable quality education with transparent fee structure</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {fees.slice(0, 6).map((fee) => (
                <div key={fee.id.toString()} className="bg-white rounded-2xl p-5 shadow-card card-hover border border-border">
                  <p className="font-semibold text-foreground">{fee.name}</p>
                  <p className="font-fredoka text-2xl text-primary mt-1">₹{fee.amount.toString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">per year</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate({ to: "/fee-structure" })}
                className="px-8 py-3 bg-gradient-hero text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-playful"
              >
                View Full Fee Structure
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30">Testimonials</Badge>
            <h2 className="font-fredoka text-4xl sm:text-5xl text-foreground mb-4">What Parents Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {h.testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-section rounded-2xl p-6 border border-border card-hover">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">"{t.feedback}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-fredoka">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-fredoka text-4xl sm:text-5xl text-white mb-4">
            Ready to Join the INDO KIDZ Family?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Give your child the gift of quality education in a nurturing, innovative environment. Admissions are open now!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/admissions" })}
              className="px-10 py-4 bg-accent text-accent-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-warm text-lg"
            >
              Apply for Admission 🎓
            </button>
            <button
              onClick={() => navigate({ to: "/contact" })}
              className="px-10 py-4 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-all border border-white/30 text-lg"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
