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
import { useActivityDetail } from "@/hooks/queries";

export default function ActivityAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useActivityDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement de l'activité...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Erreur</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to fetch activity'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
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
      {/* Header */}
      <div className="mb-8">
        <ActivityHeader
          title={activity.title}
          date={activity.date}
          type={activity.type}
          location={activity.location}
        />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">
        {/* Carte Intervalles - 2x1 - Top left (cols 1-2, row 1) */}
        <div className="md:col-span-2 md:col-start-2 md:row-start-1">
          <IntervalsRecharts intervals={activity.intervals} />
        </div>

        {/* Carte KPIs - 1x2 - Top right (col 3, rows 1-2) */}
        <div className="md:col-span-1 md:row-span-2 md:col-start-1 md:row-start-1">
          <ActivityKpisCard summary={activity.summary} scores={activity.scores} />
        </div>

        {/* Carte Zones Cardiaques - 1x1 - Bottom left (col 1, row 2) */}
        <div className="md:col-span-1 md:col-start-2 md:row-start-2">
          <HeartRateZonesChart zones={activity.heartRateZones} />
        </div>

        {/* Carte Élévation - 1x1 - (col 2, row 2) */}
        <div className="md:col-span-1 md:col-start-3 md:row-start-2">
          <ElevationProfileChart
            timeSeries={activity.timeSeries}
            elevationGain={activity.summary.elevationGain}
            elevationLoss={activity.summary.elevationLoss}
          />
        </div>

        {/* Carte Évolution Fréquence Cardiaque - 3x2 - (cols 1-3, rows 4-5) */}
        <div className="md:col-span-3 md:row-span-3 md:col-start-1 md:row-start-3">
          <HeartRateEvolutionCard
            timeSeries={activity.timeSeries}
            zones={activity.heartRateZones}
            avgHeartRate={activity.summary.avgHeartRate}
            maxHeartRate={activity.summary.maxHeartRate}
          />
        </div>

        {/* Carte Liste des Intervalles - 3x2 - (cols 4-6, rows 4-5) */}
        <div className="md:col-span-3 md:row-span-2 md:col-start-4 md:row-start-1">
          <IntervalsListCard laps={activity.intervals.map((interval) => ({
            lapIndex: interval.id,
            startTimeGMT: '',
            distance: interval.distance * 1000,
            duration: interval.duration,
            averageSpeed: interval.avgPace > 0 ? 1000 / (interval.avgPace * 60) : 0,
            calories: 0,
            averageHR: interval.avgHeartRate,
            maxHR: interval.maxHeartRate,
            elevationGain: interval.elevationGain,
            elevationLoss: 0,
          }))} />
        </div>

        {/* Carte Titres écoutés - 3x1 - (cols 1-3, row 6) */}
        <div className="md:col-span-3 md:col-start-4 md:row-start-3 md:row-span-3">
          <ActivityTracksCard tracks={bigQueryActivity?.tracks_played || []} />
        </div>

      </div>
    </div>
  );
}
