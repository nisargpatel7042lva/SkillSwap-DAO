
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, User, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const OnboardingOverlay = () => {
  const { address, isConnected } = useAccount();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasSeenProfileSetup, setHasSeenProfileSetup] = useState(false);

  // Check if user has seen profile setup before
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenProfileSetup');
    setHasSeenProfileSetup(!!seen);
  }, []);

  // Show profile setup for new connected users
  useEffect(() => {
    if (isConnected && address && !hasSeenProfileSetup) {
      const timer = setTimeout(() => {
        setShowProfileSetup(true);
      }, 2000); // Show after 2 seconds of being connected

      return () => clearTimeout(timer);
    }
  }, [isConnected, address, hasSeenProfileSetup]);

  // Show login prompt for unconnected users after 20 seconds
  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 20000); // Show after 20 seconds

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const handleCloseProfileSetup = () => {
    setShowProfileSetup(false);
    localStorage.setItem('hasSeenProfileSetup', 'true');
    setHasSeenProfileSetup(true);
  };

  if (!showProfileSetup && !showLoginPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {showProfileSetup && (
        <Card className="w-full max-w-md border-4 border-dashed border-blue-300 bg-white shadow-xl transform rotate-1 animate-in zoom-in-95 duration-300">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50"
              onClick={handleCloseProfileSetup}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-dashed border-blue-300 flex items-center justify-center mx-auto mb-4 transform -rotate-2">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to SkillSwap! 🎉
              </CardTitle>
              <Badge variant="outline" className="border-dashed border-2 border-green-300 bg-green-50 text-green-700">
                Connected Successfully
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Let's complete your profile setup to help you connect with the right opportunities and showcase your skills to the community.
            </p>
            <div className="space-y-3">
              <Link to="/profile" onClick={handleCloseProfileSetup}>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white border-2 border-dashed border-blue-600 hand-drawn-btn">
                  <User className="w-4 h-4 mr-2" />
                  Complete Profile Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={handleCloseProfileSetup}
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showLoginPrompt && (
        <Card className="w-full max-w-md border-4 border-dashed border-purple-300 bg-white shadow-xl transform -rotate-1 animate-in zoom-in-95 duration-300">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full border-4 border-dashed border-purple-300 flex items-center justify-center mx-auto mb-4 transform rotate-2">
                <Wallet className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Unlock More Opportunities! 🚀
              </CardTitle>
              <Badge variant="outline" className="border-dashed border-2 border-purple-300 bg-purple-50 text-purple-700">
                Connect Your Wallet
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Connect your wallet to access exclusive features, create your profile, and start earning from your skills in our Web3 marketplace.
            </p>
            <div className="flex justify-center mb-4">
              <ConnectButton />
            </div>
            <div className="text-xs text-gray-500">
              <p>✨ Join 1000+ skill providers already earning</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnboardingOverlay;
