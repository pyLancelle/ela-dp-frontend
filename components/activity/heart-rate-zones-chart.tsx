"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { HeartRateZone } from "@/types/activity-detail";
import { Heart } from "lucide-react";

interface HeartRateZonesChartProps {
  zones: HeartRateZone[];
}

const ZONE_COLORS: Record<number, string> = {
  1: "#64748b",   // gris  – récupération
  2: "#38bdf8",   // bleu  – endurance
  3: "#4ade80",   // vert  – tempo
  4: "#fb923c",   // orange – seuil
  5: "#f43f5e",   // rouge – VO2Max
};


export function HeartRateZonesChart({ zones }: HeartRateZonesChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  // Toutes les zones Z1-Z5, même celles à 0
  const allZones = [1, 2, 3, 4, 5].map((z) => {
    const found = zones.find((zone) => zone.zone === z);
    return {
      zone: z,
      label: found?.name ?? `Zone ${z}`,
      percentage: found?.percentage ?? 0,
      timeInZone: found?.timeInZone ?? 0,
      color: ZONE_COLORS[z],
    };
  });

  return (
    <div ref={ref} className="liquid-glass-card rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Shimmer top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Header compact */}
      <div className="px-3 pt-2.5 pb-1.5 flex items-center gap-1.5 flex-shrink-0">
        <Heart className="h-3 w-3 text-red-400" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Zones cardio</span>
      </div>

      {/* Barres — chaque ligne prend une part égale de la hauteur restante */}
      <div className="flex-1 flex flex-col px-3 pb-3 min-h-0">
        {allZones.map((z, i) => (
          <div key={z.zone} className="flex-1 flex items-center gap-2">
            {/* Label zone */}
            <span
              className="text-[10px] font-bold tabular-nums flex-shrink-0"
              style={{ color: z.color, minWidth: "1.5rem" }}
            >
              Z{z.zone}
            </span>

            {/* Barre */}
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: z.color,
                  boxShadow: z.percentage > 0 ? `0 0 6px ${z.color}70` : "none",
                }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${z.percentage}%` } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: "easeOut" }}
              />
            </div>

            {/* % */}
            <span
              className="text-[9px] tabular-nums flex-shrink-0 text-right"
              style={{
                color: z.percentage > 0 ? z.color : "rgba(255,255,255,0.2)",
                minWidth: "2rem",
              }}
            >
              {z.percentage > 0 ? `${z.percentage.toFixed(0)}%` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
