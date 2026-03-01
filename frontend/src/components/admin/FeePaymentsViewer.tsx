import { useGetFeeCategories } from "../../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { IndianRupee, Tag, AlertCircle, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FeePaymentsViewer() {
  const { data: feeCategories, isLoading, isError } = useGetFeeCategories();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IndianRupee className="w-6 h-6 text-primary" />
          <h2 className="font-fredoka text-2xl text-foreground">Fee Payment Overview</h2>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3 opacity-50" />
        <p className="text-destructive font-semibold">Failed to load fee categories.</p>
        <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  const categories = feeCategories ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <IndianRupee className="w-6 h-6 text-primary" />
        <div>
          <h2 className="font-fredoka text-2xl text-foreground">Fee Payment Overview</h2>
          <p className="text-sm text-muted-foreground">Read-only view of all fee categories and amounts</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
          <Inbox className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="font-fredoka text-xl text-muted-foreground">No fee categories found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add fee categories from the <strong>Fee Structure</strong> tab.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Category Name</span>
            <span className="text-center">Category ID</span>
            <span className="text-right">Amount</span>
          </div>
          {categories.map((fee) => (
            <div
              key={fee.id.toString()}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{fee.name}</p>
                  <p className="text-xs text-muted-foreground">Fee Category</p>
                </div>
              </div>

              <div className="flex-1 text-center">
                <Badge variant="outline" className="text-xs font-mono">
                  #{fee.id.toString()}
                </Badge>
              </div>

              <div className="flex-1 text-right">
                <span className="inline-flex items-center gap-1 font-fredoka text-xl text-primary">
                  <IndianRupee className="w-4 h-4" />
                  {fee.amount.toString()}
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
            <span className="font-semibold text-foreground">
              Total Categories: <span className="text-primary">{categories.length}</span>
            </span>
            <span className="font-fredoka text-lg text-primary flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {categories.reduce((sum, f) => sum + Number(f.amount), 0).toLocaleString("en-IN")}
              <span className="text-sm font-normal text-muted-foreground ml-1">total across all categories</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
