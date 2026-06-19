import { Skeleton } from "@/components/ui/skeleton";

function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

function RecipeSectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <section aria-hidden>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div
      className="flex flex-col gap-16"
      aria-busy="true"
      aria-label="Loading home page"
    >
      {/* Hero */}
      <section
        aria-hidden
        className="relative -mx-4 overflow-hidden rounded-3xl border border-border/60 bg-white shadow-premium sm:-mx-6"
      >
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:p-10">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-7 w-56 rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-full max-w-lg" />
              <Skeleton className="h-12 w-full max-w-md" />
              <Skeleton className="h-20 w-full max-w-xl" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>

          <Skeleton className="aspect-[4/5] w-full rounded-2xl sm:aspect-[5/6]" />
        </div>
      </section>

      <RecipeSectionSkeleton />
      <RecipeSectionSkeleton />

      {/* Recipe of the day */}
      <section aria-hidden>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-52 sm:h-9" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            <Skeleton className="aspect-[4/3] min-h-[16rem] rounded-none lg:aspect-auto lg:min-h-[22rem]" />
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-10 w-full max-w-sm" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
