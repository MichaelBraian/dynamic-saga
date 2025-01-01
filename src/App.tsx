import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CreateCharacter from "./pages/CreateCharacter";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/create-character" 
              element={
                <AuthLayout>
                  <ErrorBoundary>
                    <CreateCharacter />
                  </ErrorBoundary>
                </AuthLayout>
              } 
            />
            <Route 
              path="/" 
              element={
                <AuthLayout>
                  <ErrorBoundary>
                    <Index />
                  </ErrorBoundary>
                </AuthLayout>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;