
import { Card, CardContent } from "@/components/ui/card";
import Marquee from "@/components/ui/marquee";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Full-Stack Developer",
    content: "SkillSwap changed my career! I taught React and learned blockchain development. The community is amazing and the Web3 integration is seamless! 🚀",
    avatar: "👨‍💻",
    rating: 5,
    skill: "React & Blockchain"
  },
  {
    name: "Maria Rodriguez",
    role: "UX Designer",
    content: "Finally, a platform where I can exchange my design skills for coding lessons! The escrow system makes me feel safe, and I've made lifelong connections. ✨",
    avatar: "👩‍🎨",
    rating: 5,
    skill: "UI/UX Design"
  },
  {
    name: "David Kim",
    role: "Digital Marketing Specialist",
    content: "I've earned tokens teaching SEO and social media marketing while learning Python. The DAO governance makes every member feel valued. This is the future! 🌟",
    avatar: "📊",
    rating: 5,
    skill: "Digital Marketing & SEO"
  },
  {
    name: "Sarah Johnson",
    role: "Content Writer & Copywriter",
    content: "The skill verification system is brilliant! I've built trust teaching copywriting and content strategy while learning web development. Love how transparent everything is! 📝",
    avatar: "✍️",
    rating: 5,
    skill: "Content Writing & Copywriting"
  },
  {
    name: "Ahmed Hassan",
    role: "Data Scientist",
    content: "Teaching data analysis and machine learning while learning game development has been incredible. The rating system ensures quality, and payments are instant! 📈",
    avatar: "🔬",
    rating: 5,
    skill: "Data Science & ML"
  },
  {
    name: "Elena Kowalski",
    role: "Graphic Designer",
    content: "I teach graphic design and branding while learning mobile app development. The community diversity is beautiful, and the platform makes skill exchange so easy! 🎨",
    avatar: "🎨",
    rating: 5,
    skill: "Graphic Design & Branding"
  },
  {
    name: "Jake Thompson",
    role: "DevOps Engineer",
    content: "Trading cloud infrastructure knowledge for business coaching has opened new opportunities. The DAO model creates a sense of ownership I've never felt before! ☁️",
    avatar: "⚙️",
    rating: 5,
    skill: "DevOps & Cloud"
  },
  {
    name: "Priya Patel",
    role: "Product Manager",
    content: "Teaching product strategy while learning cybersecurity has been transformative. The platform brings tech professionals together in the most authentic way! 🚀",
    avatar: "📱",
    rating: 5,
    skill: "Product Management"
  }
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({
  name,
  role,
  content,
  avatar,
  skill,
}: {
  name: string;
  role: string;
  content: string;
  avatar: string;
  skill: string;
}) => {
  return (
    <Card className="sketch-border bg-white p-4 mx-2 max-w-sm transform hover:rotate-0 transition-all duration-200 hover:scale-105">
      <CardContent className="p-0">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl border-2 border-dashed border-blue-300 flex items-center justify-center mr-3 transform -rotate-2">
            <span className="text-2xl">{avatar}</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {content}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs bg-yellow-100 px-2 py-1 rounded border border-dashed border-yellow-300 text-yellow-700">
            {skill}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">⭐</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-t-4 border-b-4 border-dashed border-gray-300 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6 scribble-underline">
          What Our Community Says 💬
        </h2>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
          Real stories from real people who are building, learning, and earning in our SkillSwap family! 🌈
        </p>
      </div>
      
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review, index) => (
            <ReviewCard key={`first-${index}`} {...review} />
          ))}
        </Marquee>
        
        <Marquee reverse pauseOnHover className="[--duration:20s] mt-4">
          {secondRow.map((review, index) => (
            <ReviewCard key={`second-${index}`} {...review} />
          ))}
        </Marquee>
        
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </section>
  );
}
