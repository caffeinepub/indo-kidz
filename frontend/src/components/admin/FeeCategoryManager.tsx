import { useState } from 'react';
import {
  useGetFeeCategories,
  useAddFeeCategory,
  useUpdateFeeCategory,
  useDeleteFeeCategory,
} from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import type { FeeCategory } from '../../backend';

export default function FeeCategoryManager() {
  const { data: categories, isLoading } = useGetFeeCategories();
  const { mutate: addCategory, isPending: isAdding } = useAddFeeCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateFeeCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteFeeCategory();

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;
    const amount = parseInt(newAmount, 10);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    addCategory(
      { title: newTitle.trim(), amount: BigInt(amount) },
      {
        onSuccess: () => {
          toast.success(`Fee category "${newTitle.trim()}" added! ✅`);
          setNewTitle('');
          setNewAmount('');
        },
        onError: (err) => {
          toast.error('Failed to add fee category.');
          console.error(err);
        },
      }
    );
  };

  const handleEditStart = (cat: FeeCategory) => {
    setEditingTitle(cat.title);
    setEditAmount(cat.amount.toString());
  };

  const handleEditSave = (title: string) => {
    const amount = parseInt(editAmount, 10);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    updateCategory(
      { title, amount: BigInt(amount) },
      {
        onSuccess: () => {
          toast.success(`Fee category "${title}" updated! ✅`);
          setEditingTitle(null);
        },
        onError: (err) => {
          toast.error('Failed to update fee category.');
          console.error(err);
        },
      }
    );
  };

  const handleDelete = (title: string) => {
    deleteCategory(title, {
      onSuccess: () => {
        toast.success(`Fee category "${title}" deleted.`);
      },
      onError: (err) => {
        toast.error('Failed to delete fee category.');
        console.error(err);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <Card className="rounded-3xl border-2 border-border shadow-playful">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Add Fee Category</CardTitle>
          <CardDescription>Create a new fee type with its amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="newTitle" className="font-bold text-sm">Category Name</Label>
              <Input
                id="newTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Tuition Fee, Activity Fee"
                className="rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
            <div className="w-full sm:w-48 space-y-1">
              <Label htmlFor="newAmount" className="font-bold text-sm">Amount (Rp)</Label>
              <Input
                id="newAmount"
                type="number"
                min="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g., 500000"
                className="rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={isAdding || !newTitle.trim() || !newAmount}
                className="rounded-2xl font-bold flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus size={16} />
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card className="rounded-3xl border-2 border-border shadow-playful">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Manage Fee Categories</CardTitle>
          <CardDescription>
            {categories?.length ?? 0} categories available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.title}
                  className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-4 border border-border"
                >
                  {editingTitle === cat.title ? (
                    <>
                      <div className="flex-1 font-semibold text-foreground">{cat.title}</div>
                      <Input
                        type="number"
                        min="0"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-36 rounded-xl border-2 focus:border-primary h-9"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditSave(cat.title)}
                        disabled={isUpdating}
                        className="rounded-xl text-success hover:bg-success/10"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingTitle(null)}
                        className="rounded-xl text-muted-foreground hover:bg-muted"
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-bold text-foreground">{cat.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Rp {Number(cat.amount).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="font-fredoka text-xl text-primary">
                        Rp {Number(cat.amount).toLocaleString('id-ID')}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditStart(cat)}
                        className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-fredoka text-2xl">Delete Fee Category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{cat.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat.title)}
                              disabled={isDeleting}
                              className="rounded-2xl bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold">No fee categories yet.</p>
              <p className="text-sm mt-1">Add your first fee category above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
