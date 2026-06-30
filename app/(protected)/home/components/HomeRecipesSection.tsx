import {
  getFeaturedRecipes,
  getLatestRecipes,
  getRecipeOfTheDay,
} from "@/lib/recipe/recipe.service";
import type { getAuthSession } from "@/lib/auth";
import { FeaturedRecipes } from "./FeaturedRecipes";
import { LatestRecipes } from "./LatestRecipes";
import { RecipeOfTheDay } from "./RecipeOfTheDay";

type SessionPromise = ReturnType<typeof getAuthSession>;

type HomeRecipesSectionProps = {
  sessionPromise: SessionPromise;
};

export async function HomeRecipesSection({
  sessionPromise,
}: HomeRecipesSectionProps) {
  const session = await sessionPromise;

  if (!session?.accessToken) {
    return null;
  }

  const token = session.accessToken;
  const [featured, latest, recipeOfTheDay] = await Promise.all([
    getFeaturedRecipes(token),
    getLatestRecipes(token),
    getRecipeOfTheDay(token),
  ]);

  return (
    <div className="flex flex-col gap-16">
      <FeaturedRecipes recipes={featured} />
      <LatestRecipes recipes={latest} />
      <RecipeOfTheDay recipe={recipeOfTheDay} />
    </div>
  );
}
