import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetFeeCategories, useSubmitFeePayment } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FeesPayment() {
  const { data: feeCategories, isLoading: categoriesLoading } = useGetFeeCategories();
  const { mutate: submitPayment, isPending } = useSubmitFeePayment();

  const [studentName, setStudentName] = useState('');
  const [selectedFee, setSelectedFee] = useState('');
  const [successRecord, setSuccessRecord] = useState<{ id: bigint; studentName: string; feeTitle: string; amount: bigint } | null>(null);

  const selectedCategory = feeCategories?.find((f) => f.title === selectedFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !selectedFee || !selectedCategory) return;

    submitPayment(
      {
        studentName: studentName.trim(),
        feeTitle: selectedFee,
        amount: selectedCategory.amount,
      },
      {
        onSuccess: (recordId) => {
          setSuccessRecord({
            id: recordId,
            studentName: studentName.trim(),
            feeTitle: selectedFee,
            amount: selectedCategory.amount,
          });
          toast.success('Payment record submitted successfully! 🎉');
        },
        onError: (err) => {
          toast.error('Failed to submit payment. Please try again.');
          console.error(err);
        },
      }
    );
  };

  const handleReset = () => {
    setSuccessRecord(null);
    setStudentName('');
    setSelectedFee('');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-semibold">
            <ArrowLeft size={18} />
            Back to Homepage
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <CreditCard size={14} className="text-primary" />
              <span className="text-sm font-bold text-primary">School Fees</span>
            </div>
            <h1 className="font-fredoka text-4xl md:text-5xl text-foreground mb-3">
              Fees Payment 💳
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Submit your fee payment record below. Our team will process and confirm your payment.
            </p>
          </div>
        </div>

        {/* Success State */}
        {successRecord ? (
          <div className="max-w-lg mx-auto">
            <Card className="rounded-3xl border-2 border-success/30 shadow-playful-lg text-center">
              <CardContent className="pt-10 pb-8 px-8">
                <CheckCircle size={64} className="text-success mx-auto mb-4" />
                <h2 className="font-fredoka text-3xl text-foreground mb-2">Payment Submitted! 🎉</h2>
                <p className="text-muted-foreground mb-6">
                  Your payment record has been successfully submitted. Please keep your record ID for reference.
                </p>
                <div className="bg-secondary rounded-2xl p-5 text-left space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold text-sm">Record ID</span>
                    <span className="font-bold text-primary">#{successRecord.id.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold text-sm">Student Name</span>
                    <span className="font-bold">{successRecord.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold text-sm">Fee Type</span>
                    <span className="font-bold">{successRecord.feeTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold text-sm">Amount</span>
                    <span className="font-bold text-primary">
                      Rp {Number(successRecord.amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold text-sm">Status</span>
                    <span className="font-bold text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full text-xs">
                      Pending
                    </span>
                  </div>
                </div>
                <Button onClick={handleReset} className="w-full rounded-2xl font-bold">
                  Submit Another Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Fee Categories */}
            <div>
              <h2 className="font-fredoka text-2xl text-foreground mb-5">Available Fee Categories</h2>
              {categoriesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              ) : feeCategories && feeCategories.length > 0 ? (
                <div className="space-y-3">
                  {feeCategories.map((fee) => (
                    <button
                      key={fee.title}
                      onClick={() => setSelectedFee(fee.title)}
                      className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 ${
                        selectedFee === fee.title
                          ? 'border-primary bg-primary/10 shadow-playful'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">{fee.title}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">Click to select</div>
                        </div>
                        <div className="font-fredoka text-2xl text-primary">
                          Rp {Number(fee.amount).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border-2 border-border p-8 text-center">
                  <AlertCircle size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-semibold">No fee categories available yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Please check back later or contact the school.</p>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="font-fredoka text-2xl text-foreground mb-5">Submit Payment Record</h2>
              <Card className="rounded-3xl border-2 border-border shadow-playful">
                <CardContent className="pt-6 pb-6 px-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="font-bold">
                        Student Name *
                      </Label>
                      <Input
                        id="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter student's full name"
                        className="rounded-2xl border-2 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feeType" className="font-bold">
                        Fee Type *
                      </Label>
                      <Select value={selectedFee} onValueChange={setSelectedFee}>
                        <SelectTrigger className="rounded-2xl border-2 focus:border-primary">
                          <SelectValue placeholder="Select fee category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {feeCategories?.map((fee) => (
                            <SelectItem key={fee.title} value={fee.title} className="rounded-xl">
                              {fee.title} — Rp {Number(fee.amount).toLocaleString('id-ID')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCategory && (
                      <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">Amount to Pay</span>
                          <span className="font-fredoka text-2xl text-primary">
                            Rp {Number(selectedCategory.amount).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-secondary/50 rounded-2xl p-4 text-sm text-muted-foreground">
                      <p className="font-semibold mb-1">📋 Note:</p>
                      <p>This submits a payment record. Actual payment processing will be confirmed by the school administration.</p>
                    </div>

                    <Button
                      type="submit"
                      disabled={!studentName.trim() || !selectedFee || isPending}
                      className="w-full rounded-2xl font-bold text-base py-5 shadow-playful"
                    >
                      {isPending ? 'Submitting...' : 'Submit Payment Record 💳'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
