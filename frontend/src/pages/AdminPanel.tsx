import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Home, BookOpen, IndianRupee, Image, Phone, Megaphone, Palette, MessageSquare, Receipt, CreditCard } from "lucide-react";
import HomeContentEditor from "../components/admin/HomeContentEditor";
import AdmissionsContentEditor from "../components/admin/AdmissionsContentEditor";
import FeeCategoryManager from "../components/admin/FeeCategoryManager";
import GalleryManager from "../components/admin/GalleryManager";
import ContactEditor from "../components/admin/ContactEditor";
import AnnouncementsManager from "../components/admin/AnnouncementsManager";
import ThemeCustomizer from "../components/admin/ThemeCustomizer";
import ContactMessagesManager from "../components/admin/ContactMessagesManager";
import FeePaymentsViewer from "../components/admin/FeePaymentsViewer";
import PaymentRequestsViewer from "../components/admin/PaymentRequestsViewer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (!isAuthenticated) return <AccessDeniedScreen />;
  if (adminLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }
  if (!isAdmin) return <AccessDeniedScreen />;

  const tabs = [
    { value: "home", label: "Home", icon: Home, component: <HomeContentEditor /> },
    { value: "admissions", label: "Admissions", icon: BookOpen, component: <AdmissionsContentEditor /> },
    { value: "fees", label: "Fee Structure", icon: IndianRupee, component: <FeeCategoryManager /> },
    { value: "fee-payments", label: "Fee Payments", icon: Receipt, component: <FeePaymentsViewer /> },
    { value: "payment-requests", label: "Payment Requests", icon: CreditCard, component: <PaymentRequestsViewer /> },
    { value: "gallery", label: "Gallery", icon: Image, component: <GalleryManager /> },
    { value: "contact", label: "Contact Us", icon: Phone, component: <ContactEditor /> },
    { value: "announcements", label: "Announcements", icon: Megaphone, component: <AnnouncementsManager /> },
    { value: "theme", label: "Theme", icon: Palette, component: <ThemeCustomizer /> },
    { value: "messages", label: "Messages", icon: MessageSquare, component: <ContactMessagesManager /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-section animate-fade-in">
      <div className="bg-gradient-hero text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-fredoka text-3xl sm:text-4xl">Admin Customization Panel</h1>
              <p className="text-white/70 text-sm">Manage all content, settings, and appearance of INDO KIDZ website</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="home">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white shadow-card border border-border rounded-2xl p-2 mb-8">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold data-[state=active]:bg-gradient-hero data-[state=active]:text-white transition-all"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ value, component }) => (
            <TabsContent key={value} value={value} className="mt-0">
              <div className="bg-white rounded-2xl shadow-card border border-border p-6">
                {component}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
