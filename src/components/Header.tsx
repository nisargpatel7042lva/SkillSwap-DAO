import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet, Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useUser } from "@/components/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { profile } = useUser();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="bg-white border-b-4 border-dashed border-gray-300 sticky top-0 z-50 shadow-lg transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/SkillSwap DAO Logo Design.png"
              alt="SkillSwap DAO Logo"
              className="w-16 h-16 object-contain rounded-2xl border-2 border-dashed border-gray-400 bg-white mr-6"
            />
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search skills... 🔍"
                className="pl-10 border-2 border-dashed border-gray-300 focus:border-blue-400 bg-gray-50 rounded-xl"
              />
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button
            className="lg:hidden p-2 ml-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowMobileSearch((show) => !show)}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button className="border-2 border-dashed border-transparent hover:border-gray-300 rounded-xl flex items-center gap-2">
                {isConnected && profile?.avatar_url ? (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                    <AvatarFallback className="text-xs">{profile.username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-4 h-4" />
                )}
                Profile
              </Button>
            </Link>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 bg-white rounded-xl shadow-lg p-4 border-2 border-dashed border-gray-200">
            <Link to="/marketplace" className="text-gray-700 font-medium" onClick={() => setMobileNavOpen(false)}>
              Marketplace
            </Link>
            <Link to="/about" className="text-gray-700 font-medium" onClick={() => setMobileNavOpen(false)}>
              About
            </Link>
            <Link to="/dashboard" className="text-gray-700 font-medium" onClick={() => setMobileNavOpen(false)}>
              Dashboard
            </Link>
          </nav>
        )}

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden mt-4 flex items-center">
            <div className="relative w-full">
              <Input
                placeholder="Search skills... 🔍"
                className="pl-10 border-2 border-dashed border-gray-300 focus:border-blue-400 bg-gray-50 rounded-xl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
