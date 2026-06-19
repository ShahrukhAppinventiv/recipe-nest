export type SocialLoginProvider = "google" | "github";

export const SOCIAL_LOGIN_PROVIDERS: SocialLoginProvider[] = [
  "google",
  "github",
];

export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  HOME: "/home",
  PROFILE: "/profile",
} as const;

export const PROTECTED_NAV_ROUTES = [
  { label: "Home", href: "/home" },
  // { label: "Recipes", href: "/recipes" },
  { label: "Recipes", href: "/recipe" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/home",
  "/recipes",
  "/recipe",
  "/about",
  "/contact",
  "/profile",
] as const;
