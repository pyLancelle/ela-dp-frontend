"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Moon } from "lucide-react";

type SleepStage = "awake" | "rem" | "core" | "deep";

interface SleepSegment {
  startTime: Date | string;
  endTime: Date | string;
  stage: SleepStage;
}

interface SleepStagesCardProps {
  data?: SleepSegment[];
  loading?: boolean;
  className?: string;
}

const STAGE_CONFIG: Record<SleepStage, { label: string; color: string; lane: number }> = {
  awake: { label: "Awake", color: "#f97316", lane: 0 },
  rem:   { label: "REM",   color: "#38bdf8", lane: 1 },
  core:  { label: "Core",  color: "#60a5fa", lane: 2 },
  deep:  { label: "Deep",  color: "#3b82f6", lane: 3 },
};

const LANES: SleepStage[] = ["awake", "rem", "core", "deep"];


function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function SleepStagesCard({ data, loading = false, className }: SleepStagesCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  if (loading || !data?.length) {
    return (
      <div ref={ref} className={cn("liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4", className)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted/40 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-muted/40 animate-pulse" />
              <div className="h-2.5 w-20 rounded bg-muted/30 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1.5 flex flex-col items-end">
            <div className="h-7 w-14 rounded bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-8 rounded bg-muted/30 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex gap-4 min-h-0">
          <div className="flex flex-col justify-around py-0.5 gap-2 flex-shrink-0">
            {LANES.map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted/40 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-2.5 w-10 rounded bg-muted/40 animate-pulse" />
                  <div className="h-2 w-6 rounded bg-muted/30 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-around gap-[3px] py-0.5">
            {LANES.map((_, i) => (
              <div key={i} className="flex-1 relative rounded-md bg-muted/20 overflow-hidden">
                <div className="absolute inset-0 bg-muted/20 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const raw = data;

  const segments = raw.map((s) => {
    const start = new Date(s.startTime);
    const end = new Date(s.endTime);
    return { stage: s.stage, duration: (end.getTime() - start.getTime()) / 60000, start, end };
  });

  const totalMinutes = segments.reduce((s, seg) => s + seg.duration, 0);

  const totals = segments.reduce((acc, seg) => {
    acc[seg.stage] = (acc[seg.stage] || 0) + seg.duration;
    return acc;
  }, {} as Record<SleepStage, number>);

  const startTime = segments[0]?.start ?? new Date();
  const endTime = segments[segments.length - 1]?.end ?? new Date();

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
          <Moon className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Phases de sommeil
            </p>
            <span className="text-[10px] text-muted-foreground">
              {fmtTime(startTime)} – {fmtTime(endTime)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums leading-none">{fmt(totalMinutes)}</span>
          <p className="text-[10px] text-muted-foreground">total</p>
        </div>
      </div>

      {/* Hypnogramme */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Labels lanes */}
        <div className="flex flex-col justify-around py-0.5 flex-shrink-0">
          {LANES.map((stage) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: STAGE_CONFIG[stage].color }}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-medium text-foreground/80">
                  {STAGE_CONFIG[stage].label}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {fmt(totals[stage] || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 flex flex-col justify-around gap-[3px] min-w-0 py-0.5">
          {LANES.map((lane) => (
            <div key={lane} className="flex-1 relative">
              {/* Track de fond */}
              <div className="absolute inset-0 rounded-md bg-muted/20" />
              {/* Segments de cette lane, positionnés par left% + width% */}
              {segments.reduce((acc, seg, i) => {
                const leftPct = (segments.slice(0, i).reduce((s, s2) => s + s2.duration, 0) / totalMinutes) * 100;
                const widthPct = (seg.duration / totalMinutes) * 100;
                if (seg.stage !== lane) return acc;
                const cfg = STAGE_CONFIG[seg.stage];
                acc.push(
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      background: `linear-gradient(135deg, ${cfg.color}99, ${cfg.color})`,
                      boxShadow: `0 0 6px ${cfg.color}33`,
                      borderRadius: "6px",
                      transformOrigin: "left",
                    }}
                  />
                );
                return acc;
              }, [] as React.ReactElement[])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
