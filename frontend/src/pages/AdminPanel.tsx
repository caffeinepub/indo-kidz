import React, { useState } from 'react';
import { useIsOwner } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import ContentEditor from '../components/admin/ContentEditor';
import FeeCategoryManager from '../components/admin/FeeCategoryManager';
import PaymentRecordsTable from '../components/admin/PaymentRecordsTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Settings, DollarSign, FileText } from 'lucide-react';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isOwner, isLoading: ownerLoading } = useIsOwner();
  const [activeTab, setActiveTab] = useState('content');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="font-fredoka text-2xl text-primary mb-2">Please Log In</h2>
          <p className="text-muted-foreground font-nunito">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Wait until the owner check has fully resolved before rendering anything
  if (ownerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-nunito">Checking access...</p>
        </div>
      </div>
    );
  }

  // Only render admin content once we know the user is the owner
  if (!isOwner) {
    return <AccessDeniedScreen />;
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-fredoka text-3xl text-primary mb-1">Admin Panel</h1>
          <p className="text-muted-foreground font-nunito text-sm">
            Manage your school website content and fees
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted/50 rounded-2xl p-1">
            <TabsTrigger
              value="content"
              className="rounded-xl font-nunito font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="fees"
              className="rounded-xl font-nunito font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Fee Categories
            </TabsTrigger>
            <TabsTrigger
              value="records"
              className="rounded-xl font-nunito font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Settings className="w-4 h-4 mr-1.5" />
              Payment Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>
          <TabsContent value="fees">
            <FeeCategoryManager />
          </TabsContent>
          <TabsContent value="records">
            <PaymentRecordsTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
