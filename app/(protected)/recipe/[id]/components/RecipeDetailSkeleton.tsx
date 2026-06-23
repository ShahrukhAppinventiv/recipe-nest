import { Skeleton } from "@/components/ui/skeleton";

function StatSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
      aria-hidden
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-2 h-4 w-16" />
    </div>
  );
}

function ListLineSkeleton({ width = "w-full" }: { width?: string }) {
  return (
    <div className="flex gap-3" aria-hidden>
      <Skeleton className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
      <Skeleton className={`h-4 ${width}`} />
    </div>
  );
}

function InstructionStepSkeleton({ width = "w-full" }: { width?: string }) {
  return (
    <div className="flex gap-4" aria-hidden>
      <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
      <Skeleton className={`h-4 ${width} mt-1.5`} />
    </div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy
      aria-label="Loading recipe details"
    >
      <Skeleton className="h-5 w-36" />

      <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
        <div className="grid lg:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full rounded-none lg:min-h-[22rem]" />

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <Skeleton className="h-9 w-full max-w-md sm:h-10" />
            <Skeleton className="h-9 w-full max-w-sm sm:h-10" />

            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Skeleton className="h-6 w-20 rounded-full" />

            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-8 border-t border-border/60 px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <StatSkeleton key={index} />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          <section className="space-y-3" aria-hidden>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </section>

          <section className="space-y-4" aria-hidden>
            <Skeleton className="h-6 w-28" />
            <div className="space-y-3">
              <ListLineSkeleton width="w-full" />
              <ListLineSkeleton width="w-11/12" />
              <ListLineSkeleton width="w-full" />
              <ListLineSkeleton width="w-10/12" />
              <ListLineSkeleton width="w-full" />
              <ListLineSkeleton width="w-9/12" />
            </div>
          </section>

          <section className="space-y-4" aria-hidden>
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              <InstructionStepSkeleton width="w-full" />
              <InstructionStepSkeleton width="w-11/12" />
              <InstructionStepSkeleton width="w-full" />
              <InstructionStepSkeleton width="w-10/12" />
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
