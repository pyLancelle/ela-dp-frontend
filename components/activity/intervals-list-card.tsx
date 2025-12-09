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
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Splits au kilomètre
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="relative overflow-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[50px] pl-4 pr-2 py-2 bg-background">Km</TableHead>
                <TableHead className="text-right p-2 w-[90px] bg-background">Distance</TableHead>
                <TableHead className="text-right p-2 w-[80px] bg-background">Temps</TableHead>
                <TableHead className="text-right p-2 w-[100px] bg-background">Allure moy</TableHead>
                <TableHead className="text-right p-2 w-[80px] bg-background">BPM moy</TableHead>
                <TableHead className="text-right p-2 w-[80px] bg-background">BPM max</TableHead>
                <TableHead className="text-right pl-2 pr-4 py-2 w-[60px] bg-background">D+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lapsList.map((lap) => {
                const pace = msToPaceMinPerKm(lap.averageSpeed);

                return (
                  <TableRow key={lap.lapIndex} className="hover:bg-muted/50">
                    <TableCell className="font-bold pl-4 pr-2 py-2 text-sm">{lap.lapIndex}</TableCell>
                    <TableCell className="text-right p-2 text-sm">
                      {metersToKm(lap.distance).toFixed(2)} km
                    </TableCell>
                    <TableCell className="text-right p-2 text-sm font-medium">
                      {formatDuration(lap.duration)}
                    </TableCell>
                    <TableCell className="text-right p-2 text-sm">
                      {formatPace(pace)}/km
                    </TableCell>
                    <TableCell className="text-right p-2 text-sm">
                      {Math.round(lap.averageHR)} bpm
                    </TableCell>
                    <TableCell className="text-right p-2 text-sm">
                      {Math.round(lap.maxHR)} bpm
                    </TableCell>
                    <TableCell className="text-right pl-2 pr-4 py-2 text-sm font-medium">{lap.elevationGain} m</TableCell>
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
