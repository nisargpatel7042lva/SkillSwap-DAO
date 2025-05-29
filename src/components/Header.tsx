
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet, Menu } from "lucide-react";

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header className="bg-white border-b-4 border-dashed border-gray-300 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl font-bold text-blue-600">S</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-200 rounded-full border border-gray-300 flex items-center justify-center text-xs transform rotate-12">
                ✨
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 scribble-underline">SkillSwap</h1>
              <p className="text-xs text-gray-500 -mt-1 transform -rotate-1">DAO</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-600 hover:text-blue-600 font-medium relative group">
              Marketplace
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium relative group">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search skills... 🔍"
                className="pl-10 border-2 border-dashed border-gray-300 focus:border-blue-400 bg-gray-50 rounded-xl"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="border-2 border-dashed border-transparent hover:border-gray-300 rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            
            <Button
              onClick={handleWalletConnect}
              className={`hand-drawn-btn px-6 ${
                isConnected
                  ? "bg-green-100 hover:bg-green-200 text-green-700 border-green-400"
                  : "bg-blue-500 hover:bg-blue-600 text-white border-blue-600"
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnected ? "Connected 🔗" : "Connect Wallet 💼"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
