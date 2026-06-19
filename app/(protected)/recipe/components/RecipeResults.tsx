import { getRecipes } from "../lib/recipe.service";
import { parseFetchParams, parseRecipeParams } from "../lib/recipe.params";
import { RecipeList } from "./RecipeList";
import { RecipePagination } from "./RecipePagination";

type RecipeResultsProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export async function RecipeResults({ searchParams }: RecipeResultsProps) {
  const fetchParams = parseFetchParams(searchParams);
  const filters = parseRecipeParams(searchParams);
  const result = await getRecipes(fetchParams);

  return (
    <>
      <RecipeList
        recipes={result.recipes}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
      />
      <RecipePagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        filters={filters}
        sort={fetchParams.sort}
      />
    </>
  );
}
