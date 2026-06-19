import type { RecipeCardData, RecipeSpotlightData } from "@/components/recipeCard/types";
import {
  toRecipeCardData,
  toRecipeDetailData,
  toRecipeSpotlightData,
} from "@/lib/recipe/recipe.mapper";
import type {
  RecipeSearchParams,
  RecipesResult,
} from "@/lib/recipe/recipe.params";
import type {
  DbRecipeDetailWithRelations,
  DbRecipeWithRelations,
  FilterOption,
  RecipeDetailData,
} from "@/lib/recipe/recipe.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const FILTER_OPTIONS_REVALIDATE_SECONDS = 3600;

const RECIPE_LIST_SELECT = `
  id,
  title,
  description,
  image,
  difficulty,
  cook_time,
  rating_avg,
  status,
  created_at,
  cuisines ( name ),
  meal_types ( name ),
  recipe_tags ( tags ( name ) )
`;

const RECIPE_DETAIL_SELECT = `
  id,
  created_at,
  title,
  description,
  ingredients,
  instructions,
  image,
  difficulty,
  cook_time,
  servings,
  calories,
  rating_avg,
  review_count,
  view_count,
  status,
  created_by,
  cuisines ( name ),
  meal_types ( name ),
  recipe_tags ( tags ( name ) ),
  users ( name )
`;

export async function getFeaturedRecipes(): Promise<RecipeCardData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .eq("status", "published")
    .order("rating_avg", { ascending: false })
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as DbRecipeWithRelations[]).map(
    toRecipeCardData,
  );
}

async function fetchCuisinesFromDb(): Promise<FilterOption[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("cuisines")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
  }));
}

export const getCuisines = unstable_cache(
  fetchCuisinesFromDb,
  ["recipe-cuisines"],
  {
    revalidate: FILTER_OPTIONS_REVALIDATE_SECONDS,
    tags: ["cuisines"],
  },
);

async function fetchMealTypesFromDb(): Promise<FilterOption[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("meal_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .filter((row) => row.name)
    .map((row) => ({
      id: row.id,
      name: row.name as string,
    }));
}

export const getMealTypes = unstable_cache(
  fetchMealTypesFromDb,
  ["recipe-meal-types"],
  {
    revalidate: FILTER_OPTIONS_REVALIDATE_SECONDS,
    tags: ["meal-types"],
  },
);

export async function getLatestRecipes(): Promise<RecipeCardData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as DbRecipeWithRelations[]).map(
    toRecipeCardData,
  );
}

async function getRandomPublishedRecipeId(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<number | null> {
  const { data: recipeId, error } = await supabase.rpc(
    "get_random_published_recipe_id",
  );

  if (!error && recipeId) {
    return recipeId;
  }

  const { data: ids, error: idsError } = await supabase
    .from("recipes")
    .select("id")
    .eq("status", "published");

  if (idsError || !ids?.length) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex].id;
}

export async function getRecipes(
  params: RecipeSearchParams,
): Promise<RecipesResult> {
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;
  const supabase = createAdminClient();

  let query = supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT, { count: "exact" })
    .eq("status", "published");

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  if (params.cuisineIds.length > 0) {
    query = query.in("cuisine_id", params.cuisineIds);
  }

  if (params.mealTypeIds.length > 0) {
    query = query.in("meal_type_id", params.mealTypeIds);
  }

  if (params.difficulties.length > 0) {
    query = query.in("difficulty", params.difficulties);
  }

  if (params.sort === "rating") {
    query = query.order("rating_avg", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    recipes: ((data ?? []) as unknown as DbRecipeWithRelations[]).map(
      toRecipeCardData,
    ),
    total: count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export const loadFilterOptions = cache(async (): Promise<{
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
}> => {
  const [cuisines, mealTypes] = await Promise.all([
    getCuisines(),
    getMealTypes(),
  ]);

  return { cuisines, mealTypes };
});

export async function getRecipeById(
  id: string,
): Promise<RecipeDetailData | null> {
  const recipeId = Number(id);

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    return null;
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_DETAIL_SELECT)
    .eq("id", recipeId)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return toRecipeDetailData(data as unknown as DbRecipeDetailWithRelations);
}

export async function getRecipeOfTheDay(): Promise<RecipeSpotlightData | null> {
  const supabase = createAdminClient();
  const recipeId = await getRandomPublishedRecipeId(supabase);

  if (!recipeId) {
    return null;
  }

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .eq("id", recipeId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toRecipeSpotlightData(data as unknown as DbRecipeWithRelations);
}


