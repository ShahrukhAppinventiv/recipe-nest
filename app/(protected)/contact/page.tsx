import type { Metadata } from "next";
import { ContactPageContent } from "./components/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the RecipeNest team — questions, feedback, or recipe suggestions are all welcome.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
