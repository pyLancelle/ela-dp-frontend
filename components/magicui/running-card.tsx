"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Footprints, CheckCircle2 } from "lucide-react";

interface DailyRun {
  date: string;
  day: string;
  distance: number;
  aerobicScore: number;
  anaerobicScore: number;
  aerobicHeightPercentage: number;
  anaerobicHeightPercentage: number;
}

interface RunningCardProps {
  data?: {
    totalDistance: number;
    sessionCount: number;
    averagePerSession: number;
    daily: DailyRun[];
  } | null;
  className?: string;
}

const mockDaily: DailyRun[] = [
  { date: "", day: "L", distance: 0,    aerobicScore: 0,   anaerobicScore: 0,   aerobicHeightPercentage: 0,  anaerobicHeightPercentage: 0  },
  { date: "", day: "M", distance: 8.5,  aerobicScore: 2.8, anaerobicScore: 0,   aerobicHeightPercentage: 56, anaerobicHeightPercentage: 0  },
  { date: "", day: "M", distance: 0,    aerobicScore: 0,   anaerobicScore: 0,   aerobicHeightPercentage: 0,  anaerobicHeightPercentage: 0  },
  { date: "", day: "J", distance: 12.2, aerobicScore: 4.1, anaerobicScore: 0.8, aerobicHeightPercentage: 82, anaerobicHeightPercentage: 32 },
  { date: "", day: "V", distance: 0,    aerobicScore: 0,   anaerobicScore: 0,   aerobicHeightPercentage: 0,  anaerobicHeightPercentage: 0  },
  { date: "", day: "S", distance: 21.1, aerobicScore: 5.0, anaerobicScore: 1.8, aerobicHeightPercentage: 100,anaerobicHeightPercentage: 72 },
  { date: "", day: "D", distance: 5.3,  aerobicScore: 1.6, anaerobicScore: 0,   aerobicHeightPercentage: 32, anaerobicHeightPercentage: 0  },
];

const AEROBIC_COLOR = "#3b82f6";
const ANAEROBIC_COLOR = "#f97316";

const GOAL_STATUS = {
  achieved:     { label: "Objectif atteint",  color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  in_progress:  { label: "En cours",          color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  not_achieved: { label: "Non atteint",       color: "#ef4444", bg: "rgba(239,68,68,0.12)"  },
};

export function RunningCard({ data, className }: RunningCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const d = data ?? {
    totalDistance: 47.1,
    sessionCount: 4,
    averagePerSession: 11.8,
    daily: mockDaily,
  };
  const maxDist = Math.max(...d.daily.map((r) => r.distance), 1);

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
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Course à pied
            </p>
            <span className="text-[10px] text-muted-foreground">7 derniers jours</span>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)" }}>
          <CheckCircle2 className="h-3 w-3" />
          {d.sessionCount} sessions
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { value: d.totalDistance.toFixed(1), label: "km total" },
          { value: d.sessionCount.toString(),   label: "sessions"  },
          { value: d.averagePerSession.toFixed(1), label: "km/session" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-center rounded-lg bg-muted/20 py-2"
          >
            <div className="text-xl font-bold tabular-nums leading-tight">{kpi.value}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Distance bars */}
      <div className="mb-4">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1.5">Distance</p>
        <div className="flex items-end gap-[5px] h-10">
          {d.daily.map((run, i) => {
            const pct = (run.distance / maxDist) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5">
                {run.distance > 0 && (
                  <span className="text-[8px] text-foreground/60 tabular-nums leading-none">
                    {run.distance.toFixed(0)}
                  </span>
                )}
                <div className="w-full relative flex justify-center" style={{ height: run.distance > 0 ? `${pct}%` : "4px" }}>
                  {run.distance > 0 ? (
                    <motion.div
                      className="absolute inset-0 rounded-sm"
                      style={{ background: `linear-gradient(to top, ${AEROBIC_COLOR}99, ${AEROBIC_COLOR})`, transformOrigin: "bottom" }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={inView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-sm bg-muted/30" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Day labels */}
        <div className="flex gap-[5px] mt-1">
          {d.daily.map((run, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <span className="text-[9px] text-muted-foreground">{run.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aerobic / Anaerobic chart */}
      <div className="flex-1 min-h-0 flex flex-col">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1.5">
          Charge aérobie / anaérobie
        </p>

        {/* Axes mirroir */}
        <div className="flex-1 relative min-h-0">
          {/* Ligne centrale */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-border/60 z-10" />

          <div className="absolute inset-0 flex gap-[5px]">
            {d.daily.map((run, i) => (
              <div key={i} className="flex-1 h-full flex flex-col">
                {/* Aérobie — moitié haute */}
                <div className="flex-1 flex items-end justify-center pb-px">
                  {run.aerobicScore > 0 && (
                    <motion.div
                      className="w-[60%] rounded-t-sm"
                      style={{ background: `linear-gradient(to top, ${AEROBIC_COLOR}88, ${AEROBIC_COLOR})` }}
                      initial={{ height: "0%" }}
                      animate={inView ? { height: `${run.aerobicHeightPercentage}%` } : { height: "0%" }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  )}
                </div>
                {/* Anaérobie — moitié basse */}
                <div className="flex-1 flex items-start justify-center pt-px">
                  {run.anaerobicScore > 0 && (
                    <motion.div
                      className="w-[60%] rounded-b-sm"
                      style={{ background: `linear-gradient(to bottom, ${ANAEROBIC_COLOR}88, ${ANAEROBIC_COLOR})` }}
                      initial={{ height: "0%" }}
                      animate={inView ? { height: `${run.anaerobicHeightPercentage}%` } : { height: "0%" }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: AEROBIC_COLOR }} />
            <span className="text-[9px] text-muted-foreground">Aérobie</span>
            <span className="text-[9px] font-medium" style={{ color: AEROBIC_COLOR }}>+5 max</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: ANAEROBIC_COLOR }} />
            <span className="text-[9px] text-muted-foreground">Anaérobie</span>
            <span className="text-[9px] font-medium" style={{ color: ANAEROBIC_COLOR }}>-5 max</span>
          </div>
        </div>
      </div>
    </div>
  );
}
