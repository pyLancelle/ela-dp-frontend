"use client";

import { useState, useMemo } from "react";
import type { ActivityInterval } from "@/types/activity-detail";

interface IntervalsRechartsProps {
  intervals: ActivityInterval[];
}

const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  warmup:   { color: "#3b82f6", label: "Échauff." },
  work:     { color: "#3b82f6", label: "Effort"   },
  recovery: { color: "#3b82f6", label: "Récup."   },
  cooldown: { color: "#3b82f6", label: "Retour"   },
  rest:     { color: "#3b82f6", label: "Repos"    },
};

function formatPace(pace: number) {
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}'${String(sec).padStart(2, "0")}"`;
}

function formatDur(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec > 0 ? `${m}m${String(sec).padStart(2, "0")}s` : `${m}min`;
}

export function IntervalsRecharts({ intervals }: IntervalsRechartsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const totalDuration = useMemo(
    () => intervals.reduce((s, i) => s + i.duration, 0),
    [intervals]
  );

  const maxSpeed = useMemo(
    () => Math.max(...intervals.map((i) => (i.avgPace > 0 ? 60 / i.avgPace : 0))),
    [intervals]
  );
  const minSpeed = useMemo(
    () => Math.min(...intervals.map((i) => (i.avgPace > 0 ? 60 / i.avgPace : 0))),
    [intervals]
  );
  const speedRange = maxSpeed - minSpeed || 1;

  const data = useMemo(() =>
    intervals.map((interval) => {
      const cfg = TYPE_CONFIG[interval.type] ?? { color: "#94a3b8", label: interval.type };
      const speed = interval.avgPace > 0 ? 60 / interval.avgPace : 0;
      // height : 30% min → 95% max selon vitesse relative
      const heightPct = 30 + ((speed - minSpeed) / speedRange) * 65;
      const widthPct = (interval.duration / totalDuration) * 100;
      return { interval, cfg, speed, heightPct, widthPct };
    }),
    [intervals, totalDuration, maxSpeed, minSpeed, speedRange]
  );

  return (
    <div className="liquid-glass-card rounded-2xl h-full overflow-hidden flex flex-col">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent flex-shrink-0" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Intervalles</span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 px-4 pb-4 flex flex-col gap-1">
        {/* Zone des barres */}
        <div className="flex-1 relative flex items-end min-h-0 overflow-hidden">
          {data.map((d, i) => (
            <div
              key={i}
              className="relative flex items-end cursor-pointer"
              style={{ flexBasis: `${d.widthPct}%`, flexShrink: 0, flexGrow: 0, height: "100%", paddingRight: i < data.length - 1 ? 3 : 0 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Barre */}
              <div
                className="w-full rounded-t-sm transition-all duration-150"
                style={{
                  height: `${d.heightPct}%`,
                  background: `linear-gradient(to top, ${d.cfg.color}cc, ${d.cfg.color}55)`,
                  boxShadow: hovered === i
                    ? `0 0 16px ${d.cfg.color}60, inset 0 1px 0 rgba(255,255,255,0.25)`
                    : `inset 0 1px 0 rgba(255,255,255,0.12)`,
                  opacity: hovered === null ? 1 : hovered === i ? 1 : 0.35,
                  border: `1px solid ${d.cfg.color}40`,
                  borderBottom: "none",
                }}
              />

              {/* Tooltip */}
              {hovered === i && (
                <div
                  className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 liquid-glass-filter rounded-xl px-3 py-2 z-30 pointer-events-none whitespace-nowrap"
                  style={{ minWidth: 160 }}
                >
                  {/* Nom + badge type */}
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.cfg.color }} />
                    <span className="text-[11px] font-semibold">{d.interval.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium text-right">{formatDur(d.interval.duration)}</span>
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-medium text-right">{d.interval.distance.toFixed(2)} km</span>
                    <span className="text-muted-foreground">Allure</span>
                    <span className="font-medium text-right">{formatPace(d.interval.avgPace)}/km</span>
                    <span className="text-muted-foreground">FC moy</span>
                    <span className="font-medium text-right" style={{ color: "#f43f5e" }}>
                      {Math.round(d.interval.avgHeartRate)} bpm
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Axe X — numéro des intervalles sous les barres */}
        {(() => {
          const n = data.length;
          const step = n > 20 ? 5 : n > 10 ? 3 : 1;
          return (
            <div className="flex flex-shrink-0 overflow-hidden">
              {data.map((d, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 overflow-hidden"
                  style={{ width: `${d.widthPct}%` }}
                >
                  <span
                    className="block text-[8px] text-center transition-all duration-150"
                    style={{ color: hovered === i ? d.cfg.color : i % step === 0 ? "rgba(255,255,255,0.3)" : "transparent" }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
