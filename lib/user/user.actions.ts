"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type UpdateProfileResult = {
  success: boolean;
  message?: string;
};

/**
 * Updates the authenticated user's display name in the database.
 * After a successful update, revalidates the /profile route so the
 * server component picks up the new value on the next render.
 */
export async function updateProfileName(
  name: string,
): Promise<UpdateProfileResult> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return { success: false, message: "Name cannot be empty" };
  }

  if (trimmed.length > 80) {
    return { success: false, message: "Name must be 80 characters or fewer" };
  }

  const numericId = Number(session.user.id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return { success: false, message: "Invalid user ID" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("users")
    .update({ name: trimmed })
    .eq("id", numericId);

  if (error) {
    return { success: false, message: error.message };
  }

  // Expire the cached getUserProfile entry for this user immediately so the
  // next render fetches fresh data instead of serving the stale cached value.
  updateTag(`user-profile-${numericId}`);
  // Also clear the page-level router cache so navigating back to /profile
  // triggers a fresh server render.
  revalidatePath("/profile");

  return { success: true };
}
