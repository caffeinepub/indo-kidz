import { useState, useEffect } from 'react';
import { useGetHomepageContent, useUpdateHomepageContent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Save, RefreshCw, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { HomepageContent } from '../../backend';

const DEFAULT_CONTENT: HomepageContent = {
  heroText: 'Where Learning Meets Joy!',
  tagline: "Innovative methods, creative approaches, and genuine connections — building tomorrow's leaders today.",
  aboutUs:
    'INDO KIDZ is a pioneering school that believes every child is a unique learner. We combine innovative teaching methods with a warm, nurturing environment to help each student discover their full potential.',
  learningMethods:
    'Our learning approach blends hands-on activities, digital tools, project-based learning, and creative arts. We use storytelling, music, movement, and play to make every lesson memorable and meaningful.',
  studentConnection:
    'At INDO KIDZ, we believe strong relationships are the foundation of great learning. Our teachers know every student by name, celebrate their achievements, and support them through challenges.',
  schoolAddress: 'Beside Nikhil Ashram, Bahtrai, Bilaspur, Chhattisgarh - 495006',
  contactInfo: 'Email: indokidz@school.in | Phone: +91-XXXXXXXXXX',
};

interface FieldConfig {
  key: keyof HomepageContent;
  label: string;
  sectionNote: string;
  helpText: string;
  multiline?: boolean;
  placeholder: string;
}

const fields: FieldConfig[] = [
  {
    key: 'heroText',
    label: '🦸 Main Heading',
    sectionNote: 'Shown at the very top of your homepage — the first thing visitors read',
    helpText:
      'This is the big bold title on your homepage. Keep it short and welcoming, e.g. "Where Learning Meets Joy!"',
    placeholder: 'e.g. Where Learning Meets Joy!',
  },
  {
    key: 'tagline',
    label: '✨ Tagline',
    sectionNote: 'Shown just below the main heading on your homepage',
    helpText:
      "A short sentence that describes your school's mission or values. Visitors read this right after the main heading.",
    multiline: true,
    placeholder:
      "e.g. Innovative methods, creative approaches, and genuine connections — building tomorrow's leaders today.",
  },
  {
    key: 'aboutUs',
    label: 'ℹ️ About Us Description',
    sectionNote: 'Shown in the "About INDO KIDZ" section on your homepage',
    helpText:
      'Tell visitors about your school — its values, teaching style, and what makes it special. A few sentences work best.',
    multiline: true,
    placeholder: 'e.g. INDO KIDZ is a pioneering school that believes every child is a unique learner...',
  },
  {
    key: 'schoolAddress',
    label: '📍 School Address',
    sectionNote: 'Shown in the "Visit Us" section on your homepage',
    helpText:
      "Your school's physical address so parents and visitors can find you. This appears on the homepage with a map pin icon.",
    multiline: true,
    placeholder: 'e.g. Beside Nikhil Ashram, Bahtrai, Bilaspur, Chhattisgarh - 495006',
  },
  {
    key: 'contactInfo',
    label: '📞 Contact Us',
    sectionNote: 'Shown in the "Contact Us" section on your homepage',
    helpText:
      'This contact information will be displayed in the Contact Us section on the public homepage. Include email, phone, and any other details you want visitors to see.',
    multiline: true,
    placeholder: 'e.g. Email: indokidz@school.in | Phone: +91-XXXXXXXXXX\nAddress: ...',
  },
];

export default function ContentEditor() {
  const { data: content, isLoading } = useGetHomepageContent();
  const { mutate: updateContent, isPending } = useUpdateHomepageContent();

  const [form, setForm] = useState<HomepageContent>(DEFAULT_CONTENT);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (content) {
      const merged: HomepageContent = {
        heroText: content.heroText || DEFAULT_CONTENT.heroText,
        tagline: content.tagline || DEFAULT_CONTENT.tagline,
        aboutUs: content.aboutUs || DEFAULT_CONTENT.aboutUs,
        learningMethods: content.learningMethods || DEFAULT_CONTENT.learningMethods,
        studentConnection: content.studentConnection || DEFAULT_CONTENT.studentConnection,
        schoolAddress: content.schoolAddress || DEFAULT_CONTENT.schoolAddress,
        contactInfo: content.contactInfo || DEFAULT_CONTENT.contactInfo,
      };
      setForm(merged);
      setIsDirty(false);
    }
  }, [content]);

  const handleChange = (field: keyof HomepageContent, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateContent(form, {
      onSuccess: () => {
        toast.success('Website content updated! Your homepage now shows the new text. ✅');
        setIsDirty(false);
      },
      onError: (err) => {
        toast.error('Could not save changes. Please try again.');
        console.error(err);
      },
    });
  };

  const handleReset = () => {
    if (content) {
      setForm({
        heroText: content.heroText || DEFAULT_CONTENT.heroText,
        tagline: content.tagline || DEFAULT_CONTENT.tagline,
        aboutUs: content.aboutUs || DEFAULT_CONTENT.aboutUs,
        learningMethods: content.learningMethods || DEFAULT_CONTENT.learningMethods,
        studentConnection: content.studentConnection || DEFAULT_CONTENT.studentConnection,
        schoolAddress: content.schoolAddress || DEFAULT_CONTENT.schoolAddress,
        contactInfo: content.contactInfo || DEFAULT_CONTENT.contactInfo,
      });
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Card className="rounded-3xl border-2 border-border shadow-playful">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Edit Your Website Text</CardTitle>
          <CardDescription>
            Update the text shown on your homepage. After clicking "Save Changes", your website updates immediately — no
            waiting needed!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          {fields.map(({ key, label, sectionNote, helpText, multiline, placeholder }) => (
            <div key={key} className="space-y-2">
              {/* Label row with tooltip */}
              <div className="flex items-center gap-2">
                <Label htmlFor={key} className="font-bold text-sm">
                  {label}
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                      <HelpCircle size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs">
                    {helpText}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Section note */}
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                {sectionNote}
              </p>

              {/* Input */}
              {multiline ? (
                <Textarea
                  id={key}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="rounded-2xl border-2 focus:border-primary min-h-[100px] resize-y"
                />
              ) : (
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="rounded-2xl border-2 focus:border-primary"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!isDirty || isPending}
              className="rounded-2xl font-bold flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
            {isDirty && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isPending}
                className="rounded-2xl font-bold"
              >
                Undo Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
