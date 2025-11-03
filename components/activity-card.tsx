import { Activity, Clock, Gauge, Route } from "lucide-react";

export interface ActivityData {
  id: string;
  title: string;
  distance: number; // en km
  duration: number; // en minutes
  date: string;
  type: string;
}

interface ActivityCardProps {
  activity: ActivityData;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  // Calculer l'allure (min/km)
  const pace = activity.distance > 0 ? activity.duration / activity.distance : 0;
  const paceMin = Math.floor(pace);
  const paceSec = Math.round((pace - paceMin) * 60);

  // Formatter la durée
  const hours = Math.floor(activity.duration / 60);
  const minutes = activity.duration % 60;
  const durationFormatted = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`;

  return (
    <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{activity.title}</h3>
              <p className="text-sm text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Route className="h-4 w-4" />
              <span className="text-xs font-medium">Distance</span>
            </div>
            <p className="text-lg font-bold">{activity.distance.toFixed(1)} km</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Temps</span>
            </div>
            <p className="text-lg font-bold">{durationFormatted}</p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Gauge className="h-4 w-4" />
              <span className="text-xs font-medium">Allure</span>
            </div>
            <p className="text-lg font-bold">{paceMin}'{paceSec.toString().padStart(2, '0')}" /km</p>
          </div>
        </div>
      </div>
    </div>
  );
}
