import { Suspense } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { getAuthSession } from "@/lib/auth";
import { getSavedRecipesCount } from "@/lib/saved-recipes/saved-recipe.service";
import { AUTH_ROUTES } from "@/lib/constants/constants";

// ---------------------------------------------------------------------------
// Server component — fetches saved count and renders the badge link.
// Wrapped in <Suspense> below so it never blocks the rest of the layout.
// ---------------------------------------------------------------------------
async function SavedBadge() {
  const session = await getAuthSession();
  const count = session?.user?.id
    ? await getSavedRecipesCount(session.user.id)
    : 0;

  return (
    <Link
      href={AUTH_ROUTES.SAVED}
      aria-label={`Saved recipes${count > 0 ? `, ${count} saved` : ""}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
    >
      <Bookmark className="h-5 w-5" aria-hidden />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

// Fallback shown while SavedBadge is loading — same size, no count.
function SavedBadgeSkeleton() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground">
      <Bookmark className="h-5 w-5" aria-hidden />
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        savedBadge={
          <Suspense fallback={<SavedBadgeSkeleton />}>
            <SavedBadge />
          </Suspense>
        }
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
