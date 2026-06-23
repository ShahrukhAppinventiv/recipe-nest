import type { RecipeCardData } from "@/components/recipeCard/types";

/** A row from public.saved_recipes joined with its recipe data. */
export type SavedRecipeRow = {
  recipe_id: number;
  created_at: string;
  recipes: unknown; // resolved by mapper
};

/** Lightweight result returned by toggleSaveRecipe action. */
export type ToggleSaveResult = {
  success: boolean;
  saved: boolean; // true = just saved, false = just unsaved
  message?: string;
};

/** What the header badge / drawer needs from the server. */
export type SavedRecipesSummary = {
  count: number;
  recipes: RecipeCardData[];
};
