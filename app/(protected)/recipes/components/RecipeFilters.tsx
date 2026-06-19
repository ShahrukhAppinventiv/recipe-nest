"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { useRecipeNavigation } from "./RecipeNavigationProvider";
import {
  DIFFICULTY_FILTER_OPTIONS,
  EMPTY_RECIPE_FILTERS,
} from "@/lib/recipe/recipe.filters";
import type { FilterOption } from "@/lib/recipe/recipe.types";

const FILTER_PREVIEW_COUNT = 5;

type RecipeFiltersProps = {
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
};

export function RecipeFilters({
  cuisines,
  mealTypes,
}: RecipeFiltersProps) {
  const { params, navigate } = useRecipeNavigation();

  const hasActiveFilters =
    params.cuisineIds.length > 0 ||
    params.mealTypeIds.length > 0 ||
    params.difficulties.length > 0;

  function toggleId(
    group: "cuisineIds" | "mealTypeIds",
    id: number,
    checked: boolean,
  ) {
    const current = params[group];
    const next = checked
      ? [...current, id]
      : current.filter((item) => item !== id);

    navigate({ [group]: next, page: 1 });
  }

  function toggleDifficulty(value: string, checked: boolean) {
    const next = checked
      ? [...params.difficulties, value]
      : params.difficulties.filter((item) => item !== value);

    navigate({ difficulties: next, page: 1 });
  }

  return (
    <div className="sticky top-24 space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">Filters</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Refine recipes by cuisine, meal type, and difficulty
          </p>
        </div>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-primary"
            onClick={() => navigate({ ...EMPTY_RECIPE_FILTERS, page: 1 })}
          >
            Clear All
          </Button>
        ) : null}
      </div>

      <Separator />

      <FilterOptionGroup
        title="Cuisine"
        options={cuisines}
        selectedIds={params.cuisineIds}
        onCheckedChange={(id, checked) => toggleId("cuisineIds", id, checked)}
        onClear={() => navigate({ cuisineIds: [], page: 1 })}
      />

      <Separator />

      <FilterOptionGroup
        title="Meal Type"
        options={mealTypes}
        selectedIds={params.mealTypeIds}
        onCheckedChange={(id, checked) => toggleId("mealTypeIds", id, checked)}
        onClear={() => navigate({ mealTypeIds: [], page: 1 })}
      />

      <Separator />

      <FilterStringGroup
        title="Difficulty"
        options={DIFFICULTY_FILTER_OPTIONS}
        selected={params.difficulties}
        onCheckedChange={toggleDifficulty}
        onClear={() => navigate({ difficulties: [], page: 1 })}
      />
    </div>
  );
}

function FilterOptionGroup({
  title,
  options,
  selectedIds,
  onCheckedChange,
  onClear,
}: {
  title: string;
  options: FilterOption[];
  selectedIds: number[];
  onCheckedChange: (id: number, checked: boolean) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSelection = selectedIds.length > 0;
  const hasMore = options.length > FILTER_PREVIEW_COUNT;

  const visibleOptions = useMemo(() => {
    if (!hasMore || expanded) {
      return options;
    }

    return options.filter(
      (option, index) =>
        index < FILTER_PREVIEW_COUNT || selectedIds.includes(option.id),
    );
  }, [expanded, hasMore, options, selectedIds]);

  const hiddenCount = options.length - visibleOptions.length;

  return (
    <section aria-label={title} className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>

        {hasSelection ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-auto px-2 py-1 text-xs text-primary"
            onClick={onClear}
          >
            Clear
          </Button>
        ) : null}
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">No options available</p>
      ) : (
        <>
          <div className="space-y-2.5">
            {visibleOptions.map((option) => {
              const inputId = `${title.toLowerCase().replace(/\s+/g, "-")}-${option.id}`;
              const checked = selectedIds.includes(option.id);

              return (
                <div
                  key={option.id}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <Checkbox
                    id={inputId}
                    checked={checked}
                    onCheckedChange={(value) =>
                      onCheckedChange(option.id, value === true)
                    }
                  />
                  <Label
                    htmlFor={inputId}
                    className="cursor-pointer font-normal text-muted-foreground"
                  >
                    {option.name}
                  </Label>
                </div>
              );
            })}
          </div>

          {hasMore ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-auto px-0 py-1 text-xs text-primary"
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded
                ? "Show less"
                : `More (${hiddenCount > 0 ? hiddenCount : options.length - FILTER_PREVIEW_COUNT})`}
            </Button>
          ) : null}
        </>
      )}
    </section>
  );
}

function FilterStringGroup({
  title,
  options,
  selected,
  onCheckedChange,
  onClear,
}: {
  title: string;
  options: string[];
  selected: string[];
  onCheckedChange: (value: string, checked: boolean) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSelection = selected.length > 0;
  const hasMore = options.length > FILTER_PREVIEW_COUNT;

  const visibleOptions = useMemo(() => {
    if (!hasMore || expanded) {
      return options;
    }

    return options.filter(
      (option, index) =>
        index < FILTER_PREVIEW_COUNT || selected.includes(option),
    );
  }, [expanded, hasMore, options, selected]);

  const hiddenCount = options.length - visibleOptions.length;

  return (
    <section aria-label={title} className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>

        {hasSelection ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-auto px-2 py-1 text-xs text-primary"
            onClick={onClear}
          >
            Clear
          </Button>
        ) : null}
      </div>

      <div className="space-y-2.5">
        {visibleOptions.map((option) => {
          const inputId = `${title.toLowerCase().replace(/\s+/g, "-")}-${option.toLowerCase().replace(/\s+/g, "-")}`;
          const checked = selected.includes(option);

          return (
            <div
              key={option}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                id={inputId}
                checked={checked}
                onCheckedChange={(value) =>
                  onCheckedChange(option, value === true)
                }
              />
              <Label
                htmlFor={inputId}
                className="cursor-pointer font-normal text-muted-foreground"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>

      {hasMore ? (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-auto px-0 py-1 text-xs text-primary"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded
            ? "Show less"
            : `More (${hiddenCount > 0 ? hiddenCount : options.length - FILTER_PREVIEW_COUNT})`}
        </Button>
      ) : null}
    </section>
  );
}
