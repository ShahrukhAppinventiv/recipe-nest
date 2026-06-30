import { cacheLife, cacheTag } from "next/cache";
import { apiFetchAuth } from "@/lib/api/client";
import type { UserProfile } from "@/lib/user/user.types";

export async function getUserProfile(
  userId: string,
  token: string,
): Promise<UserProfile | null> {
  "use cache";
  cacheTag(`user-profile-${userId}`);
  cacheLife({ stale: 5 * 60, revalidate: 5 * 60, expire: 60 * 60 });

  if (!userId.trim() || !token) {
    return null;
  }

  console.log(`[getUserProfile] CACHE MISS for userId: ${userId}`);

  try {
    return await apiFetchAuth<UserProfile>(`/api/users/${userId}`, token);
  } catch {
    return null;
  }
}
