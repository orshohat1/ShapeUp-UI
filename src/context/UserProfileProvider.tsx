import React, { useState, ReactNode, useEffect } from "react";
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
    try {
      const storedProfile = localStorage.getItem("userProfile");
      return storedProfile ? JSON.parse(storedProfile) : null;
    } catch (error) {
      console.error("Failed to parse user profile from localStorage:", error);
      return null;
    }
  });

  const refreshUserProfile = async () => {
    try {
      const userProfileData = await getUserProfile();

      if (!userProfileData || !userProfileData._id) {
        console.warn("Invalid user profile data received:", userProfileData);
        return;
      }

      const userProfile = {
        _id: userProfileData._id,
        avatarUrl: userProfileData.avatarUrl || "",
        birthdate: userProfileData.birthdate || "",
        email: userProfileData.email || "",
        favoriteGyms: userProfileData.favoriteGyms || [],
        firstName: userProfileData.firstName || "",
        gender: userProfileData.gender || "",
        lastName: userProfileData.lastName || "",
        role: userProfileData.role || "user",
        id: userProfileData._id,
        street: userProfileData.street || "",
        city: userProfileData.city || "",
      };

      setUserProfile(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get("refresh_token");
      if (!refreshToken) {
        console.error("No refresh token found in cookies.");
        return;
      }

      await logoutServer(refreshToken);
      localStorage.removeItem("userProfile");
      setUserProfile(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Auto-refresh user profile on mount
  useEffect(() => {
    if (!userProfile) {
      if (location.pathname !== "/login" && location.pathname !== "/user/login") {
        refreshUserProfile();
      }
    }
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, logout }}>
      {children}
    </UserProfileContext.Provider>
  );
};
