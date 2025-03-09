import React, { useState, ReactNode } from "react";
import { UserProfile } from "./UserProfileContext";
import { UserProfileContext } from "./useUserProfile";
import { getUserProfile } from "../api/users";
import Cookies from "js-cookie";
import { logoutServer } from "../api/auth";

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const refreshUserProfile = async () => {
    const userProfileData = await getUserProfile();

    const userProfile = {
      _id: userProfileData._id,
      avatarUrl: userProfileData.avatarUrl,
      birthdate: userProfileData.birthdate,
      email: userProfileData.email,
      favoriteGyms: userProfileData.favoriteGyms || [],
      firstName: userProfileData.firstName,
      gender: userProfileData.gender,
      lastName: userProfileData.lastName,
      role: userProfileData.role,
      id: userProfileData._id,
      street: userProfileData.street,
      city: userProfileData.city,
    };

    if (userProfile) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("userProfile");
    }

    setUserProfile(userProfile);
  };

  const logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      console.error("No refresh token found in cookies.");
      return;
    }
    await logoutServer(refreshToken);
    localStorage.removeItem("userProfile");
    setUserProfile(null);
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, logout }}>
      {children}
    </UserProfileContext.Provider>
  );
};
