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
  className?: string;
}

const STAGE_CONFIG: Record<SleepStage, { label: string; color: string; lane: number }> = {
  awake: { label: "Awake", color: "#f97316", lane: 0 },
  rem:   { label: "REM",   color: "#38bdf8", lane: 1 },
  core:  { label: "Core",  color: "#60a5fa", lane: 2 },
  deep:  { label: "Deep",  color: "#3b82f6", lane: 3 },
};

const LANES: SleepStage[] = ["awake", "rem", "core", "deep"];

const mockData: SleepSegment[] = [
  { startTime: "2024-01-01T00:31:00", endTime: "2024-01-01T01:01:00", stage: "awake" },
  { startTime: "2024-01-01T01:01:00", endTime: "2024-01-01T03:01:00", stage: "deep" },
  { startTime: "2024-01-01T03:01:00", endTime: "2024-01-01T03:46:00", stage: "core" },
  { startTime: "2024-01-01T03:46:00", endTime: "2024-01-01T05:01:00", stage: "rem" },
  { startTime: "2024-01-01T05:01:00", endTime: "2024-01-01T05:39:00", stage: "rem" },
  { startTime: "2024-01-01T05:39:00", endTime: "2024-01-01T06:09:00", stage: "core" },
  { startTime: "2024-01-01T06:09:00", endTime: "2024-01-01T06:21:00", stage: "awake" },
  { startTime: "2024-01-01T06:21:00", endTime: "2024-01-01T07:07:00", stage: "deep" },
  { startTime: "2024-01-01T07:07:00", endTime: "2024-01-01T07:22:00", stage: "core" },
  { startTime: "2024-01-01T07:22:00", endTime: "2024-01-01T07:45:00", stage: "rem" },
  { startTime: "2024-01-01T07:45:00", endTime: "2024-01-01T08:45:00", stage: "core" },
  { startTime: "2024-01-01T08:45:00", endTime: "2024-01-01T09:30:00", stage: "rem" },
  { startTime: "2024-01-01T09:30:00", endTime: "2024-01-01T10:15:00", stage: "core" },
  { startTime: "2024-01-01T10:15:00", endTime: "2024-01-01T10:30:00", stage: "awake" },
];

function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function SleepStagesCard({ data, className }: SleepStagesCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const raw = data || mockData;

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
        <div className="flex-1 flex flex-col justify-around gap-[3px] min-w-0 py-0.5 overflow-hidden">
          {LANES.map((lane) => (
            <div key={lane} className="flex-1 relative flex items-center">
              {/* Track de fond */}
              <div className="absolute inset-0 rounded-md bg-muted/20" />
              {/* Segments de cette lane */}
              <div className="absolute inset-0 flex gap-[1px]">
                {segments.map((seg, i) => {
                  const widthPct = (seg.duration / totalMinutes) * 100;
                  const isThisLane = seg.stage === lane;
                  const cfg = STAGE_CONFIG[seg.stage];

                  return (
                    <div
                      key={i}
                      className="h-full flex-shrink-0"
                      style={{ width: `${widthPct}%` }}
                    >
                      {isThisLane && (
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={inView
                            ? { scaleX: 1, opacity: 1 }
                            : { scaleX: 0, opacity: 0 }
                          }
                          transition={{
                            duration: 0.5,
                            delay: 0.05 + i * 0.04,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                          style={{
                            background: `linear-gradient(135deg, ${cfg.color}99, ${cfg.color})`,
                            boxShadow: `0 0 6px ${cfg.color}33`,
                            height: "100%",
                            borderRadius: "6px",
                            transformOrigin: "left",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
