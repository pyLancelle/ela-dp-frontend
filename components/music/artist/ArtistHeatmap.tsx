"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface HeatmapDay {
  date: string;
  minutes: number;
}

interface AccentColor {
  r: number;
  g: number;
  b: number;
}

interface ArtistHeatmapProps {
  data: HeatmapDay[];
  title?: string;
  accentColor?: AccentColor | null;
}

const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const ROWS = 7;
const COLS = 24;
const GAP = 3;
const DAY_LABEL_W = 10;
const DAY_LABEL_GAP = 10;
const XLABEL_H = 14;

function getIntensityClass(minutes: number, max: number): string {
  if (minutes === 0) return "bg-white/5 border border-white/10";
  const ratio = minutes / max;
  if (ratio < 0.15) return "bg-cyan-300/40 border border-cyan-300/20";
  if (ratio < 0.4)  return "bg-cyan-400/60 border border-cyan-400/30";
  if (ratio < 0.7)  return "bg-cyan-500/80 border border-cyan-500/40";
  return "bg-cyan-600/90 border border-cyan-600/50";
}

function getIntensityStyle(minutes: number, max: number, c: AccentColor): React.CSSProperties {
  if (minutes === 0) {
    return { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  }
  const ratio = minutes / max;
  const { r, g, b } = c;
  if (ratio < 0.15) return { background: `rgba(${r},${g},${b},0.25)`, border: `1px solid rgba(${r},${g},${b},0.15)` };
  if (ratio < 0.4)  return { background: `rgba(${r},${g},${b},0.45)`, border: `1px solid rgba(${r},${g},${b},0.25)` };
  if (ratio < 0.7)  return { background: `rgba(${r},${g},${b},0.65)`, border: `1px solid rgba(${r},${g},${b},0.35)` };
  return { background: `rgba(${r},${g},${b},0.85)`, border: `1px solid rgba(${r},${g},${b},0.5)` };
}

function buildGrid(data: HeatmapDay[]) {
  const map: Record<string, number> = {};
  for (const d of data) map[d.date] = d.minutes;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - COLS * 7);

  const offsetToMonday = (start.getDay() + 6) % 7;
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - offsetToMonday);

  const weeks: (HeatmapDay | null)[][] = [];
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  const cursor = new Date(gridStart);

  for (let week = 0; week < COLS; week++) {
    const col: (HeatmapDay | null)[] = [];
    for (let day = 0; day < ROWS; day++) {
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
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

export function ArtistHeatmap({ data, title = "Activité d'écoute", accentColor }: ArtistHeatmapProps) {
  const max = Math.max(...data.map((d) => d.minutes), 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(11);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = (width: number) => {
      const gridW = width - DAY_LABEL_W - DAY_LABEL_GAP;
      const cell = Math.floor((gridW - (COLS - 1) * GAP) / COLS);
      setCellSize(Math.max(6, cell));
    };
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) compute(width);
    });
    ro.observe(el);
    const { width } = el.getBoundingClientRect();
    if (width > 0) compute(width);
    return () => ro.disconnect();
  }, []);

  const { weeks, monthPositions } = buildGrid(data);

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2 w-full">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        {title}
      </p>

      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        <div className="flex" style={{ gap: `${DAY_LABEL_GAP}px` }}>
          {/* Day labels */}
          <div
            className="flex flex-col flex-shrink-0"
            style={{ width: `${DAY_LABEL_W}px`, gap: `${GAP}px`, paddingBottom: `${XLABEL_H + GAP}px` }}
          >
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                className="text-[8px] text-muted-foreground flex items-center justify-end leading-none"
                style={{ height: `${cellSize}px` }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid + labels */}
          <div className="flex flex-col min-w-0">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
                gridAutoFlow: "column",
                gap: `${GAP}px`,
              }}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day === null) return <div key={`${wi}-${di}`} className="rounded-[3px] opacity-0" />;
                  const label = day.minutes > 0
                    ? `${new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} — ${day.minutes} min`
                    : new Date(day.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                  return (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2, delay: wi * 0.005, ease: "easeOut" }}
                      className={`rounded-[3px] cursor-default ${accentColor ? "" : getIntensityClass(day.minutes, max)}`}
                      style={accentColor ? getIntensityStyle(day.minutes, max, accentColor) : undefined}
                      title={label}
                    />
                  );
                })
              )}
            </div>

            {/* Month labels en bas */}
            <div className="relative flex-shrink-0" style={{ height: `${XLABEL_H}px`, marginTop: `${GAP}px` }}>
              {monthPositions.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-[9px] text-muted-foreground"
                  style={{ left: `${col * (cellSize + GAP)}px`, top: "2px" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
