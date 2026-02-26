import { Link } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6 animate-bounce-slow">🔒</div>
      <div className="bg-card rounded-3xl border-2 border-destructive/30 p-10 max-w-md shadow-playful-lg">
        <ShieldX size={48} className="text-destructive mx-auto mb-4" />
        <h2 className="font-fredoka text-3xl text-foreground mb-3">Access Denied</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Oops! This area is only for the school owner. You don't have permission to view this page.
        </p>
        <Link to="/">
          <Button className="rounded-2xl font-bold px-8">
            🏠 Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
