import { AboutCta } from "./components/AboutCta";
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
