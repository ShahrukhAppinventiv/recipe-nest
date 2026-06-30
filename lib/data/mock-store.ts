import type {
  DbRecipeDetailWithRelations,
  DbRecipeWithRelations,
  FilterOption,
} from "@/lib/recipe/recipe.types";
import type { UserProfile } from "@/lib/user/user.types";

export const ADMIN_EMAIL = "admin@yopmail.com";
export const ADMIN_PASSWORD = "Admin@123";

const MOCK_CUISINES: FilterOption[] = [
  { id: 1, name: "Italian" },
  { id: 2, name: "Indian" },
  { id: 3, name: "Mexican" },
  { id: 4, name: "Japanese" },
];

const MOCK_MEAL_TYPES: FilterOption[] = [
  { id: 1, name: "Breakfast" },
  { id: 2, name: "Lunch" },
  { id: 3, name: "Dinner" },
  { id: 4, name: "Snack" },
];

const MOCK_RECIPES: DbRecipeDetailWithRelations[] = [
  {
    id: 1,
    created_at: "2025-01-10T10:00:00.000Z",
    title: "Classic Margherita Pizza",
    description: "A simple wood-fired pizza with fresh basil and mozzarella.",
    ingredients: ["500g pizza dough", "200g mozzarella", "Fresh basil", "Tomato sauce"],
    instructions: ["Preheat oven to 250°C", "Spread sauce on dough", "Bake for 12 minutes"],
    image: "/recipe1.webp",
    difficulty: "Medium",
    cook_time_minutes: 12,
    prep_time_minutes: 20,
    servings: 4,
    calories_per_serving: 320,
    rating_avg: 4.8,
    review_count: 42,
    status: "published",
    cuisine_id: 1,
    created_by: 1,
    tags: ["vegetarian", "comfort food"],
    cuisines: { name: "Italian" },
    recipe_meal_types: [{ meal_types: { name: "Dinner" } }],
    users: { name: "Admin" },
  },
  {
    id: 2,
    created_at: "2025-01-15T10:00:00.000Z",
    title: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces.",
    ingredients: ["600g chicken", "Butter", "Tomato puree", "Garam masala"],
    instructions: ["Marinate chicken", "Cook sauce", "Simmer together for 25 minutes"],
    image: "/recipe2.webp",
    difficulty: "Medium",
    cook_time_minutes: 35,
    prep_time_minutes: 15,
    servings: 4,
    calories_per_serving: 410,
    rating_avg: 4.9,
    review_count: 88,
    status: "published",
    cuisine_id: 2,
    created_by: 1,
    tags: ["spicy", "curry"],
    cuisines: { name: "Indian" },
    recipe_meal_types: [{ meal_types: { name: "Dinner" } }],
    users: { name: "Admin" },
  },
  {
    id: 3,
    created_at: "2025-02-01T10:00:00.000Z",
    title: "Avocado Toast",
    description: "Quick breakfast with smashed avocado and chili flakes.",
    ingredients: ["2 slices sourdough", "1 ripe avocado", "Lemon juice", "Chili flakes"],
    instructions: ["Toast bread", "Mash avocado with lemon", "Top and serve"],
    image: "/recipe3.webp",
    difficulty: "Easy",
    cook_time_minutes: 5,
    prep_time_minutes: 5,
    servings: 1,
    calories_per_serving: 280,
    rating_avg: 4.2,
    review_count: 19,
    status: "published",
    cuisine_id: 3,
    created_by: 1,
    tags: ["quick", "healthy"],
    cuisines: { name: "Mexican" },
    recipe_meal_types: [{ meal_types: { name: "Breakfast" } }],
    users: { name: "Admin" },
  },
  {
    id: 4,
    created_at: "2025-02-10T10:00:00.000Z",
    title: "Chicken Ramen",
    description: "Rich broth with noodles, soft egg, and sliced chicken.",
    ingredients: ["Ramen noodles", "Chicken stock", "Soy sauce", "Soft-boiled egg"],
    instructions: ["Simmer broth", "Cook noodles", "Assemble bowls"],
    image: "/recipe4.webp",
    difficulty: "Hard",
    cook_time_minutes: 45,
    prep_time_minutes: 20,
    servings: 2,
    calories_per_serving: 520,
    rating_avg: 4.6,
    review_count: 31,
    status: "published",
    cuisine_id: 4,
    created_by: 1,
    tags: ["noodles", "comfort food"],
    cuisines: { name: "Japanese" },
    recipe_meal_types: [{ meal_types: { name: "Lunch" } }],
    users: { name: "Admin" },
  },
  {
    id: 5,
    created_at: "2025-02-20T10:00:00.000Z",
    title: "Caprese Salad",
    description: "Fresh tomatoes, mozzarella, and basil with balsamic glaze.",
    ingredients: ["Tomatoes", "Fresh mozzarella", "Basil", "Balsamic glaze"],
    instructions: ["Slice tomatoes and cheese", "Layer with basil", "Drizzle glaze"],
    image: "/recipe5.webp",
    difficulty: "Easy",
    cook_time_minutes: 0,
    prep_time_minutes: 10,
    servings: 2,
    calories_per_serving: 190,
    rating_avg: 4.4,
    review_count: 12,
    status: "published",
    cuisine_id: 1,
    created_by: 1,
    tags: ["salad", "vegetarian"],
    cuisines: { name: "Italian" },
    recipe_meal_types: [{ meal_types: { name: "Snack" } }],
    users: { name: "Admin" },
  },
  {
    id: 6,
    created_at: "2025-03-01T10:00:00.000Z",
    title: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and spices.",
    ingredients: ["Basmati rice", "Mixed vegetables", "Biryani masala", "Yogurt"],
    instructions: ["Par-cook rice", "Layer with vegetables", "Dum cook for 30 minutes"],
    image: "/recipe6.avif",
    difficulty: "Hard",
    cook_time_minutes: 40,
    prep_time_minutes: 25,
    servings: 6,
    calories_per_serving: 380,
    rating_avg: 4.7,
    review_count: 54,
    status: "published",
    cuisine_id: 2,
    created_by: 1,
    tags: ["vegetarian", "rice"],
    cuisines: { name: "Indian" },
    recipe_meal_types: [{ meal_types: { name: "Dinner" } }],
    users: { name: "Admin" },
  },
];

