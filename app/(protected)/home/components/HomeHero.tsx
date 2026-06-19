import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HomeHeroCarousel } from "./HomeHeroCarousel";
import { Button } from "@/components/ui/button";

type HomeHeroProps = {
  userName?: string | null;
};

function getFirstName(name?: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.split(" ")[0];
}

export function HomeHero({ userName }: HomeHeroProps) {
  const firstName = getFirstName(userName);

  return (
    <section className="relative -mx-4 overflow-hidden rounded-3xl border border-border/60 bg-white shadow-premium sm:-mx-6">
      <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:p-10">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Curated recipes for every kitchen
          </div>

          <div className="space-y-4">
            {firstName ? (
              <p className="text-sm font-medium text-primary">
                Welcome back, {firstName}
              </p>
            ) : null}

            <h1 className="font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Discover recipes you&apos;ll love to cook
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore featured dishes, browse by cuisine and meal type, and
              build your personal collection — all in one warm, welcoming place.
            </p>
          </div>

          {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-xl px-6">
              <Link href="/recipes">
                Browse recipes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-border bg-white px-6"
            >
              <Link href="/recipes">View featured</Link>
            </Button>
          </div> */}
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <HomeHeroCarousel />
        </div>
      </div>
    </section>
  );
}
