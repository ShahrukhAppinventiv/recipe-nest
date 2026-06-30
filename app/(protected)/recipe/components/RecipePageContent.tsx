"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/lib/recipe/recipe.types";
import {
  EMPTY_RECIPE_FILTERS,
  type FilterGroup,
  type RecipeFiltersState,
} from "@/lib/recipe/filter-options";
import {
  parseRecipeParams,
  type RecipeSort,
  recipeFiltersToQueryString,
} from "@/lib/recipe/recipe.params";
import { RecipeFilters } from "./RecipeFilters";
import { RecipeMobileFilters } from "./RecipeMobileFilters";
import { RecipeSearch } from "./RecipeSearch";

type RecipePageContentProps = {
  initialFilters: RecipeFiltersState;
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
  children: React.ReactNode;
};

export function RecipePageContent({
  initialFilters,
  cuisines,
  mealTypes,
  children,
}: RecipePageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();
  const filtersRef = useRef(filters);

  const sort: RecipeSort =
    searchParams.get("sort") === "rating" ? "rating" : "latest";
  const sortRef = useRef(sort);

  filtersRef.current = filters;
  sortRef.current = sort;

  useEffect(() => {
    const parsed = parseRecipeParams(
      Object.fromEntries(searchParams.entries()),
    );
    setFilters(parsed);
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      syncUrl(filtersRef.current);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search, pathname, router]);

  function syncUrl(next: RecipeFiltersState, nextPage = 1) {
    const query = recipeFiltersToQueryString(
      next,
      nextPage,
      sortRef.current,
    );
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function commitFilters(next: RecipeFiltersState) {
    setFilters(next);
    syncUrl(next);
  }

  function toggleFilterId(
    group: FilterGroup,
    id: number | string,
    checked: boolean,
  ) {
    const selected = filters[group] as (number | string)[];
    const nextIds = checked
      ? [...selected, id]
      : selected.filter((item) => item !== id);

    commitFilters({ ...filters, [group]: nextIds });
  }

  function clearFilterGroup(group: FilterGroup) {
    commitFilters({ ...filters, [group]: [] });
  }

  function clearAllFilters() {
    commitFilters(EMPTY_RECIPE_FILTERS);
  }

  function setSearch(search: string) {
    setFilters((current) => ({ ...current, search }));
  }

  const filterProps = {
    cuisines,
    mealTypes,
    filters,
    onToggle: toggleFilterId,
    onClearGroup: clearFilterGroup,
    onClearAll: clearAllFilters,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <RecipeFilters {...filterProps} />

      <div className="flex min-w-0 flex-col gap-4">
        <RecipeSearch value={filters.search} onChange={setSearch} />
        <RecipeMobileFilters {...filterProps} />
        <div className={cn("relative transition-opacity duration-200", isPending && "opacity-60 pointer-events-none")}>
          {isPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 backdrop-blur-[1px] min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
