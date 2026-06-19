import { RecipePagination } from "./RecipePagination";
import { RecipeResults } from "./RecipeResults";
import type { RecipeSearchParams } from "@/lib/recipe/recipe.params";
import { getRecipes } from "@/lib/recipe/recipe.service";

type RecipeResultsSectionProps = {
  params: RecipeSearchParams;
};

export async function RecipeResultsSection({
  params,
}: RecipeResultsSectionProps) {
  const recipesResult = await getRecipes(params);

  return (
    <>
      <RecipeResults
        recipes={recipesResult.recipes}
        total={recipesResult.total}
        page={params.page}
        pageSize={params.pageSize}
      />
      <RecipePagination total={recipesResult.total} />
    </>
  );
}
