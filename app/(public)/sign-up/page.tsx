import type { Metadata } from "next";
import { SignUpForm } from "./components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free RecipeNest account and start discovering, saving, and cooking great recipes.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <SignUpForm />;
}
