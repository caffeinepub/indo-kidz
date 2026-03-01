import { useGetSchoolInfo, useSubmitContactMessage } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Globe, User } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactUs() {
  const { data: info, isLoading } = useGetSchoolInfo();
  const [form, setForm] = useState(emptyForm);
  const submitMessage = useSubmitContactMessage();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMessage.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        timestamp: BigInt(Date.now()),
      });
      toast.success("Message sent! We'll get back to you soon. 📬");
      setForm(emptyForm);
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const defaultInfo = {
    schoolName: "INDO KIDZ",
    principalName: "School Principal",
    phoneNumber: "+91-XXXXXXXXXX",
    emailAddress: "indokidz@school.in",
    address: "Beside Nikhil Ashram, 495006, Bilaspur, Chhattisgarh",
    website: "https://www.indokidzschool.in",
    facebookLink: "https://facebook.com/IndokidzSchool",
    twitterLink: "https://twitter.com/IndokidzSchool",
    instagramLink: "https://instagram.com/IndokidzSchool",
    adminContactInfo: "",
  };

  const s = info || defaultInfo;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl text-white mb-4">Contact Us</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us for admissions, queries, or just to say hello!
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-fredoka text-3xl text-foreground mb-2">Get in Touch</h2>
                <p className="text-muted-foreground">Our team is available Monday to Saturday, 8 AM – 4 PM.</p>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: User, label: "Principal", value: s.principalName },
                    { icon: Phone, label: "Phone", value: s.phoneNumber },
                    { icon: Mail, label: "Email", value: s.emailAddress },
                    { icon: MapPin, label: "Address", value: s.address },
                    ...(s.website ? [{ icon: Globe, label: "Website", value: s.website }] : []),
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-card border border-border card-hover">
                      <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
                        <p className="text-foreground font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-5 shadow-card border border-border">
                <h3 className="font-fredoka text-xl text-foreground mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {s.facebookLink && (
                    <a href={s.facebookLink} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <SiFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {s.instagramLink && (
                    <a href={s.instagramLink} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <SiInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {s.twitterLink && (
                    <a href={s.twitterLink} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <SiX className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-playful p-8 border border-border">
              <h2 className="font-fredoka text-3xl text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <Label htmlFor="cname">Your Name</Label>
                  <Input
                    id="cname"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cemail">Email Address</Label>
                  <Input
                    id="cemail"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cphone">Phone Number</Label>
                  <Input
                    id="cphone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91-XXXXXXXXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="csubject">Subject</Label>
                  <Input
                    id="csubject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What is this about?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cmessage">Message</Label>
                  <Textarea
                    id="cmessage"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero text-white hover:opacity-90 py-5 text-base font-bold rounded-xl"
                  disabled={submitMessage.isPending}
                >
                  {submitMessage.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Message 📨"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
