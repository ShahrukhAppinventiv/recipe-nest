import { Sparkles } from "lucide-react";

export function RecipeHero() {
  return (
    <section
      aria-labelledby="recipe-hero-heading"
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-white p-6 shadow-premium sm:p-8 lg:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          RecipeNest
        </div>

        <h1
          id="recipe-hero-heading"
          className="mt-5 font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl"
        >
          Recipes
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover dishes you&apos;ll love to cook, from everyday favorites to
          something new for the table.
        </p>
      </div>
    </section>
  );
}
