"use client";

import { Search } from "lucide-react";

type RecipeSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RecipeSearch({ value, onChange }: RecipeSearchProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      <label htmlFor="recipe-search" className="sr-only">
        Search recipes
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="recipe-search"
          type="search"
          value={value}
          autoComplete="off"
          placeholder="Search recipes by Name..."
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  );
}
