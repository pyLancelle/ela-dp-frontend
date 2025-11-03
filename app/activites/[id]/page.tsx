"use client";

import { use } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Activity,
  Clock,
  Gauge,
  Route,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";

// Données d'exemple pour les activités (à remplacer par des données réelles)
const activitiesData: Record<
  string,
  {
    id: string;
    title: string;
    distance: number;
    duration: number;
    date: string;
    type: string;
    heartRate?: { avg: number; max: number };
    elevation?: number;
    calories?: number;
    location?: string;
  }
> = {
  "1": {
    id: "1",
    title: "Course matinale",
    distance: 5.2,
    duration: 32,
    date: "Il y a 2 heures",
    type: "running",
    heartRate: { avg: 145, max: 165 },
    elevation: 85,
    calories: 320,
    location: "Paris, France",
  },
  "2": {
    id: "2",
    title: "Sortie vélo",
    distance: 15.8,
    duration: 45,
    date: "Hier",
    type: "cycling",
    heartRate: { avg: 132, max: 158 },
    elevation: 245,
    calories: 580,
    location: "Bois de Vincennes",
  },
  "3": {
    id: "3",
    title: "Natation",
    distance: 1.5,
    duration: 40,
    date: "Il y a 2 jours",
    type: "swimming",
    heartRate: { avg: 128, max: 145 },
    calories: 290,
    location: "Piscine municipale",
  },
  "4": {
    id: "4",
    title: "Course longue",
    distance: 10.5,
    duration: 68,
    date: "Il y a 3 jours",
    type: "running",
    heartRate: { avg: 152, max: 172 },
    elevation: 156,
    calories: 650,
    location: "Parc de Sceaux",
  },
  "5": {
    id: "5",
    title: "Vélo de montagne",
    distance: 25.3,
    duration: 95,
    date: "Il y a 4 jours",
    type: "cycling",
    heartRate: { avg: 142, max: 168 },
    elevation: 512,
    calories: 890,
    location: "Forêt de Fontainebleau",
  },
  "6": {
    id: "6",
    title: "Footing du soir",
    distance: 7.2,
    duration: 42,
    date: "Il y a 5 jours",
    type: "running",
    heartRate: { avg: 138, max: 155 },
    elevation: 92,
    calories: 425,
    location: "Bords de Seine",
  },
};

export default function ActivityAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const activity = activitiesData[id];

  if (!activity) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumb
          items={[
            { label: "Activités", href: "/activites" },
            { label: "Activité introuvable" },
          ]}
        />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Activité introuvable</h1>
          <p className="text-muted-foreground">
            L'activité que vous recherchez n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  // Calculer l'allure (min/km)
  const pace =
    activity.distance > 0 ? activity.duration / activity.distance : 0;
  const paceMin = Math.floor(pace);
  const paceSec = Math.round((pace - paceMin) * 60);

  // Formatter la durée
  const hours = Math.floor(activity.duration / 60);
  const minutes = activity.duration % 60;
  const durationFormatted =
    hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

  // Calculer la vitesse moyenne
  const avgSpeed = activity.duration > 0
    ? (activity.distance / (activity.duration / 60)).toFixed(1)
    : "0";

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumb
        items={[
          { label: "Activités", href: "/activites" },
          { label: activity.title },
        ]}
      />

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activity.title}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground">{activity.date}</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Route className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Distance totale
            </p>
          </div>
          <p className="text-3xl font-bold">{activity.distance.toFixed(1)} km</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Durée
            </p>
          </div>
          <p className="text-3xl font-bold">{durationFormatted}</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Gauge className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Allure moyenne</p>
          </div>
          <p className="text-3xl font-bold">
            {paceMin}'{paceSec.toString().padStart(2, "0")}" /km
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Vitesse moyenne
            </p>
          </div>
          <p className="text-3xl font-bold">{avgSpeed} km/h</p>
        </div>
      </div>

      {/* Statistiques secondaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activity.heartRate && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-muted-foreground">
                Fréquence cardiaque
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Moyenne</span>
                <span className="text-lg font-bold">
                  {activity.heartRate.avg} bpm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Maximum</span>
                <span className="text-lg font-bold">
                  {activity.heartRate.max} bpm
                </span>
              </div>
            </div>
          </div>
        )}

        {activity.elevation !== undefined && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Dénivelé positif
              </p>
            </div>
            <p className="text-3xl font-bold">{activity.elevation} m</p>
          </div>
        )}

        {activity.calories !== undefined && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Calories brûlées
              </p>
            </div>
            <p className="text-3xl font-bold">{activity.calories} kcal</p>
          </div>
        )}

        {activity.location && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Localisation
              </p>
            </div>
            <p className="text-lg font-semibold">{activity.location}</p>
          </div>
        )}
      </div>

      {/* Section d'analyse détaillée */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Analyse de l'activité</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Cette activité de type <strong>{activity.type}</strong> a été
            réalisée {activity.date.toLowerCase()}. Vous avez parcouru{" "}
            <strong>{activity.distance.toFixed(1)} km</strong> en{" "}
            <strong>{durationFormatted}</strong>.
          </p>
          {activity.heartRate && (
            <p>
              Votre fréquence cardiaque moyenne était de{" "}
              <strong>{activity.heartRate.avg} bpm</strong>, avec un pic à{" "}
              <strong>{activity.heartRate.max} bpm</strong>.
            </p>
          )}
          {activity.elevation !== undefined && (
            <p>
              Vous avez gravi un dénivelé positif de{" "}
              <strong>{activity.elevation} m</strong> au cours de cette session.
            </p>
          )}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm">
              <strong>Conseil:</strong> Pour améliorer vos performances,
              essayez de maintenir une allure régulière tout au long de votre
              activité et surveillez votre fréquence cardiaque pour rester dans
              votre zone d'entraînement optimale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
