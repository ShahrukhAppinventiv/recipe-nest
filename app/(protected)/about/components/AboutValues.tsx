import { Clock, Globe, Heart, UtensilsCrossed } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VALUES = [
  {
    icon: UtensilsCrossed,
    title: "Curated quality",
    description:
      "Every recipe is selected for clear steps, reliable results, and real-world flavor.",
  },
  {
    icon: Globe,
    title: "Global cuisines",
    description:
      "Explore Mediterranean, Asian, Italian, and more — all in one welcoming place.",
  },
  {
    icon: Clock,
    title: "Cook with confidence",
    description:
      "Cook times, difficulty, and tags help you pick the right dish for your schedule.",
  },
  {
    icon: Heart,
    title: "Made with care",
    description:
      "A calm, premium experience designed to feel as warm as your favorite kitchen.",
  },
] as const;

export function AboutValues() {
  return (
    <section aria-labelledby="about-values-heading">
      <div className="mb-6 text-center lg:mb-8">
        <h2
          id="about-values-heading"
          className="font-heading text-2xl text-foreground sm:text-3xl"
        >
          What we believe in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          The principles behind every recipe on RecipeNest
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="gap-3 pt-0 shadow-soft transition-shadow hover:shadow-medium"
          >
            <CardHeader className="gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
