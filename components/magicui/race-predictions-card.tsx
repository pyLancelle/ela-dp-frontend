"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

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
      <div className={cn("flex items-center gap-2 mb-3", loading && "invisible")}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prédictions courses
          </p>
          <span className="text-[10px] text-muted-foreground">vs 30 derniers jours</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-hidden">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center px-3 rounded-lg bg-muted/20 flex-1 border-l-2 border-muted/20">
                <div className="w-10 flex-shrink-0">
                  <div className="h-3 w-7 rounded bg-muted/30 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-7 w-24 rounded bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                </div>
                <div className="h-3 w-12 rounded bg-muted/30 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 80}ms` }} />
              </div>
            ))}
          </>
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
                className="flex items-center px-3 rounded-lg bg-muted/20 flex-1"
                style={{ borderLeft: `2px solid ${color}40` }}
              >
                {/* Distance badge */}
                <div className="w-10 flex-shrink-0">
                  <span
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color }}
                  >
                    {p.distance}
                  </span>
                </div>

                {/* Time — centre, prend tout l'espace */}
                <div className="flex-1 text-center">
                  <span className="text-2xl font-black tabular-nums leading-none tracking-tight">
                    {p.time}
                  </span>
                </div>

                {/* Delta */}
                <div className="flex items-center gap-0.5 flex-shrink-0" style={{ color }}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-sm font-bold tabular-nums">
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
