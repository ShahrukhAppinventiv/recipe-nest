import { Suspense } from "react";
import type { getAuthSession } from "@/lib/auth";
import { loadFilterOptions } from "@/lib/recipe/recipe.service";
import { parseRecipeParams } from "@/lib/recipe/recipe.params";
import {
  RecipeFiltersLayoutSkeleton,
  RecipeListSkeleton,
} from "./RecipePageSkeleton";
import { RecipePageContent } from "./RecipePageContent";
import { RecipeResults } from "./RecipeResults";

type SessionPromise = ReturnType<typeof getAuthSession>;

type RecipeBrowseLayoutProps = {
  sessionPromise: SessionPromise;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function RecipeBrowseLayout({
  sessionPromise,
  searchParams,
}: RecipeBrowseLayoutProps) {
  const [session, raw] = await Promise.all([sessionPromise, searchParams]);
  console.log("searchParmas", raw);
  const token = session?.accessToken ?? "";
  const initialFilters = parseRecipeParams(raw);

  const { cuisines, mealTypes } = token
    ? await loadFilterOptions(token)
    : { cuisines: [], mealTypes: [] };

  return (
    <RecipePageContent
      initialFilters={initialFilters}
      cuisines={cuisines}
      mealTypes={mealTypes}
    >
      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeResults searchParams={raw} token={token} />
      </Suspense>
    </RecipePageContent>
  );
}

export function RecipeBrowseLayoutFallback() {
  return <RecipeFiltersLayoutSkeleton />;
}
