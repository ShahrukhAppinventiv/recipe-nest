import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RecipeCardData } from "@/components/recipeCard/types";
import { RecipeCard } from "@/components/recipeCard/RecipeCard";

type FeaturedRecipesProps = {
  recipes: RecipeCardData[];
};

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-recipes-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="featured-recipes-heading"
            className="font-heading text-2xl text-foreground sm:text-3xl"
          >
            Featured Recipes
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hand-picked favorites from our kitchen
          </p>
        </div>

        <Link
          href="/recipe?sort=rating"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            variant="compact"
            isSaved={recipe.isSaved}
          />
        ))}
      </div>
    </section>
  );
}
