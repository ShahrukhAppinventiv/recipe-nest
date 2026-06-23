import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecipeCardData, RecipeCardVariant } from "./types";
import { SaveRecipeButton } from "./SaveRecipeButton";

type RecipeCardProps = {
  recipe: RecipeCardData;
  variant?: RecipeCardVariant;
  className?: string;
  /** When provided the save/bookmark button is shown on the card image. */
  isSaved?: boolean;
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

function formatRating(rating: number) {
  return rating.toFixed(1);
}

function RecipeCardInner({
  recipe,
  variant,
  className,
  isSaved,
}: RecipeCardProps & { variant: RecipeCardVariant }) {
  return (
    <Card
      className={cn(
        "h-full gap-3 pt-0 pb-4 shadow-soft transition-shadow hover:shadow-medium",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <CardHeader className="gap-1.5">
        {/* Title row — save button sits on the right, aligned to the top of the title */}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
            {recipe.title}
          </CardTitle>

          {isSaved !== undefined ? (
            <SaveRecipeButton recipeId={recipe.id} initialIsSaved={isSaved} />
          ) : null}
        </div>

        <div className="flex items-center gap-1 text-sm text-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
          <span className="font-medium">{formatRating(recipe.rating)}</span>
        </div>

        <CardDescription className="text-xs">
          {recipe.cuisine}{recipe.mealType ? ` · ${recipe.mealType}` : ""}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {formatCookTime(recipe.cookTimeMinutes)}
          </span>

          {variant === "rich" && recipe.difficulty ? (
            <>
              <span aria-hidden>·</span>
              <span>{recipe.difficulty}</span>
            </>
          ) : null}
        </div>

        {/* {variant === "rich" && recipe.tags && recipe.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null} */}
      </CardContent>
    </Card>
  );
}

export function RecipeCard({
  recipe,
  variant = "compact",
  className,
  isSaved,
}: RecipeCardProps) {
  if (recipe.href) {
    return (
      <Link
        href={recipe.href}
        className={cn("group block h-full", className)}
      >
        <RecipeCardInner recipe={recipe} variant={variant} isSaved={isSaved} />
      </Link>
    );
  }

  return (
    <article className={cn("group h-full", className)}>
      <RecipeCardInner recipe={recipe} variant={variant} isSaved={isSaved} />
    </article>
  );
}