const RECIPE_MEAL_TYPE_MAP: Record<number, number[]> = {
  1: [3],
  2: [3],
  3: [1],
  4: [2],
  5: [4],
  6: [3],
};

const users = new Map<string, UserProfile>([
  [
    "1",
    {
      id: "1",
      name: "Admin",
      email: ADMIN_EMAIL,
      image: null,
      role: "ADMIN",
      provider: "credentials",
      createdAt: "2025-01-01T00:00:00.000Z",
      lastLoginAt: null,
    },
  ],
]);

const savedRecipes = new Map<string, Set<number>>();

let nextOAuthUserId = 2;

function nowIso() {
  return new Date().toISOString();
}

export function getPublishedRecipes(): DbRecipeWithRelations[] {
  return MOCK_RECIPES.filter((recipe) => recipe.status === "published");
}

export function getRecipeDetailById(id: number): DbRecipeDetailWithRelations | null {
  return MOCK_RECIPES.find((recipe) => recipe.id === id && recipe.status === "published") ?? null;
}

export function getCuisineOptions(): FilterOption[] {
  return MOCK_CUISINES;
}

export function getMealTypeOptions(): FilterOption[] {
  return MOCK_MEAL_TYPES;
}

export function getRandomPublishedRecipeId(): number | null {
  const published = getPublishedRecipes();
  if (published.length === 0) return null;
  const index = Math.floor(Math.random() * published.length);
  return published[index]?.id ?? null;
}

export function getUserProfileById(userId: string): UserProfile | null {
  return users.get(userId) ?? null;
}

export function updateUserName(userId: string, name: string): boolean {
  const user = users.get(userId);
  if (!user) return false;
  users.set(userId, { ...user, name });
  return true;
}

type OAuthUserInput = {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
};

export function upsertOAuthUser(input: OAuthUserInput): UserProfile {
  const existing = [...users.values()].find((user) => user.email === input.email);

  if (existing) {
    const updated: UserProfile = {
      ...existing,
      name: input.name ?? existing.name,
      image: input.image ?? existing.image,
      provider: input.provider,
      lastLoginAt: nowIso(),
    };
    users.set(existing.id, updated);
    return updated;
  }

  const id = String(nextOAuthUserId++);
  const profile: UserProfile = {
    id,
    name: input.name ?? input.email.split("@")[0],
    email: input.email,
    image: input.image ?? null,
    role: input.email === ADMIN_EMAIL ? "ADMIN" : "USER",
    provider: input.provider,
    createdAt: nowIso(),
    lastLoginAt: nowIso(),
  };

  users.set(id, profile);
  return profile;
}

export function touchAdminLogin() {
  const admin = users.get("1");
  if (admin) {
    users.set("1", { ...admin, lastLoginAt: nowIso() });
  }
}

export function getSavedRecipeIdsForUser(userId: string): Set<string> {
  const ids = savedRecipes.get(userId);
  if (!ids) return new Set();
  return new Set([...ids].map(String));
}

export function getSavedRecipesCountForUser(userId: string): number {
  return savedRecipes.get(userId)?.size ?? 0;
}

export function isRecipeSavedByUser(userId: string, recipeId: string): boolean {
  const numericId = Number(recipeId);
  if (!Number.isInteger(numericId)) return false;
  return savedRecipes.get(userId)?.has(numericId) ?? false;
}

export function getSavedRecipeCardsForUser(userId: string): DbRecipeWithRelations[] {
  const ids = savedRecipes.get(userId);
  if (!ids || ids.size === 0) return [];

  return [...ids]
    .map((id) => getRecipeDetailById(id))
    .filter((recipe): recipe is DbRecipeDetailWithRelations => recipe !== null);
}

export function toggleSavedRecipe(
  userId: string,
  recipeId: string,
): { saved: boolean } | null {
  const numericId = Number(recipeId);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;
  if (!getRecipeDetailById(numericId)) return null;

  const current = savedRecipes.get(userId) ?? new Set<number>();
  const next = new Set(current);

  if (next.has(numericId)) {
    next.delete(numericId);
    savedRecipes.set(userId, next);
    return { saved: false };
  }

  next.add(numericId);
  savedRecipes.set(userId, next);
  return { saved: true };
}

export function recipeMatchesMealTypes(recipeId: number, mealTypeIds: number[]): boolean {
  if (mealTypeIds.length === 0) return true;
  const recipeMealTypes = RECIPE_MEAL_TYPE_MAP[recipeId] ?? [];
  return mealTypeIds.some((id) => recipeMealTypes.includes(id));
}
