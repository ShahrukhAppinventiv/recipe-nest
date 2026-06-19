"use client";

import type { RecipeCardData } from "@/components/recipeCard/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FilterOption } from "@/lib/recipe/recipe.types";
import {
  EMPTY_RECIPE_FILTERS,
  type FilterGroup,
  type RecipeFiltersState,
} from "../lib/filter-options";
import {
  parseRecipeParams,
  type RecipeSort,
  recipeFiltersToQueryString,
} from "../lib/recipe.params";
import { RecipeFilters } from "./RecipeFilters";
import { RecipeHero } from "./RecipeHero";
import { RecipeList } from "./RecipeList";
import { RecipeMobileFilters } from "./RecipeMobileFilters";
import { RecipePagination } from "./RecipePagination";
import { RecipeSearch } from "./RecipeSearch";

type RecipePageContentProps = {
  initialFilters: RecipeFiltersState;
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
  recipes: RecipeCardData[];
  total: number;
  page: number;
  pageSize: number;
  sort: RecipeSort;
};

export function RecipePageContent({
  initialFilters,
  cuisines,
  mealTypes,
  recipes,
  total,
  page,
  pageSize,
  sort,
}: RecipePageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const filtersRef = useRef(filters);
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

    router.replace(href, { scroll: false });
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
    <div className="flex flex-col gap-8">
      <RecipeHero />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <RecipeFilters {...filterProps} />

        <div className="flex min-w-0 flex-col gap-4">
          <RecipeSearch value={filters.search} onChange={setSearch} />
          <RecipeMobileFilters {...filterProps} />
          <RecipeList
            recipes={recipes}
            total={total}
            page={page}
            pageSize={pageSize}
          />
          <RecipePagination
            page={page}
            pageSize={pageSize}
            total={total}
            filters={filters}
            sort={sort}
          />
        </div>
      </div>
    </div>
  );
}
