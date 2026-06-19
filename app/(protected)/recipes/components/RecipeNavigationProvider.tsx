"use client";

import { cn } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  recipeParamsToQueryString,
  type RecipeSearchParams,
} from "@/lib/recipe/recipe.params";

type RecipeNavigationContextValue = {
  params: RecipeSearchParams;
  navigate: (updates: Partial<RecipeSearchParams>) => void;
  isPending: boolean;
};

const RecipeNavigationContext =
  createContext<RecipeNavigationContextValue | null>(null);

type RecipeNavigationProviderProps = {
  params: RecipeSearchParams;
  children: ReactNode;
};

export function RecipeNavigationProvider({
  params,
  children,
}: RecipeNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (updates: Partial<RecipeSearchParams>) => {
      const next = { ...params, ...updates };
      const query = recipeParamsToQueryString(next);
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  return (
    <RecipeNavigationContext value={{ params, navigate, isPending }}>
      {children}
    </RecipeNavigationContext>
  );
}

export function useRecipeNavigation() {
  const context = useContext(RecipeNavigationContext);

  if (!context) {
    throw new Error(
      "useRecipeNavigation must be used within RecipeNavigationProvider",
    );
  }

  return context;
}

type RecipeResultsPendingWrapperProps = {
  children: ReactNode;
};

export function RecipeResultsPendingWrapper({
  children,
}: RecipeResultsPendingWrapperProps) {
  const { isPending } = useRecipeNavigation();

  return (
    <div
      className={cn(
        "flex flex-col gap-6 transition-opacity duration-200",
        isPending && "pointer-events-none opacity-60",
      )}
      aria-busy={isPending}
    >
      {children}
    </div>
  );
}
