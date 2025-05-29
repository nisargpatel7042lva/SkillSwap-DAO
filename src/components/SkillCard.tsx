
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card className="sketch-border hover:shadow-lg transition-all duration-200 bg-white overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-sketch-blue to-sketch-green p-4 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-4xl opacity-50">🎨</div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-sketch-gray">
            {category}
          </Badge>
          <span className="font-bold text-lg text-primary">{price}</span>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-sketch-blue rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">{provider.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{provider.name}</p>
            <div className="flex items-center">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-gray-500 ml-1">{provider.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/service/${id}`} className="w-full">
          <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
