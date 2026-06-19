import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { ProfileContent } from "./components/ProfileContent";
import { getAuthSession } from "@/lib/auth";
import { AUTH_ROUTES } from "@/lib/constants/constants";
import { getUserProfile } from "@/lib/user/user.service";
import type { UserProfile } from "@/lib/user/user.types";

function profileFromSession(user: Session["user"]): UserProfile {
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
    role: user.role,
    provider: null,
    createdAt: null,
    lastLoginAt: null,
  };
}

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <ProfileContent user={profile ?? profileFromSession(session.user)} />
  );
}
