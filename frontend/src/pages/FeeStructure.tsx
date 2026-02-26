import { useGetFeeCategories } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, BookOpen, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function FeeStructure() {
  const navigate = useNavigate();
  const { data: fees, isLoading } = useGetFeeCategories();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <IndianRupee className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl text-white mb-4">Fee Structure</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Transparent and affordable fee structure designed to make quality education accessible to all.
          </p>
        </div>
      </section>

      {/* Fee Cards */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : fees && fees.length > 0 ? (
            <>
              <div className="text-center mb-10">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Academic Year 2025-26</Badge>
                <h2 className="font-fredoka text-3xl text-foreground">All Fee Categories</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fees.map((fee, i) => {
                  const colors = [
                    "from-blue-500 to-blue-600",
                    "from-purple-500 to-purple-600",
                    "from-green-500 to-green-600",
                    "from-orange-500 to-orange-600",
                    "from-pink-500 to-pink-600",
                    "from-teal-500 to-teal-600",
                  ];
                  const gradient = colors[i % colors.length];
                  return (
                    <div key={fee.id.toString()} className="bg-white rounded-2xl shadow-card card-hover overflow-hidden border border-border">
                      <div className={`bg-gradient-to-r ${gradient} p-4`}>
                        <BookOpen className="w-6 h-6 text-white mb-1" />
                        <h3 className="font-fredoka text-xl text-white">{fee.name}</h3>
                      </div>
                      <div className="p-5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-muted-foreground text-sm">₹</span>
                          <span className="font-fredoka text-4xl text-foreground">{fee.amount.toString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">per academic year</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Info className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-fredoka text-2xl text-foreground mb-2">Fee Structure Coming Soon</h3>
              <p className="text-muted-foreground">Please contact the school office for fee details.</p>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
            <h3 className="font-fredoka text-xl text-foreground mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" /> Important Note
            </h3>
            <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
              <li>Fees are subject to revision each academic year</li>
              <li>Scholarships available for meritorious students</li>
              <li>Fee concession for siblings studying in the same school</li>
              <li>Contact the school office for payment plans</li>
            </ul>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate({ to: "/fees-payment" })}
              className="px-8 py-3 bg-gradient-hero text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-playful"
            >
              Pay Fees Online →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
