import { Suspense } from "react";
import { RecipesLayout } from "./components/RecipesLayout";
import { RecipeResultsSection } from "./components/RecipeResultsSection";
import { RecipeResultsSectionSkeleton } from "./components/RecipesPageSkeleton";
import { parseRecipeSearchParams } from "@/lib/recipe/recipe.params";
import { loadFilterOptions } from "@/lib/recipe/recipe.service";

type RecipesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = parseRecipeSearchParams(await searchParams);
  const filterOptions = await loadFilterOptions();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
          Recipes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Browse and filter our full collection of curated recipes
        </p>
      </div>

      <RecipesLayout
        params={params}
        cuisines={filterOptions.cuisines}
        mealTypes={filterOptions.mealTypes}
      >
          <RecipeResultsSection params={params} />
      </RecipesLayout>
    </div>
  );
}
