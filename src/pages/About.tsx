
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, Zap, Shield, Gift } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Building the Future of
            <span className="text-primary block mt-2">Skill Exchange</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            SkillSwap DAO is more than a platform—it's a movement toward a world where knowledge flows freely, 
            barriers to learning disappear, and everyone has the opportunity to teach, learn, and grow together.
          </p>
          <div className="w-full h-64 bg-gradient-to-r from-sketch-blue via-white to-sketch-green rounded-3xl flex items-center justify-center mb-8">
            <div className="text-7xl">🌍</div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that every person has valuable knowledge to share and unlimited potential to learn. 
                Our mission is to create a decentralized, community-owned platform that removes traditional 
                barriers to education and skill-sharing.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By leveraging blockchain technology and community governance, we're building a sustainable 
                ecosystem where value flows directly between learners and teachers, creating opportunities 
                for everyone to participate in the knowledge economy.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-sketch-green to-sketch-blue rounded-3xl flex items-center justify-center">
                <div className="text-8xl opacity-60">🎯</div>
              </div>
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-8 h-8 text-primary" />,
              title: "Community First",
              description: "Every decision is made with our community's best interests at heart. We're owned and governed by the people who use the platform."
            },
            {
              icon: <Heart className="w-8 h-8 text-primary" />,
              title: "Inclusive Learning",
              description: "We believe learning should be accessible to everyone, regardless of background, location, or financial situation."
            },
            {
              icon: <Globe className="w-8 h-8 text-primary" />,
              title: "Global Connection",
              description: "Breaking down geographical barriers to connect learners and teachers from every corner of the world."
            },
            {
              icon: <Zap className="w-8 h-8 text-primary" />,
              title: "Innovation",
              description: "Constantly pushing the boundaries of what's possible in education technology and decentralized systems."
            },
            {
              icon: <Shield className="w-8 h-8 text-primary" />,
              title: "Trust & Safety",
              description: "Building a secure, transparent environment where everyone can learn and teach with confidence."
            },
            {
              icon: <Gift className="w-8 h-8 text-primary" />,
              title: "Value Creation",
              description: "Ensuring that everyone who contributes to the platform is fairly rewarded for their participation."
            }
          ].map((value, index) => (
            <Card key={index} className="sketch-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How We're Different */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How We're Different
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Community Owned</h3>
                  <p className="text-gray-600">No corporate overlords. The platform is owned and governed by the community through our DAO structure.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Fair Value Distribution</h3>
                  <p className="text-gray-600">Teachers keep the majority of what they earn. No hidden fees or unfair revenue splits.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Skill-Based Economy</h3>
                  <p className="text-gray-600">Earn and spend SKILL tokens within our ecosystem. Your knowledge has real, tradeable value.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Transparent & Open</h3>
                  <p className="text-gray-600">All platform decisions are made transparently through community voting and open governance.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Global by Design</h3>
                  <p className="text-gray-600">Built for a global community with multi-language support and cross-border payments.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality Focus</h3>
                  <p className="text-gray-600">Community-driven quality assurance ensures high standards for all learning experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Built by the Community
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          SkillSwap DAO is developed by a diverse team of educators, developers, and community members 
          from around the world, all united by the vision of democratizing education.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { role: "Community", count: "10,000+", description: "Active members worldwide" },
            { role: "Contributors", count: "150+", description: "Developers and educators" },
            { role: "Countries", count: "75+", description: "Global reach and impact" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-sketch-blue rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {index === 0 ? "👥" : index === 1 ? "💻" : "🌍"}
                </span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.count}</div>
              <div className="font-semibold text-gray-800 mb-1">{stat.role}</div>
              <div className="text-gray-600 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sketch-blue to-sketch-green py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to be part of the future of education? Start your journey today as a learner, 
            teacher, or community contributor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="px-8 py-3 rounded-2xl text-lg">
                Start Learning
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-2xl text-lg border-2">
                Start Teaching
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
