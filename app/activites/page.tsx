"use client";

import { Activity, TrendingUp, Calendar, Clock, Loader2 } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { useActivitiesList } from "@/hooks/queries";

export default function ActivitesPage() {
  const { data: activities = [], isLoading, isError, error } = useActivitiesList();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et suivez vos activités sportives
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Activités
              </p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cette semaine
              </p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Temps total
              </p>
              <p className="text-2xl font-bold">12h</p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Progression
              </p>
              <p className="text-2xl font-bold">+15%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Mes activités</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Erreur: {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune activité trouvée
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
