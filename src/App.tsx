import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { LeadManagement } from '@/components/leads/LeadManagement';
import { ProjectManagement } from '@/components/projects/ProjectManagement';
import { InventoryManagement } from '@/components/inventory/InventoryManagement';
import { SiteVisitManagement } from '@/components/site-visits/SiteVisitManagement';
import { BookingManagement } from '@/components/bookings/BookingManagement';
import { CommissionTracking } from '@/components/commissions/CommissionTracking';
import { TeamManagement } from '@/components/team/TeamManagement';
import { DocumentManagement } from '@/components/documents/DocumentManagement';
import { PaymentTracking } from '@/components/payments/PaymentTracking';
import { CommunicationHub } from '@/components/communications/CommunicationHub';
import { ReportsDashboard } from '@/components/reports/ReportsDashboard';
import { FollowUpManagement } from '@/components/followups/FollowUpManagement';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { NotificationsPage } from '@/components/notifications/NotificationsPage';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Login } from '@/components/auth/Login';
import { canAccessRoute } from '@/lib/access';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

function PageWrapper({ children, title }: PageWrapperProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ children, path }: { children: React.ReactNode; path: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!canAccessRoute(user.role, path)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <div className="min-h-screen bg-gray-50">
              <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

              <div
                className="transition-all duration-300"
                style={{ marginLeft: isSidebarCollapsed ? '80px' : '260px' }}
              >
                <Header isSidebarCollapsed={isSidebarCollapsed} pageTitle="" />

                <main className="pt-16 min-h-screen">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <RequireRole path="/">
                            <PageWrapper title="Dashboard">
                              <Dashboard />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/leads"
                        element={
                          <RequireRole path="/leads">
                            <PageWrapper title="Lead Management">
                              <LeadManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/projects"
                        element={
                          <RequireRole path="/projects">
                            <PageWrapper title="Projects & Builders">
                              <ProjectManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/inventory"
                        element={
                          <RequireRole path="/inventory">
                            <PageWrapper title="Inventory Management">
                              <InventoryManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/site-visits"
                        element={
                          <RequireRole path="/site-visits">
                            <PageWrapper title="Site Visit Management">
                              <SiteVisitManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/bookings"
                        element={
                          <RequireRole path="/bookings">
                            <PageWrapper title="Booking & Closure Tracking">
                              <BookingManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/commissions"
                        element={
                          <RequireRole path="/commissions">
                            <PageWrapper title="Commission Tracking">
                              <CommissionTracking />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/team"
                        element={
                          <RequireRole path="/team">
                            <PageWrapper title="Team Management">
                              <TeamManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/documents"
                        element={
                          <RequireRole path="/documents">
                            <PageWrapper title="Document Management">
                              <DocumentManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/payments"
                        element={
                          <RequireRole path="/payments">
                            <PageWrapper title="Payment Tracking">
                              <PaymentTracking />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/communications"
                        element={
                          <RequireRole path="/communications">
                            <PageWrapper title="Communication Hub">
                              <CommunicationHub />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <RequireRole path="/reports">
                            <PageWrapper title="Reports & Analytics">
                              <ReportsDashboard />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <RequireRole path="/settings">
                            <SettingsPage />
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/follow-ups"
                        element={
                          <RequireRole path="/follow-ups">
                            <PageWrapper title="Follow-Up & Tasks">
                              <FollowUpManagement />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <RequireRole path="/notifications">
                            <PageWrapper title="Notifications">
                              <NotificationsPage />
                            </PageWrapper>
                          </RequireRole>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>

              <Toaster position="top-right" />
            </div>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
