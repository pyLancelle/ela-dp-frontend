import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KilometerLap } from "@/types/activity";
import { metersToKm, formatDuration, formatPace, msToPaceMinPerKm } from "@/types/activity";
import { Activity } from "lucide-react";

interface IntervalsListCardProps {
  laps?: KilometerLap[] | null;
}

export function IntervalsListCard({ laps }: IntervalsListCardProps) {
  const lapsList = laps || [];

  if (lapsList.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Splits au kilomètre
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Aucun split disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Splits au kilomètre
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Km</TableHead>
                <TableHead className="text-right">Distance</TableHead>
                <TableHead className="text-right">Temps</TableHead>
                <TableHead className="text-right">Allure moy</TableHead>
                <TableHead className="text-right">BPM moy</TableHead>
                <TableHead className="text-right">BPM max</TableHead>
                <TableHead className="text-right">D+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lapsList.map((lap) => {
                const pace = msToPaceMinPerKm(lap.averageSpeed);

                return (
                  <TableRow key={lap.lapIndex}>
                    <TableCell className="font-medium">{lap.lapIndex}</TableCell>
                    <TableCell className="text-right">
                      {metersToKm(lap.distance).toFixed(2)} km
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDuration(lap.duration)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPace(pace)}/km
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round(lap.averageHR)} bpm
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round(lap.maxHR)} bpm
                    </TableCell>
                    <TableCell className="text-right">
                      {lap.elevationGain} m
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
