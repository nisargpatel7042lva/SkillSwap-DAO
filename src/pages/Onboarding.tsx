
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, BookOpen, Code, Palette, Megaphone, Camera, Wrench, Heart, CheckCircle } from "lucide-react";

const SKILL_CATEGORIES = [
  { id: "development", name: "Development", icon: Code },
  { id: "design", name: "Design", icon: Palette },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "photography", name: "Photography", icon: Camera },
  { id: "writing", name: "Writing", icon: BookOpen },
  { id: "consulting", name: "Consulting", icon: User },
  { id: "technical", name: "Technical Support", icon: Wrench },
  { id: "wellness", name: "Health & Wellness", icon: Heart },
];

const Onboarding = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setSaveLoading] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    }

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", username.trim())
        .neq("address", address);

      if (error) {
        setUsernameError("Error checking username availability");
        return false;
      }

      if (data && data.length > 0) {
        setUsernameError("Username is already taken");
        return false;
      }

      setUsernameError("");
      return true;
    } catch (err) {
      setUsernameError("Error checking username availability");
      return false;
    }
  };

  const handleUsernameBlur = () => {
    if (username.trim()) {
      checkUsernameAvailability(username);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const canProceedToStep2 = username.trim() && !usernameError;
  const canProceedToStep3 = true; // Bio is optional
  const canComplete = acceptedTerms;

  const handleCompleteProfile = async () => {
    if (!address || !acceptedTerms) {
      toast.error("Please complete all required fields");
      return;
    }

    const isUsernameValid = await checkUsernameAvailability(username);
    if (!isUsernameValid) {
      toast.error("Please fix username issues before proceeding");
      return;
    }

    setSaveLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .upsert({
          address,
          username: username.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'address'
        });

      if (error) {
        console.error("Profile creation error:", error);
        toast.error("Failed to create profile. Please try again.");
        return;
      }

      toast.success("Welcome to SkillSwap DAO! Profile created successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-blue-300 transform -rotate-2">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SkillSwap DAO!</h2>
        <p className="text-gray-600">Let's set up your profile to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose your username *
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            placeholder="Enter a unique username"
            className={`${usernameError ? 'border-red-300' : 'border-gray-300'} border-2 border-dashed`}
          />
          {usernameError && (
            <p className="text-red-600 text-sm mt-1">{usernameError}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">What is SkillSwap DAO?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• A decentralized marketplace for skills and services</li>
            <li>• Earn and spend SKILL tokens for various services</li>
            <li>• Connect with talented individuals worldwide</li>
            <li>• Secure payments through blockchain escrow</li>
          </ul>
        </div>
      </div>

      <Button 
        onClick={() => setCurrentStep(2)} 
        disabled={!canProceedToStep2}
        className="w-full border-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
      >
        Continue
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-green-300 transform rotate-2">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">Add your photo and description (optional)</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <AvatarUpload 
            value={avatarUrl} 
            onChange={(url) => setAvatarUrl(url)} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (optional)
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about your skills, experience, or interests..."
            className="border-2 border-dashed border-gray-300"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            {bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
          className="flex-1 border-2 border-dashed border-gray-400"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)} 
          className="flex-1 border-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-purple-300 transform -rotate-1">
          <Code className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What skills can you offer?</h2>
        <p className="text-gray-600">Select categories that match your expertise (optional)</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SKILL_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all transform hover:scale-105 ${
                isSelected 
                  ? 'border-purple-400 bg-purple-50 text-purple-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-dashed border-purple-200">
          <p className="text-sm text-purple-700 mb-2">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = SKILL_CATEGORIES.find(c => c.id === categoryId);
              return (
                <Badge key={categoryId} variant="secondary" className="bg-purple-100 text-purple-700">
                  {category?.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(2)}
          className="flex-1 border-2 border-dashed border-gray-400"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(4)} 
          className="flex-1 border-2 border-dashed border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-green-300 transform rotate-1">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost there!</h2>
        <p className="text-gray-600">Please accept our terms to complete setup</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 max-h-40 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-2">Terms of Service</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>By using SkillSwap DAO, you agree to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide honest and accurate information about your skills</li>
            <li>Deliver services as promised and on time</li>
            <li>Respect other users and maintain professional conduct</li>
            <li>Use the platform responsibly and legally</li>
            <li>Accept that payments are processed through blockchain escrow</li>
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox 
          id="terms" 
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
        />
        <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
          I accept the Terms of Service and Privacy Policy
        </label>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(3)}
          className="flex-1 border-2 border-dashed border-gray-400"
        >
          Back
        </Button>
        <Button 
          onClick={handleCompleteProfile}
          disabled={!canComplete || loading}
          className="flex-1 border-2 border-dashed border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
        >
          {loading ? "Creating Profile..." : "Complete Profile"}
        </Button>
      </div>
    </div>
  );

  if (!isConnected) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center text-sm font-medium transform ${
                  step === currentStep 
                    ? 'border-blue-400 bg-blue-50 text-blue-700 scale-110' 
                    : step < currentStep 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 border border-dashed border-gray-300">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-white shadow-lg transform rotate-1">
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="link" 
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 text-sm"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
