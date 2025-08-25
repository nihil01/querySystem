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
import { MyRequests } from "./pages/MyRequests";
import { useEffect, useState } from "react";
import { wrapRequest } from "./utils/NetworkWrapper";
import {Request, SingleRequestFullResponse} from "@/types";
import { RequestPage } from "./pages/RequestPage";
import {AdminRequests} from "@/pages/AdminRequests.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { currentUser, isLoggedIn } = useAuth();
  const [userRequests, setUserRequests] = useState<SingleRequestFullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      const endpont = currentUser?.role === "ADMIN" ? `http://localhost:8080/api/v1/request/get-all`
          : `http://localhost:8080/api/v1/request/get-all?issuer=${currentUser.principalName}`

      try {
        const res = await wrapRequest(endpont
          ,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to load requests");

        const data: SingleRequestFullResponse[] = await res.json();
        setUserRequests(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  if (!isLoggedIn) return <LoginForm />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              {currentUser?.role === "ADMIN" ?(
                <Route
                  path="/"
                  element={<AdminDashboard data={userRequests} />}
                />
              ) : (
                <Route
                  path="/"
                  element={
                    <UserDashboard
                      data={userRequests}
                      loading={loading}
                      error={error}
                    />
                  }
                />
              )}
              <Route path="/new-request" element={<NewRequest />} />
                <Route path="/admin-requests" element={<AdminRequests data={userRequests} />} />
              <Route path="/request/:id" element={<RequestPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/my-requests"
                element={<MyRequests data={userRequests} />}
              />
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
