"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity, Timer, TrendingUp } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";

// Dynamic import pour éviter le SSR avec React Leaflet
const RunMap = dynamic(() => import("./RunMap"), { ssr: false });

const ACCENT = "#FF6B35";

const mockRun = {
  name: "Sortie trail matinale",
  date: "2026-02-18T07:30:00",
  distance: 12.4,
  duration: "1:02:31",
  pace: "5:03",
  elevation: 187,
  heartRateAvg: 158,
  coordinates: [
    [48.8566, 2.3522],
    [48.858, 2.355],
    [48.86, 2.358],
    [48.862, 2.356],
    [48.864, 2.353],
    [48.863, 2.35],
    [48.861, 2.347],
    [48.859, 2.349],
    [48.8566, 2.3522],
  ] as [number, number][],
};

function formatDateFR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function LastRunCard({ className }: { className?: string }) {
  const run = mockRun;
  const [hovered, setHovered] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Distance entière et décimale pour NumberTicker
  const distanceInt = Math.floor(run.distance);
  const distanceDec = Math.round((run.distance - distanceInt) * 10);

  return (
    <BlurFade delay={0.3} inView className={cn("h-full", className)}>
      <div
        className="relative liquid-glass-card rounded-2xl overflow-hidden h-full flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* BorderBeam au hover */}
        {hovered && (
          <BorderBeam
            size={80}
            duration={5}
            colorFrom={ACCENT}
            colorTo="#ff9966"
            borderWidth={1.5}
          />
        )}

        <div className="flex h-full">
          {/* Colonne gauche : header + KPIs — 1/3 */}
          <div className="flex flex-col justify-between px-4 py-4 w-1/3 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                style={{ background: `${ACCENT}22` }}
              >
                <Activity className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">{run.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {formatDateFR(run.date)}
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="flex flex-col gap-2">
              {/* Distance */}
              <div className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: `${ACCENT}12` }}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Distance</span>
                </div>
                <span className="text-base font-bold tabular-nums" style={{ color: ACCENT }}>
                  <NumberTicker value={run.distance} decimalPlaces={1} className="text-base font-bold" style={{ color: ACCENT }} /> km
                </span>
              </div>

              {/* Temps */}
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Temps</span>
                </div>
                <span className="text-base font-bold tabular-nums">{run.duration}</span>
              </div>

              {/* Allure */}
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Allure</span>
                </div>
                <span className="text-base font-bold tabular-nums">{run.pace} /km</span>
              </div>
            </div>
          </div>

          {/* Colonne droite : carte — 3/4 */}
          <div className="relative flex-1 m-3 rounded-xl overflow-hidden">
            <RunMap coordinates={run.coordinates} accentColor={ACCENT} isDark={isDark} />
          </div>
        </div>
      </div>
    </BlurFade>
  );
}
