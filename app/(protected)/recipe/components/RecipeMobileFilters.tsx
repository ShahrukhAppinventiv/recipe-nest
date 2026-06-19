"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal } from "lucide-react";
import {
  RecipeFiltersPanel,
  type RecipeFiltersPanelProps,
} from "./RecipeFiltersPanel";

type RecipeMobileFiltersProps = RecipeFiltersPanelProps;

export function RecipeMobileFilters(props: RecipeMobileFiltersProps) {
  const activeCount =
    props.filters.cuisineIds.length +
    props.filters.mealTypeIds.length +
    props.filters.difficultyIds.length;

  return (
    <div className="lg:hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <SlidersHorizontal aria-hidden />
            Filters
            {activeCount > 0 ? ` (${activeCount})` : null}
          </Button>
        </DialogTrigger>

        <DialogContent
          showCloseButton
          className="fixed inset-x-0 bottom-0 top-auto flex max-h-[90dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-2xl rounded-b-none border-b-0 p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Filters</DialogTitle>

          <div className="overflow-y-auto p-5">
            <RecipeFiltersPanel {...props} />
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
