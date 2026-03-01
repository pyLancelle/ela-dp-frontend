"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface HeatmapDay {
  date: string;
  minutes: number;
}

interface ArtistHeatmapProps {
  data: HeatmapDay[];
  title?: string;
  /** Earliest date to display (YYYY-MM-DD). Defaults to "2025-07-01". */
  startDate?: string;
}

const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const ROWS = 7;
const GAP = 3;
const DAY_LABEL_W = 10;
const DAY_LABEL_GAP = 10;
const MONTH_LABEL_H = 16;

function getIntensityClass(minutes: number, max: number): string {
  if (minutes === 0) return "bg-white/5 border border-white/10";
  const ratio = minutes / max;
  if (ratio < 0.15) return "bg-cyan-900/60 border border-cyan-800/40";
  if (ratio < 0.4)  return "bg-cyan-700/70 border border-cyan-600/40";
  if (ratio < 0.7)  return "bg-cyan-500/80 border border-cyan-400/50";
  return "bg-cyan-300/90 border border-cyan-200/60";
}

interface GridResult {
  weeks: (HeatmapDay | null)[][];
  monthPositions: { label: string; col: number }[];
}

function buildGrid(data: HeatmapDay[], days: number): GridResult {
  const map: Record<string, number> = {};
  for (const d of data) map[d.date] = d.minutes;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - days);

  const offsetToMonday = (start.getDay() + 6) % 7;
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - offsetToMonday);

  const weeks: (HeatmapDay | null)[][] = [];
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  const cursor = new Date(gridStart);

  const totalDays = Math.ceil((today.getTime() - gridStart.getTime()) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  for (let week = 0; week < totalWeeks; week++) {
    const col: (HeatmapDay | null)[] = [];
    for (let day = 0; day < ROWS; day++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const isFuture = cursor > today;
      const isBeforeStart = cursor < start;
      col.push((isFuture || isBeforeStart) ? null : { date: dateStr, minutes: map[dateStr] ?? 0 });
      if (!isBeforeStart && !isFuture && cursor.getDate() === 1) {
        const m = cursor.getMonth();
        if (m !== lastMonth) {
          monthPositions.push({ label: MONTH_LABELS[m], col: week });
          lastMonth = m;
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(col);
  }

  return { weeks, monthPositions };
}

export function ArtistHeatmap({
  data,
  title = "Activité d'écoute",
  startDate = "2025-07-01",
}: ArtistHeatmapProps) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(11);

  const days = 300;
  const totalWeeks = Math.ceil(days / 7) + 1;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = (width: number, height: number) => {
      const gridH = height - MONTH_LABEL_H - GAP;
      const cellFromH = (gridH - (ROWS - 1) * GAP) / ROWS;
      const minCell = 8;
      setCellSize(Math.max(minCell, Math.floor(cellFromH)));
    };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) compute(width, height);
    });
    ro.observe(el);

    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) compute(width, height);

    return () => ro.disconnect();
  }, [totalWeeks]);

  const { weeks, monthPositions } = buildGrid(data, days);

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2 w-full">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        {title}
      </p>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full" style={{ gap: `${DAY_LABEL_GAP}px`, minWidth: `${DAY_LABEL_W + DAY_LABEL_GAP + weeks.length * (cellSize + GAP)}px` }}>
          {/* Day labels */}
          <div
            className="flex flex-col flex-shrink-0 justify-start"
            style={{
              width: `${DAY_LABEL_W}px`,
              marginTop: `${MONTH_LABEL_H}px`,
              gap: `${GAP}px`,
            }}
          >
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                className="text-[8px] text-muted-foreground flex items-center justify-end leading-none flex-shrink-0"
                style={{ height: `${cellSize}px` }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid area */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Month labels */}
            <div
              className="relative flex-shrink-0"
              style={{ height: `${MONTH_LABEL_H}px` }}
            >
              {monthPositions.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-[9px] text-muted-foreground"
                  style={{
                    left: `${col * (cellSize + GAP)}px`,
                    top: "2px",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* 2D grid avec cellules carrées de taille fixe */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
                gridAutoFlow: "column",
                gap: `${GAP}px`,
              }}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day === null) {
                    return (
                      <div key={`${wi}-${di}`} className="rounded-[3px] opacity-0" />
                    );
                  }

                  const label =
                    day.minutes > 0
                      ? `${new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", year: "numeric",
                        })} — ${day.minutes} min`
                      : new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short",
                        });

                  return (
                    <motion.div
                      key={`${wi}-${di}`}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: wi * 0.005, ease: "easeOut" }}
                    >
                      <div
                        className={`w-full h-full rounded-[3px] transition-transform hover:scale-110 cursor-default ${getIntensityClass(day.minutes, max)}`}
                      />
                      <div className="pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex">
                        <div className="liquid-glass-filter rounded px-2 py-1 text-[9px] whitespace-nowrap text-foreground shadow-lg">
                          {label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
