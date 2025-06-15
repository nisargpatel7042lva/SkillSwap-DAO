import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 md:hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center space-x-3" onClick={onClose}>
            <img
              src="/SkillSwap DAO Logo Design.png"
              alt="SkillSwap DAO Logo"
              className="w-12 h-12 object-contain rounded-2xl border-2 border-dashed border-gray-400 bg-white"
            />
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search skills... 🔍"
              className="pl-10 border-2 border-dashed border-gray-300 focus:border-blue-400 bg-gray-50 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="flex flex-col space-y-4">
          <Link
            to="/marketplace"
            className="text-gray-600 hover:text-blue-600 font-medium py-2"
            onClick={onClose}
          >
            Marketplace
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 font-medium py-2"
            onClick={onClose}
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium py-2"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-600 font-medium py-2"
            onClick={onClose}
          >
            Profile
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu; 