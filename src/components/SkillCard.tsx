
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

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
}

const SkillCard = ({ id, title, description, price, provider, category, image }: SkillCardProps) => {
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  return (
    <Card className={`border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 bg-white dark:bg-gray-800 overflow-hidden transform ${randomRotation} hover:rotate-0 hover:scale-105 hover:z-10 doodle-shadow`}>
      <div className="h-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 p-4 flex items-center justify-center border-b-2 border-dashed border-gray-200 dark:border-gray-600 relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600" />
        ) : (
          <div className="relative">
            <div className="text-4xl opacity-60">🎨</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 dark:bg-yellow-600 rounded-full border border-gray-300 dark:border-gray-500 flex items-center justify-center text-xs transform rotate-12">
              ✨
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-xs border-dashed border-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
            {category}
          </Badge>
          <div className="text-right">
            <span className="font-bold text-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 py-1 rounded border border-dashed border-green-200 dark:border-green-700">
              {price}
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 scribble-underline">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{provider.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{provider.name}</p>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{provider.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/service/${id}`} className="w-full">
          <Button className="w-full hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600">
            View Details 📝
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
