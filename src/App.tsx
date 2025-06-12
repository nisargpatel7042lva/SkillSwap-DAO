
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OnboardingOverlay from "./components/OnboardingOverlay";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SmoothCursor />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/service/:id" element={<ServiceDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <OnboardingOverlay />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
