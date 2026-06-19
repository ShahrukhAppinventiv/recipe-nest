import { RecipeCard } from "@/components/recipeCard/RecipeCard";
import type { RecipeCardData } from "@/components/recipeCard/types";

type RecipeResultsProps = {
  recipes: RecipeCardData[];
  total: number;
  page: number;
  pageSize: number;
};

export function RecipeResults({
  recipes,
  total,
  page,
  pageSize,
}: RecipeResultsProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <section aria-label="Recipe results">
      <p className="mb-4 text-sm text-muted-foreground">
        {total === 0
          ? "No recipes found"
          : `Showing ${start}-${end} of ${total} ${total === 1 ? "recipe" : "recipes"}`}
      </p>

      {recipes.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center shadow-soft">
          <p className="font-heading text-lg text-foreground">
            No recipes match your filters
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting or clearing your filter selections
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="rich" />
          ))}
        </div>
      )}
    </section>
  );
}
