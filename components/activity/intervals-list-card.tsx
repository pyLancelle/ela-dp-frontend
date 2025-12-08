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
  warmup: "text-blue-500",
  work: "text-orange-500",
  recovery: "text-green-500",
  cooldown: "text-purple-500",
  rest: "text-gray-500",
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
       <CardContent className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">N°</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Distance</TableHead>
                <TableHead className="text-right">Temps</TableHead>
                <TableHead className="text-right">Allure moy</TableHead>
                <TableHead className="text-right">BPM moy</TableHead>
                <TableHead className="text-right">D+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intervals.map((interval, index) => (
                <TableRow key={interval.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${intervalTypeColors[interval.type]}`}>
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
                    {interval.elevationGain} m
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
