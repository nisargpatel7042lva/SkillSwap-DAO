
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Exchange Skills,
              <br />
              <span className="text-primary">Build Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join our decentralized skill-sharing platform where everyone can teach, learn, and earn. 
              Connect with talented individuals worldwide in a friendly Web3 environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 rounded-2xl text-lg">
                  Explore Skills
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 rounded-2xl text-lg border-2">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-sketch-blue via-white to-sketch-green rounded-3xl flex items-center justify-center">
              <div className="text-8xl opacity-60">🤝</div>
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-sketch-green rounded-2xl flex items-center justify-center">
              <span className="text-3xl">💡</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-sketch-blue rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How SkillSwap Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="sketch-border bg-white p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Skills</h3>
                <p className="text-gray-600">
                  Browse through hundreds of skills offered by community members. From coding to cooking, find exactly what you need.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect</h3>
                <p className="text-gray-600">
                  Connect with skill providers and learners. Build meaningful relationships in our supportive community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Earn & Learn</h3>
                <p className="text-gray-600">
                  Earn tokens by sharing your skills or exchange them to learn new ones. Everyone benefits in our circular economy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Popular Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Programming", icon: "💻", count: "250+ skills" },
            { name: "Design", icon: "🎨", count: "180+ skills" },
            { name: "Marketing", icon: "📢", count: "120+ skills" },
            { name: "Writing", icon: "✍️", count: "90+ skills" },
            { name: "Music", icon: "🎵", count: "75+ skills" },
            { name: "Languages", icon: "🗣️", count: "200+ skills" },
            { name: "Business", icon: "💼", count: "150+ skills" },
            { name: "Cooking", icon: "👨‍🍳", count: "80+ skills" }
          ].map((category) => (
            <Link
              key={category.name}
              to={`/marketplace?category=${category.name.toLowerCase()}`}
              className="block"
            >
              <Card className="sketch-border hover:shadow-lg transition-all duration-200 bg-white p-6 text-center cursor-pointer">
                <CardContent className="p-0">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sketch-blue to-sketch-green py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Start Your Skill Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers in our vibrant community. Your next skill adventure awaits!
          </p>
          <Link to="/marketplace">
            <Button size="lg" className="px-12 py-4 rounded-2xl text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
