import { FeaturedRecipes } from "./components/FeaturedRecipes";
import { HomeHero } from "./components/HomeHero";
import { LatestRecipes } from "./components/LatestRecipes";
import { RecipeOfTheDay } from "./components/RecipeOfTheDay";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  return (
    <div className="flex flex-col gap-16">
      <HomeHero userName={session?.user?.name} />
      <FeaturedRecipes />
      <LatestRecipes />
      <RecipeOfTheDay />

      {/* Upcoming sections: Browse By Cuisine, Browse By Meal Type, etc. */}
    </div>
  );
}
