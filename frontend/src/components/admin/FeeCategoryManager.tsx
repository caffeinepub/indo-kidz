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

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAmount) return;
    const amount = parseInt(newAmount, 10);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    addCategory(
      { name: newName.trim(), amount: BigInt(amount) },
      {
        onSuccess: () => {
          toast.success(`Fee category "${newName.trim()}" added! ✅`);
          setNewName('');
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
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditAmount(cat.amount.toString());
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditAmount('');
  };

  const handleEditSave = (cat: FeeCategory) => {
    const amount = parseInt(editAmount, 10);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    if (!editName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    updateCategory(
      { id: cat.id, name: editName.trim(), amount: BigInt(amount) },
      {
        onSuccess: () => {
          toast.success(`Fee category updated! ✅`);
          setEditingId(null);
          setEditName('');
          setEditAmount('');
        },
        onError: (err) => {
          toast.error('Failed to update fee category.');
          console.error(err);
        },
      }
    );
  };

  const handleDelete = (cat: FeeCategory) => {
    deleteCategory(cat.id, {
      onSuccess: () => {
        toast.success(`Fee category "${cat.name}" deleted.`);
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
              <Label htmlFor="newName" className="font-bold text-sm">Category Name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Tuition Fee, Activity Fee"
                className="rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
            <div className="w-full sm:w-48 space-y-1">
              <Label htmlFor="newAmount" className="font-bold text-sm">Amount (₹)</Label>
              <Input
                id="newAmount"
                type="number"
                min="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g., 1000"
                className="rounded-2xl border-2 focus:border-primary"
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={isAdding || !newName.trim() || !newAmount}
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
                  key={cat.id.toString()}
                  className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-4 border border-border"
                >
                  {editingId === cat.id ? (
                    <>
                      <div className="flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-xl border-2 focus:border-primary h-9 mb-2"
                          placeholder="Category name"
                          autoFocus
                        />
                      </div>
                      <Input
                        type="number"
                        min="0"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-36 rounded-xl border-2 focus:border-primary h-9"
                        placeholder="Amount"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditSave(cat)}
                        disabled={isUpdating}
                        className="rounded-xl text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Save"
                      >
                        {isUpdating ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEditCancel}
                        disabled={isUpdating}
                        className="rounded-xl text-muted-foreground hover:text-foreground"
                        title="Cancel"
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{cat.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹ {Number(cat.amount).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditStart(cat)}
                        disabled={isDeleting}
                        className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isDeleting}
                            className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-fredoka text-xl">
                              Delete Fee Category?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>"{cat.name}"</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat)}
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
              <div className="text-4xl mb-3">📂</div>
              <p className="font-semibold">No fee categories yet.</p>
              <p className="text-sm mt-1">Add your first category using the form above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Need to import RefreshCw for the loading spinner in edit mode
import { RefreshCw } from 'lucide-react';
