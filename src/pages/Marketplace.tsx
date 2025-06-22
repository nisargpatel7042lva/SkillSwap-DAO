import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillCard from "@/components/SkillCard";
import { Search, Filter, Grid, List } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Mock data for skills
  const skills = [
    {
      id: "1",
      title: "React Development Bootcamp",
      description: "Learn modern React development with hooks, context, and best practices. Perfect for beginners and intermediate developers.",
      price: "50 SKILL",
      provider: {
        name: "Alex Chen",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      category: "Programming"
    },
    {
      id: "2",
      title: "UI/UX Design Fundamentals",
      description: "Master the principles of user interface and user experience design. Create beautiful, functional designs that users love.",
      price: "40 SKILL",
      provider: {
        name: "Sarah Wilson",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.8
      },
      category: "Design"
    },
    {
      id: "3",
      title: "Digital Marketing Strategy",
      description: "Build comprehensive marketing campaigns that drive results. Learn SEO, social media, and content marketing strategies.",
      price: "45 SKILL",
      provider: {
        name: "Mike Johnson",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.7
      },
      category: "Marketing"
    },
    {
      id: "4",
      title: "Creative Writing Workshop",
      description: "Develop your storytelling skills and find your unique voice. Perfect for aspiring authors and content creators.",
      price: "30 SKILL",
      provider: {
        name: "Emma Davis",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      category: "Writing"
    },
    {
      id: "5",
      title: "Spanish Conversation Practice",
      description: "Improve your Spanish speaking skills through interactive conversations and cultural immersion.",
      price: "25 SKILL",
      provider: {
        name: "Carlos Rodriguez",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.8
      },
      category: "Languages"
    },
    {
      id: "6",
      title: "Photography Masterclass",
      description: "Learn professional photography techniques, from composition to post-processing. Includes hands-on practice sessions.",
      price: "55 SKILL",
      provider: {
        name: "Lisa Zhang",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      category: "Design"
    },
    {
      id: "101",
      title: "Web3 Smart Contract Bootcamp",
      description: "Learn to write, deploy, and audit smart contracts on Ethereum using Solidity and Hardhat.",
      price: "100 SKILL",
      provider: {
        name: "Priya Sharma",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      category: "Programming"
    },
    {
      id: "102",
      title: "Cartoon Sketching for Beginners",
      description: "Master the basics of cartoon sketching and character design with fun, hands-on lessons.",
      price: "30 SKILL",
      provider: {
        name: "Ravi Patel",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.8
      },
      category: "Design"
    },
    {
      id: "103",
      title: "Digital Marketing 101",
      description: "Kickstart your marketing career with SEO, social media, and content strategy essentials.",
      price: "50 SKILL",
      provider: {
        name: "Aisha Khan",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.7
      },
      category: "Marketing"
    },
    {
      id: "104",
      title: "Creative Writing Workshop",
      description: "Unlock your creativity and learn storytelling techniques from published authors.",
      price: "40 SKILL",
      provider: {
        name: "John Lee",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      category: "Writing"
    }
  ];

  const categories = ["all", "Programming", "Design", "Marketing", "Writing", "Languages", "Business", "Music"];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
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
              setIsVisible(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 100); // Staggered animation
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filteredSkills]);

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
                transitionDelay: `${index * 100}ms`
              }}
            >
              <SkillCard {...skill} viewMode={viewMode} />
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
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }} 
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
