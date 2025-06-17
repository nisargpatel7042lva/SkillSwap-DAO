
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Wallet } from "lucide-react";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Exchange Skills,
              <br />
              <span className="text-blue-600 scribble-underline">Build Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join our decentralized skill-sharing platform where everyone can teach, learn, and earn. 
              Connect with talented individuals worldwide in a friendly Web3 environment! 🌟
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600 text-lg">
                  Explore Skills 🚀
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 hand-drawn-btn text-lg border-2 border-dashed border-gray-400 bg-white text-gray-800">
                  Learn More 📚
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center transform rotate-2 doodle-shadow">
              <img
                src="/SkillSwap DAO Logo Design.png"
                alt="SkillSwap DAO Logo"
                className="w-56 h-56 object-contain opacity-80 transform -rotate-2"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-100 rounded-2xl border-2 border-dashed border-green-300 flex items-center justify-center transform -rotate-12">
              <span className="text-3xl">💡</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-100 rounded-xl border-2 border-dashed border-yellow-300 flex items-center justify-center transform rotate-12">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="absolute top-8 right-8 w-12 h-12 bg-pink-100 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center transform rotate-45">
              <span className="text-xl">✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 border-t-4 border-b-4 border-dashed border-gray-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 scribble-underline">
            How SkillSwap Works ⚡
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <Card className="sketch-border bg-white p-8 text-center transform rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl border-2 border-dashed border-blue-300 flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Skills 🔍</h3>
                <p className="text-gray-600">
                  Browse through hundreds of skills offered by community members. From coding to cooking, find exactly what you need.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center transform -rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl border-2 border-dashed border-green-300 flex items-center justify-center mx-auto mb-6 transform rotate-2">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect 🤝</h3>
                <p className="text-gray-600">
                  Connect with skill providers and learners. Build meaningful relationships in our supportive community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center transform rotate-2 hover:rotate-0 transition-transform">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl border-2 border-dashed border-purple-300 flex items-center justify-center mx-auto mb-6 transform -rotate-1">
                  <Wallet className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Earn & Learn 💰</h3>
                <p className="text-gray-600">
                  Earn tokens by sharing your skills or exchange them to learn new ones. Everyone benefits in our circular economy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center transform rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl border-2 border-dashed border-yellow-300 flex items-center justify-center mx-auto mb-6 transform rotate-2">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Book a service</h3>
                <p className="text-gray-600">
                  Funds are locked in escrow automatically for trust and safety. Your payment is secure until the service is delivered.
                </p>
              </CardContent>
            </Card>
            
            <Card className="sketch-border bg-white p-8 text-center transform -rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl border-2 border-dashed border-green-300 flex items-center justify-center mx-auto mb-6 transform -rotate-2">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Rate & Release Payment</h3>
                <p className="text-gray-600">
                  After rating the service, payment is released instantly and trustlessly to the provider. No middlemen, no delays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 scribble-underline">
          Popular Categories 🎯
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Programming", icon: "💻", count: "250+ skills" },
            { name: "Design", icon: "🎨", count: "180+ skills" },
            { name: "Digital Marketing", icon: "📢", count: "120+ skills" },
            { name: "Content Writing", icon: "✍️", count: "90+ skills" },
            { name: "Data Science", icon: "📊", count: "75+ skills" },
            { name: "Copywriting", icon: "📝", count: "65+ skills" },
            { name: "DevOps", icon: "⚙️", count: "85+ skills" },
            { name: "Cybersecurity", icon: "🔒", count: "55+ skills" }
          ].map((category, index) => (
            <Link
              key={category.name}
              to={`/marketplace?category=${category.name.toLowerCase()}`}
              className="block"
            >
              <Card className={`sketch-border hover:shadow-lg transition-all duration-200 bg-white p-6 text-center cursor-pointer transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 hover:scale-105`}>
                <CardContent className="p-0">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded border border-dashed border-gray-200">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-16 border-t-4 border-dashed border-gray-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 scribble-underline">
            Ready to Start Your Skill Journey? 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers in our vibrant community. Your next skill adventure awaits!
          </p>
          <Link to="/marketplace">
            <Button size="lg" className="px-12 py-4 hand-drawn-btn bg-blue-500 hover:bg-blue-600 text-white border-blue-600 text-lg transform hover:scale-105 transition-transform">
              Get Started Today 🚀
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
