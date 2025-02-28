import React, { useState, ReactNode } from "react";
import { UserProfile } from "./UserProfileContext";
import { UserProfileContext } from "./useUserProfile";

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
