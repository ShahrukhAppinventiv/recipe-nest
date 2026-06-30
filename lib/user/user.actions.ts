"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { apiFetchAuth } from "@/lib/api/client";
import { supabaseAdmin } from "@/lib/supabase/client";

export type UpdateProfileResult = {
  success: boolean;
  message?: string;
};

export async function updateProfileName(
  name: string,
): Promise<UpdateProfileResult> {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.accessToken) {
    return { success: false, message: "Not authenticated" };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return { success: false, message: "Name cannot be empty" };
  }

  if (trimmed.length > 80) {
    return { success: false, message: "Name must be 80 characters or fewer" };
  }

  try {
    await apiFetchAuth<null>(
      `/api/users/${session.user.id}`,
      session.accessToken,
      {
        method: "PATCH",
        body: JSON.stringify({ name: trimmed }),
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update profile name";
    return { success: false, message };
  }

  updateTag(`user-profile-${session.user.id}`);
  // revalidatePath("/profile");

  return { success: true };
}

export async function updateUserProfile(
  name: string,
  image?: string | null,
): Promise<UpdateProfileResult> {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.accessToken) {
    return { success: false, message: "Not authenticated" };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return { success: false, message: "Name cannot be empty" };
  }

  if (trimmed.length > 80) {
    return { success: false, message: "Name must be 80 characters or fewer" };
  }

  const payload: { name: string; image?: string | null } = { name: trimmed };
  if (image !== undefined) {
    payload.image = image;
  }
  console.log("payload ------", payload)

  try {
    await apiFetchAuth<null>(
      `/api/users/${session.user.id}`,
      session.accessToken,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update profile";
    return { success: false, message };
  }

  updateTag(`user-profile-${session.user.id}`);
  // revalidatePath("/profile");

  return { success: true };
}

export async function deletePreviousProfileImage(imageUrl: string): Promise<UpdateProfileResult> {
  const session = await getAuthSession();
  if (!session?.user?.id || !session.accessToken) {
    return { success: false, message: "Not authenticated" };
  }

  if (!imageUrl) {
    return { success: true };
  }

  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "recipe-nest";
  const searchString = `/storage/v1/object/public/${bucketName}/`;
  const index = imageUrl.indexOf(searchString);
  if (index === -1) {
    console.log("Image URL does not match current bucket, skipping deletion:", imageUrl);
    return { success: true };
  }

  const filePath = imageUrl.slice(index + searchString.length);
  if (!filePath) {
    return { success: true };
  }

  // Ensure the filename belongs to the authenticated user!
  if (!filePath.startsWith(`user_${session.user.id}_`)) {
    console.error(`Unauthorized deletion attempt by user ${session.user.id} for file ${filePath}`);
    return { success: false, message: "Unauthorized file deletion" };
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete previous image from Supabase storage:", error);
      return { success: false, message: error.message };
    }

    console.log("Successfully deleted previous image from Supabase storage:", filePath);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image from Supabase storage:", error);
    return { success: false, message: "Internal error during deletion" };
  }
}

