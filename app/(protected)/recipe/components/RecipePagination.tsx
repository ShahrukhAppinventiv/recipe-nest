"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import type { RecipeFiltersState } from "../lib/filter-options";
import { type RecipeSort, recipeFiltersToQueryString } from "../lib/recipe.params";

type RecipePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  filters: RecipeFiltersState;
  sort: RecipeSort;
};

export function RecipePagination({
  page,
  pageSize,
  total,
  filters,
  sort,
}: RecipePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(page, totalPages);

  function goToPage(nextPage: number) {
    const query = recipeFiltersToQueryString(filters, nextPage, sort);
    const href = query ? `${pathname}?${query}` : pathname;

    router.replace(href, { scroll: false });
  }

  return (
    <Pagination aria-label="Recipe pagination" className="pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) {
                goToPage(page - 1);
              }
            }}
          />
        </PaginationItem>

        {pages.map((pageNumber, index) =>
          pageNumber === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                className={cn(
                  "min-w-9",
                  pageNumber === page &&
                    "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(event) => {
              event.preventDefault();
              if (page < totalPages) {
                goToPage(page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    visiblePages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    visiblePages.push(pageNumber);
  }

  if (currentPage < totalPages - 2) {
    visiblePages.push("ellipsis");
  }

  visiblePages.push(totalPages);

  return visiblePages;
}
