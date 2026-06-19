"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FilterOption } from "../lib/recipe.types";
import { useMemo, useState } from "react";
import {
  STATIC_DIFFICULTY_OPTIONS,
  type FilterGroup,
  type RecipeFiltersState,
} from "../lib/filter-options";

const FILTER_PREVIEW_COUNT = 5;

export type RecipeFiltersPanelProps = {
  cuisines: FilterOption[];
  mealTypes: FilterOption[];
  filters: RecipeFiltersState;
  onToggle: (
    group: FilterGroup,
    id: number | string,
    checked: boolean,
  ) => void;
  onClearGroup: (group: FilterGroup) => void;
  onClearAll: () => void;
  className?: string;
};

export function RecipeFiltersPanel({
  cuisines,
  mealTypes,
  filters,
  onToggle,
  onClearGroup,
  onClearAll,
  className,
}: RecipeFiltersPanelProps) {
  const hasActiveFilters =
    filters.cuisineIds.length > 0 ||
    filters.mealTypeIds.length > 0 ||
    filters.difficultyIds.length > 0;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg text-foreground">Filters</h2>
        </div>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-primary"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <Separator />

      <FilterOptionGroup
        title="Cuisine"
        options={cuisines}
        selectedIds={filters.cuisineIds}
        onToggle={(id, checked) => onToggle("cuisineIds", id, checked)}
        onClear={() => onClearGroup("cuisineIds")}
      />

      <Separator />

      <FilterOptionGroup
        title="Meal type"
        options={mealTypes}
        selectedIds={filters.mealTypeIds}
        onToggle={(id, checked) => onToggle("mealTypeIds", id, checked)}
        onClear={() => onClearGroup("mealTypeIds")}
      />

      <Separator />

      <FilterOptionGroup
        title="Difficulty"
        options={STATIC_DIFFICULTY_OPTIONS}
        selectedIds={filters.difficultyIds}
        onToggle={(id, checked) => onToggle("difficultyIds", id, checked)}
        onClear={() => onClearGroup("difficultyIds")}
      />
    </div>
  );
}

function FilterOptionGroup({
  title,
  options,
  selectedIds,
  onToggle,
  onClear,
}: {
  title: string;
  options: { id: number | string; name: string }[];
  selectedIds: (number | string)[];
  onToggle: (id: number | string, checked: boolean) => void;
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

      <div className="space-y-2.5">
        {visibleOptions.map((option) => {
          const inputId = `${title.toLowerCase().replace(/\s+/g, "-")}-${String(option.id).toLowerCase().replace(/\s+/g, "-")}`;
          const checked = selectedIds.includes(option.id);

          return (
            <div
              key={String(option.id)}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                id={inputId}
                checked={checked}
                onCheckedChange={(value) =>
                  onToggle(option.id, value === true)
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

      {hasMore && (expanded || hiddenCount > 0) ? (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-auto px-0 py-1 text-xs text-primary"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : `More (${hiddenCount})`}
        </Button>
      ) : null}
    </section>
  );
}
