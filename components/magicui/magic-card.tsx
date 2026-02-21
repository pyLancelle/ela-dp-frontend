"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  beamDuration?: number;
  beamSize?: number;
}

export function MagicCard({
  children,
  className,
  beamDuration = 5,
  beamSize = 60,
}: MagicCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("relative h-full rounded-xl", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <BorderBeam
          size={beamSize}
          duration={beamDuration}
          colorFrom="#ffffff88"
          colorTo="#9c40ff"
          borderWidth={1.5}
        />
      )}
    </div>
  );
}
