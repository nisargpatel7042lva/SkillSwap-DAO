
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/components/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useState, Suspense, lazy } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

const Web3Provider = lazy(() => import('./components/Web3Provider'));
const Profile = lazy(() => import('./pages/Profile'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const MinimalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader />
  </div>
);

const AppContent = () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        <Footer />
    </div>
);

function App() {
  const [showWeb3Provider, setShowWeb3Provider] = useState(true);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<MinimalLoader />}>
            <Web3Provider>
              <UserProvider>
                <AppContent />
              </UserProvider>
            </Web3Provider>
          </Suspense>
        </TooltipProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
