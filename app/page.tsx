"use client";

import { useHomepage } from "@/hooks/queries";
import { SleepStagesCard } from "@/components/magicui/sleep-stages-card";
import { TopMusicCard } from "@/components/magicui/top-music-card";
import { RunningCard } from "@/components/magicui/running-card";
import { RacePredictionsCard } from "@/components/magicui/race-predictions-card";
import { Vo2maxCard } from "@/components/magicui/vo2max-card";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BarChartCard } from "@/components/magicui/bar-chart-card";

export default function Home() {
  const { data, isLoading } = useHomepage();

  return (
    <div className="px-6 py-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <BlurFade delay={0.0} duration={0.5}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            <AuroraText colors={["#1DB954", "#9c40ff", "#3b82f6", "#06b6d4"]} speed={0.8}>
              Welcome, Etienne !
            </AuroraText>
          </h1>
          <p className="text-muted-foreground">Overview</p>
        </div>
      </BlurFade>

      <BentoGrid>

        {/* Running Card - 2x2 */}
        <BlurFade delay={0.05} className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1">
          <RunningCard data={data?.running ?? null} />
        </BlurFade>

        {/* Top Artists/Tracks - 2x3, colonne droite */}
        <BlurFade delay={0.10} className="md:col-span-2 md:row-span-3 md:col-start-5 md:row-start-2">
          <TopMusicCard
            topArtists={data?.music?.topArtists}
            topTracks={data?.music?.topTracks}
            loading={isLoading}
          />
        </BlurFade>

        {/* Listening Time Chart - 2x1 */}
        <BlurFade delay={0.15} className="md:col-span-2 md:col-start-5 md:row-start-1">
          <BarChartCard
            title="Temps d'écoute"
            kpi={
              data?.music?.listeningTime?.averagePerDay
                ? typeof data.music.listeningTime.averagePerDay === "number"
                  ? (() => {
                      const h = Math.floor(data.music.listeningTime.averagePerDay as number / 60);
                      const m = Math.floor((data.music.listeningTime.averagePerDay as number) % 60);
                      return h > 0 ? `${h}h${m > 0 ? `${m}` : ""}` : `${m}m`;
                    })()
                  : String(data.music.listeningTime.averagePerDay)
                : "4h12"
            }
            kpiLabel="moy/jour"
            subtitle="10 derniers jours"
            color="#1DB954"
            data={
              data?.music?.listeningTime?.days?.map((d) => ({
                label: { Lun: "L", Mar: "M", Mer: "M", Jeu: "J", Ven: "V", Sam: "S", Dim: "D" }[d.day] ?? d.day.charAt(0),
                value: d.heightPercentage,
                formatted: d.formatted,
              })) ?? [
                { label: "L", value: 57, formatted: "2h50" },
                { label: "M", value: 75, formatted: "3h45" },
                { label: "M", value: 90, formatted: "4h30" },
                { label: "J", value: 45, formatted: "2h15" },
                { label: "V", value: 100, formatted: "5h00" },
                { label: "S", value: 67, formatted: "3h20" },
                { label: "D", value: 97, formatted: "4h50" },
                { label: "L", value: 63, formatted: "3h10" },
                { label: "M", value: 35, formatted: "1h45" },
                { label: "M", value: 82, formatted: "4h05" },
              ]
            }
          />
        </BlurFade>

        {/* Weekly Running Volume - 1x1 */}
        <BlurFade delay={0.20} className="md:col-span-1 md:col-start-3 md:row-start-3">
          <BarChartCard
            title="Volume hebdo"
            kpi={`${data?.weeklyVolume?.average?.toFixed(1) ?? "25"}`}
            kpiLabel="km moy"
            subtitle="10 dernières semaines"
            color="#3b82f6"
            data={
              data?.weeklyVolume?.weeks?.map((w) => ({
                label: w.week,
                value: w.volume,
                formatted: `${w.volume}`,
              })) ?? [
                { label: "S-9", value: 20, formatted: "20" },
                { label: "S-8", value: 25, formatted: "25" },
                { label: "S-7", value: 30, formatted: "30" },
                { label: "S-6", value: 22, formatted: "22" },
                { label: "S-5", value: 28, formatted: "28" },
                { label: "S-4", value: 35, formatted: "35" },
                { label: "S-3", value: 32, formatted: "32" },
                { label: "S-2", value: 38, formatted: "38" },
                { label: "S-1", value: 40, formatted: "40" },
                { label: "S0",  value: 42, formatted: "42" },
              ]
            }
          />
        </BlurFade>

        {/* Sleep Stages Chart - 2x1 */}
        <BlurFade delay={0.25} className="md:col-span-2 md:col-start-1 md:row-start-1">
          <SleepStagesCard data={data?.sleepStages} />
        </BlurFade>

        {/* Sleep Score - 1x1 */}
        <BlurFade delay={0.30} className="md:col-span-1 md:col-start-1 md:row-start-2">
          <BarChartCard
            title="Sommeil"
            kpi={data?.sleepBodyBattery?.sleepScores?.average?.toString() ?? "72"}
            kpiLabel="/100"
            subtitle="7 derniers jours"
            color="#6366f1"
            data={
              data?.sleepBodyBattery?.sleepScores?.daily?.map((d) => ({
                label: d.day,
                value: d.score,
                formatted: d.score.toString(),
              })) ?? [
                { label: "L", value: 55, formatted: "55" },
                { label: "M", value: 75, formatted: "75" },
                { label: "M", value: 38, formatted: "38" },
                { label: "J", value: 78, formatted: "78" },
                { label: "V", value: 69, formatted: "69" },
                { label: "S", value: 85, formatted: "85" },
                { label: "D", value: 88, formatted: "88" },
              ]
            }
          />
        </BlurFade>

        {/* Body Battery - 1x1 */}
        <BlurFade delay={0.35} className="md:col-span-1 md:col-start-2 md:row-start-2">
          <BarChartCard
            title="Body Battery"
            kpi={`+${data?.sleepBodyBattery?.bodyBattery?.average ?? 81}`}
            kpiLabel="delta moy"
            subtitle="7 derniers jours"
            color="#10b981"
            data={
              data?.sleepBodyBattery?.bodyBattery?.daily?.map((d) => ({
                label: d.day,
                value: d.range[1],
                range: d.range,
              })) ?? [
                { label: "L", value: 85, range: [15, 85] as [number, number] },
                { label: "M", value: 92, range: [20, 92] as [number, number] },
                { label: "M", value: 65, range: [10, 65] as [number, number] },
                { label: "J", value: 88, range: [25, 88] as [number, number] },
                { label: "V", value: 95, range: [18, 95] as [number, number] },
                { label: "S", value: 98, range: [30, 98] as [number, number] },
                { label: "D", value: 91, range: [10, 91] as [number, number] },
              ]
            }
          />
        </BlurFade>

        {/* HRV - 1x1 */}
        <BlurFade delay={0.40} className="md:col-span-1 md:col-start-1 md:row-start-3">
          <BarChartCard
            title="HRV"
            kpi={data?.sleepBodyBattery?.hrv?.average?.toString() ?? "58"}
            kpiLabel="ms"
            subtitle="7 derniers jours"
            color="#8b5cf6"
            data={
              data?.sleepBodyBattery?.hrv?.daily?.map((d) => ({
                label: d.day,
                value: d.hrv,
                formatted: `${d.hrv}`,
              })) ?? [
                { label: "L", value: 52, formatted: "52ms" },
                { label: "M", value: 48, formatted: "48ms" },
                { label: "M", value: 55, formatted: "55ms" },
                { label: "J", value: 61, formatted: "61ms" },
                { label: "V", value: 54, formatted: "54ms" },
                { label: "S", value: 50, formatted: "50ms" },
                { label: "D", value: 58, formatted: "58ms" },
              ]
            }
          />
        </BlurFade>

        {/* Resting HR - 1x1 */}
        <BlurFade delay={0.45} className="md:col-span-1 md:col-start-2 md:row-start-3">
          <BarChartCard
            title="FC Repos"
            kpi={data?.sleepBodyBattery?.restingHr?.average?.toString() ?? "52"}
            kpiLabel="bpm"
            subtitle="7 derniers jours"
            color="#ef4444"
            data={
              data?.sleepBodyBattery?.restingHr?.daily?.map((d) => ({
                label: d.day,
                value: d.hr,
                formatted: `${d.hr}`,
              })) ?? [
                { label: "L", value: 54, formatted: "54 bpm" },
                { label: "M", value: 51, formatted: "51 bpm" },
                { label: "M", value: 53, formatted: "53 bpm" },
                { label: "J", value: 50, formatted: "50 bpm" },
                { label: "V", value: 52, formatted: "52 bpm" },
                { label: "S", value: 55, formatted: "55 bpm" },
                { label: "D", value: 52, formatted: "52 bpm" },
              ]
            }
          />
        </BlurFade>

        {/* Stress - 1x1 */}
        <BlurFade delay={0.50} className="md:col-span-1 md:col-start-1 md:row-start-4">
          <BarChartCard
            title="Stress"
            kpi={data?.stress?.average?.toString() ?? "32"}
            kpiLabel="/100"
            subtitle="7 derniers jours"
            color="#f59e0b"
            data={
              data?.stress?.daily?.map((d) => ({
                label: d.day,
                value: d.stress,
                formatted: d.stress.toString(),
              })) ?? [
                { label: "L", value: 28, formatted: "28" },
                { label: "M", value: 45, formatted: "45" },
                { label: "M", value: 22, formatted: "22" },
                { label: "J", value: 38, formatted: "38" },
                { label: "V", value: 52, formatted: "52" },
                { label: "S", value: 18, formatted: "18" },
                { label: "D", value: 24, formatted: "24" },
              ]
            }
          />
        </BlurFade>

        {/* Steps BarChartCard - 1x1 */}
        <BlurFade delay={0.55} className="md:col-span-1 md:col-start-2 md:row-start-4">
          <BarChartCard
            title="Pas"
            kpi={
              data?.steps?.average
                ? data.steps.average >= 1000
                  ? `${(data.steps.average / 1000).toFixed(1)}K`
                  : data.steps.average.toString()
                : "9.2K"
            }
            kpiLabel="moy/jour"
            subtitle="7 derniers jours"
            color="#6366f1"
            data={
              data?.steps?.daily?.map((d) => ({
                label: d.day,
                value: d.steps,
                formatted: d.steps >= 1000
                  ? `${(d.steps / 1000).toFixed(1)}K`
                  : d.steps.toString(),
              })) ?? [
                { label: "L", value: 12543, formatted: "12.5K" },
                { label: "M", value: 8234, formatted: "8.2K" },
                { label: "M", value: 10456, formatted: "10.5K" }, 
                { label: "J", value: 7892, formatted: "7.9K" },
                { label: "V", value: 9123, formatted: "9.1K" },
                { label: "S", value: 11234, formatted: "11.2K" },
                { label: "D", value: 5156, formatted: "5.2K" },
              ]
            }
          />
        </BlurFade>

        {/* VO2 Max Trend - 1x1 */}
        <BlurFade delay={0.60} className="md:col-span-1 md:col-start-3 md:row-start-4">
          <Vo2maxCard
            data={data?.vo2maxTrend}
            loading={isLoading}
          />
        </BlurFade>

        {/* Race Predictions - 1x2 */}
        <BlurFade delay={0.65} className="md:col-span-1 md:col-start-4 md:row-span-2 md:row-start-3">
          <RacePredictionsCard
            predictions={data?.racePredictions?.predictions}
            loading={isLoading}
          />
        </BlurFade>


      </BentoGrid>
    </div>
  );
}
