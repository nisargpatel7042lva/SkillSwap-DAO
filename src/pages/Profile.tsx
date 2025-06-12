import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Star, TrendingUp, User, Award, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount, useEnsName } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/components/UserContext";

interface UserProfile {
  username: string | null;
  avatar_url: string | null;
  bio?: string | null;
  reputation: number | null;
  created_at: string | null;
}

interface UpdateProfileData {
  address: string;
  username: string;
  avatar_url: string;
  bio?: string;
  updated_at?: string;
}

const Profile = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { profile, setProfile, refreshProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Profile data
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [joinDate, setJoinDate] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
      setRating(profile.reputation || 0);
      setJoinDate(profile.created_at ? new Date(profile.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : "");
      setLoading(false);
      return;
    }
    if (!address) return;
    setLoading(true);
    
    const fetchOrCreateProfile = async () => {
      try {
        // First try to fetch existing profile
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("username, avatar_url, reputation, created_at")
          .eq("address", address)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // If no profile exists, create a new one
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert([
              {
                address,
                username: ensName || `User_${address.slice(0, 6)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            setError("Failed to create profile. Please try again.");
            return;
          }

          // Set the new user data
          setUsername(newUser.username || "");
          setBio(""); // Default empty bio
          setAvatarUrl(newUser.avatar_url || "");
          setRating(newUser.reputation || 0);
          setJoinDate(new Date(newUser.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }));
        } else if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          setError("Failed to load profile data");
          return;
        } else if (data) {
          const profileData = data as UserProfile;
          // Set existing user data
          setUsername(profileData.username || "");
          setBio(profileData.bio || ""); // Will be empty if column doesn't exist
          setAvatarUrl(profileData.avatar_url || "");
          setRating(profileData.reputation || 0);
          setJoinDate(profileData.created_at ? new Date(profileData.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : "");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateProfile();
  }, [address, ensName, profile]);

  const handleSave = async () => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setSaving(true);
    setError("");
    
    try {
      const updateData: UpdateProfileData = {
        address,
        username: username.trim(),
        avatar_url: avatarUrl.trim()
      };

      // Only include bio if it exists in the schema
      if (bio !== undefined) {
        updateData.bio = bio.trim();
      }

      const { error: saveError } = await supabase
        .from("users")
        .upsert(updateData, {
          onConflict: 'address'
        });
      
      if (saveError) {
        console.error("Supabase error:", saveError);
        setError(saveError.message || "Failed to save profile. Please try again.");
        setSaving(false);
        return;
      }
      
      setIsEditing(false);
      setSaving(false);
      
      toast.success("Profile updated successfully!");
      await refreshProfile();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setSaving(false);
    }
  };

  if (!isConnected) {
    return <div className="text-gray-500 p-8 text-center">Connect your wallet to view your profile.</div>;
  }

  if (loading) {
    return <div className="text-gray-500 p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8 border-2 border-dashed border-gray-300 bg-white shadow-lg transform rotate-1">
        <CardContent className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center transform -rotate-2">
                {isEditing ? (
                  <AvatarUpload value={avatarUrl} onChange={(url) => setAvatarUrl(url)} />
                ) : avatarUrl ? (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback>{username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-200 rounded-full border-2 border-gray-400 flex items-center justify-center transform rotate-12">
                <span className="text-sm">✨</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      className="text-3xl font-bold text-gray-800 mb-2 bg-gray-100 border-b-2 border-dashed border-gray-300 px-2 py-1 rounded"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{username || ensName || "Unnamed"}</h1>
                  )}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{rating}</span>
                    </div>
                    <Badge variant="outline" className="border-dashed border-2">
                      0 services completed
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    <strong>Wallet:</strong> {address}
                    {ensName && <span className="ml-2 text-green-600">({ensName})</span>}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-2 border-dashed border-gray-400 hover:bg-gray-50"
                  disabled={saving}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              {isEditing ? (
                <>
                  <input
                    className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="Avatar URL"
                  />
                  <textarea
                    className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                  <Button 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="border-2 border-dashed border-blue-400"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <p className="text-gray-600 mb-4 max-w-2xl">{bio || "No bio yet."}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
                  <div className="text-2xl font-bold text-green-600">0 SKILL</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Services</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{joinDate || "Recent"}</div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 border-2 border-dashed border-gray-300">
          <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">My Skills</TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">Badges</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card className="border-2 border-dashed border-gray-300 bg-white text-center p-8">
            <div className="text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No skills added yet. Start by listing your first skill!</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card className="border-2 border-dashed border-gray-300 bg-white text-center p-8">
            <div className="text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No badges earned yet. Complete services to earn your first badge!</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity. Start using SkillSwap to see your activity here!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
