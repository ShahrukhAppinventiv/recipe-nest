export type DbRecipe = {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  ingredients?: unknown;
  instructions?: unknown;
  image: string | null;
  difficulty: string | null;
  cook_time: number | null;
  servings: number | null;
  calories: number | null;
  rating_avg: number;
  review_count: number | null;
  view_count: number | null;
  status: string | null;
  cuisine_id: number | null;
  meal_type_id: number | null;
  created_by: number | null;
};

export type DbRecipeWithRelations = DbRecipe & {
  cuisines: { name: string } | null;
  meal_types: { name: string } | null;
  recipe_tags: { tags: { name: string } | null }[] | null;
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
  viewCount: number;
  cuisine: string;
  mealType: string;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  ingredients: string[];
  instructions: string[];
  authorName?: string;
  createdAt: string;
};
