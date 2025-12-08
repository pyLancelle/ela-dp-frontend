import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityInterval, IntervalType } from "@/types/activity-detail";
import { Activity } from "lucide-react";

interface IntervalsListCardProps {
  intervals: ActivityInterval[];
}

const intervalTypeLabels: Record<IntervalType, string> = {
  warmup: "Échauffement",
  work: "Effort",
  recovery: "Récupération",
  cooldown: "Retour calme",
  rest: "Repos",
};

const intervalTypeColors: Record<IntervalType, string> = {
  warmup: "bg-blue-500/20 border-blue-500/50",
  work: "bg-orange-500/20 border-orange-500/50",
  recovery: "bg-green-500/20 border-green-500/50",
  cooldown: "bg-purple-500/20 border-purple-500/50",
  rest: "bg-gray-500/20 border-gray-500/50",
};

export function IntervalsListCard({ intervals }: IntervalsListCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Intervalles
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {intervals.map((interval, index) => (
              <div
                key={interval.id}
                className={`border rounded-lg p-3 ${intervalTypeColors[interval.type]}`}
              >
                {/* Header avec numéro et nom */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm">
                      {interval.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {intervalTypeLabels[interval.type]}
                  </span>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Distance</div>
                    <div className="font-semibold">{interval.distance.toFixed(2)} km</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Temps</div>
                    <div className="font-semibold">{formatDuration(interval.duration)}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Allure moy</div>
                    <div className="font-semibold">{formatPace(interval.avgPace)}/km</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">FC moy</div>
                    <div className="font-semibold">{interval.avgHeartRate} bpm</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">FC max</div>
                    <div className="font-semibold">{interval.maxHeartRate} bpm</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">D+</div>
                    <div className="font-semibold">{interval.elevationGain} m</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
