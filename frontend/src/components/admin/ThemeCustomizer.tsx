import { useState, useEffect } from "react";
import { useThemeSettings, useUpdateThemeSettings } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

const FONT_OPTIONS = [
  { value: "Nunito", label: "Nunito (Default)" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
];

const PRESET_COLORS = [
  { label: "Ocean Blue", primary: "#3b82f6", accent: "#f59e0b" },
  { label: "Forest Green", primary: "#16a34a", accent: "#f97316" },
  { label: "Royal Purple", primary: "#7c3aed", accent: "#ec4899" },
  { label: "Crimson Red", primary: "#dc2626", accent: "#fbbf24" },
  { label: "Teal", primary: "#0d9488", accent: "#f59e0b" },
  { label: "Indigo", primary: "#4f46e5", accent: "#fb923c" },
];

export default function ThemeCustomizer() {
  const { data: theme, isLoading } = useThemeSettings();
  const update = useUpdateThemeSettings();

  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [fontChoice, setFontChoice] = useState("Nunito");

  useEffect(() => {
    if (theme) {
      setPrimaryColor(theme.primaryColor);
      setAccentColor(theme.accentColor);
      setFontChoice(theme.fontChoice);
    }
  }, [theme]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({ primaryColor, accentColor, fontChoice });
      toast.success("Theme settings saved! ✅");
    } catch {
      toast.error("Failed to save theme settings.");
    }
  };

  const applyPreset = (preset: { primary: string; accent: string }) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h2 className="font-fredoka text-2xl text-foreground">Theme Customizer</h2>
      </div>

      {/* Color Presets */}
      <div className="border border-border rounded-xl p-5 bg-muted/30">
        <h3 className="font-semibold text-foreground mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white hover:border-primary/50 hover:shadow-card transition-all text-left"
            >
              <div className="flex gap-1">
                <div
                  className="w-5 h-5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h3 className="font-semibold text-foreground mb-4">Custom Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 font-mono"
              />
            </div>
            <div
              className="mt-2 h-8 rounded-lg border border-border"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          <div>
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#f59e0b"
                className="flex-1 font-mono"
              />
            </div>
            <div
              className="mt-2 h-8 rounded-lg border border-border"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Font Choice */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h3 className="font-semibold text-foreground mb-3">Font Family</h3>
        <Select value={fontChoice} onValueChange={setFontChoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Note: Font changes are saved to the backend. A full theme rebuild may be needed to apply font changes site-wide.
        </p>
      </div>

      {/* Preview */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h3 className="font-semibold text-foreground mb-3">Preview</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div
            className="px-5 py-2 rounded-full text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Primary Button
          </div>
          <div
            className="px-5 py-2 rounded-full font-bold text-sm shadow-sm"
            style={{ backgroundColor: accentColor, color: "#1a1a1a" }}
          >
            Accent Button
          </div>
          <div
            className="px-4 py-2 rounded-full border-2 font-bold text-sm"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Outline Button
          </div>
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
          <span className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Theme Settings
          </span>
        )}
      </Button>
    </div>
  );
}
