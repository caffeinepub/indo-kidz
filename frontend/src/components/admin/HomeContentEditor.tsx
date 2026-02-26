import { useState, useEffect } from "react";
import { useHomeHeroSection, useUpdateHomeHeroSection } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Save, Home } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial } from "../../backend";

export default function HomeContentEditor() {
  const { data: hero, isLoading } = useHomeHeroSection();
  const update = useUpdateHomeHeroSection();

  const [schoolName, setSchoolName] = useState("");
  const [tagline, setTagline] = useState("");
  const [address, setAddress] = useState("");
  const [studentsEnrolled, setStudentsEnrolled] = useState("250");
  const [yearsOfExcellence, setYearsOfExcellence] = useState("9");
  const [facultyCount, setFacultyCount] = useState("15");
  const [highlight1, setHighlight1] = useState("");
  const [highlight2, setHighlight2] = useState("");
  const [highlight3, setHighlight3] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (hero) {
      setSchoolName(hero.schoolName);
      setTagline(hero.tagline);
      setAddress(hero.address);
      setStudentsEnrolled(hero.heroStats.studentsEnrolled.toString());
      setYearsOfExcellence(hero.heroStats.yearsOfExcellence.toString());
      setFacultyCount(hero.heroStats.facultyCount.toString());
      setHighlight1(hero.schoolHighlights.highlight1);
      setHighlight2(hero.schoolHighlights.highlight2);
      setHighlight3(hero.schoolHighlights.highlight3);
      setTestimonials([...hero.testimonials]);
    }
  }, [hero]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        schoolName,
        tagline,
        address,
        stats: {
          studentsEnrolled: BigInt(parseInt(studentsEnrolled) || 0),
          yearsOfExcellence: BigInt(parseInt(yearsOfExcellence) || 0),
          facultyCount: BigInt(parseInt(facultyCount) || 0),
        },
        highlights: { highlight1, highlight2, highlight3 },
        testimonials,
      });
      toast.success("Home content updated successfully! ✅");
    } catch {
      toast.error("Failed to update home content.");
    }
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { name: "", designation: "", feedback: "" }]);
  };

  const removeTestimonial = (i: number) => {
    setTestimonials(testimonials.filter((_, idx) => idx !== i));
  };

  const updateTestimonial = (i: number, field: keyof Testimonial, value: string) => {
    const updated = [...testimonials];
    updated[i] = { ...updated[i], [field]: value };
    setTestimonials(updated);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-primary" />
        <h2 className="font-fredoka text-2xl text-foreground">Edit Home Page Content</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>School Name</Label>
          <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Tagline</Label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
      </div>

      <div className="border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">📊 Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Students Enrolled</Label>
            <Input type="number" value={studentsEnrolled} onChange={(e) => setStudentsEnrolled(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Years of Excellence</Label>
            <Input type="number" value={yearsOfExcellence} onChange={(e) => setYearsOfExcellence(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Faculty Count</Label>
            <Input type="number" value={facultyCount} onChange={(e) => setFacultyCount(e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">✨ School Highlights</h3>
        <div className="space-y-3">
          <div>
            <Label>Highlight 1</Label>
            <Input value={highlight1} onChange={(e) => setHighlight1(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Highlight 2</Label>
            <Input value={highlight2} onChange={(e) => setHighlight2(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Highlight 3</Label>
            <Input value={highlight3} onChange={(e) => setHighlight3(e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">💬 Testimonials</h3>
          <Button size="sm" variant="outline" onClick={addTestimonial} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-border rounded-xl p-4 relative">
              <button
                onClick={() => removeTestimonial(i)}
                className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label>Name</Label>
                  <Input value={t.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input value={t.designation} onChange={(e) => updateTestimonial(i, "designation", e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Feedback</Label>
                <Textarea value={t.feedback} onChange={(e) => updateTestimonial(i, "feedback", e.target.value)} className="mt-1" rows={2} />
              </div>
            </div>
          ))}
        </div>
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
          <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Home Content</span>
        )}
      </Button>
    </div>
  );
}
