"use client";

import {
  RecipeFiltersPanel,
  type RecipeFiltersPanelProps,
} from "./RecipeFiltersPanel";

type RecipeFiltersProps = RecipeFiltersPanelProps;

export function RecipeFilters(props: RecipeFiltersProps) {
  return (
    <aside aria-label="Recipe filters" className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <RecipeFiltersPanel {...props} />
      </div>
    </aside>
  );
}
