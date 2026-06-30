import type { RecipeCardData } from "@/components/recipeCard/types";
import { apiFetchAuth } from "@/lib/api/client";
import { cacheLife, cacheTag } from "next/cache";

export function savedRecipesCountTag(userId: string) {
  return `saved-recipes-count-${userId}`;
}

export async function getSavedRecipesCount(
  userId: string,
  token: string,
): Promise<number> {
  "use cache";
  cacheLife({
    stale: 5 * 60,
    revalidate: 5 * 60,
    expire: 60 * 60,
  });
  cacheTag(savedRecipesCountTag(userId));

  if (!userId.trim() || !token) {
    return 0;
  }

  return apiFetchAuth<number>(
    `/api/users/${userId}/saved-recipes/count`,
    token,
  );
}

export function savedRecipesListTag(userId: string) {
  return `saved-recipes-list-${userId}`;
}

export async function getSavedRecipesWithData(
  userId: string,
  token: string,
): Promise<RecipeCardData[]> {
  "use cache";
  cacheLife({
    stale: 5 * 60,
    revalidate: 5 * 60,
    expire: 60 * 60,
  });
  cacheTag(savedRecipesListTag(userId));

  if (!userId.trim() || !token) {
    return [];
  }

  return apiFetchAuth<RecipeCardData[]>(
    `/api/users/${userId}/saved-recipes`,
    token,
  );
}
