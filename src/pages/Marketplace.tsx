import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillCard from "@/components/SkillCard";
import { Search, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  type SkillWithUser = Tables<"skills"> & { user?: Pick<Tables<"users">, "username" | "avatar_url" | "reputation"> };
  const [skills, setSkills] = useState<SkillWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("skills")
          .select(`*, user:users(username, avatar_url, reputation)`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setSkills((data as SkillWithUser[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = (skill.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 100);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, [filteredSkills]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading skills...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            Skill Marketplace
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
            Discover amazing skills from our community of talented individuals
          </p>
        </div>
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-blue-400 h-14 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl"
            />
          </div>
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 rounded-2xl border-2 border-gray-200 h-12 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="hover:bg-gray-50 text-gray-900">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="rounded-2xl border-2 h-12 px-6 bg-white/80 backdrop-blur-sm text-gray-900 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-1 shadow-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-xl transition-all duration-200"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-xl transition-all duration-200"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-gray-200">
            Showing {filteredSkills.length} of {skills.length} skills
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>
        {/* Skills Grid/List */}
        <div className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }`}>
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`transform transition-all duration-700 ease-out ${
                isVisible[index]
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <SkillCard
                id={String(skill.id)}
                title={skill.title}
                description={skill.description}
                price={skill.price + " USDC"}
                provider={{
                  name: skill.user?.username || "Unknown",
                  avatar: skill.user?.avatar_url || "/placeholder-avatar.jpg",
                  rating: skill.user?.reputation || 0,
                }}
                category={skill.category || "Other"}
                image={skill.illustration_url || undefined}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
        {/* No Results */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or category filter</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
