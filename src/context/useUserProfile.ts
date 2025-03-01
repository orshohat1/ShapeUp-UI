import { createContext, useContext } from "react";
import { UserProfileContextType } from "./UserProfileContext";

export const UserProfileContext = createContext<
  UserProfileContextType | undefined
>(undefined);

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
