import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfileSetupModal from "./components/ProfileSetupModal";
import Homepage from "./pages/Homepage";
import Admissions from "./pages/Admissions";
import FeeStructure from "./pages/FeeStructure";
import Gallery from "./pages/Gallery";
import FeesPayment from "./pages/FeesPayment";
import ContactUs from "./pages/ContactUs";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <ProfileSetupModal />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Homepage });
const admissionsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admissions", component: Admissions });
const feeStructureRoute = createRoute({ getParentRoute: () => rootRoute, path: "/fee-structure", component: FeeStructure });
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: "/gallery", component: Gallery });
const feesPaymentRoute = createRoute({ getParentRoute: () => rootRoute, path: "/fees-payment", component: FeesPayment });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: ContactUs });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: AdminPanel });

const routeTree = rootRoute.addChildren([
  indexRoute,
  admissionsRoute,
  feeStructureRoute,
  galleryRoute,
  feesPaymentRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
