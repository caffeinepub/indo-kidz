import { useState, useEffect } from "react";
import { useAdmissionsContent, useUpdateAdmissionsContent } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function AdmissionsContentEditor() {
  const { data: content, isLoading } = useAdmissionsContent();
  const update = useUpdateAdmissionsContent();

  const [eligibility, setEligibility] = useState("");
  const [process, setProcess] = useState("");
  const [documents, setDocuments] = useState("");
  const [applicationSteps, setApplicationSteps] = useState("");
  const [portalLink, setPortalLink] = useState("");
  const [faq, setFaq] = useState("");

  useEffect(() => {
    if (content) {
      setEligibility(content.eligibility);
      setProcess(content.process);
      setDocuments(content.documents);
      setApplicationSteps(content.applicationSteps);
      setPortalLink(content.portalLink);
      setFaq(content.faq);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({ eligibility, process, documents, applicationSteps, portalLink, faq });
      toast.success("Admissions content updated! ✅");
    } catch {
      toast.error("Failed to update admissions content.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  const fields = [
    { label: "Eligibility Criteria", value: eligibility, setter: setEligibility, rows: 4 },
    { label: "Admission Process", value: process, setter: setProcess, rows: 5 },
    { label: "Required Documents", value: documents, setter: setDocuments, rows: 5 },
    { label: "Application Steps", value: applicationSteps, setter: setApplicationSteps, rows: 5 },
    { label: "FAQ", value: faq, setter: setFaq, rows: 6 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-fredoka text-2xl text-foreground">Edit Admissions Content</h2>
      </div>

      {fields.map(({ label, value, setter, rows }) => (
        <div key={label}>
          <Label>{label}</Label>
          <Textarea
            value={value}
            onChange={(e) => setter(e.target.value)}
            rows={rows}
            className="mt-1"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      ))}

      <div>
        <Label>Online Portal Link (optional)</Label>
        <Input
          value={portalLink}
          onChange={(e) => setPortalLink(e.target.value)}
          placeholder="https://..."
          className="mt-1"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={update.isPending}
        className="w-full bg-gradient-hero text-white hover:opacity-90 py-5 text-base font-bold rounded-xl"
      >
        {update.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Admissions Content</span>
        )}
      </Button>
    </div>
  );
}
