import { useGetAllPaymentRequests, useGetFeeCategories } from "../../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Inbox, Clock, User, IndianRupee } from "lucide-react";
import { Variant_pending_approved_rejected } from "../../backend";

function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp);
  if (!ms) return "—";
  const date = new Date(ms);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.approved) {
    return <Badge className="bg-success/15 text-success border-success/30 font-semibold">Approved</Badge>;
  }
  if (status === Variant_pending_approved_rejected.rejected) {
    return <Badge variant="destructive" className="font-semibold">Rejected</Badge>;
  }
  return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 font-semibold">Pending</Badge>;
}

export default function PaymentRequestsViewer() {
  const { data: requests, isLoading: requestsLoading, isError } = useGetAllPaymentRequests();
  const { data: feeCategories } = useGetFeeCategories();

  const getCategoryName = (categoryId: bigint): string => {
    if (!feeCategories) return `Category #${categoryId}`;
    const cat = feeCategories.find((c) => c.id === categoryId);
    return cat ? cat.name : `Category #${categoryId}`;
  };

  if (requestsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-primary" />
          <h2 className="font-fredoka text-2xl text-foreground">Payment Requests</h2>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-56" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-12 h-12 text-destructive mx-auto mb-3 opacity-50" />
        <p className="text-destructive font-semibold">Failed to load payment requests.</p>
        <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  const sorted = requests ? [...requests].sort((a, b) => Number(b.id) - Number(a.id)) : [];

  const pendingCount = sorted.filter((r) => r.status === Variant_pending_approved_rejected.pending).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary" />
          <h2 className="font-fredoka text-2xl text-foreground">Payment Requests</h2>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-300 font-semibold">
              {pendingCount} pending
            </Badge>
          )}
          {sorted.length > 0 && (
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
              {sorted.length} total
            </Badge>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-gradient-section rounded-2xl border border-border">
          <Inbox className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="font-fredoka text-xl text-muted-foreground">No payment requests yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Payment requests submitted by users will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-section border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <span>#</span> ID
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Payer
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Fee Category
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5" /> Amount
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground/70 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Submitted
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((req, idx) => (
                <tr
                  key={String(req.id)}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gradient-section/40"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{String(req.id)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs bg-muted px-2 py-0.5 rounded-lg text-foreground/70 max-w-[140px] truncate block"
                      title={req.payer.toString()}
                    >
                      {req.payer.toString().slice(0, 12)}…
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {getCategoryName(req.categoryId)}
                  </td>
                  <td className="px-4 py-3 font-fredoka text-primary text-base">
                    ₹{req.amount.toString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(req.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
