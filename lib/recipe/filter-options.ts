export type FilterOption = {
  id: number | string;
  name: string;
};

export type FilterGroup = "cuisineIds" | "mealTypeIds" | "difficultyIds";

export type RecipeFiltersState = {
  search: string;
  cuisineIds: number[];
  mealTypeIds: number[];
  difficultyIds: string[];
};

export const EMPTY_RECIPE_FILTERS: RecipeFiltersState = {
  search: "",
  cuisineIds: [],
  mealTypeIds: [],
  difficultyIds: [],
};

export const STATIC_DIFFICULTY_OPTIONS: FilterOption[] = [
  { id: "Easy", name: "Easy" },
  { id: "Medium", name: "Medium" },
  { id: "Hard", name: "Hard" },
];
