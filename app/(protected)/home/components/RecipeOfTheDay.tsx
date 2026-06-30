import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Star } from "lucide-react";
import type { RecipeSpotlightData } from "@/components/recipeCard/types";
import { Button } from "@/components/ui/button";

type RecipeOfTheDayProps = {
  recipe: RecipeSpotlightData | null;
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

export function RecipeOfTheDay({ recipe }: RecipeOfTheDayProps) {
  if (!recipe) {
    return null;
  }

  return (
    <section aria-labelledby="recipe-of-the-day-heading">
      <div className="mb-6">
        <h2
          id="recipe-of-the-day-heading"
          className="font-heading text-2xl text-foreground sm:text-3xl"
        >
          Recipe of the Day
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Today&apos;s spotlight pick from the RecipeNest kitchen
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
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

          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              Today&apos;s pick
            </div>

            <div className="space-y-3">
              <h3 className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
                {recipe.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
                  <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                </span>

                <span>
                  {recipe.cuisine}{recipe.mealType ? ` · ${recipe.mealType}` : ""}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden />
                  {formatCookTime(recipe.cookTimeMinutes)}
                </span>

                {recipe.difficulty ? <span>{recipe.difficulty}</span> : null}
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {recipe.description}
              </p>
            </div>

            {recipe.tags && recipe.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {recipe.href ? (
              <Button asChild size="lg" className="w-fit rounded-xl px-6">
                <Link href={recipe.href}>
                  View recipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
