"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flame,
  MessageSquare,
  Star,
  Timer,
  User,
  Users,
} from "lucide-react";
import type { RecipeDetailData } from "@/lib/recipe/recipe.types";
import { SaveRecipeButton } from "@/components/recipeCard/SaveRecipeButton";

type RecipeDetailContentProps = {
  recipe: RecipeDetailData;
};

function formatCookTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatReviewCount(count: number) {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}

type StatItemProps = {
  icon: ReactElement;
  label: string;
  value: string;
};

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function RecipeDetailContent({ recipe }: RecipeDetailContentProps) {
  const router = useRouter();
  const hasTags = recipe.tags && recipe.tags.length > 0;
  const hasIngredients = recipe.ingredients.length > 0;
  const hasInstructions = recipe.instructions.length > 0;

  const stats: StatItemProps[] = [];

  if (recipe.prepTimeMinutes > 0) {
    stats.push({
      icon: <Timer className="h-3.5 w-3.5" aria-hidden />,
      label: "Prep time",
      value: formatCookTime(recipe.prepTimeMinutes),
    });
  }

  if (recipe.cookTimeMinutes > 0) {
    stats.push({
      icon: <Clock className="h-3.5 w-3.5" aria-hidden />,
      label: "Cook time",
      value: formatCookTime(recipe.cookTimeMinutes),
    });
  }

  if (recipe.servings > 0) {
    stats.push({
      icon: <Users className="h-3.5 w-3.5" aria-hidden />,
      label: "Servings",
      value: String(recipe.servings),
    });
  }

  if (recipe.caloriesPerServing > 0) {
    stats.push({
      icon: <Flame className="h-3.5 w-3.5" aria-hidden />,
      label: "Calories",
      value: `${recipe.caloriesPerServing.toLocaleString()} kcal`,
    });
  }

  // if (recipe.reviewCount > 0) {
  //   stats.push({
  //     icon: <MessageSquare className="h-3.5 w-3.5" aria-hidden />,
  //     label: "Reviews",
  //     value: formatReviewCount(recipe.reviewCount),
  //   });
  // }

  return (
    <div className="flex flex-col gap-6">
      {/* <BackButton /> */}
      <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Go Back
    </button>

      <article className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                {recipe.title}
              </h1>

              <SaveRecipeButton
                recipeId={recipe.id}
                initialIsSaved={recipe.isSaved ?? false}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
                <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                {/* {recipe.reviewCount > 0 ? (
                  <span className="text-muted-foreground">
                    ({formatReviewCount(recipe.reviewCount)})
                  </span>
                ) : null} */}
              </span>

              <span>
                {recipe.cuisine}
                {recipe.mealTypes.length > 0
                  ? ` · ${recipe.mealTypes.join(", ")}`
                  : ""}
              </span>
            </div>

            {recipe.difficulty ? (
              <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {recipe.difficulty}
              </span>
            ) : null}

            {(recipe.authorName || recipe.createdAt) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {recipe.authorName ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" aria-hidden />
                    {recipe.authorName}
                  </span>
                ) : null}

                {recipe.createdAt ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" aria-hidden />
                    {formatDate(recipe.createdAt)}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8 border-t border-border/60 px-6 py-6 sm:px-8 sm:py-8">
          {stats.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <StatItem
                  key={stat.label}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          ) : null}

          {hasTags ? (
            <div className="flex flex-wrap gap-2">
              {recipe.tags!.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {recipe.description ? (
            <section aria-labelledby="recipe-description-heading">
              <h2
                id="recipe-description-heading"
                className="font-heading text-xl text-foreground"
              >
                About this recipe
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {recipe.description}
              </p>
            </section>
          ) : null}

          {hasIngredients ? (
            <section aria-labelledby="recipe-ingredients-heading">
              <h2
                id="recipe-ingredients-heading"
                className="font-heading text-xl text-foreground"
              >
                Ingredients
              </h2>
              <ul className="mt-4 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={`${ingredient}-${index}`}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hasInstructions ? (
            <section aria-labelledby="recipe-instructions-heading">
              <h2
                id="recipe-instructions-heading"
                className="font-heading text-xl text-foreground"
              >
                Instructions
              </h2>
              <ol className="mt-4 space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li
                    key={`${instruction}-${index}`}
                    className="flex gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      </article>
    </div>
  );
}
