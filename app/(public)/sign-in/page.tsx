import type { Metadata } from "next";
import { SignInForm } from "./components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your RecipeNest account to access your saved recipes and personalised feed.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInForm />;
}
