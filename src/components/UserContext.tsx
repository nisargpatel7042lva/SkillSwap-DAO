import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useEnsName } from "wagmi";
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
  const { data: ensName } = useEnsName({ address });
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
        .eq("address", address);
      console.log("Supabase response:", { data, error });
      if (error) {
        setError(error.message);
        setProfile(null);
      } else if (!data || data.length === 0) {
        // Auto-create user profile if not found
        const username = ensName || `User_${address.slice(0, 6)}`;
        const now = new Date().toISOString();
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([
            {
              address,
              username,
              created_at: now,
              updated_at: now,
            },
          ])
          .select("username, avatar_url, bio, reputation, created_at")
          .single();
        if (createError) {
          // If duplicate key error, fetch the existing user
          if ((createError.code && createError.code.toString() === '23505') || (createError.message && createError.message.toLowerCase().includes('duplicate key'))) {
            const { data: existingUser, error: fetchExistingError } = await supabase
              .from("users")
              .select("username, avatar_url, bio, reputation, created_at")
              .eq("address", address)
              .single();
            if (fetchExistingError) {
              setError("Failed to fetch existing user profile after duplicate error.");
              setProfile(null);
            } else {
              setProfile(existingUser);
            }
          } else {
            setError(`Failed to create user profile: ${createError.message || 'Unknown error'}`);
            setProfile(null);
          }
        } else {
          setProfile(newUser);
        }
      } else if (data.length > 1) {
        setError("Multiple users found for this wallet address. Please contact support.");
        setProfile(null);
      } else {
        setProfile(data[0]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
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
  }, [address, ensName]);

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