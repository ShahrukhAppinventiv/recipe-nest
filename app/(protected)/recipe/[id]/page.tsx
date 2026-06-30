import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import { getRecipeById } from "@/lib/recipe/recipe.service";
import { RecipeDetailContent } from "./components/RecipeDetailContent";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getAuthSession();

  if (!session?.accessToken) {
    return { title: "Recipe Not Found" };
  }

  const recipe = await getRecipeById(id, session.accessToken);

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
      images: recipe.image
        ? [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }]
        : [],
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
  const session = await getAuthSession();

  if (!session?.accessToken) {
    notFound();
  }

  const recipe = await getRecipeById(id, session.accessToken);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailContent recipe={recipe} />;
}
