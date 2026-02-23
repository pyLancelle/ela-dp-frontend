"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Flag, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface RacePrediction {
  distance: string;
  time: string;
  difference: string;
  isImprovement: boolean;
}

interface RacePredictionsCardProps {
  predictions?: RacePrediction[];
  loading?: boolean;
  className?: string;
}

const defaultPredictions: RacePrediction[] = [
  { distance: "5K",  time: "20:25", difference: "-1:15",  isImprovement: true },
  { distance: "10K", time: "42:15", difference: "-2:30",  isImprovement: true },
  { distance: "21K", time: "1:32:45", difference: "-5:15", isImprovement: true },
  { distance: "42K", time: "3:18:30", difference: "-12:20", isImprovement: true },
];

export function RacePredictionsCard({ predictions = defaultPredictions, loading, className }: RacePredictionsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Flag className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prédictions courses
          </p>
          <span className="text-[10px] text-muted-foreground">vs 30 derniers jours</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
            Chargement...
          </div>
        ) : (
          predictions.map((p, i) => {
            const color = p.isImprovement ? "#22c55e" : "#ef4444";
            const Icon = p.isImprovement ? ArrowDownRight : ArrowUpRight;

            return (
              <motion.div
                key={p.distance}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 + i * 0.08,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/20 flex-shrink-0"
              >
                {/* Distance + time */}
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {p.distance}
                  </span>
                  <div className="text-base font-bold tabular-nums leading-tight">
                    {p.time}
                  </div>
                </div>

                {/* Delta */}
                <div className="flex items-center gap-0.5" style={{ color }}>
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs font-semibold tabular-nums">
                    {p.difference}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
