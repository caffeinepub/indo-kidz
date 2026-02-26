import { useState, useEffect } from 'react';
import { useGetSchoolInfo, useUpdateSchoolInfo } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Save, RefreshCw, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { SchoolInfo } from '../../backend';

const DEFAULT_INFO: SchoolInfo = {
  schoolName: 'Indokidz School',
  adminContactInfo: '',
  phoneNumber: '+91-XXXXXXXXXX',
  emailAddress: 'indokidz@school.in',
  address: 'Teosa, Maharashtra, 444902',
  principalName: '',
  facebookLink: 'https://facebook.com/IndokidzSchool',
  twitterLink: 'https://twitter.com/IndokidzSchool',
  instagramLink: 'https://instagram.com/IndokidzSchool',
  website: 'https://www.indokidzschool.in',
};

interface FieldConfig {
  key: keyof SchoolInfo;
  label: string;
  helpText: string;
  placeholder: string;
  type?: string;
}

const fields: FieldConfig[] = [
  {
    key: 'schoolName',
    label: '🏫 School Name',
    helpText: 'The official name of your school displayed across the website.',
    placeholder: 'e.g. Indokidz School',
  },
  {
    key: 'principalName',
    label: '👤 Principal\'s Name',
    helpText: 'The name of the school principal.',
    placeholder: 'e.g. Dr. Ramesh Kumar',
  },
  {
    key: 'phoneNumber',
    label: '📞 Phone Number',
    helpText: 'The main contact phone number for the school.',
    placeholder: 'e.g. +91-9876543210',
    type: 'tel',
  },
  {
    key: 'emailAddress',
    label: '✉️ Email Address',
    helpText: 'The official school email address.',
    placeholder: 'e.g. info@school.in',
    type: 'email',
  },
  {
    key: 'address',
    label: '📍 Physical Address',
    helpText: 'The full physical address of the school.',
    placeholder: 'e.g. Teosa, Maharashtra, 444902',
  },
  {
    key: 'adminContactInfo',
    label: '📋 Additional Contact Info',
    helpText: 'Any extra contact details you want to display (e.g. office hours, alternate phone).',
    placeholder: 'e.g. Office hours: Mon–Fri, 9am–5pm',
  },
  {
    key: 'website',
    label: '🌐 Website URL',
    helpText: 'The official school website URL.',
    placeholder: 'e.g. https://www.indokidzschool.in',
    type: 'url',
  },
  {
    key: 'facebookLink',
    label: '📘 Facebook Link',
    helpText: 'Link to the school\'s Facebook page.',
    placeholder: 'e.g. https://facebook.com/IndokidzSchool',
    type: 'url',
  },
  {
    key: 'twitterLink',
    label: '🐦 Twitter / X Link',
    helpText: 'Link to the school\'s Twitter/X profile.',
    placeholder: 'e.g. https://twitter.com/IndokidzSchool',
    type: 'url',
  },
  {
    key: 'instagramLink',
    label: '📸 Instagram Link',
    helpText: 'Link to the school\'s Instagram profile.',
    placeholder: 'e.g. https://instagram.com/IndokidzSchool',
    type: 'url',
  },
];

export default function ContactEditor() {
  const { data: schoolInfo, isLoading } = useGetSchoolInfo();
  const { mutate: updateInfo, isPending } = useUpdateSchoolInfo();

  const [form, setForm] = useState<SchoolInfo>(DEFAULT_INFO);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (schoolInfo) {
      setForm({ ...DEFAULT_INFO, ...schoolInfo });
      setIsDirty(false);
    }
  }, [schoolInfo]);

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateInfo(form, {
      onSuccess: () => {
        toast.success('School contact info updated successfully! ✅');
        setIsDirty(false);
      },
      onError: (err) => {
        toast.error('Could not save changes. Please try again.');
        console.error(err);
      },
    });
  };

  const handleReset = () => {
    if (schoolInfo) {
      setForm({ ...DEFAULT_INFO, ...schoolInfo });
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Card className="rounded-3xl border-2 border-border shadow-playful">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Edit Contact Information</CardTitle>
          <CardDescription>
            Update the school's contact details shown on the public homepage. Changes are saved immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map(({ key, label, helpText, placeholder, type }) => (
            <div key={key} className="space-y-2">
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
              <Input
                id={key}
                type={type || 'text'}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="rounded-2xl border-2 focus:border-primary"
              />
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
