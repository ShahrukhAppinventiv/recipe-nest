import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ProfileContent } from "./components/ProfileContent";
import { getAuthSession } from "@/lib/auth";
import { AUTH_ROUTES } from "@/lib/constants/constants";
import { getUserProfile } from "@/lib/user/user.service";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your RecipeNest account details.",
  robots: { index: false, follow: false },
};

async function ProfilePageContent() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  return <ProfileContent user={profile} />;
}

function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy aria-label="Loading profile">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
