"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecipeNavigation } from "./RecipeNavigationProvider";

type RecipePaginationProps = {
  total: number;
};

export function RecipePagination({ total }: RecipePaginationProps) {
  const { params, navigate } = useRecipeNavigation();
  const totalPages = Math.ceil(total / params.pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(params.page, totalPages);

  return (
    <nav
      aria-label="Recipe pagination"
      className="flex items-center justify-center gap-2 pt-2"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={params.page <= 1}
        onClick={() => navigate({ page: params.page - 1 })}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === params.page ? "default" : "outline"}
              size="sm"
              className="min-w-9"
              onClick={() => navigate({ page })}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={params.page >= totalPages}
        onClick={() => navigate({ page: params.page + 1 })}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}
