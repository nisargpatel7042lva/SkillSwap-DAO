
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OnboardingOverlay from "./components/OnboardingOverlay";
import { UserProvider, useUser } from "@/components/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import SecurityProvider from "./components/SecurityProvider";
import Loader from "./components/Loader";
import React, { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Profile = lazy(() => import("./pages/Profile"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Move loading dialogues outside component to prevent recreation
const LOADING_DIALOGUES = [
  "Sharpening skills...",
  "Matching you with the best mentors...",
  "Swapping knowledge on the blockchain...",
  "Summoning the DAO wisdom...",
  "Loading your skill arsenal...",
  "Connecting to the SkillSwap universe...",
  "Unlocking new opportunities...",
  "Fueling up your learning journey...",
  "Gathering community insights...",
  "Preparing your dashboard...",
];

// Optimize random dialogue selection
const getRandomDialogue = () => 
  LOADING_DIALOGUES[Math.floor(Math.random() * LOADING_DIALOGUES.length)];

const LoadingFallback = ({ message }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Loader />
    <span className="mt-4 text-lg text-blue-600 font-semibold animate-pulse">
      {message || "Loading..."}
    </span>
  </div>
);

function AppContent() {
  const { loading, error } = useUser();
  
  if (loading) {
    return <LoadingFallback message={getRandomDialogue()} />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload
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
          <Suspense fallback={<LoadingFallback message="Loading page..." />}>
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
            <AppContent />
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
