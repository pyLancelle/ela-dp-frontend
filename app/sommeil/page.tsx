"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSleepOverview } from "@/hooks/queries";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BarChartCard } from "@/components/magicui/bar-chart-card";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import {
  Moon,
  BedDouble,
  Sunrise,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────

function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? `${m}` : ""}` : `${m}m`;
}

function delta(current: number, previous: number) {
  const diff = current - previous;
  return { diff, isPositive: diff > 0, formatted: diff > 0 ? `+${diff}` : `${diff}` };
}

// ── Page ─────────────────────────────────────────────────────────────

export default function SommeilPage() {
  const { data, isLoading } = useSleepOverview();
  const router = useRouter();

  const last7 = data?.daily?.slice(-7) ?? [];
  const last30 = data?.daily ?? [];

  return (
    <div className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <BentoGrid>
        {/* KPI cards row — 4x 1.5col */}
        <BlurFade delay={0.05} className="h-[140px] md:h-auto md:col-span-3 md:col-start-1 md:row-start-1">
          <MagicCard>
            <KpiCard
              title="Score sommeil"
              value={data?.currentMonth.avgScore}
              unit="/100"
              prevValue={data?.previousMonth.avgScore}
              color="#6366f1"
              loading={isLoading}
            />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.1} className="h-[140px] md:h-auto md:col-span-3 md:col-start-4 md:row-start-1">
          <MagicCard>
            <KpiCard
              title="Durée moyenne"
              value={data?.currentMonth.avgDurationMinutes}
              formatValue={fmt}
              prevValue={data?.previousMonth.avgDurationMinutes}
              formatPrev={(v) => `${delta(data?.currentMonth.avgDurationMinutes ?? 0, v).formatted} min`}
              color="#818cf8"
              loading={isLoading}
            />
          </MagicCard>
        </BlurFade>

        {/* Score 7 jours - 2x1 */}
        <BlurFade delay={0.15} className="h-[180px] md:h-auto md:col-span-2 md:col-start-1 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="Score sommeil"
              kpi={last7.length ? Math.round(last7.reduce((s, d) => s + d.score, 0) / last7.length).toString() : "—"}
              kpiLabel="/100"
              subtitle="7 derniers jours"
              color="#6366f1"
              loading={isLoading}
              data={last7.map((d) => ({ label: d.day, value: d.score, formatted: d.score.toString() }))}
            />
          </MagicCard>
        </BlurFade>

        {/* Durée 7 jours - 2x1 */}
        <BlurFade delay={0.2} className="h-[180px] md:h-auto md:col-span-2 md:col-start-3 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="Durée"
              kpi={last7.length ? fmt(Math.round(last7.reduce((s, d) => s + d.durationMinutes, 0) / last7.length)) : "—"}
              kpiLabel="moy/nuit"
              subtitle="7 derniers jours"
              color="#818cf8"
              loading={isLoading}
              data={last7.map((d) => ({ label: d.day, value: d.durationMinutes, formatted: fmt(d.durationMinutes) }))}
            />
          </MagicCard>
        </BlurFade>

        {/* HRV 7 jours - 1x1 */}
        <BlurFade delay={0.25} className="h-[180px] md:h-auto md:col-span-1 md:col-start-5 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="HRV"
              kpi={last7.length ? Math.round(last7.reduce((s, d) => s + d.hrv, 0) / last7.length).toString() : "—"}
              kpiLabel="ms"
              subtitle="7 jours"
              color="#8b5cf6"
              loading={isLoading}
              data={last7.map((d) => ({ label: d.day, value: d.hrv, formatted: `${d.hrv}` }))}
            />
          </MagicCard>
        </BlurFade>

        {/* FC Repos 7 jours - 1x1 */}
        <BlurFade delay={0.3} className="h-[180px] md:h-auto md:col-span-1 md:col-start-6 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="FC Repos"
              kpi={last7.length ? Math.round(last7.reduce((s, d) => s + d.restingHr, 0) / last7.length).toString() : "—"}
              kpiLabel="bpm"
              subtitle="7 jours"
              color="#ef4444"
              loading={isLoading}
              data={last7.map((d) => ({ label: d.day, value: d.restingHr, formatted: `${d.restingHr}` }))}
            />
          </MagicCard>
        </BlurFade>

        {/* Night strip - cliquable vers /sommeil/[date] */}
        <BlurFade delay={0.35} className="md:col-span-6 md:col-start-1 md:row-start-3">
          <MagicCard beamDuration={7}>
            <NightStrip
              days={last30}
              loading={isLoading}
              onSelect={(date) => router.push(`/sommeil/${date}`)}
            />
          </MagicCard>
        </BlurFade>
      </BentoGrid>
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  unit,
  formatValue,
  prevValue,
  formatPrev,
  color,
  loading,
}: {
  title: string;
  value?: number;
  unit?: string;
  formatValue?: (v: number) => string;
  prevValue?: number;
  formatPrev?: (v: number) => string;
  color: string;
  loading: boolean;
}) {
  if (loading || value === undefined) {
    return (
      <div className="liquid-glass-card rounded-xl h-full flex flex-col justify-center items-center p-4 gap-2">
        <div className="h-3 w-24 rounded bg-muted/40 animate-pulse" />
        <div className="h-10 w-20 rounded bg-muted/40 animate-pulse" />
        <div className="h-2.5 w-16 rounded bg-muted/30 animate-pulse" />
      </div>
    );
  }

  const displayed = formatValue ? formatValue(value) : value.toString();
  const d = prevValue !== undefined ? delta(value, prevValue) : null;

  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col justify-center items-center p-4 gap-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        {formatValue ? (
          <span className="text-3xl font-bold" style={{ color }}>
            {displayed}
          </span>
        ) : (
          <NumberTicker
            value={value}
            className="text-3xl font-bold"
            style={{ color }}
          />
        )}
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
      {d && (
        <div className={cn("flex items-center gap-1 text-xs", d.isPositive ? "text-emerald-500" : "text-red-400")}>
          {d.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{formatPrev ? formatPrev(prevValue!) : d.formatted}</span>
          <span className="text-muted-foreground">vs mois dernier</span>
        </div>
      )}
    </div>
  );
}

// ── Night Strip ──────────────────────────────────────────────────────

interface NightDay {
  date: string;
  day: string;
  score: number;
  durationMinutes: number;
  bedtime: string;
  waketime: string;
}

function NightStrip({
  days,
  loading,
  onSelect,
}: {
  days: NightDay[];
  loading: boolean;
  onSelect: (date: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [days.length]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="liquid-glass-card rounded-xl h-full flex flex-col p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 w-32 rounded bg-muted/40 animate-pulse" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-16 h-20 rounded-xl bg-muted/30 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  // Couleur du score
  function scoreColor(score: number) {
    if (score >= 80) return "text-emerald-400";
    if (score >= 65) return "text-amber-400";
    return "text-red-400";
  }

  // Group by month
  let lastMonth = -1;

  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-400" />
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mes nuits — cliquer pour analyser
          </p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => scroll("left")} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scroll("right")} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
        {days.map((night) => {
          const month = new Date(night.date).getMonth();
          const showMonth = month !== lastMonth;
          if (showMonth) lastMonth = month;

          return (
            <div key={night.date} className="flex flex-col items-center flex-shrink-0">
              {showMonth && (
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
                  {new Date(night.date).toLocaleDateString("fr-FR", { month: "short" })}
                </span>
              )}
              {!showMonth && <span className="mb-1 h-3" />}
              <button
                type="button"
                onClick={() => onSelect(night.date)}
                className="w-16 flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 hover:bg-muted/40 transition-all duration-150 group"
              >
                <span className="text-[10px] font-medium uppercase text-muted-foreground">
                  {night.day}
                </span>
                <span className="text-sm font-bold">
                  {new Date(night.date).getDate()}
                </span>
                <span className={cn("text-xs font-bold tabular-nums", scoreColor(night.score))}>
                  {night.score}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {fmt(night.durationMinutes)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
