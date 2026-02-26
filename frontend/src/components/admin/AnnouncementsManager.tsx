import { useState } from "react";
import {
  useAnnouncements,
  useAddAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Megaphone, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface EditState {
  id: bigint;
  title: string;
  body: string;
  date: string;
}

export default function AnnouncementsManager() {
  const { data: announcements, isLoading } = useAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const today = new Date().toISOString().split("T")[0];
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newDate, setNewDate] = useState(today);
  const [editing, setEditing] = useState<EditState | null>(null);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("Please enter both title and body.");
      return;
    }
    try {
      await addAnnouncement.mutateAsync({ title: newTitle.trim(), body: newBody.trim(), date: newDate });
      setNewTitle("");
      setNewBody("");
      setNewDate(today);
      toast.success("Announcement added! ✅");
    } catch {
      toast.error("Failed to add announcement.");
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.body.trim()) {
      toast.error("Please enter both title and body.");
      return;
    }
    try {
      await updateAnnouncement.mutateAsync({
        id: editing.id,
        title: editing.title.trim(),
        body: editing.body.trim(),
        date: editing.date,
      });
      setEditing(null);
      toast.success("Announcement updated! ✅");
    } catch {
      toast.error("Failed to update announcement.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteAnnouncement.mutateAsync(id);
      toast.success("Announcement deleted.");
    } catch {
      toast.error("Failed to delete announcement.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="font-fredoka text-2xl text-foreground">Manage Announcements</h2>
      </div>

      {/* Add New */}
      <div className="border border-border rounded-xl p-5 bg-muted/30">
        <h3 className="font-semibold text-foreground mb-4">Add New Announcement</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Title *</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., School Holiday Notice"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Body *</Label>
            <Textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Announcement details..."
              rows={3}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={addAnnouncement.isPending}
            className="bg-gradient-hero text-white hover:opacity-90"
          >
            {addAnnouncement.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Announcement
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* List */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          All Announcements ({announcements?.length ?? 0})
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map((ann, idx) => {
              const id = BigInt(idx + 1);
              const isEditing = editing !== null && editing.id === id;

              return (
                <div key={idx} className="border border-border rounded-xl p-4 bg-white">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={editing.title}
                            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={editing.date}
                            onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Body</Label>
                        <Textarea
                          value={editing.body}
                          onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={updateAnnouncement.isPending}
                          className="bg-gradient-hero text-white hover:opacity-90"
                        >
                          {updateAnnouncement.isPending ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><Check className="w-4 h-4 mr-1" /> Save</>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{ann.title}</h4>
                          {ann.date && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                              {ann.date}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ann.body}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditing({ id, title: ann.title, body: ann.body, date: ann.date })}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{ann.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(id)}
                                className="bg-destructive text-white hover:bg-destructive/80"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No announcements yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
