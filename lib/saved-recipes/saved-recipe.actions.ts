"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetchAuth } from "@/lib/api/client";
import { getAuthSession } from "@/lib/auth";
import {
  savedRecipesCountTag,
  savedRecipesListTag,
} from "./saved-recipe.service";
import type { ToggleSaveResult } from "./saved-recipe.types";

function revalidateAfterToggle(userId: string) {
  updateTag("featured-recipes");
  updateTag("latest-recipes");
  // updateTag("recipe-of-the-day");
  updateTag(savedRecipesCountTag(userId));
  updateTag(savedRecipesListTag(userId));
  revalidatePath("/recipe");
  revalidatePath("/saved");
}

export async function toggleSaveRecipe(
  recipeId: string,
): Promise<ToggleSaveResult> {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.accessToken) {
    return { success: false, saved: false, message: "Not authenticated" };
  }

  const trimmedRecipeId = recipeId.trim();
  if (!trimmedRecipeId) {
    return { success: false, saved: false, message: "Invalid recipe" };
  }

  try {
    const result = await apiFetchAuth<ToggleSaveResult>(
      `/api/users/${session.user.id}/saved-recipes/${trimmedRecipeId}/toggle`,
      session.accessToken,
      { method: "POST" },
    );

    if (!result.success) {
      return {
        success: false,
        saved: result.saved,
        message: result.message ?? "Could not update saved recipe",
      };
    }

    revalidateAfterToggle(session.user.id);
    return { success: true, saved: result.saved };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update saved recipe";
    return { success: false, saved: false, message };
  }
}
