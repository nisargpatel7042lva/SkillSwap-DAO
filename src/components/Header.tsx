
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet, Menu } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import MobileMenu from "./MobileMenu";
import Loader from "./Loader";

const Web3Buttons = lazy(() => import('./Web3Buttons'));

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
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
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search skills... 🔍"
                  className="pl-10 border-2 border-dashed border-gray-300 focus:border-blue-400 bg-gray-50 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Suspense fallback={<Loader />}>
                <Web3Buttons />
              </Suspense>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
