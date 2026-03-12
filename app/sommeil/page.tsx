"use client";

import { useSleep } from "@/hooks/queries";
import { SleepStagesCard } from "@/components/magicui/sleep-stages-card";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BarChartCard } from "@/components/magicui/bar-chart-card";
import { MagicCard } from "@/components/magicui/magic-card";
import { Moon, BedDouble, Sunrise } from "lucide-react";

function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? `${m}` : ""}` : `${m}m`;
}

export default function SommeilPage() {
  const { data, isLoading } = useSleep();

  return (
    <div className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <BentoGrid>
        {/* Sleep Stages Timeline - 3x1 */}
        <BlurFade
          delay={0.05}
          className="h-[180px] md:h-auto md:col-span-3 md:col-start-1 md:row-start-1"
        >
          <MagicCard>
            <SleepStagesCard data={data?.sleepStages} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        {/* Sleep Score - 1x1 */}
        <BlurFade
          delay={0.1}
          className="h-[180px] md:h-auto md:col-span-1 md:col-start-4 md:row-start-1"
        >
          <MagicCard>
            <BarChartCard
              title="Score sommeil"
              kpi={data?.sleepScores?.average?.toString() ?? "—"}
              kpiValue={data?.sleepScores?.average}
              kpiLabel="/100"
              subtitle="7 derniers jours"
              color="#6366f1"
              loading={isLoading}
              data={
                data?.sleepScores?.daily?.map((d) => ({
                  label: d.day,
                  value: d.score,
                  formatted: d.score.toString(),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Body Battery - 1x1 */}
        <BlurFade
          delay={0.15}
          className="h-[180px] md:h-auto md:col-span-1 md:col-start-5 md:row-start-1"
        >
          <MagicCard>
            <BarChartCard
              title="Body Battery"
              kpi={
                data?.bodyBattery?.average
                  ? `+${data.bodyBattery.average}`
                  : "—"
              }
              kpiValue={data?.bodyBattery?.average}
              kpiLabel="delta moy"
              subtitle="7 derniers jours"
              color="#10b981"
              loading={isLoading}
              data={
                data?.bodyBattery?.daily?.map((d) => ({
                  label: d.day,
                  value: d.range[1],
                  range: d.range,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Stress nocturne - 1x1 */}
        <BlurFade
          delay={0.2}
          className="h-[180px] md:h-auto md:col-span-1 md:col-start-6 md:row-start-1"
        >
          <MagicCard>
            <BarChartCard
              title="Stress"
              kpi={data?.stress?.average?.toString() ?? "—"}
              kpiValue={data?.stress?.average}
              kpiLabel="/100"
              subtitle="7 derniers jours"
              color="#f59e0b"
              yMax={100}
              loading={isLoading}
              data={
                data?.stress?.daily?.map((d) => ({
                  label: d.day,
                  value: d.stress,
                  formatted: d.stress.toString(),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Durée de sommeil - 2x1 */}
        <BlurFade
          delay={0.25}
          className="h-[180px] md:h-auto md:col-span-2 md:col-start-1 md:row-start-2"
        >
          <MagicCard>
            <BarChartCard
              title="Durée de sommeil"
              kpi={
                data?.sleepDuration?.averageMinutes
                  ? fmt(data.sleepDuration.averageMinutes)
                  : "—"
              }
              kpiLabel="moy/nuit"
              subtitle="7 derniers jours"
              color="#818cf8"
              loading={isLoading}
              data={
                data?.sleepDuration?.daily?.map((d) => ({
                  label: d.day,
                  value: d.durationMinutes,
                  formatted: fmt(d.durationMinutes),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* HRV - 2x1 */}
        <BlurFade
          delay={0.3}
          className="h-[180px] md:h-auto md:col-span-2 md:col-start-3 md:row-start-2"
        >
          <MagicCard>
            <BarChartCard
              title="HRV"
              kpi={data?.hrv?.average?.toString() ?? "—"}
              kpiValue={data?.hrv?.average}
              kpiLabel="ms"
              subtitle="7 derniers jours"
              color="#8b5cf6"
              loading={isLoading}
              data={
                data?.hrv?.daily?.map((d) => ({
                  label: d.day,
                  value: d.hrv,
                  formatted: `${d.hrv}`,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* FC Repos - 2x1 */}
        <BlurFade
          delay={0.35}
          className="h-[180px] md:h-auto md:col-span-2 md:col-start-5 md:row-start-2"
        >
          <MagicCard>
            <BarChartCard
              title="FC Repos"
              kpi={data?.restingHr?.average?.toString() ?? "—"}
              kpiValue={data?.restingHr?.average}
              kpiLabel="bpm"
              subtitle="7 derniers jours"
              color="#ef4444"
              loading={isLoading}
              data={
                data?.restingHr?.daily?.map((d) => ({
                  label: d.day,
                  value: d.hr,
                  formatted: `${d.hr}`,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Horaires coucher/lever - 6x1 */}
        <BlurFade
          delay={0.4}
          className="md:col-span-6 md:col-start-1 md:row-start-3"
        >
          <MagicCard beamDuration={7}>
            <SleepScheduleCard
              data={data?.sleepDuration?.daily}
              loading={isLoading}
            />
          </MagicCard>
        </BlurFade>
      </BentoGrid>
    </div>
  );
}

// ── Card horaires coucher/lever ──────────────────────────────────────

interface ScheduleDay {
  day: string;
  bedtime: string;
  waketime: string;
  date: string;
}

function SleepScheduleCard({
  data,
  loading,
}: {
  data?: ScheduleDay[];
  loading: boolean;
}) {
  if (loading || !data?.length) {
    return (
      <div className="liquid-glass-card rounded-xl h-full flex flex-col p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-muted/40 animate-pulse" />
            <div className="h-2.5 w-24 rounded bg-muted/30 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-end gap-3 min-h-0">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-3/4 rounded bg-muted/30 animate-pulse"
                style={{ height: 48, animationDelay: `${i * 80}ms` }}
              />
              <div className="h-2.5 w-4 rounded bg-muted/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Parse times pour calculer les positions visuelles
  const parsed = data.map((d) => {
    const bed = parseTime(d.bedtime);
    const wake = parseTime(d.waketime);
    return { ...d, bedMinutes: bed, wakeMinutes: wake };
  });

  // Normalisation : le coucher peut être > 24h (ex: 23h = -1h du jour suivant)
  // On travaille en "minutes depuis minuit" avec coucher négatif si avant minuit
  const allBed = parsed.map((d) =>
    d.bedMinutes > 720 ? d.bedMinutes - 1440 : d.bedMinutes
  );
  const allWake = parsed.map((d) => d.wakeMinutes);

  const minTime = Math.min(...allBed) - 30;
  const maxTime = Math.max(...allWake) + 30;
  const range = maxTime - minTime;

  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-400" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Horaires de sommeil
            </p>
            <span className="text-[10px] text-muted-foreground">
              Coucher → Lever
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-stretch gap-2 min-h-0">
        {parsed.map((d, i) => {
          const bedNorm =
            d.bedMinutes > 720 ? d.bedMinutes - 1440 : d.bedMinutes;
          const bottomPct = ((bedNorm - minTime) / range) * 100;
          const topPct = ((d.wakeMinutes - minTime) / range) * 100;
          const heightPct = topPct - bottomPct;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
            >
              {/* Wake time label */}
              <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                <Sunrise className="h-2.5 w-2.5 text-amber-400" />
                {d.waketime}
              </span>

              {/* Bar */}
              <div className="flex-1 w-full relative min-h-[40px]">
                <div
                  className="absolute w-3/4 left-1/2 -translate-x-1/2 rounded-md"
                  style={{
                    bottom: `${bottomPct}%`,
                    height: `${heightPct}%`,
                    background:
                      "linear-gradient(to top, #6366f1cc, #818cf8cc)",
                    boxShadow: "0 0 8px rgba(99,102,241,0.2)",
                  }}
                />
              </div>

              {/* Bedtime label */}
              <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                <BedDouble className="h-2.5 w-2.5 text-indigo-400" />
                {d.bedtime}
              </span>

              {/* Day */}
              <span className="text-[10px] text-muted-foreground font-medium">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Parse "23:15" or "7:30" → minutes since midnight */
function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}
