"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages - 1, start + showPages - 1);
      if (end - start < showPages - 1) start = Math.max(2, end - showPages + 1);
      if (start > 2) pages.push("ellipsis");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  const NavBtn = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded-lg text-xs transition-colors",
        "border border-white/10",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <NavBtn onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        <ChevronsLeft className="h-3.5 w-3.5" />
      </NavBtn>
      <NavBtn onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-3.5 w-3.5" />
      </NavBtn>

      {pageNumbers.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`e-${index}`} className="px-1 text-xs text-muted-foreground/50">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
              currentPage === page
                ? "bg-white/15 text-foreground border border-white/20"
                : "text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent"
            )}
          >
            {page}
          </button>
        )
      )}

      <NavBtn onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight className="h-3.5 w-3.5" />
      </NavBtn>
      <NavBtn onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        <ChevronsRight className="h-3.5 w-3.5" />
      </NavBtn>
    </div>
  );
}
