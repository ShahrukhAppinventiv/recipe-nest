import { createAdminClient } from "@/lib/supabase/admin";
import type { RecipeCardData } from "@/components/recipeCard/types";
import { toRecipeCardData } from "@/lib/recipe/recipe.mapper";
import type { DbRecipeWithRelations } from "@/lib/recipe/recipe.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNumericUserId(userId: string): number | null {
  const id = Number(userId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---------------------------------------------------------------------------
// Read functions  (no caching — data is per-user and changes on every toggle)
// ---------------------------------------------------------------------------

/**
 * Returns the set of recipe IDs saved by the user.
 * Used by recipe lists to mark individual cards as saved.
 */
export async function getSavedRecipeIds(
  userId: string,
): Promise<Set<string>> {
  const numericId = toNumericUserId(userId);
  if (!numericId) return new Set();

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("recipe_id")
    .eq("user_id", numericId);

  if (error) {
    console.error("[getSavedRecipeIds]", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => String(row.recipe_id)));
}

/**
 * Returns the total number of recipes saved by the user.
 * Used for the header badge count.
 */
export async function getSavedRecipesCount(userId: string): Promise<number> {
  const numericId = toNumericUserId(userId);
  if (!numericId) return 0;

  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("saved_recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", numericId);

  if (error) {
    console.error("[getSavedRecipesCount]", error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * Returns full recipe card data for all recipes saved by the user,
 * ordered newest-saved first. Used by the drawer / saved recipes page.
 */
export async function getSavedRecipesWithData(
  userId: string,
): Promise<RecipeCardData[]> {
  const numericId = toNumericUserId(userId);
  if (!numericId) return [];

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("saved_recipes")
    .select(
      `
      recipe_id,
      created_at,
      recipes (
        id,
        title,
        description,
        image,
        difficulty,
        cook_time_minutes,
        prep_time_minutes,
        rating_avg,
        status,
        created_at,
        tags,
        cuisines ( name ),
        recipe_meal_types ( meal_types ( name ) )
      )
    `,
    )
    .eq("user_id", numericId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getSavedRecipesWithData]", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.recipes as unknown as DbRecipeWithRelations | null)
    .filter((recipe): recipe is DbRecipeWithRelations => recipe !== null)
    .map(toRecipeCardData);
}

/**
 * Checks whether a specific recipe is already saved by the user.
 * Used server-side when rendering a single recipe detail page.
 */
export async function isRecipeSaved(
  userId: string,
  recipeId: string,
): Promise<boolean> {
  const numericUserId = toNumericUserId(userId);
  const numericRecipeId = Number(recipeId);

  if (!numericUserId || !Number.isInteger(numericRecipeId) || numericRecipeId <= 0) {
    return false;
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("user_id", numericUserId)
    .eq("recipe_id", numericRecipeId)
    .maybeSingle();

  if (error) {
    console.error("[isRecipeSaved]", error.message);
    return false;
  }

  return data !== null;
}
