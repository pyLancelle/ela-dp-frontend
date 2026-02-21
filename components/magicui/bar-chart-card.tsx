"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/magicui/number-ticker";

export interface BarChartDay {
  label: string;
  value: number;          // valeur brute (utilisée pour barres classiques)
  range?: [number, number]; // [min, max] pour barres flottantes
  formatted?: string;     // affiché au-dessus de la barre
}

interface BarChartCardProps {
  title: string;
  kpi: string;
  kpiValue?: number;
  kpiDecimals?: number;
  kpiLabel?: string;
  subtitle?: string;
  data: BarChartDay[];
  color?: string;
  className?: string;
}

export function BarChartCard({
  title,
  kpi,
  kpiValue,
  kpiDecimals = 0,
  kpiLabel,
  subtitle = "7 derniers jours",
  data,
  color = "#6366f1",
  className,
}: BarChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const isFloating = data.some((d) => d.range !== undefined);

  // Pour barres flottantes : max global = max de toutes les valeurs hautes
  const globalMax = isFloating
    ? Math.max(...data.map((d) => d.range?.[1] ?? d.value), 1)
    : Math.max(...data.map((d) => d.value), 1);

  // Moyenne pour la ligne de référence
  const avg = isFloating
    ? data.reduce((s, d) => s + (d.range?.[1] ?? d.value), 0) / (data.length || 1)
    : data.reduce((s, d) => s + d.value, 0) / (data.length || 1);

  const avgPct = (avg / globalMax) * 100;

  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {title}
          </p>
          <span className="text-[10px] text-muted-foreground">{subtitle}</span>
        </div>
        <div className="text-right">
          {kpiValue !== undefined ? (
            <NumberTicker
              value={kpiValue}
              decimalPlaces={kpiDecimals}
              className="text-2xl font-bold leading-none"
            />
          ) : (
            <span className="text-2xl font-bold tabular-nums leading-none">{kpi}</span>
          )}
          {kpiLabel && (
            <p className="text-[10px] text-muted-foreground">{kpiLabel}</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex flex-col justify-end min-h-0">
        <div className="relative flex-1">
          <div className="absolute inset-0 flex items-end gap-[5px]">

            {/* Ligne de moyenne */}
            <div
              className="absolute inset-x-0 border-t border-dashed border-muted-foreground/30 pointer-events-none z-10"
              style={{ bottom: `${avgPct * 0.9}%` }}
            />

            {data.map((day, i) => {
              if (isFloating && day.range) {
                // Barre flottante : [min, max]
                const [lo, hi] = day.range;
                const bottomPct = (lo / globalMax) * 100 * 0.9;
                const heightPct = ((hi - lo) / globalMax) * 100 * 0.9;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    {/* Label haut */}
                    <span className="text-[9px] font-medium mb-0.5 text-foreground/70 whitespace-nowrap">
                      {hi}
                    </span>

                    <div className="w-full flex justify-center relative" style={{ height: "90%" }}>
                      <div className="relative w-[55%] h-full">
                        {/* Barre flottante animée */}
                        <motion.div
                          className="absolute w-full rounded-sm"
                          style={{
                            background: `linear-gradient(to top, ${color}99, ${color})`,
                            bottom: `${bottomPct}%`,
                          }}
                          initial={{ height: "0%", opacity: 0 }}
                          animate={inView
                            ? { height: `${heightPct}%`, opacity: 1 }
                            : { height: "0%", opacity: 0 }
                          }
                          transition={{
                            duration: 0.6,
                            delay: 0.05 + i * 0.06,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                        />
                        {/* Label bas */}
                        <motion.span
                          className="absolute text-[8px] text-muted-foreground whitespace-nowrap left-1/2 -translate-x-1/2"
                          style={{ bottom: `calc(${bottomPct}% - 14px)` }}
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: 0.3 + i * 0.06 }}
                        >
                          {lo}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Barre classique
              const heightPct = (day.value / globalMax) * 100;
              const isAboveAvg = day.value >= avg;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <span className="text-[9px] font-medium mb-0.5 text-foreground/70 whitespace-nowrap">
                    {day.formatted ?? day.value.toLocaleString("fr-FR")}
                  </span>

                  <div className="w-full flex justify-center relative" style={{ height: "90%" }}>
                    <div className="relative overflow-hidden rounded-t-sm w-[55%]" style={{ height: "100%" }}>
                      <motion.div
                        className="absolute bottom-0 w-full rounded-t-sm"
                        style={{
                          background: isAboveAvg
                            ? `linear-gradient(to top, ${color}cc, ${color})`
                            : `linear-gradient(to top, ${color}55, ${color}88)`,
                        }}
                        initial={{ height: "0%" }}
                        animate={inView ? { height: `${heightPct}%` } : { height: "0%" }}
                        transition={{
                          duration: 0.6,
                          delay: 0.05 + i * 0.06,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                      />
                      {isAboveAvg && (
                        <motion.div
                          className="absolute bottom-0 w-full rounded-t-sm pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, transparent 60%, rgba(255,255,255,0.18) 100%)`,
                          }}
                          initial={{ height: "0%" }}
                          animate={inView ? { height: `${heightPct}%` } : { height: "0%" }}
                          transition={{
                            duration: 0.6,
                            delay: 0.05 + i * 0.06,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Labels jours */}
        <div className="flex gap-[5px] mt-1.5">
          {data.map((day, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <span className="text-[10px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
