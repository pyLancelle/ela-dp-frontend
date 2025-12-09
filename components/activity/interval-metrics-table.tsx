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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Métriques par intervalle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Distance</TableHead>
                <TableHead className="text-right">Temps</TableHead>
                <TableHead className="text-right">Allure</TableHead>
                <TableHead className="text-right">FC Moy</TableHead>
                <TableHead className="text-right">FC Max</TableHead>
                <TableHead className="text-center">Zone</TableHead>
                <TableHead className="text-right">D+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intervals.map((interval, index) => (
                <TableRow key={interval.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{interval.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        intervalTypeColors[interval.type]
                      }`}
                    >
                      {intervalTypeLabels[interval.type]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {interval.distance.toFixed(2)} km
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDuration(interval.duration)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPace(interval.avgPace)}/km
                  </TableCell>
                  <TableCell className="text-right">
                    {interval.avgHeartRate} bpm
                  </TableCell>
                  <TableCell className="text-right">
                    {interval.maxHeartRate} bpm
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                      Z{interval.dominantZone}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{interval.elevationGain} m</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
