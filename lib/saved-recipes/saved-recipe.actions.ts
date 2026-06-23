"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ToggleSaveResult } from "./saved-recipe.types";

/**
 * Revalidates every route that renders saved-recipe state so they all
 * pick up the latest data after a save/unsave action.
 */
function revalidateSavedPaths() {
  revalidatePath("/home");
  revalidatePath("/recipe");
  revalidatePath("/saved");
}

/**
 * Toggles the saved state of a recipe for the currently authenticated user.
 * - If the recipe is not yet saved → inserts a row (saved = true).
 * - If the recipe is already saved → deletes the row (saved = false).
 *
 * Revalidates the home and saved pages so server components pick up the change.
 */
export async function toggleSaveRecipe(
  recipeId: string,
): Promise<ToggleSaveResult> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { success: false, saved: false, message: "Not authenticated" };
  }

  const numericUserId = Number(session.user.id);
  const numericRecipeId = Number(recipeId);

  if (
    !Number.isInteger(numericUserId) ||
    numericUserId <= 0 ||
    !Number.isInteger(numericRecipeId) ||
    numericRecipeId <= 0
  ) {
    return { success: false, saved: false, message: "Invalid ID" };
  }

  const supabase = createAdminClient();

  // Check current state
  const { data: existing } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("user_id", numericUserId)
    .eq("recipe_id", numericRecipeId)
    .maybeSingle();

  if (existing) {
    // Already saved → unsave
    const { error } = await supabase
      .from("saved_recipes")
      .delete()
      .eq("user_id", numericUserId)
      .eq("recipe_id", numericRecipeId);

    if (error) {
      return { success: false, saved: true, message: error.message };
    }

    revalidateSavedPaths();
    return { success: true, saved: false };
  }

  // Not saved → save
  const { error } = await supabase.from("saved_recipes").insert({
    user_id: numericUserId,
    recipe_id: numericRecipeId,
  });

  if (error) {
    return { success: false, saved: false, message: error.message };
  }

  revalidateSavedPaths();
  return { success: true, saved: true };
}
