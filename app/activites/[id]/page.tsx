"use client";

import { use } from "react";
import { mockActivities } from "@/lib/mock/activity-detail-mock";
import { ActivityHeader } from "@/components/activity/activity-header";
import { IntervalsRecharts } from "@/components/activity/intervals-recharts";
import { ActivityKpisCard } from "@/components/activity/activity-kpis-card";
import { HeartRateZonesChart } from "@/components/activity/heart-rate-zones-chart";
import { ElevationProfileChart } from "@/components/activity/elevation-profile-chart";
import { MapCard } from "@/components/activity/map-card";
import { ActivityNotesCard } from "@/components/activity/activity-notes-card";
import { HeartRateEvolutionCard } from "@/components/activity/heart-rate-evolution-card";
import { IntervalsListCard } from "@/components/activity/intervals-list-card";

// Exemple de tracé GPS (lon, lat converti en lat, lon pour Leaflet)
const exampleRoute: [number, number][] = [
  [48.82562189362943, 2.239961698651314],
  [48.825620636343956, 2.239933703094721],
  [48.825620636343956, 2.239933703094721],
  [48.82559046149254, 2.239898666739464],
  [48.825569339096546, 2.239871509373188],
  [48.82554469630122, 2.239846782758832],
  [48.82552457973361, 2.2398136742413044],
  [48.82550588808954, 2.2397809009999037],
  [48.82550010457635, 2.2397497203201056],
  [48.82549524307251, 2.2397158574312925],
];

export default function ActivityAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const activity = mockActivities[id];

  if (!activity) {
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

        {/* Carte Map - 3x2 - Right side (cols 4-6, rows 1-2) */}
        <MapCard title="Tracé de l'activité" route={exampleRoute} />

        {/* Carte Évolution Fréquence Cardiaque - 3x2 - (cols 1-3, rows 3-4) */}
        <div className="md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-4">
          <HeartRateEvolutionCard
            timeSeries={activity.timeSeries}
            zones={activity.heartRateZones}
            avgHeartRate={activity.summary.avgHeartRate}
            maxHeartRate={activity.summary.maxHeartRate}
          />
        </div>

        {/* Carte Liste des Intervalles - 3x2 - (cols 4-6, rows 3-4) */}
        <div className="md:col-span-3 md:row-span-2 md:col-start-4 md:row-start-4">
          <IntervalsListCard intervals={activity.intervals} />
        </div>

        {/* Carte Texte - 6x1 - Bottom (cols 1-6, row 5) */}
        {activity.notes && (
          <div className="md:col-span-6 md:col-start-1 md:row-start-3">
            <ActivityNotesCard notes={activity.notes} />
          </div>
        )}
      </div>
    </div>
  );
}
