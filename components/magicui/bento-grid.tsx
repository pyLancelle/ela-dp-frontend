"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 gap-2 auto-rows-[150px] md:auto-rows-[minmax(160px,calc((100vh-14rem)/5))]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        "liquid-glass-card rounded-xl overflow-hidden min-h-[180px]",
        className
      )}
    >
      {children}
    </div>
  );
}
