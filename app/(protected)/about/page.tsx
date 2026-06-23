import type { Metadata } from "next";
import { AboutCta } from "./components/AboutCta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RecipeNest — our story, values, and mission to make great cooking accessible to everyone.",
};
import { AboutHero } from "./components/AboutHero";
import { AboutStory } from "./components/AboutStory";
import { AboutValues } from "./components/AboutValues";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCta />
    </div>
  );
}
