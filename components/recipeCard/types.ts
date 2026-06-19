export type RecipeDifficulty = "Easy" | "Medium" | "Hard";

export type RecipeCardData = {
  id: string;
  title: string;
  image: string;
  rating: number;
  cuisine: string;
  mealType: string;
  cookTimeMinutes: number;
  difficulty?: RecipeDifficulty;
  tags?: string[];
  href?: string;
};

export type RecipeCardVariant = "compact" | "rich";

export type RecipeSpotlightData = RecipeCardData & {
  description: string;
};
