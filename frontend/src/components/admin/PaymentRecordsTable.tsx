import { useState } from 'react';
import { useGetAllPaymentRecords, useUpdatePaymentStatus } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentStatus } from '../../backend';

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; emoji: string }> = {
  paid: { label: 'Paid', variant: 'default', emoji: '✅' },
  pending: { label: 'Pending', variant: 'secondary', emoji: '⏳' },
  unpaid: { label: 'Unpaid', variant: 'destructive', emoji: '❌' },
};

function getStatusKey(status: PaymentStatus): string {
  if (status === PaymentStatus.paid) return 'paid';
  if (status === PaymentStatus.pending) return 'pending';
  return 'unpaid';
}

export default function PaymentRecordsTable() {
  const { data: records, isLoading, refetch, isFetching } = useGetAllPaymentRecords();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdatePaymentStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const filtered = records?.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.feeTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || getStatusKey(r.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (recordId: bigint, newStatus: string) => {
    let status: PaymentStatus;
    if (newStatus === 'paid') status = PaymentStatus.paid;
    else if (newStatus === 'pending') status = PaymentStatus.pending;
    else status = PaymentStatus.unpaid;

    setUpdatingId(recordId);
    updateStatus(
      { recordId, status },
      {
        onSuccess: () => {
          toast.success('Payment status updated! ✅');
          setUpdatingId(null);
        },
        onError: (err) => {
          toast.error('Failed to update status.');
          console.error(err);
          setUpdatingId(null);
        },
      }
    );
  };

  return (
    <Card className="rounded-3xl border-2 border-border shadow-playful">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="font-fredoka text-2xl">Payment Records</CardTitle>
            <CardDescription>
              {records?.length ?? 0} total records
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-2xl font-bold flex items-center gap-2"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or fee type..."
              className="pl-9 rounded-2xl border-2 focus:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 rounded-2xl border-2">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">✅ Paid</SelectItem>
              <SelectItem value="pending">⏳ Pending</SelectItem>
              <SelectItem value="unpaid">❌ Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((record) => {
              const statusKey = getStatusKey(record.status);
              const statusInfo = STATUS_LABELS[statusKey];
              const isThisUpdating = updatingId === record.recordId;

              return (
                <div
                  key={record.recordId.toString()}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 bg-secondary/30 rounded-2xl p-4 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">{record.studentName}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        #{record.recordId.toString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {record.feeTitle} — <span className="font-semibold text-primary">Rp {Number(record.amount).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={statusInfo.variant} className="rounded-full px-3 py-1 font-semibold">
                      {statusInfo.emoji} {statusInfo.label}
                    </Badge>

                    <Select
                      value={statusKey}
                      onValueChange={(val) => handleStatusChange(record.recordId, val)}
                      disabled={isThisUpdating || isUpdating}
                    >
                      <SelectTrigger className="w-36 rounded-xl border-2 h-9 text-sm">
                        {isThisUpdating ? (
                          <span className="flex items-center gap-1">
                            <RefreshCw size={12} className="animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="paid">✅ Mark Paid</SelectItem>
                        <SelectItem value="pending">⏳ Mark Pending</SelectItem>
                        <SelectItem value="unpaid">❌ Mark Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-semibold text-lg">
              {search || statusFilter !== 'all' ? 'No records match your filters.' : 'No payment records yet.'}
            </p>
            <p className="text-sm mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Payment records will appear here once submitted.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
