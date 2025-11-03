import { Activity, TrendingUp, Calendar, Clock } from "lucide-react";

export default function ActivitesPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
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

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Activités récentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Course à pied</p>
                  <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">5.2 km</p>
                <p className="text-sm text-muted-foreground">32 min</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Vélo</p>
                  <p className="text-sm text-muted-foreground">Hier</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">15.8 km</p>
                <p className="text-sm text-muted-foreground">45 min</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Natation</p>
                  <p className="text-sm text-muted-foreground">Il y a 2 jours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">1.5 km</p>
                <p className="text-sm text-muted-foreground">40 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
