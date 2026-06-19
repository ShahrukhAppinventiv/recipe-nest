import { type ReactNode } from "react";
import { RecipeFilters } from "./RecipeFilters";
import { RecipeToolbar } from "./RecipeToolbar";
import {
  RecipeNavigationProvider,
  RecipeResultsPendingWrapper,
} from "./RecipeNavigationProvider";
import type { RecipeSearchParams } from "@/lib/recipe/recipe.params";
import type { FilterOption } from "@/lib/recipe/recipe.types";

type RecipesLayoutProps = {
  params: RecipeSearchParams;
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
  children: ReactNode;
};

export function RecipesLayout({
  params,
  cuisines,
  mealTypes,
  children,
}: RecipesLayoutProps) {
  return (
    <RecipeNavigationProvider params={params}>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <RecipeFilters cuisines={cuisines} mealTypes={mealTypes} />
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3 lg:hidden">
            <p className="text-sm text-muted-foreground">
              Filters appear in a left panel on larger screens. Mobile filter
              sheet coming in a later step.
            </p>
          </div>

          <RecipeToolbar />

          <RecipeResultsPendingWrapper>{children}</RecipeResultsPendingWrapper>
        </div>
      </div>
    </RecipeNavigationProvider>
  );
}
