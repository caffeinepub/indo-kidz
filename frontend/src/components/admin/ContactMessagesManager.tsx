import { useContactMessages } from "../../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Clock, MessageSquare, Inbox } from "lucide-react";

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

export default function ContactMessagesManager() {
  const { data: messages, isLoading, isError } = useContactMessages();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="font-fredoka text-2xl text-foreground">Contact Messages</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-destructive mx-auto mb-3 opacity-50" />
        <p className="text-destructive font-semibold">Failed to load messages.</p>
        <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  const sorted = messages ? [...messages].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="font-fredoka text-2xl text-foreground">Contact Messages</h2>
        </div>
        {sorted.length > 0 && (
          <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
            {sorted.length} {sorted.length === 1 ? "message" : "messages"}
          </Badge>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-gradient-section rounded-2xl border border-border">
          <Inbox className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="font-fredoka text-xl text-muted-foreground">No messages yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Messages submitted via the Contact Us form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((msg) => (
            <div
              key={String(msg.id)}
              className="rounded-2xl border border-border bg-white shadow-card p-5 hover:shadow-playful transition-shadow"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground">{msg.name}</span>
                  </div>
                  {msg.subject && (
                    <Badge variant="outline" className="text-xs font-medium">
                      {msg.subject}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimestamp(msg.timestamp)}</span>
                </div>
              </div>

              {/* Contact details */}
              <div className="flex flex-wrap gap-4 mb-3">
                {msg.email && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary/70" />
                    <a
                      href={`mailto:${msg.email}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {msg.email}
                    </a>
                  </div>
                )}
                {msg.phone && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary/70" />
                    <a
                      href={`tel:${msg.phone}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {msg.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Message body */}
              <div className="bg-gradient-section rounded-xl p-4 border border-border/50">
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
