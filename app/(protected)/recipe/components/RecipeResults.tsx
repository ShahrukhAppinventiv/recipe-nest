import { getAuthSession } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes/saved-recipe.service";
import { getRecipes } from "@/lib/recipe/recipe.service";
import { parseFetchParams, parseRecipeParams } from "@/lib/recipe/recipe.params";
import { RecipeList } from "./RecipeList";
import { RecipePagination } from "./RecipePagination";

type RecipeResultsProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export async function RecipeResults({ searchParams }: RecipeResultsProps) {
  const fetchParams = parseFetchParams(searchParams);
  const filters = parseRecipeParams(searchParams);

  // Fetch recipes + session in parallel — saved IDs depend on session
  const [result, session] = await Promise.all([
    getRecipes(fetchParams),
    getAuthSession(),
  ]);

  const savedRecipeIds = session?.user?.id
    ? await getSavedRecipeIds(session.user.id)
    : new Set<string>();

  return (
    <>
      <RecipeList
        recipes={result.recipes}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        savedRecipeIds={savedRecipeIds}
      />
      <RecipePagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        filters={filters}
        sort={fetchParams.sort}
      />
    </>
  );
}
