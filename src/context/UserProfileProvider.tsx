import React, { useState, ReactNode, useEffect } from "react";
import { UserProfile } from "./UserProfileContext";
import { UserProfileContext } from "./useUserProfile";

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    console.log("UserProfileProvider: initializing userProfile state");
    // Load user profile from localStorage if available
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  // Update localStorage when userProfile changes
  useEffect(() => {
    console.log("UserProfileProvider: updating localStorage");
    if (userProfile) {
      console.log("UserProfileProvider: saving userProfile to localStorage");
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } else {
      console.log("UserProfileProvider: removing userProfile from localStorage");
      localStorage.removeItem("userProfile");
    }
  }, [userProfile]);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
