import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/components/layout/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LoginForm } from "@/components/login/LoginForm";
import { UserDashboard } from "@/pages/UserDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { NewRequest } from "@/pages/NewRequest";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { currentUser, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              {currentUser?.role === 'ADMIN' && currentUser?.preferedDashboard === 'ADMIN' ? (
                <Route path="/" element={<AdminDashboard />} />
              ) : (
                <Route path="/" element={<UserDashboard />} />
              )}
              <Route path="/new-request" element={<NewRequest />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
