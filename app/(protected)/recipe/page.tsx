import { Suspense } from "react";
import { getRecipes, loadFilterOptions } from "@/lib/recipe/recipe.service";
import { RecipePageContent } from "./components/RecipePageContent";
import { parseFetchParams, parseRecipeParams } from "./lib/recipe.params";

type RecipePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecipePage({ searchParams }: RecipePageProps) {
  const raw = await searchParams;
  const fetchParams = parseFetchParams(raw);
  const initialFilters = parseRecipeParams(raw);

  const [{ cuisines, mealTypes }, recipesResult] = await Promise.all([
    loadFilterOptions(),
    getRecipes(fetchParams),
  ]);

  return (
    <Suspense>
      <RecipePageContent
        initialFilters={initialFilters}
        cuisines={cuisines}
        mealTypes={mealTypes}
        recipes={recipesResult.recipes}
        total={recipesResult.total}
        page={fetchParams.page}
        pageSize={fetchParams.pageSize}
        sort={fetchParams.sort}
      />
    </Suspense>
  );
}
