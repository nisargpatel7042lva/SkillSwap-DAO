
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillCard from "@/components/SkillCard";
import { Search } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    }
  ];

  const categories = ["all", "Programming", "Design", "Marketing", "Writing", "Languages", "Business", "Music"];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Skill Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Discover amazing skills from our community of talented individuals</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            placeholder="Search for skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 rounded-2xl border-2 border-gray-200 dark:border-gray-600 h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="rounded-2xl border-2 h-12 px-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600">
          Filters
        </Button>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredSkills.length} of {skills.length} skills
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No skills found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search terms or category filter</p>
          <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }} className="rounded-xl">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
