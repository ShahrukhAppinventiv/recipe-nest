import { notFound } from "next/navigation";
import { RecipeDetailContent } from "../components/RecipeDetailContent";
import { getRecipeById } from "../lib/recipe.service";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  console.log("recipe", recipe);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailContent recipe={recipe} />;
}
