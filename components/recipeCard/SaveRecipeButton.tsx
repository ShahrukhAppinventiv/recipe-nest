"use client";

import { useState, useTransition, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSaveRecipe } from "@/lib/saved-recipes/saved-recipe.actions";
import { toast } from "sonner";

type SaveRecipeButtonProps = {
  recipeId: string;
  initialIsSaved: boolean;
};

// ---------------------------------------------------------------------------
// Module-level store — shared across every SaveRecipeButton in the session.
//
// With cacheComponents: true, Next.js uses React <Activity> to keep recently
// visited pages hidden instead of unmounting them. This means useState never
// re-initialises when you navigate back — it stays at whatever value it had
// when the page was hidden. To fix that, we record every save/unsave here and
// read it back when Activity shows the component again (effects run on every
// hide-to-visible transition even with [] deps).
// ---------------------------------------------------------------------------
const savedStateStore = new Map<string, boolean>();

export function SaveRecipeButton({
  recipeId,
  initialIsSaved,
}: SaveRecipeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  // Runs on first mount AND on every Activity hide→visible cycle.
  // Picks up any save/unsave that happened on a different page while this
  // page was hidden, so the icon always reflects the actual server state.
  useEffect(() => {
    const override = savedStateStore.get(recipeId);
    if (override !== undefined) {
      setIsSaved(override);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const optimisticNext = !isSaved;
    setIsSaved(optimisticNext);

    startTransition(async () => {
      const result = await toggleSaveRecipe(recipeId);

      if (!result.success) {
        setIsSaved(!optimisticNext);
        toast.error(result.message ?? "Could not update saved recipe");
        return;
      }

      // Persist the confirmed server state so other Activity-preserved pages
      // pick it up when they next become visible.
      savedStateStore.set(recipeId, result.saved);
      toast.success(result.saved ? "Recipe saved!" : "Removed from saved");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
      title={isSaved ? "Remove from saved" : "Save recipe"}
      className={cn(
        // Shrink-0 keeps the button from being squished by the long title
        "shrink-0 cursor-pointer",
        "flex h-8 w-8 items-center justify-center rounded-full",
        "border transition-all duration-200",
        "hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        isSaved
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isSaved ? "fill-primary-foreground stroke-primary-foreground" : "fill-transparent",
        )}
        aria-hidden
      />
    </button>
  );
}
