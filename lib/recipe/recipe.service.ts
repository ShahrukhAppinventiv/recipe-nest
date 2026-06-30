import type { RecipeCardData, RecipeSpotlightData } from "@/components/recipeCard/types";
import { apiFetchAuth } from "@/lib/api/client";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import type {
  FilterOption,
  RecipeDetailData,
  RecipeSearchParams,
  RecipesResult,
} from "./recipe.types";
import { recipeSearchParamsToQueryString } from "./recipe.params";

export async function getFeaturedRecipes(
  token: string,
): Promise<RecipeCardData[]> {
  "use cache";
  cacheLife({
    stale: 1 * 60 * 60,
    revalidate: 1 * 60 * 60,
    expire: 24 * 60 * 60,
  });
  cacheTag("featured-recipes");

  return apiFetchAuth<RecipeCardData[]>("/api/recipes/featured", token);
}

export async function getLatestRecipes(
  token: string,
): Promise<RecipeCardData[]> {
  "use cache";
  cacheLife({
    stale: 1 * 60 * 60,
    revalidate: 1 * 60 * 60,
    expire: 24 * 60 * 60,
  });
  cacheTag("latest-recipes");

  return apiFetchAuth<RecipeCardData[]>("/api/recipes/latest", token);
}

export async function getRecipeOfTheDay(
  token: string,
): Promise<RecipeSpotlightData | null> {
  "use cache";
  cacheLife({
    stale: 1 * 24 * 60 * 60,
    revalidate: 1 * 24 * 60 * 60,
    expire: 7 * 24 * 60 * 60,
  });
  cacheTag("recipe-of-the-day");

  return apiFetchAuth<RecipeSpotlightData>(
    "/api/recipes/recipe-of-the-day",
    token,
  );
}

export async function getCuisines(token: string): Promise<FilterOption[]> {
  "use cache";
  cacheLife({
    stale: 1 * 60 * 60,
    revalidate: 1 * 60 * 60,
    expire: 24 * 60 * 60,
  });
  cacheTag("cuisines");

  return apiFetchAuth<FilterOption[]>("/api/cuisines", token);
}

export async function getMealTypes(token: string): Promise<FilterOption[]> {
  "use cache";
  cacheLife({
    stale: 1 * 60 * 60,
    revalidate: 1 * 60 * 60,
    expire: 24 * 60 * 60,
  });
  cacheTag("meal-types");

  return apiFetchAuth<FilterOption[]>("/api/meal-types", token);
}

export const loadFilterOptions = cache(async (token: string): Promise<{
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
}> => {
  const [cuisines, mealTypes] = await Promise.all([
    getCuisines(token),
    getMealTypes(token),
  ]);

  return { cuisines, mealTypes };
});

export async function getRecipes(
  params: RecipeSearchParams,
  token: string,
): Promise<RecipesResult> {
  const query = recipeSearchParamsToQueryString(params);
  const path = query ? `/api/recipes?${query}` : "/api/recipes";

  return apiFetchAuth<RecipesResult>(path, token);
}

export async function getRecipeById(
  id: string,
  token: string,
): Promise<RecipeDetailData | null> {
  const recipeId = Number(id);

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    return null;
  }

  try {
    return await apiFetchAuth<RecipeDetailData>(`/api/recipes/${id}`, token, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}
