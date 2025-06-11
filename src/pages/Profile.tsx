
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

const Profile = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Profile data
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [joinDate, setJoinDate] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    supabase
      .from("users")
      .select("username, avatar_url, bio, reputation, created_at")
      .eq("address", address)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase fetch error:", error);
        }
        if (data) {
          setUsername(data.username || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
          setRating(data.reputation || 0);
          setJoinDate(data.created_at ? new Date(data.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : "");
        }
        setLoading(false);
      });
  }, [address]);

  const handleSave = async () => {
    if (!address) return;
    setSaving(true);
    
    const { error } = await supabase.from("users").upsert({
      address,
      username,
      avatar_url: avatarUrl,
      bio,
    });
    
    if (error) {
      console.error("Supabase upsert error:", error);
      setSaving(false);
      return;
    }
    
    setIsEditing(false);
    setSaving(false);
    
    // Redirect to home page after successful save
    navigate("/");
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
                    placeholder="Short bio"
                  />
                  <Button onClick={handleSave} disabled={saving} className="border-2 border-dashed border-blue-400">
                    {saving ? "Saving..." : "Save"}
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
