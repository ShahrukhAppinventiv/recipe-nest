import { Suspense } from "react";
import { loadFilterOptions } from "./lib/recipe.service";
import { RecipeListSkeleton } from "./components/RecipePageSkeleton";
import { RecipePageContent } from "./components/RecipePageContent";
import { RecipeResults } from "./components/RecipeResults";
import { parseRecipeParams } from "./lib/recipe.params";

type RecipePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecipePage({ searchParams }: RecipePageProps) {
  const raw = await searchParams;
  const [{ cuisines, mealTypes }, initialFilters] = await Promise.all([
    loadFilterOptions(),
    Promise.resolve(parseRecipeParams(raw)),
  ]);

  return (
    <RecipePageContent
      initialFilters={initialFilters}
      cuisines={cuisines}
      mealTypes={mealTypes}
    >
      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeResults searchParams={raw} />
      </Suspense>
    </RecipePageContent>
  );
}
