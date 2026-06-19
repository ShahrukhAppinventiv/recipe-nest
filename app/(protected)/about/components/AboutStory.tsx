import Image from "next/image";

export function AboutStory() {
  return (
    <section
      aria-labelledby="about-story-heading"
      className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-large">
        <Image
          src="/recipe3.webp"
          alt="Beautifully plated seasonal dish"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="space-y-4">
        <h2
          id="about-story-heading"
          className="font-heading text-2xl text-foreground sm:text-3xl"
        >
          Built for home cooks who love good food
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          We started RecipeNest with a simple idea: finding great recipes
          shouldn&apos;t feel overwhelming. No endless scroll of duplicates — just
          thoughtfully chosen dishes with clear instructions, helpful details, and
          flavors from around the world.
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Whether you&apos;re planning a quick lunch, a family dinner, or trying
          something new, RecipeNest helps you browse by cuisine, meal type, and
          mood — and save the recipes that belong in your kitchen.
        </p>
      </div>
    </section>
  );
}
