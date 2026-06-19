import type { RecipeCardData } from "@/components/recipeCard/types";
import type { RecipeFiltersState } from "@/lib/recipe/recipe.filters";

export const RECIPE_PAGE_SIZE = 9;

export type RecipeSort = "latest" | "rating";

export type RecipeSearchParams = RecipeFiltersState & {
  search?: string;
  sort: RecipeSort;
  page: number;
  pageSize: number;
};

export type RecipesResult = {
  recipes: RecipeCardData[];
  total: number;
  page: number;
  pageSize: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function getParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseIds(value: string | undefined): number[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function parseList(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseRecipeSearchParams(
  searchParams: RawSearchParams,
): RecipeSearchParams {
  const sortParam = getParam(searchParams.sort);
  const pageParam = Number(getParam(searchParams.page));

  return {
    search: getParam(searchParams.q)?.trim() || undefined,
    cuisineIds: parseIds(getParam(searchParams.cuisine)),
    mealTypeIds: parseIds(getParam(searchParams.mealType)),
    difficulties: parseList(getParam(searchParams.difficulty)),
    sort: sortParam === "rating" ? "rating" : "latest",
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
    pageSize: RECIPE_PAGE_SIZE,
  };
}

export function recipeParamsToQueryString(params: RecipeSearchParams): string {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("q", params.search);
  }

  if (params.cuisineIds.length > 0) {
    searchParams.set("cuisine", params.cuisineIds.join(","));
  }

  if (params.mealTypeIds.length > 0) {
    searchParams.set("mealType", params.mealTypeIds.join(","));
  }

  if (params.difficulties.length > 0) {
    searchParams.set("difficulty", params.difficulties.join(","));
  }

  if (params.sort === "rating") {
    searchParams.set("sort", "rating");
  }

  if (params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  return searchParams.toString();
}

export function resultsCacheKey(params: RecipeSearchParams): string {
  return recipeParamsToQueryString(params) || "default";
}
