import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function AccessDeniedScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldX className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="font-fredoka text-4xl text-foreground mb-3">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have permission to access this page. Only the school administrator can access the customization panel.
      </p>
      <Button onClick={() => navigate({ to: "/" })} className="bg-gradient-hero text-white hover:opacity-90">
        Back to Home
      </Button>
    </div>
  );
}
