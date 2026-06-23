import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse and filter thousands of recipes by cuisine, meal type, and difficulty. Find your next favourite dish.",
};
import { loadFilterOptions } from "@/lib/recipe/recipe.service";
import { RecipeListSkeleton } from "./components/RecipePageSkeleton";
import { RecipePageContent } from "./components/RecipePageContent";
import { RecipeResults } from "./components/RecipeResults";
import { parseRecipeParams } from "@/lib/recipe/recipe.params";

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
