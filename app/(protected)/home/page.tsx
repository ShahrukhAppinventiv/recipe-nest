import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your personalised recipe feed — featured picks, latest recipes, and a recipe of the day.",
};
import { getAuthSession } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes/saved-recipe.service";
import { FeaturedRecipes } from "./components/FeaturedRecipes";
import { HomeHero } from "./components/HomeHero";
import { LatestRecipes } from "./components/LatestRecipes";
import { RecipeOfTheDay } from "./components/RecipeOfTheDay";
import { RecipeSectionSkeleton } from "./components/HomePageSkeleton";

// ---------------------------------------------------------------------------
// Validate that this route produces an instant static shell on every possible
// navigation entry point (page load + client-side navigations from sibling
// routes). Next.js surfaces violations as dev-overlay errors.
// ---------------------------------------------------------------------------
export const unstable_instant = { prefetch: "static" };

// ---------------------------------------------------------------------------
// Streaming wrapper components — awaited inside <Suspense> so the static
// skeleton fallbacks show immediately and data streams in as it resolves.
// ---------------------------------------------------------------------------

type SessionPromise = ReturnType<typeof getAuthSession>;
type SavedIdsPromise = Promise<Set<string>>;

async function HeroSection({ sessionPromise }: { sessionPromise: SessionPromise }) {
  const session = await sessionPromise;
  return <HomeHero userName={session?.user?.name} />;
}

async function FeaturedSection({ savedIdsPromise }: { savedIdsPromise: SavedIdsPromise }) {
  const savedIds = await savedIdsPromise;
  return <FeaturedRecipes savedRecipeIds={savedIds} />;
}

async function LatestSection({ savedIdsPromise }: { savedIdsPromise: SavedIdsPromise }) {
  const savedIds = await savedIdsPromise;
  return <LatestRecipes savedRecipeIds={savedIds} />;
}

// ---------------------------------------------------------------------------
// Page — non-async so the static shell renders without any await.
// Promises are started immediately so all data fetches run in parallel.
// ---------------------------------------------------------------------------
export default function HomePage() {
  // Start both fetches immediately — don't await here.
  const sessionPromise = getAuthSession();

  // Chain savedIds off session; both run concurrently with the recipe caches.
  const savedIdsPromise: SavedIdsPromise = sessionPromise.then((session) =>
    session?.user?.id
      ? getSavedRecipeIds(session.user.id)
      : Promise.resolve(new Set<string>()),
  );

  return (
    <div className="flex flex-col gap-16">
      {/* Hero: static shell shows immediately without the username,
          then the greeting streams in once session resolves. */}
      <Suspense fallback={<HomeHero userName={null} />}>
        <HeroSection sessionPromise={sessionPromise} />
      </Suspense>

      {/* Recipe sections: data comes from `use cache` (fast), save state
          streams in concurrently with the session / saved-ids fetch. */}
      <Suspense fallback={<RecipeSectionSkeleton cards={4} />}>
        <FeaturedSection savedIdsPromise={savedIdsPromise} />
      </Suspense>

      <Suspense fallback={<RecipeSectionSkeleton cards={4} />}>
        <LatestSection savedIdsPromise={savedIdsPromise} />
      </Suspense>

      {/* Recipe of the day: already cached, streams instantly. */}
      <Suspense fallback={null}>
        <RecipeOfTheDay />
      </Suspense>
    </div>
  );
}
