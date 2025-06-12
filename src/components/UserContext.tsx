import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  username: string;
  avatar_url: string;
  bio?: string;
  reputation?: number;
  created_at?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async () => {
    if (!address) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("users")
      .select("username, avatar_url, bio, reputation, created_at")
      .eq("address", address)
      .single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [address]);

  return (
    <UserContext.Provider value={{ profile, setProfile, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}; 