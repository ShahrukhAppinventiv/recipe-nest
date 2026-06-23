import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RecipeDetailContent } from "./components/RecipeDetailContent";
import { getRecipeById } from "@/lib/recipe/recipe.service";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Memoize within a single request so generateMetadata and the page
// component share one DB round-trip instead of making two.
const getRecipeCached = cache(async (id: string) => getRecipeById(id));

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeCached(id);

  if (!recipe) {
    return { title: "Recipe Not Found" };
  }

  const description = recipe.description
    ? recipe.description.slice(0, 155)
    : `${recipe.cuisine} recipe — ${recipe.cookTimeMinutes} min cook time.`;

  return {
    title: recipe.title,
    description,
    openGraph: {
      title: recipe.title,
      description,
      images: recipe.image ? [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description,
      images: recipe.image ? [recipe.image] : [],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipeCached(id);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailContent recipe={recipe} />;
}
