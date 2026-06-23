import type { RecipeCardData, RecipeSpotlightData } from "@/components/recipeCard/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import {
  toRecipeCardData,
  toRecipeDetailData,
  toRecipeSpotlightData,
} from "./recipe.mapper";
import type {
  DbRecipeDetailWithRelations,
  DbRecipeWithRelations,
  FilterOption,
  RecipeDetailData,
  RecipeSearchParams,
  RecipesResult,
} from "./recipe.types";

const RECIPE_LIST_SELECT = `
  id,
  title,
  description,
  image,
  difficulty,
  cook_time_minutes,
  prep_time_minutes,
  rating_avg,
  status,
  created_at,
  tags,
  cuisines ( name ),
  recipe_meal_types ( meal_types ( name ) )
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
  cook_time_minutes,
  prep_time_minutes,
  servings,
  calories_per_serving,
  rating_avg,
  review_count,
  status,
  created_by,
  tags,
  cuisines ( name ),
  recipe_meal_types ( meal_types ( name ) ),
  users ( name )
`;

// ---------------------------------------------------------------------------
// Home-page data — cached with `use cache`
// ---------------------------------------------------------------------------

export async function getFeaturedRecipes(): Promise<RecipeCardData[]> {
  "use cache";
  cacheLife({
    stale:      1 * 60 * 60,  // 1 hour  — client uses cached data for 1 hr
    revalidate: 1 * 60 * 60,  // 1 hour  — server refreshes every 1 hr
    expire:    24 * 60 * 60,  // 1 day   — deleted after 24 hrs if no traffic
  });
  cacheTag("featured-recipes");

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

export async function getLatestRecipes(): Promise<RecipeCardData[]> {
  "use cache";
  cacheLife({
    stale:      1 * 60 * 60,       // 1 hour  — client uses cached data for 1 hr
    revalidate: 1 * 60 * 60,       // 1 hour  — server refreshes every 1 hr
    expire:    24 * 60 * 60,       // 1 day    — deleted after 24 hrs if no traffic
  });
  cacheTag("latest-recipes");

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

export async function getRecipeOfTheDay(): Promise<RecipeSpotlightData | null> {
  "use cache";
  cacheLife({
    stale:      1 * 24 * 60 * 60,  // 1 day   — client uses cached data for 1 day
    revalidate: 1 * 24 * 60 * 60,  // 1 day   — server refreshes every 1 day
    expire:     7 * 24 * 60 * 60,  // 7 days  — deleted after 7 days if no traffic
  });
  cacheTag("recipe-of-the-day");

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

// ---------------------------------------------------------------------------
// Filter options — cached with `use cache`
// ---------------------------------------------------------------------------

export async function getCuisines(): Promise<FilterOption[]> {
  "use cache";
  cacheLife({
    stale:      1 * 60 * 60,  // 1 hour  — client uses cached data for 1 hr
    revalidate: 1 * 60 * 60,  // 1 hour  — server refreshes every 1 hr
    expire:    24 * 60 * 60,  // 1 day   — deleted after 24 hrs if no traffic
  });
  cacheTag("cuisines");

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

export async function getMealTypes(): Promise<FilterOption[]> {
  "use cache";
  cacheLife({
    stale:      1 * 60 * 60,  // 1 hour  — client uses cached data for 1 hr
    revalidate: 1 * 60 * 60,  // 1 hour  — server refreshes every 1 hr
    expire:    24 * 60 * 60,  // 1 day   — deleted after 24 hrs if no traffic
  });
  cacheTag("meal-types");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("meal_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name ?? "",
  }));
}

// `cache()` deduplicates calls within the same request (a single page render
// may invoke loadFilterOptions from both layout and page).
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

// ---------------------------------------------------------------------------
// Dynamic queries — NOT cached (user-supplied search params)
// ---------------------------------------------------------------------------

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
  const supabase = createAdminClient();

  // Resolve meal type filter via junction table (separate query)
  let mealTypeRecipeIds: number[] | null = null;
  if (params.mealTypeIds.length > 0) {
    const { data: rows } = await supabase
      .from("recipe_meal_types")
      .select("recipe_id")
      .in("meal_type_id", params.mealTypeIds);

    mealTypeRecipeIds = (rows ?? []).map((r) => r.recipe_id);

    if (mealTypeRecipeIds.length === 0) {
      return { recipes: [], total: 0, page: params.page, pageSize: params.pageSize };
    }
  }

  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

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

  if (mealTypeRecipeIds !== null) {
    query = query.in("id", mealTypeRecipeIds);
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
