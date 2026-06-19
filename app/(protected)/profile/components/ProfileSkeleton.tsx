import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function DetailRowSkeleton() {
  return (
    <div className="flex items-start gap-3" aria-hidden>
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div
      className="flex flex-col gap-8"
      aria-busy
      aria-label="Loading profile"
    >
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full" />

          <div className="space-y-3">
            <Skeleton className="h-5 w-28 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-9 w-64 sm:h-10" />
              <Skeleton className="h-4 w-48" />
            </div>

            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="space-y-2 p-4 pb-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="space-y-5 px-4 pb-4">
            <DetailRowSkeleton />
            <Separator />
            <DetailRowSkeleton />
            <Separator />
            <DetailRowSkeleton />
            <Separator />
            <DetailRowSkeleton />
            <Separator />
            <DetailRowSkeleton />
            <Separator />
            <DetailRowSkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="space-y-2 p-4 pb-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="flex flex-col gap-3 px-4 pb-4">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="space-y-2 p-4 pb-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-56" />
            </div>

            <div className="px-4 pb-4">
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
