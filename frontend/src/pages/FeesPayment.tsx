import { useState } from "react";
import { useGetFeeCategories } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle, IndianRupee, User, Phone, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function FeesPayment() {
  const { data: fees, isLoading } = useGetFeeCategories();
  const [form, setForm] = useState({ studentName: "", rollNo: "", phone: "", category: "", paymentMode: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedFee = fees?.find((f) => f.id.toString() === form.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.category || !form.paymentMode) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Payment request submitted successfully!");
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="font-fredoka text-4xl text-foreground mb-3">Payment Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            Your payment request for <strong>{selectedFee?.name}</strong> has been submitted.
          </p>
          <p className="text-muted-foreground mb-6">
            Amount: <strong className="text-primary">₹{selectedFee?.amount.toString()}</strong>
          </p>
          <p className="text-sm text-muted-foreground bg-muted rounded-xl p-4 mb-6">
            Please visit the school office with your payment receipt to complete the process. Our staff will assist you.
          </p>
          <Button
            onClick={() => { setSubmitted(false); setForm({ studentName: "", rollNo: "", phone: "", category: "", paymentMode: "" }); }}
            className="bg-gradient-hero text-white hover:opacity-90"
          >
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl text-white mb-4">Fee Payment</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Quick and easy fee payment for INDO KIDZ students.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-playful p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-fredoka text-2xl text-foreground">Payment Form</h2>
                <p className="text-sm text-muted-foreground">Fill in the details to proceed</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="studentName" className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-4 h-4 text-primary" /> Student Name *
                </Label>
                <Input
                  id="studentName"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rollNo" className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-4 h-4 text-primary" /> Roll Number
                </Label>
                <Input
                  id="rollNo"
                  value={form.rollNo}
                  onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                  placeholder="Enter roll number (optional)"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-4 h-4 text-primary" /> Parent's Phone
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1.5 mb-1.5">
                  <IndianRupee className="w-4 h-4 text-primary" /> Fee Category *
                </Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full rounded-lg" />
                ) : (
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee category" />
                    </SelectTrigger>
                    <SelectContent>
                      {fees && fees.length > 0 ? (
                        fees.map((fee) => (
                          <SelectItem key={fee.id.toString()} value={fee.id.toString()}>
                            {fee.name} — ₹{fee.amount.toString()}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No fee categories available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedFee && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="font-fredoka text-3xl text-primary">₹{selectedFee.amount.toString()}</p>
                </div>
              )}

              <div>
                <Label className="flex items-center gap-1.5 mb-1.5">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment Mode *
                </Label>
                <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash at School Office</SelectItem>
                    <SelectItem value="upi">UPI Transfer</SelectItem>
                    <SelectItem value="bank">Bank Transfer / NEFT</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="dd">Demand Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-hero text-white hover:opacity-90 py-6 text-lg font-bold rounded-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Submit Payment Request 💳"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Note:</strong> This form submits a payment request. Please visit the school office with your payment to complete the transaction. For UPI/Bank transfers, contact the office for account details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
