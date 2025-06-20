
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
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

export const UserProvider = React.memo(({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!address || !isConnected) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, bio, reputation, created_at")
        .eq("address", address);
        
      if (error) {
        console.error("Profile fetch error:", error);
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
          console.error("Profile creation error:", createError);
          if ((createError.code && createError.code.toString() === '23505') || 
              (createError.message && createError.message.toLowerCase().includes('duplicate key'))) {
            const { data: existingUser, error: fetchExistingError } = await supabase
              .from("users")
              .select("username, avatar_url, bio, reputation, created_at")
              .eq("address", address)
              .single();
              
            if (fetchExistingError) {
              setError("Failed to fetch user profile.");
              setProfile(null);
            } else {
              setProfile(existingUser);
            }
          } else {
            setError("Failed to create user profile.");
            setProfile(null);
          }
        } else {
          setProfile(newUser);
        }
      } else if (data.length > 1) {
        setError("Multiple users found. Please contact support.");
        setProfile(null);
      } else {
        setProfile(data[0]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("UserContext error:", errorMessage);
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [address, ensName, isConnected]);

  useEffect(() => {
    // Only fetch profile if wallet is connected
    if (isConnected && address) {
      fetchProfile();
    } else {
      // Clear profile data when wallet is disconnected
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [fetchProfile, isConnected, address]);

  const contextValue = useMemo(() => ({
    profile,
    setProfile,
    refreshProfile: fetchProfile,
    loading,
    error,
  }), [profile, fetchProfile, loading, error]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
});

UserProvider.displayName = 'UserProvider';

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
