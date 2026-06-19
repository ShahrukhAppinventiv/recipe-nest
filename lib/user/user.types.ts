export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  provider: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
};
