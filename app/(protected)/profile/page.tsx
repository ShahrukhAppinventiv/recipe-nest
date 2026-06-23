import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your RecipeNest account details.",
  robots: { index: false, follow: false },
};
import { ProfileContent } from "./components/ProfileContent";
import { getAuthSession } from "@/lib/auth";
import { AUTH_ROUTES } from "@/lib/constants/constants";
import { getUserProfile } from "@/lib/user/user.service";

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  // Always read from the database — getUserProfile is cached with "use cache"
  // and is invalidated by updateTag() in the updateProfileName action.
  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  return <ProfileContent user={profile} />;
}
