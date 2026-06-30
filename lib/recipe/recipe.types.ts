import type { RecipeCardData } from "@/components/recipeCard/types";

export type DbRecipe = {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  ingredients?: unknown;
  instructions?: unknown;
  image: string | null;
  difficulty: string | null;
  cook_time_minutes: number | null;
  prep_time_minutes: number | null;
  servings: number | null;
  calories_per_serving: number | null;
  rating_avg: number;
  review_count: number | null;
  status: string | null;
  cuisine_id: number | null;
  created_by: number | null;
  tags?: unknown;
};

export type DbRecipeWithRelations = DbRecipe & {
  cuisines: { name: string } | null;
  recipe_meal_types: { meal_types: { name: string } | null }[] | null;
};

export type DbRecipeDetailWithRelations = DbRecipeWithRelations & {
  ingredients: unknown;
  instructions: unknown;
  users: { name: string | null } | null;
};

export type FilterOption = {
  id: number;
  name: string;
};

export type RecipeDetailData = {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  mealTypes: string[];
  cookTimeMinutes: number;
  prepTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  ingredients: string[];
  instructions: string[];
  authorName?: string;
  createdAt: string;
  /** Whether the logged-in user saved this recipe (from backend API). */
  isSaved?: boolean;
};

export type RecipeSort = "latest" | "rating";

export type RecipeSearchParams = {
  search?: string;
  cuisineIds: number[];
  mealTypeIds: number[];
  difficulties: string[];
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
