import { Skeleton } from "@/components/ui/skeleton";
import { RECIPE_PAGE_SIZE } from "@/lib/recipe/recipe.params";

function RecipeRichCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
      aria-hidden
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RecipeResultsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <Skeleton className="h-5 w-40" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: RECIPE_PAGE_SIZE }).map((_, index) => (
          <RecipeRichCardSkeleton key={index} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function RecipesPageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden>
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 sm:h-11" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <Skeleton className="h-[420px] w-full rounded-2xl" />
        </aside>

        <RecipeResultsSectionSkeleton />
      </div>
    </div>
  );
}
