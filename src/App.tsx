
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "@/components/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { lazy, Suspense } from "react";
import Loader from "./components/Loader";

// Lazy load all components including layout components
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const OnboardingOverlay = lazy(() => import("./components/OnboardingOverlay"));
const SecurityProvider = lazy(() => import("./components/SecurityProvider"));

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Profile = lazy(() => import("./pages/Profile"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  
  // Don't show loading for user context unless it's actually loading
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
    <Suspense fallback={<CustomLoader />}>
      <SecurityProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Suspense fallback={<div className="h-16 bg-white border-b animate-pulse"></div>}>
            <Header />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<CustomLoader />}>
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
            </Suspense>
          </main>
          <Suspense fallback={<div className="h-16 bg-gray-800 animate-pulse"></div>}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <OnboardingOverlay />
          </Suspense>
        </div>
      </SecurityProvider>
    </Suspense>
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
