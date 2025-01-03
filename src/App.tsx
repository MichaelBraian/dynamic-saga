import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CreateCharacter from "./pages/CreateCharacter";
import CharacterList from "./pages/CharacterList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-character" element={<AuthLayout><CreateCharacter /></AuthLayout>} />
          <Route path="/character-list" element={<AuthLayout><CharacterList /></AuthLayout>} />
          <Route path="/" element={<AuthLayout><Index /></AuthLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;