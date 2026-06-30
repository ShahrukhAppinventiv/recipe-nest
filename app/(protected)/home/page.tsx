import type { Metadata } from "next";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import { HomeHero } from "./components/HomeHero";
import { HomeRecipesSection } from "./components/HomeRecipesSection";
import { HomeRecipesSkeleton } from "./components/HomePageSkeleton";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your personalised recipe feed — featured picks, latest recipes, and a recipe of the day.",
};

type SessionPromise = ReturnType<typeof getAuthSession>;

async function HeroSection({ sessionPromise }: { sessionPromise: SessionPromise }) {
  const session = await sessionPromise;
  return <HomeHero userName={session?.user?.name} />;
}

export default function HomePage() {
  const sessionPromise = getAuthSession();

  return (
    <div className="flex flex-col gap-16">
      <Suspense fallback={<HomeHero userName={null} />}>
        <HeroSection sessionPromise={sessionPromise} />
      </Suspense>

      <Suspense fallback={<HomeRecipesSkeleton />}>
        <HomeRecipesSection sessionPromise={sessionPromise} />
      </Suspense>
    </div>
  );
}
