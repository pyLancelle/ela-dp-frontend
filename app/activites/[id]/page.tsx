"use client";

import { use } from "react";
import { ActivityHeader } from "@/components/activity/activity-header";
import { IntervalsRecharts } from "@/components/activity/intervals-recharts";
import { ActivityKpisCard } from "@/components/activity/activity-kpis-card";
import { HeartRateZonesChart } from "@/components/activity/heart-rate-zones-chart";
import { ElevationProfileChart } from "@/components/activity/elevation-profile-chart";
import { HeartRateEvolutionCard } from "@/components/activity/heart-rate-evolution-card";
import { IntervalsListCard } from "@/components/activity/intervals-list-card";
import { ActivityTracksCard } from "@/components/activity/activity-tracks-card";
import { ActivityMapCard } from "@/components/activity/activity-map-card";
import { useActivityDetail } from "@/hooks/queries";

// ── Magic UI animated orbs background ───────────────────────────────────────
function AnimatedOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {/* Orb 1 – orange/red (running vibe) */}
      <div
        className="absolute rounded-full opacity-20 dark:opacity-10 blur-3xl"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, hsl(14 100% 57%), transparent 70%)",
          top: "-10%",
          left: "-5%",
          animation: "orb1 18s ease-in-out infinite alternate",
        }}
      />
      {/* Orb 2 – blue/purple */}
      <div
        className="absolute rounded-full opacity-15 dark:opacity-8 blur-3xl"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, hsl(217 91% 60%), transparent 70%)",
          top: "40%",
          right: "-8%",
          animation: "orb2 22s ease-in-out infinite alternate",
        }}
      />
      {/* Orb 3 – green */}
      <div
        className="absolute rounded-full opacity-10 dark:opacity-6 blur-3xl"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, hsl(142 71% 45%), transparent 70%)",
          bottom: "5%",
          left: "30%",
          animation: "orb3 26s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

// ── Loading skeleton with shimmer ────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <AnimatedOrbs />
      <div className="flex items-center justify-center h-64">
        <div className="liquid-glass-card rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
          {/* Spinner */}
          <div
            className="w-8 h-8 rounded-full border-2 border-white/20 border-t-orange-400"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-sm text-muted-foreground">Chargement de l'activité...</p>
        </div>
      </div>
    </div>
  );
}

export default function ActivityAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useActivityDetail(id);

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <AnimatedOrbs />
        <div className="liquid-glass-card rounded-2xl p-5 border border-red-500/30">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-400/40 to-transparent mb-4" />
          <h2 className="text-red-400 font-semibold mb-2">Erreur</h2>
          <p className="text-red-300 text-sm">
            {error instanceof Error ? error.message : "Failed to fetch activity"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <AnimatedOrbs />
        <div className="liquid-glass-card rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Activité introuvable</h1>
          <p className="text-muted-foreground">
            L'activité que vous recherchez n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  const { raw: bigQueryActivity, detail: activity } = data;

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-8rem)]">
      <AnimatedOrbs />

      {/* Header */}
      <div className="mb-8">
        <ActivityHeader
          title={activity.title}
          date={activity.date}
          type={activity.type}
        />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[200px]">
        {/* Intervalles - 2x1 */}
        <div className="h-[200px] md:h-auto md:col-span-2 md:col-start-2 md:row-start-1">
          <IntervalsRecharts intervals={activity.intervals} />
        </div>

        {/* Carte GPS - 1x1 */}
        <div className="h-[200px] md:h-auto md:col-span-3 md:col-start-4 md:row-start-1">
          <ActivityMapCard coordinates={activity.coordinates} location={activity.location} />
        </div>

        {/* KPIs - 1x2 */}
        <div className="md:col-span-1 md:row-span-2 md:col-start-1 md:row-start-1">
          <ActivityKpisCard summary={activity.summary} scores={activity.scores} />
        </div>

        {/* Zones Cardiaques - 1x1 */}
        <div className="h-[200px] md:h-auto md:col-span-2 md:col-start-2 md:row-start-2">
          <HeartRateZonesChart zones={activity.heartRateZones} />
        </div>

        {/* Évolution FC - 3x3 */}
        <div className="h-[200px] md:h-auto md:col-span-3 md:row-span-1 md:col-start-1 md:row-start-3">
          <HeartRateEvolutionCard
            timeSeries={activity.timeSeries}
            zones={activity.heartRateZones}
            avgHeartRate={activity.summary.avgHeartRate}
            maxHeartRate={activity.summary.maxHeartRate}
          />
        </div>

        {/* Liste Intervalles - 3x2 */}
        <div className="h-[400px] md:h-auto md:col-span-3 md:row-span-2 md:col-start-4 md:row-start-2">
          <IntervalsListCard
            kmLaps={bigQueryActivity?.kilometer_laps}
            intervals={activity.intervals}
            tracks={bigQueryActivity?.tracks_played}
          />
        </div>
      </div>
    </div>
  );
}
