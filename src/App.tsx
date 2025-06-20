
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "@/components/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { lazy, Suspense } from "react";

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

// Minimal loading component to reduce initial bundle
const MinimalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Optimized loading fallback
const LoadingFallback = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
));

function AppContent() {
  const { loading, error } = useUser();
  
  if (loading) {
    return <MinimalLoader />;
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
    <Suspense fallback={<LoadingFallback />}>
      <SecurityProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Suspense fallback={<div className="h-16 bg-white border-b"></div>}>
            <Header />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
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
          <Suspense fallback={<div className="h-16 bg-gray-800"></div>}>
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
            <AppContent />
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
