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
        "grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]",
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
        "liquid-glass-card rounded-xl overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
