import { getRecipes } from "@/lib/recipe/recipe.service";
import { parseFetchParams, parseRecipeParams } from "@/lib/recipe/recipe.params";
import { RecipeList } from "./RecipeList";
import { RecipePagination } from "./RecipePagination";

type RecipeResultsProps = {
  searchParams: Record<string, string | string[] | undefined>;
  token: string;
};

export async function RecipeResults({ searchParams, token }: RecipeResultsProps) {
  const fetchParams = parseFetchParams(searchParams);
  const filters = parseRecipeParams(searchParams);

  const result = token
    ? await getRecipes(fetchParams, token)
    : { recipes: [], total: 0, page: fetchParams.page, pageSize: fetchParams.pageSize };

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
