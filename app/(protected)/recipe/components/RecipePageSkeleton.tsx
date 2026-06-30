import { Skeleton } from "@/components/ui/skeleton";

const RECIPE_LIST_SKELETON_COUNT = 6;

export function RecipeListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy aria-label="Loading recipes">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: RECIPE_LIST_SKELETON_COUNT }).map((_, index) => (
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

/** Filters sidebar + search — used while filter options load (hero shown separately). */
export function RecipeFiltersLayoutSkeleton() {
  return (
    <div
      className="grid gap-8 lg:grid-cols-[260px_1fr]"
      aria-busy
      aria-label="Loading recipe filters"
    >
      <aside className="hidden lg:block" aria-hidden>
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <Skeleton className="h-[74px] w-full rounded-2xl" aria-hidden />
        <Skeleton className="h-10 w-full rounded-lg lg:hidden" aria-hidden />
        <RecipeListSkeleton />
      </div>
    </div>
  );
}
