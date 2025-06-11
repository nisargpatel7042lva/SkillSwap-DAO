import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, Zap, Shield, Gift, Award, Star, TrendingUp, CheckCircle, Search } from "lucide-react";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <img
            src="/SkillSwap DAO Logo Design.png"
            alt="SkillSwap DAO Logo"
            className="mx-auto mb-6 w-32 h-32 object-contain rounded-2xl border-2 border-dashed border-gray-400 bg-white"
          />
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

      {/* How It Works Section */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How SkillSwap Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="sketch-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Connect Your Wallet</h3>
                <p className="text-gray-600">Join our community by connecting your crypto wallet. Create your profile and showcase your skills to the world.</p>
              </CardContent>
            </Card>

            <Card className="sketch-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2. List Your Skills</h3>
                <p className="text-gray-600">Showcase your expertise by listing skills you can teach. Set your own rates and describe what you offer.</p>
              </CardContent>
            </Card>

            <Card className="sketch-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sketch-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Earn & Learn</h3>
                <p className="text-gray-600">Complete services, earn SKILL tokens, build your reputation, and unlock exclusive badges and rewards.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Badge System Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Badge System</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Earn recognition for your contributions to the SkillSwap community. Our badge system rewards excellence, consistency, and positive impact.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "🌟",
              title: "Rising Star",
              description: "Complete your first 5 services with 4+ star ratings",
              color: "bg-yellow-100 border-yellow-300"
            },
            {
              icon: "🏆",
              title: "Expert Teacher",
              description: "Maintain a 4.8+ rating over 25+ completed services",
              color: "bg-blue-100 border-blue-300"
            },
            {
              icon: "💎",
              title: "Community Gem",
              description: "Receive 50+ positive reviews from learners",
              color: "bg-purple-100 border-purple-300"
            },
            {
              icon: "🚀",
              title: "Innovation Pioneer",
              description: "Be among the first to teach emerging technologies",
              color: "bg-green-100 border-green-300"
            },
            {
              icon: "🌍",
              title: "Global Connector",
              description: "Successfully teach students from 10+ different countries",
              color: "bg-indigo-100 border-indigo-300"
            },
            {
              icon: "⚡",
              title: "Quick Responder",
              description: "Maintain <2 hour average response time for 30 days",
              color: "bg-orange-100 border-orange-300"
            },
            {
              icon: "🎯",
              title: "Goal Achiever",
              description: "Help 100+ students achieve their learning objectives",
              color: "bg-red-100 border-red-300"
            },
            {
              icon: "👑",
              title: "DAO Leader",
              description: "Active participation in governance and community building",
              color: "bg-pink-100 border-pink-300"
            }
          ].map((badge, index) => (
            <Card key={index} className={`border-2 border-dashed ${badge.color} text-center p-6 transform hover:scale-105 transition-transform`}>
              <CardContent className="p-0">
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Complete Workflow</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Service Discovery",
                  description: "Browse the marketplace to find skills you want to learn or list your own expertise",
                  icon: <Search className="w-6 h-6" />
                },
                {
                  step: "2", 
                  title: "Smart Matching",
                  description: "Our algorithm matches learners with the most suitable teachers based on ratings, expertise, and availability",
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  step: "3",
                  title: "Secure Booking",
                  description: "Book sessions with escrow protection. SKILL tokens are held securely until service completion",
                  icon: <Shield className="w-6 h-6" />
                },
                {
                  step: "4",
                  title: "Learning Session",
                  description: "Engage in one-on-one or group sessions via your preferred platform (Zoom, Discord, in-person)",
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: "5",
                  title: "Quality Assurance",
                  description: "Both parties rate the experience. Feedback ensures continuous improvement of service quality",
                  icon: <Star className="w-6 h-6" />
                },
                {
                  step: "6",
                  title: "Reward Distribution",
                  description: "SKILL tokens are released, reputation scores updated, and badges awarded based on performance",
                  icon: <Award className="w-6 h-6" />
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-sketch-blue rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
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
      </section>

      {/* Values Section */}
      <section className="bg-sketch-gray py-16">
        <div className="container mx-auto px-4">
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
