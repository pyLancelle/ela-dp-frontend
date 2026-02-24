"use client";

import { useHomepage } from "@/hooks/queries";
import { SleepStagesCard } from "@/components/magicui/sleep-stages-card";
import { TopMusicCard } from "@/components/magicui/top-music-card";
import { RunningCard } from "@/components/magicui/running-card";
import { RacePredictionsCard } from "@/components/magicui/race-predictions-card";
import { Vo2maxCard } from "@/components/magicui/vo2max-card";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BarChartCard } from "@/components/magicui/bar-chart-card";
import { MagicCard } from "@/components/magicui/magic-card";

const DAY_FR_TO_EN: Record<string, string> = {
  L: "M", M: "T", Me: "W", J: "T", V: "F", S: "S", D: "S",
};
const dayEn = (d: string) => DAY_FR_TO_EN[d] ?? d;

export default function Home() {
  const { data, isLoading } = useHomepage();

  return (
    <div className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <BentoGrid>

        {/* Running Card - 2x2 */}
        <BlurFade delay={0.05} className="h-[340px] md:h-auto md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1">
          <MagicCard>
            <RunningCard data={data?.running ?? null} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        {/* Top Artists/Tracks - 2x3, colonne droite */}
        <BlurFade delay={0.10} className="md:col-span-2 md:row-span-3 md:col-start-5 md:row-start-2">
          <MagicCard beamDuration={7}>
            <TopMusicCard
              topArtists={data?.music?.topArtists}
              topTracks={data?.music?.topTracks}
              loading={isLoading}
            />
          </MagicCard>
        </BlurFade>

        {/* Listening Time Chart - 2x1 */}
        <BlurFade delay={0.15} className="h-[180px] md:h-auto md:col-span-2 md:col-start-5 md:row-start-1">
          <MagicCard>
            <BarChartCard
              title="Temps d'écoute"
              kpi={data?.music?.listeningTime?.averagePerDay ?? "—"}
              kpiLabel="moy/jour"
              subtitle="10 derniers jours"
              color="#1DB954"
              loading={isLoading}
              data={
                data?.music?.listeningTime?.days?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.heightPercentage,
                  formatted: d.formatted,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Weekly Running Volume - 1x1 */}
        <BlurFade delay={0.20} className="h-[180px] md:h-auto md:col-span-1 md:col-start-3 md:row-start-3">
          <MagicCard>
            <BarChartCard
              title="Volume hebdo"
              kpi={data?.weeklyVolume?.average?.toFixed(1) ?? "—"}
              kpiValue={data?.weeklyVolume?.average}
              kpiDecimals={1}
              kpiLabel="km moy"
              subtitle="10 dernières semaines"
              color="#3b82f6"
              loading={isLoading}
              data={
                data?.weeklyVolume?.weeks?.map((w) => ({
                  label: w.week,
                  value: w.volume,
                  formatted: `${w.volume}`,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Sleep Stages Chart - 2x1 */}
        <BlurFade delay={0.25} className="h-[180px] md:h-auto md:col-span-2 md:col-start-1 md:row-start-1">
          <MagicCard>
            <SleepStagesCard data={data?.sleepStages} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        {/* Sleep Score - 1x1 */}
        <BlurFade delay={0.30} className="h-[180px] md:h-auto md:col-span-1 md:col-start-1 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="Sommeil"
              kpi={data?.sleepBodyBattery?.sleepScores?.average?.toString() ?? "—"}
              kpiValue={data?.sleepBodyBattery?.sleepScores?.average}
              kpiLabel="/100"
              subtitle="7 derniers jours"
              color="#6366f1"
              loading={isLoading}
              data={
                data?.sleepBodyBattery?.sleepScores?.daily?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.score,
                  formatted: d.score.toString(),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Body Battery - 1x1 */}
        <BlurFade delay={0.35} className="h-[180px] md:h-auto md:col-span-1 md:col-start-2 md:row-start-2">
          <MagicCard>
            <BarChartCard
              title="Body Battery"
              kpi={data?.sleepBodyBattery?.bodyBattery?.average ? `+${data.sleepBodyBattery.bodyBattery.average}` : "—"}
              kpiValue={data?.sleepBodyBattery?.bodyBattery?.average}
              kpiLabel="delta moy"
              subtitle="7 derniers jours"
              color="#10b981"
              loading={isLoading}
              data={
                data?.sleepBodyBattery?.bodyBattery?.daily?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.range[1],
                  range: d.range,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* HRV - 1x1 */}
        <BlurFade delay={0.40} className="h-[180px] md:h-auto md:col-span-1 md:col-start-1 md:row-start-3">
          <MagicCard>
            <BarChartCard
              title="HRV"
              kpi={data?.sleepBodyBattery?.hrv?.average?.toString() ?? "—"}
              kpiValue={data?.sleepBodyBattery?.hrv?.average}
              kpiLabel="ms"
              subtitle="7 derniers jours"
              color="#8b5cf6"
              loading={isLoading}
              data={
                data?.sleepBodyBattery?.hrv?.daily?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.hrv,
                  formatted: `${d.hrv}`,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Resting HR - 1x1 */}
        <BlurFade delay={0.45} className="h-[180px] md:h-auto md:col-span-1 md:col-start-2 md:row-start-3">
          <MagicCard>
            <BarChartCard
              title="FC Repos"
              kpi={data?.sleepBodyBattery?.restingHr?.average?.toString() ?? "—"}
              kpiValue={data?.sleepBodyBattery?.restingHr?.average}
              kpiLabel="bpm"
              subtitle="7 derniers jours"
              color="#ef4444"
              loading={isLoading}
              data={
                data?.sleepBodyBattery?.restingHr?.daily?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.hr,
                  formatted: `${d.hr}`,
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Stress - 1x1 */}
        <BlurFade delay={0.50} className="h-[180px] md:h-auto md:col-span-1 md:col-start-1 md:row-start-4">
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
                  label: dayEn(d.day),
                  value: d.stress,
                  formatted: d.stress.toString(),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* Steps - 1x1 */}
        <BlurFade delay={0.55} className="h-[180px] md:h-auto md:col-span-1 md:col-start-2 md:row-start-4">
          <MagicCard>
            <BarChartCard
              title="Pas"
              kpi={
                data?.steps?.average
                  ? data.steps.average >= 1000
                    ? `${(data.steps.average / 1000).toFixed(1)}K`
                    : data.steps.average.toString()
                  : "—"
              }
              kpiValue={data?.steps?.average ? data.steps.average / 1000 : undefined}
              kpiDecimals={1}
              kpiLabel="K moy/jour"
              subtitle="7 derniers jours"
              color="#6366f1"
              loading={isLoading}
              data={
                data?.steps?.daily?.map((d) => ({
                  label: dayEn(d.day),
                  value: d.steps,
                  formatted: d.steps >= 1000
                    ? `${(d.steps / 1000).toFixed(1)}K`
                    : d.steps.toString(),
                })) ?? []
              }
            />
          </MagicCard>
        </BlurFade>

        {/* VO2 Max Trend - 1x1 */}
        <BlurFade delay={0.60} className="h-[180px] md:h-auto md:col-span-1 md:col-start-3 md:row-start-4">
          <MagicCard>
            <Vo2maxCard data={data?.vo2maxTrend} loading={isLoading} />
          </MagicCard>
        </BlurFade>

        {/* Race Predictions - 1x2 */}
        <BlurFade delay={0.65} className="h-[320px] md:h-auto md:col-span-1 md:col-start-4 md:row-span-2 md:row-start-3">
          <MagicCard beamDuration={7}>
            <RacePredictionsCard
              predictions={data?.racePredictions?.predictions}
              loading={isLoading}
            />
          </MagicCard>
        </BlurFade>

      </BentoGrid>
    </div>
  );
}
