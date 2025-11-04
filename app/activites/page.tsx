import { Activity, TrendingUp, Calendar, Clock } from "lucide-react";
import { ActivityCard, ActivityData } from "@/components/activity-card";

// Données d'exemple pour les activités
const activities: ActivityData[] = [
  {
    id: "1",
    title: "Course matinale",
    distance: 5.2,
    duration: 32,
    date: "Il y a 2 heures",
    type: "running",
  },
  {
    id: "2",
    title: "Sortie vélo",
    distance: 15.8,
    duration: 45,
    date: "Hier",
    type: "cycling",
  },
  {
    id: "3",
    title: "Natation",
    distance: 1.5,
    duration: 40,
    date: "Il y a 2 jours",
    type: "swimming",
  },
  {
    id: "4",
    title: "Course longue",
    distance: 10.5,
    duration: 68,
    date: "Il y a 3 jours",
    type: "running",
  },
  {
    id: "5",
    title: "Vélo de montagne",
    distance: 25.3,
    duration: 95,
    date: "Il y a 4 jours",
    type: "cycling",
  },
  {
    id: "6",
    title: "Footing du soir",
    distance: 7.2,
    duration: 42,
    date: "Il y a 5 jours",
    type: "running",
  },
];

export default function ActivitesPage() {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
