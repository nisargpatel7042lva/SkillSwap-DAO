import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "@/components/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OnboardingOverlay from "./components/OnboardingOverlay";
import SecurityProvider from "./components/SecurityProvider";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Custom loading component with your loader
const CustomLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Minimal loader for initial app load
const MinimalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader />
  </div>
);

function AppContent() {
  const { loading, error } = useUser();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) setTimedOut(false);
    if (loading) {
      const timeout = setTimeout(() => setTimedOut(true), 10000); // 10s timeout
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading && !timedOut) {
    return <CustomLoader />;
  }

  if (timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Loading Timeout</h2>
          <p className="text-gray-700 mb-4">The app is taking too long to load. Please check your connection or try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-700 mb-4">Unable to load the application. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <SecurityProvider>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <OnboardingOverlay />
      </div>
    </SecurityProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <BrowserRouter>
            <Suspense fallback={<MinimalLoader />}>
              <AppContent />
            </Suspense>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
