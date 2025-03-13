export interface UserProfile {
    avatarUrl: string;
    birthdate: string;
    email: string;
    favoriteGyms: any[];
    firstName: string;
    gender: string;
    lastName: string;
    role: string;
    street: string;
    city: string;
    id: string;
}

export interface UserProfileContextType {
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<any>;
  logout: () => void;
}
