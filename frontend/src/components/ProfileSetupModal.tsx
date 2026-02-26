import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success(`Welcome to INDO KIDZ, ${name.trim()}! 🎉`);
        },
        onError: () => {
          toast.error('Failed to save profile. Please try again.');
        },
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="rounded-3xl border-2 border-primary/30 max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="text-5xl mb-2 text-center">👋</div>
          <DialogTitle className="font-fredoka text-3xl text-center text-foreground">
            Welcome to INDO KIDZ!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please tell us your name so we can personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="rounded-2xl border-2 border-border focus:border-primary"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full rounded-2xl font-bold text-base py-5"
          >
            {isPending ? 'Saving...' : "Let's Go! 🚀"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
