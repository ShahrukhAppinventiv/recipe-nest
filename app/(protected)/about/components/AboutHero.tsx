import { ChefHat, Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-white p-6 shadow-premium sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
          <ChefHat className="h-7 w-7 text-primary-foreground" aria-hidden />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Our story
        </div>

        <h1 className="font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          About RecipeNest
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          RecipeNest is a warm, curated home for discovering recipes you&apos;ll
          actually want to cook — from weeknight dinners to weekend projects.
        </p>
      </div>
    </section>
  );
}
