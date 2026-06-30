import type { Metadata } from "next";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import {
  RecipeBrowseLayout,
  RecipeBrowseLayoutFallback,
} from "./components/RecipeBrowseLayout";
import { RecipeHero } from "./components/RecipeHero";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse and filter thousands of recipes by cuisine, meal type, and difficulty. Find your next favourite dish.",
};

type RecipePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function RecipePage({ searchParams }: RecipePageProps) {
  const sessionPromise = getAuthSession();

  return (
    <div className="flex flex-col gap-8">
      <RecipeHero />

      <Suspense fallback={<RecipeBrowseLayoutFallback />}>
        <RecipeBrowseLayout
          sessionPromise={sessionPromise}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
