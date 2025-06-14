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
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!address) {
      setProfile(null);
      setLoading(false);
      setError(null);
      console.log("No address, skipping profile fetch");
      return;
    }
    setLoading(true);
    setError(null);
    console.log("Fetching profile for address:", address);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, bio, reputation, created_at")
        .eq("address", address)
        .single();
      console.log("Supabase response:", { data, error });
      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setProfile(null);
      console.log("Fetch profile error:", err);
    } finally {
      setLoading(false);
      console.log("Profile fetch complete. Loading:", false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [address]);

  return (
    <UserContext.Provider value={{ profile, setProfile, refreshProfile: fetchProfile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}; 