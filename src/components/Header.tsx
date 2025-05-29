
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet } from "lucide-react";

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sketch-blue rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">SkillSwap</h1>
              <p className="text-xs text-gray-500 -mt-1">DAO</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-600 hover:text-primary font-medium">
              Marketplace
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary font-medium">
              About
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">
              Dashboard
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search skills..."
                className="pl-10 rounded-2xl border-2 border-gray-200 focus:border-primary"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            
            <Button
              onClick={handleWalletConnect}
              className={`rounded-xl px-6 ${
                isConnected
                  ? "bg-sketch-green hover:bg-green-200 text-gray-700"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
