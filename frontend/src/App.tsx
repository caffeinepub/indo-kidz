import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet, Link } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Homepage from './pages/Homepage';
import FeesPayment from './pages/FeesPayment';
import AdminPanel from './pages/AdminPanel';
import ProfileSetupModal from './components/ProfileSetupModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useGetCallerUserProfile } from './hooks/useQueries';

function Layout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
});

const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fees',
  component: FeesPayment,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([indexRoute, feesRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
