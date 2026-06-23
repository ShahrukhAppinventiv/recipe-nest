import type {
  RecipeCardData,
  RecipeDifficulty,
  RecipeSpotlightData,
} from "@/components/recipeCard/types";
import type {
  DbRecipeDetailWithRelations,
  DbRecipeWithRelations,
  RecipeDetailData,
} from "./recipe.types";

function toRecipeDifficulty(
  value: string | null,
): RecipeDifficulty | undefined {
  if (value === "Easy" || value === "Medium" || value === "Hard") {
    return value;
  }

  return undefined;
}

function mapMealTypes(
  rows: DbRecipeWithRelations["recipe_meal_types"],
): string[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows
    .map((row) => row.meal_types?.name?.trim() ?? "")
    .filter(Boolean);
}

function mapTags(raw: unknown): string[] {
  if (!raw) {
    return [];
  }

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const name = record.name ?? record.tag ?? record.label;
        return typeof name === "string" ? name.trim() : "";
      }

      return "";
    })
    .filter(Boolean);
}

function parseJsonbTextList(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      const trimmed = item.trim();
      return trimmed ? [trimmed] : [];
    }

    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const instructionText =
      record.text ??
      record.instruction ??
      record.step_text ??
      record.description;

    if (typeof instructionText === "string" && instructionText.trim()) {
      return [instructionText.trim()];
    }

    const itemName = record.item ?? record.name ?? record.ingredient;
    const quantity = record.quantity ?? record.amount ?? record.qty;

    if (typeof itemName === "string" && itemName.trim()) {
      if (typeof quantity === "string" && quantity.trim()) {
        return [`${quantity.trim()} ${itemName.trim()}`];
      }

      if (typeof quantity === "number") {
        return [`${quantity} ${itemName.trim()}`];
      }

      return [itemName.trim()];
    }

    return [];
  });
}

export function toRecipeCardData(recipe: DbRecipeWithRelations): RecipeCardData {
  const mealTypes = mapMealTypes(recipe.recipe_meal_types);

  return {
    id: String(recipe.id),
    title: recipe.title ?? "Untitled recipe",
    image: recipe.image ?? "/recipe1.webp",
    rating: Number(recipe.rating_avg),
    cuisine: recipe.cuisines?.name ?? "Unknown",
    mealType: mealTypes[0] ?? "",
    cookTimeMinutes: Number(recipe.cook_time_minutes ?? 0),
    difficulty: toRecipeDifficulty(recipe.difficulty),
    tags: mapTags(recipe.tags),
    href: `/recipe/${recipe.id}`,
  };
}

export function toRecipeDetailData(
  recipe: DbRecipeDetailWithRelations,
): RecipeDetailData {
  const authorName = recipe.users?.name?.trim();

  return {
    id: String(recipe.id),
    title: recipe.title ?? "Untitled recipe",
    description: recipe.description ?? "",
    image: recipe.image ?? "/recipe1.webp",
    rating: Number(recipe.rating_avg),
    reviewCount: Number(recipe.review_count ?? 0),
    cuisine: recipe.cuisines?.name ?? "Unknown",
    mealTypes: mapMealTypes(recipe.recipe_meal_types),
    cookTimeMinutes: Number(recipe.cook_time_minutes ?? 0),
    prepTimeMinutes: Number(recipe.prep_time_minutes ?? 0),
    servings: Number(recipe.servings ?? 0),
    caloriesPerServing: Number(recipe.calories_per_serving ?? 0),
    difficulty: toRecipeDifficulty(recipe.difficulty),
    tags: mapTags(recipe.tags),
    ingredients: parseJsonbTextList(recipe.ingredients),
    instructions: parseJsonbTextList(recipe.instructions),
    authorName: authorName || undefined,
    createdAt: recipe.created_at,
  };
}

export function toRecipeSpotlightData(
  recipe: DbRecipeWithRelations,
): RecipeSpotlightData {
  return {
    ...toRecipeCardData(recipe),
    description: recipe.description ?? "",
  };
}
