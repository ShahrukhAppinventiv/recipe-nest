import type { RecipeFiltersState } from "./filter-options";
import type { RecipeSearchParams, RecipeSort } from "./recipe.types";

export type { RecipeSort };

export const RECIPE_PAGE_SIZE = 50;

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

/** URL → filter UI state (checkboxes + search input) */
export function parseRecipeParams(
  searchParams: RawSearchParams,
): RecipeFiltersState {
  return {
    search: getParam(searchParams.q)?.trim() ?? "",
    cuisineIds: parseIds(getParam(searchParams.cuisine)),
    mealTypeIds: parseIds(getParam(searchParams.mealType)),
    difficultyIds: parseList(getParam(searchParams.difficulty)),
  };
}

/** URL → params for getRecipes() (server fetch) */
export function parseFetchParams(
  searchParams: RawSearchParams,
): RecipeSearchParams {
  const filters = parseRecipeParams(searchParams);
  const sortParam = getParam(searchParams.sort);
  const pageParam = Number(getParam(searchParams.page));

  return {
    search: filters.search.trim() || undefined,
    cuisineIds: filters.cuisineIds,
    mealTypeIds: filters.mealTypeIds,
    difficulties: filters.difficultyIds,
    sort: sortParam === "rating" ? "rating" : "latest",
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
    pageSize: RECIPE_PAGE_SIZE,
  };
}

/** Filter UI state → URL query string */
export function recipeFiltersToQueryString(
  filters: RecipeFiltersState,
  page = 1,
  sort: RecipeSort = "latest",
): string {
  const searchParams = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    searchParams.set("q", search);
  }

  if (filters.cuisineIds.length > 0) {
    searchParams.set("cuisine", filters.cuisineIds.join(","));
  }

  if (filters.mealTypeIds.length > 0) {
    searchParams.set("mealType", filters.mealTypeIds.join(","));
  }

  if (filters.difficultyIds.length > 0) {
    searchParams.set("difficulty", filters.difficultyIds.join(","));
  }

  if (sort === "rating") {
    searchParams.set("sort", "rating");
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  return searchParams.toString();
}
