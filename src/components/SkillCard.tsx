import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users } from "lucide-react";

interface SkillCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
  };
  category: string;
  image?: string;
  viewMode?: "grid" | "list";
}

const SkillCard = ({ id, title, description, price, provider, category, image, viewMode = "grid" }: SkillCardProps) => {
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  if (viewMode === "list") {
    return (
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] hover:z-10 doodle-shadow hover:shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-200 relative">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover rounded-lg border-2 border-dashed border-gray-300" />
            ) : (
              <div className="relative">
                <div className="text-4xl opacity-60">🎨</div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 rounded-full border border-gray-300 flex items-center justify-center text-xs transform rotate-12">
                  ✨
                </div>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs border-dashed border-2 bg-gray-50 text-gray-700 border-gray-300">
                  {category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>2-4 hours</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>1-on-1</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-green-600 bg-green-50 px-3 py-1 rounded-full border border-dashed border-green-200">
                  {price} USDC
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-2 text-lg scribble-underline">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">{provider.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{provider.name}</p>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{provider.rating}</span>
                  </div>
                </div>
              </div>
              
              <Link to={`/service/${id}`}>
                <Button className="hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600 px-6 py-2 transition-all duration-300 hover:scale-105">
                  View Details 📝
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View (default)
  return (
    <Card className={`border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden transform ${randomRotation} hover:rotate-0 hover:scale-105 hover:z-10 doodle-shadow hover:shadow-xl group`}>
      {/* Image Section */}
      <div className="h-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center border-b-2 border-dashed border-gray-200 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover rounded-lg border-2 border-dashed border-gray-300 transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="relative">
            <div className="text-4xl opacity-60 transition-transform duration-300 group-hover:scale-110">🎨</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 rounded-full border border-gray-300 flex items-center justify-center text-xs transform rotate-12 animate-pulse">
              ✨
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-xs border-dashed border-2 bg-gray-50 text-gray-700 border-gray-300">
            {category}
          </Badge>
          <div className="text-right">
            <span className="font-bold text-lg text-green-600 bg-green-50 px-2 py-1 rounded border border-dashed border-green-200">
              {price} USDC
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 scribble-underline group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 hover:bg-gray-100 transition-colors duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">{provider.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{provider.name}</p>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500 ml-1">{provider.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/service/${id}`} className="w-full">
          <Button className="w-full hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600 transition-all duration-300 hover:scale-105 group-hover:shadow-lg">
            View Details 📝
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
