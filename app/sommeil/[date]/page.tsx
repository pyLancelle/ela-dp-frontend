"use client";

import { use } from "react";
import Link from "next/link";
import { useSleepNight } from "@/hooks/queries";
import { SleepStagesCard } from "@/components/magicui/sleep-stages-card";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Moon,
  Clock,
  Heart,
  Activity,
  BedDouble,
  Sunrise,
  Zap,
  Brain,
} from "lucide-react";

function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? `${m}` : ""}` : `${m}m`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function scoreLabel(score: number) {
  if (score >= 85) return { label: "Excellent", color: "text-emerald-400" };
  if (score >= 70) return { label: "Bon", color: "text-blue-400" };
  if (score >= 55) return { label: "Correct", color: "text-amber-400" };
  return { label: "Médiocre", color: "text-red-400" };
}

export default function SleepNightPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const { data, isLoading } = useSleepNight(date);

  const label = data ? scoreLabel(data.score) : null;

  return (
    <div className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      {/* Back link + date */}
      <BlurFade delay={0} duration={0.25}>
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/sommeil"
            className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold capitalize">
              {isLoading ? (
                <span className="inline-block h-5 w-48 rounded bg-muted/40 animate-pulse align-middle" />
              ) : (
                `Nuit du ${formatDate(date)}`
              )}
            </h1>
            {label && (
              <span className={cn("text-sm font-medium", label.color)}>
                {label.label}
              </span>
            )}
          </div>
        </div>
      </BlurFade>

      <BentoGrid>
        {/* Hypnogramme - 4x1 */}
        <BlurFade
          delay={0.05}
          className="h-[180px] md:h-auto md:col-span-4 md:col-start-1 md:row-start-1"
        >
          <MagicCard>
            <SleepStagesCard data={data?.stages} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        {/* Score - 2x1 */}
        <BlurFade
          delay={0.1}
          className="h-[140px] md:h-auto md:col-span-2 md:col-start-5 md:row-start-1"
        >
          <MagicCard>
            <div className="liquid-glass-card rounded-xl h-full flex flex-col justify-center items-center p-4 gap-1">
              {isLoading ? (
                <>
                  <div className="h-3 w-20 rounded bg-muted/40 animate-pulse" />
                  <div className="h-12 w-16 rounded bg-muted/40 animate-pulse" />
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <NumberTicker
                    value={data?.score ?? 0}
                    className={cn("text-4xl font-bold", label?.color)}
                  />
                  <span className="text-xs text-muted-foreground">/100</span>
                </>
              )}
            </div>
          </MagicCard>
        </BlurFade>

        {/* KPI grid - 6x 1col */}
        <BlurFade delay={0.15} className="h-[120px] md:h-auto md:col-span-1 md:col-start-1 md:row-start-2">
          <MagicCard>
            <MetricCard icon={Clock} label="Durée" value={data ? fmt(data.durationMinutes) : undefined} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.2} className="h-[120px] md:h-auto md:col-span-1 md:col-start-2 md:row-start-2">
          <MagicCard>
            <MetricCard icon={BedDouble} label="Coucher" value={data?.bedtime} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.25} className="h-[120px] md:h-auto md:col-span-1 md:col-start-3 md:row-start-2">
          <MagicCard>
            <MetricCard icon={Sunrise} label="Lever" value={data?.waketime} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.3} className="h-[120px] md:h-auto md:col-span-1 md:col-start-4 md:row-start-2">
          <MagicCard>
            <MetricCard icon={Brain} label="HRV" value={data ? `${data.hrv} ms` : undefined} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.35} className="h-[120px] md:h-auto md:col-span-1 md:col-start-5 md:row-start-2">
          <MagicCard>
            <MetricCard icon={Heart} label="FC Repos" value={data ? `${data.restingHr} bpm` : undefined} loading={isLoading} color="text-red-400" />
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.4} className="h-[120px] md:h-auto md:col-span-1 md:col-start-6 md:row-start-2">
          <MagicCard>
            <MetricCard icon={Zap} label="Body Battery" value={data ? `+${data.bodyBatteryGain}` : undefined} loading={isLoading} color="text-emerald-400" />
          </MagicCard>
        </BlurFade>
      </BentoGrid>
    </div>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  loading,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  loading: boolean;
  color?: string;
}) {
  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col justify-center items-center p-3 gap-1.5">
      {loading ? (
        <>
          <div className="h-4 w-4 rounded bg-muted/40 animate-pulse" />
          <div className="h-5 w-12 rounded bg-muted/40 animate-pulse" />
          <div className="h-2.5 w-10 rounded bg-muted/30 animate-pulse" />
        </>
      ) : (
        <>
          <Icon className={cn("h-4 w-4 text-muted-foreground", color)} />
          <span className={cn("text-lg font-bold tabular-nums", color)}>
            {value}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
        </>
      )}
    </div>
  );
}
