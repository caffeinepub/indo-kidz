import { useAdmissionsContent } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, ClipboardList, Link, HelpCircle, GraduationCap } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const defaultContent = {
  eligibility: "Children aged 3-14 years are eligible for admission. Age proof (birth certificate) is mandatory. Students from all boards are welcome to apply.",
  process: "1. Fill the online/offline application form\n2. Submit required documents\n3. Attend the interaction session\n4. Receive admission confirmation\n5. Complete fee payment",
  documents: "• Birth Certificate\n• Aadhar Card (Child & Parent)\n• Previous School Transfer Certificate\n• Passport Size Photographs (4)\n• Address Proof\n• Medical Certificate",
  applicationSteps: "Step 1: Visit school or apply online\nStep 2: Fill application form completely\nStep 3: Submit documents at the office\nStep 4: Attend scheduled interaction\nStep 5: Pay admission fees",
  portalLink: "",
  faq: "Q: When do admissions open?\nA: Admissions open in January every year for the next academic session.\n\nQ: Is there an entrance test?\nA: No entrance test. We conduct a friendly interaction session.\n\nQ: What is the medium of instruction?\nA: English medium with Hindi as second language.",
};

const sections = [
  { key: "eligibility" as const, icon: Users, title: "Eligibility Criteria", color: "bg-blue-50 border-blue-200" },
  { key: "process" as const, icon: ClipboardList, title: "Admission Process", color: "bg-green-50 border-green-200" },
  { key: "documents" as const, icon: FileText, title: "Required Documents", color: "bg-yellow-50 border-yellow-200" },
  { key: "applicationSteps" as const, icon: CheckCircle, title: "Application Steps", color: "bg-purple-50 border-purple-200" },
  { key: "faq" as const, icon: HelpCircle, title: "Frequently Asked Questions", color: "bg-pink-50 border-pink-200" },
];

export default function Admissions() {
  const navigate = useNavigate();
  const { data: content, isLoading } = useAdmissionsContent();
  const c = content || defaultContent;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl text-white mb-4">Admissions</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Begin your child's journey to excellence at INDO KIDZ. We welcome bright young minds ready to explore, learn, and grow.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map(({ key, icon: Icon, title, color }) => {
                const text = c[key];
                if (!text) return null;
                return (
                  <div key={key} className={`rounded-2xl border-2 p-6 ${color} card-hover`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-fredoka text-2xl text-foreground">{title}</h2>
                    </div>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{text}</div>
                  </div>
                );
              })}

              {c.portalLink && (
                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center">
                      <Link className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-fredoka text-2xl text-foreground">Apply Online</h2>
                  </div>
                  <a
                    href={c.portalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-hero text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Visit Admission Portal →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-fredoka text-3xl sm:text-4xl text-foreground mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">Our admissions team is here to help you through every step of the process.</p>
          <button
            onClick={() => navigate({ to: "/contact" })}
            className="px-8 py-3 bg-gradient-hero text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-playful"
          >
            Contact Admissions Team
          </button>
        </div>
      </section>
    </div>
  );
}
