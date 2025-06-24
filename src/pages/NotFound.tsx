import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Wallet, AlertTriangle } from "lucide-react";

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    --color-0: #fff;
    --color-1: #111;
    --color-2: #222;
    --color-3: #333;
    --color-4: #2e2e2e;
    --color-5: #d2b48c;
    --color-6: #b22222;
    --color-7: #871a1a;
    --color-8: #ff6347;
    --color-9: #ff3814;
    width: 100%;
    height: 100%;
    background-color: var(--color-1);
    background-image: linear-gradient(
        to top,
        var(--color-2) 5%,
        var(--color-1) 6%,
        var(--color-1) 7%,
        transparent 7%
      ),
      linear-gradient(to bottom, var(--color-1) 30%, transparent 80%),
      linear-gradient(to right, var(--color-2), var(--color-4) 5%, transparent 5%),
      linear-gradient(
        to right,
        transparent 6%,
        var(--color-2) 6%,
        var(--color-4) 9%,
        transparent 9%
      ),
      linear-gradient(
        to right,
        transparent 27%,
        var(--color-2) 27%,
        var(--color-4) 34%,
        transparent 34%
      ),
      linear-gradient(
        to right,
        transparent 51%,
        var(--color-2) 51%,
        var(--color-4) 57%,
        transparent 57%
      ),
      linear-gradient(to bottom, var(--color-1) 35%, transparent 35%),
      linear-gradient(
        to right,
        transparent 42%,
        var(--color-2) 42%,
        var(--color-4) 44%,
        transparent 44%
      ),
      linear-gradient(
        to right,
        transparent 45%,
        var(--color-2) 45%,
        var(--color-4) 47%,
        transparent 47%
      ),
      linear-gradient(
        to right,
        transparent 48%,
        var(--color-2) 48%,
        var(--color-4) 50%,
        transparent 50%
      ),
      linear-gradient(
        to right,
        transparent 87%,
        var(--color-2) 87%,
        var(--color-4) 91%,
        transparent 91%
      ),
      linear-gradient(to bottom, var(--color-1) 37.5%, transparent 37.5%),
      linear-gradient(
        to right,
        transparent 14%,
        var(--color-2) 14%,
        var(--color-4) 20%,
        transparent 20%
      ),
      linear-gradient(to bottom, var(--color-1) 40%, transparent 40%),
      linear-gradient(
        to right,
        transparent 10%,
        var(--color-2) 10%,
        var(--color-4) 13%,
        transparent 13%
      ),
      linear-gradient(
        to right,
        transparent 21%,
        var(--color-2) 21%,
        #1a1a1a 25%,
        transparent 25%
      ),
      linear-gradient(
        to right,
        transparent 58%,
        var(--color-2) 58%,
        var(--color-4) 64%,
        transparent 64%
      ),
      linear-gradient(
        to right,
        transparent 92%,
        var(--color-2) 92%,
        var(--color-4) 95%,
        transparent 95%
      ),
      linear-gradient(to bottom, var(--color-1) 48%, transparent 48%),
      linear-gradient(
        to right,
        transparent 96%,
        var(--color-2) 96%,
        #1a1a1a 99%,
        transparent 99%
      ),
      linear-gradient(
        to bottom,
        transparent 68.5%,
        transparent 76%,
        var(--color-1) 76%,
        var(--color-1) 77.5%,
        transparent 77.5%,
        transparent 86%,
        var(--color-1) 86%,
        var(--color-1) 87.5%,
        transparent 87.5%
      ),
      linear-gradient(
        to right,
        transparent 35%,
        var(--color-2) 35%,
        var(--color-4) 41%,
        transparent 41%
      ),
      linear-gradient(to bottom, var(--color-1) 68%, transparent 68%),
      linear-gradient(
        to right,
        transparent 78%,
        var(--color-3) 78%,
        var(--color-3) 80%,
        transparent 80%,
        transparent 82%,
        var(--color-3) 82%,
        var(--color-3) 83%,
        transparent 83%
      ),
      linear-gradient(
        to right,
        transparent 66%,
        var(--color-2) 66%,
        var(--color-4) 85%,
        transparent 85%
      );
    background-size: 300px 150px;
    background-position: center bottom;
  }

  .container:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background-color: var(--color-1);
    background-image: linear-gradient(
        to top,
        var(--color-5) 5%,
        var(--color-1) 6%,
        var(--color-1) 7%,
        transparent 7%
      ),
      linear-gradient(to bottom, var(--color-1) 30%, transparent 30%),
      linear-gradient(to right, var(--color-6), var(--color-7) 5%, transparent 5%),
      linear-gradient(
        to right,
        transparent 6%,
        var(--color-8) 6%,
        var(--color-9) 9%,
        transparent 9%
      ),
      linear-gradient(
        to right,
        transparent 27%,
        #556b2f 27%,
        #39481f 34%,
        transparent 34%
      ),
      linear-gradient(
        to right,
        transparent 51%,
        #fa8072 51%,
        #f85441 57%,
        transparent 57%
      ),
      linear-gradient(to bottom, var(--color-1) 35%, transparent 35%),
      linear-gradient(
        to right,
        transparent 42%,
        #008080 42%,
        #004d4d 44%,
        transparent 44%
      ),
      linear-gradient(
        to right,
        transparent 45%,
        #008080 45%,
        #004d4d 47%,
        transparent 47%
      ),
      linear-gradient(
        to right,
        transparent 48%,
        #008080 48%,
        #004d4d 50%,
        transparent 50%
      ),
      linear-gradient(
        to right,
        transparent 87%,
        #789 87%,
        #4f5d6a 91%,
        transparent 91%
      ),
      linear-gradient(to bottom, var(--color-1) 37.5%, transparent 37.5%),
      linear-gradient(
        to right,
        transparent 14%,
        #bdb76b 14%,
        #989244 20%,
        transparent 20%
      ),
      linear-gradient(to bottom, var(--color-1) 40%, transparent 40%),
      linear-gradient(
        to right,
        transparent 10%,
        #808000 10%,
        #4d4d00 13%,
        transparent 13%
      ),
      linear-gradient(
        to right,
        transparent 21%,
        #8b4513 21%,
        #5e2f0d 25%,
        transparent 25%
      ),
      linear-gradient(
        to right,
        transparent 58%,
        #8b4513 58%,
        #5e2f0d 64%,
        transparent 64%
      ),
      linear-gradient(
        to right,
        transparent 92%,
        #2f4f4f 92%,
        #1c2f2f 95%,
        transparent 95%
      ),
      linear-gradient(to bottom, var(--color-1) 48%, transparent 48%),
      linear-gradient(
        to right,
        transparent 96%,
        #2f4f4f 96%,
        #1c2f2f 99%,
        transparent 99%
      ),
      linear-gradient(
        to bottom,
        transparent 68.5%,
        transparent 76%,
        var(--color-1) 76%,
        var(--color-1) 77.5%,
        transparent 77.5%,
        transparent 86%,
        var(--color-1) 86%,
        var(--color-1) 87.5%,
        transparent 87.5%
      ),
      linear-gradient(
        to right,
        transparent 35%,
        #cd5c5c 35%,
        #bc3a3a 41%,
        transparent 41%
      ),
      linear-gradient(to bottom, var(--color-1) 68%, transparent 68%),
      linear-gradient(
        to right,
        transparent 78%,
        #bc8f8f 78%,
        #bc8f8f 80%,
        transparent 80%,
        transparent 82%,
        #bc8f8f 82%,
        #bc8f8f 83%,
        transparent 83%
      ),
      linear-gradient(
        to right,
        transparent 66%,
        #a52a2a 66%,
        #7c2020 85%,
        transparent 85%
      );
    background-size: 300px 150px;
    background-position: center bottom;
    clip-path: circle(150px at center center);
    animation: flashlight 20s ease infinite;
  }

  .container:after {
    content: "";
    width: 25px;
    height: 10px;
    position: absolute;
    left: calc(50% + 59px);
    bottom: 100px;
    background-repeat: no-repeat;
    background-image: radial-gradient(circle, #fff 50%, transparent 50%),
      radial-gradient(circle, #fff 50%, transparent 50%);
    background-size: 10px 10px;
    background-position:
      left center,
      right center;
    animation: eyes 20s infinite;
  }

  @keyframes flashlight {
    0% {
      clip-path: circle(150px at -25% 10%);
    }

    38% {
      clip-path: circle(150px at 60% 20%);
    }

    39% {
      opacity: 1;
      clip-path: circle(150px at 60% 86%);
    }

    40% {
      opacity: 0;
      clip-path: circle(150px at 60% 86%);
    }

    41% {
      opacity: 1;
      clip-path: circle(150px at 60% 86%);
    }

    42% {
      opacity: 0;
      clip-path: circle(150px at 60% 86%);
    }

    54% {
      opacity: 0;
      clip-path: circle(150px at 60% 86%);
    }

    55% {
      opacity: 1;
      clip-path: circle(150px at 60% 86%);
    }

    59% {
      opacity: 1;
      clip-path: circle(150px at 60% 86%);
    }

    64% {
      clip-path: circle(150px at 45% 78%);
    }

    68% {
      clip-path: circle(150px at 85% 89%);
    }

    72% {
      clip-path: circle(150px at 60% 86%);
    }

    74% {
      clip-path: circle(150px at 60% 86%);
    }

    100% {
      clip-path: circle(150px at 150% 50%);
    }
  }

  @keyframes eyes {
    0%,
    38% {
      opacity: 0;
    }

    39%,
    41% {
      opacity: 1;
      transform: scaleY(1);
    }

    40% {
      transform: scaleY(0);
      filter: none;
      background-image: radial-gradient(circle, #fff 50%, transparent 50%),
        radial-gradient(circle, #fff 50%, transparent 50%);
    }

    41% {
      transform: scaleY(1);
      background-image: radial-gradient(circle, #ff0000 50%, transparent 50%),
        radial-gradient(circle, #ff0000 50%, transparent 50%);
      filter: drop-shadow(0 0 4px #ff8686);
    }

    42%,
    100% {
      opacity: 0;
    }
  }
`;

const NotFound = () => {
  const location = useLocation();
  
  // Safe wallet connection check - only use wagmi hooks if available
  let isConnected = false;
  try {
    // Dynamic import to avoid errors when wagmi provider is not available
    const { useAccount } = require("wagmi");
    const { isConnected: walletConnected } = useAccount();
    isConnected = walletConnected;
  } catch (error) {
    // Wagmi provider not available, wallet is not connected
    isConnected = false;
  }

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Pattern Background - Fixed positioning to cover entire viewport */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Pattern />
      </div>
      
      {/* Dotted background pattern matching the theme */}
      <div className="fixed inset-0 z-0" 
           style={{
             backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.05) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="sketch-border doodle-shadow max-w-md w-full transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            {/* 404 Icon and Title */}
            <div className="space-y-4">
              <div className="relative mx-auto w-20 h-20 bg-red-50 rounded-full border-2 border-dashed border-red-300 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 rounded-full border border-gray-300 flex items-center justify-center text-xs transform rotate-12">
                  ❗
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl font-bold text-gray-800 scribble-underline">404</h1>
                <h2 className="text-xl font-semibold text-red-500 wobble-1">Oops! Page Not Found</h2>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 text-sm leading-relaxed">
                The page you're looking for seems to have vanished into the digital void! 
                Don't worry, it happens to the best of us. ✨
              </p>
            </div>
            
            {/* Wallet Status */}
            <div className="bg-blue-50 p-3 rounded-lg border border-dashed border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Wallet className="w-4 h-4" />
                <span className="font-medium text-gray-700">Wallet Status:</span>
                <span className={`font-semibold px-2 py-1 rounded-full border border-dashed text-xs ${
                  isConnected 
                    ? 'text-green-600 bg-green-50 border-green-200' 
                    : 'text-orange-600 bg-orange-50 border-orange-200'
                }`}>
                  {isConnected ? '✅ Connected' : '⚠️ Not Connected'}
                </span>
              </div>
              
              {!isConnected && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-100 p-2 rounded border border-dashed border-orange-200">
                  💡 Connect your wallet to access all features
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/" className="block">
                <Button className="w-full hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Take Me Home 🏠</span>
                </Button>
              </Link>
              
              <div className="text-xs text-gray-500 italic">
                "Not all who wander are lost... but this page definitely is!" 📍
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
