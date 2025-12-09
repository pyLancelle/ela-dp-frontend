import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActivityInterval, IntervalType } from "@/types/activity-detail";
import { BarChart3 } from "lucide-react";

interface IntervalMetricsTableProps {
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
  warmup: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  work: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  recovery: "bg-green-500/10 text-green-700 dark:text-green-400",
  cooldown: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  rest: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

export function IntervalMetricsTable({ intervals }: IntervalMetricsTableProps) {
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
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Splits au kilomètre
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="overflow-x-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] p-2">Km</TableHead>
                <TableHead className="p-2 min-w-[100px]">Temps</TableHead>
                <TableHead className="text-right p-2 min-w-[100px]">Allure</TableHead>
                <TableHead className="text-right p-2 w-[80px]">FC moy</TableHead>
                <TableHead className="text-right p-2 w-[70px]">D+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intervals.map((interval, index) => (
                <TableRow key={interval.id} className="hover:bg-muted/50">
                  <TableCell className="font-bold p-2 text-sm">{index + 1}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-sm font-medium">
                        {formatDuration(interval.duration)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {interval.distance.toFixed(2)} km
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <div className="flex flex-col gap-0.5 items-end">
                      <div className="text-sm font-medium">
                        {formatPace(interval.avgPace)}/km
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Zone {interval.dominantZone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <div className="flex flex-col gap-0.5 items-end">
                      <div className="text-sm font-medium">{interval.avgHeartRate}</div>
                      <div className="text-xs text-muted-foreground">{interval.maxHeartRate} max</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right p-2 text-sm font-medium">{interval.elevationGain} m</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
