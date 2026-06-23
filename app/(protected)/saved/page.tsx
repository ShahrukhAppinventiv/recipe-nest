import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Saved Recipes",
  description: "All the recipes you have bookmarked, ready to cook whenever you are.",
  robots: { index: false, follow: false },
};
import { Bookmark } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getSavedRecipesWithData } from "@/lib/saved-recipes/saved-recipe.service";
import { RecipeCard } from "@/components/recipeCard/RecipeCard";
import { AUTH_ROUTES } from "@/lib/constants/constants";

export default async function SavedRecipesPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect(AUTH_ROUTES.SIGN_IN);
  }

  const recipes = await getSavedRecipesWithData(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bookmark className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
              Saved Recipes
            </h1>
            <p className="text-sm text-muted-foreground">
              {recipes.length === 0
                ? "You haven't saved any recipes yet"
                : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} saved`}
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {recipes.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card px-6 py-20 text-center shadow-soft">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/40" aria-hidden />
          <p className="mt-4 font-heading text-lg text-foreground">
            No saved recipes yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse recipes and tap the bookmark icon to save your favourites here.
          </p>
          <Link
            href="/recipe"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="rich"
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
