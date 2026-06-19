import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="rounded-3xl border border-border/60 bg-white p-6 text-center shadow-soft sm:p-8"
    >
      <h2
        id="about-cta-heading"
        className="font-heading text-2xl text-foreground sm:text-3xl"
      >
        Ready to start cooking?
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
        Browse our collection of featured and latest recipes, or explore by
        cuisine and meal type.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          <Link href="/home">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
