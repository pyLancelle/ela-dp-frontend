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
  loading?: boolean;
  yMax?: number;
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
  loading = false,
  yMax,
}: BarChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  if (loading || data.length === 0) {
    return (
      <div ref={ref} className={cn("liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4", className)}>
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-28 rounded bg-muted/30 animate-pulse" />
          </div>
          <div className="space-y-1.5 items-end flex flex-col">
            <div className="h-7 w-12 rounded bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-8 rounded bg-muted/30 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-end gap-[5px] min-h-0">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <div
                className="w-4/5 rounded-t-sm bg-muted/30 animate-pulse"
                style={{ height: `${30 + Math.sin(i) * 20 + 20}%`, animationDelay: `${i * 80}ms` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-[5px] mt-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div className="h-2.5 w-3 rounded bg-muted/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isFloating = data.some((d) => d.range !== undefined);

  const globalMax = yMax ?? (isFloating
    ? Math.max(...data.map((d) => d.range?.[1] ?? d.value), 1)
    : Math.max(...data.map((d) => d.value), 1));

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
      <div className="flex-1 flex flex-col min-h-0">
        {/* Bars area */}
        <div className="flex-1 relative min-h-0">
          {/* Bars row */}
          <div className="absolute inset-0 flex items-end gap-[5px]">
            {data.map((day, i) => {
              if (isFloating && day.range) {
                const [lo, hi] = day.range;
                const bottomPct = (lo / globalMax) * 100;
                const heightPct = ((hi - lo) / globalMax) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-medium mb-0.5 text-foreground/70 whitespace-nowrap">
                      {hi}
                    </span>
                    <div className="w-full h-full relative">
                      <motion.div
                        className="absolute w-4/5 left-1/2 -translate-x-1/2 rounded-sm"
                        style={{
                          background: `linear-gradient(to top, ${color}99, ${color})`,
                          bottom: `${bottomPct}%`,
                        }}
                        initial={{ height: "0%", opacity: 0 }}
                        animate={inView ? { height: `${heightPct}%`, opacity: 1 } : { height: "0%", opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                      />
                    </div>
                  </div>
                );
              }

              // Barre classique
              const heightPct = (day.value / globalMax) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[9px] font-medium mb-0.5 text-foreground/70 whitespace-nowrap">
                    {day.formatted ?? day.value.toLocaleString("fr-FR")}
                  </span>
                  <div className="w-full h-full relative">
                    <motion.div
                      className="absolute bottom-0 w-4/5 left-1/2 -translate-x-1/2 rounded-t-sm"
                      style={{
                        background: `linear-gradient(to top, ${color}cc, ${color})`,
                      }}
                      initial={{ height: "0%" }}
                      animate={inView ? { height: `${heightPct}%` } : { height: "0%" }}
                      transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                    />
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
