export const DIFFICULTY_FILTER_OPTIONS: string[] = ["Easy", "Medium", "Hard"];

export type RecipeFiltersState = {
  cuisineIds: number[];
  mealTypeIds: number[];
  difficulties: string[];
};

export const EMPTY_RECIPE_FILTERS: RecipeFiltersState = {
  cuisineIds: [],
  mealTypeIds: [],
  difficulties: [],
};
