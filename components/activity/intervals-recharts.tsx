"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityInterval } from "@/types/activity-detail";
import { Timer } from "lucide-react";
import { useState } from "react";

interface IntervalsRechartsProps {
  intervals: ActivityInterval[];
}

// Fonction pour calculer la couleur en fonction de l'allure
function getPaceColor(pace: number, minPace: number, maxPace: number): string {
  const normalized = (pace - minPace) / (maxPace - minPace);
  const reversed = 1 - normalized;

  const lightBlue = { r: 191, g: 219, b: 254 };
  const darkBlue = { r: 30, g: 64, b: 175 };

  const r = Math.round(lightBlue.r + (darkBlue.r - lightBlue.r) * reversed);
  const g = Math.round(lightBlue.g + (darkBlue.g - lightBlue.g) * reversed);
  const b = Math.round(lightBlue.b + (darkBlue.b - lightBlue.b) * reversed);

  return `rgb(${r}, ${g}, ${b})`;
}

export function IntervalsRecharts({ intervals }: IntervalsRechartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculer les données pour le graphique
  const paces = intervals.map((i) => i.avgPace);
  const minPace = Math.min(...paces);
  const maxPace = Math.max(...paces);

  // Calculer la vitesse (km/h) depuis l'allure (min/km)
  const speeds = intervals.map((i) => 60 / i.avgPace);
  const maxSpeed = Math.max(...speeds);

  // Calculer la durée totale pour les pourcentages de largeur
  const totalDuration = intervals.reduce((sum, i) => sum + i.duration, 0);

  // Préparer les données avec les pourcentages
  const intervalData = intervals.map((interval) => {
    const speed = 60 / interval.avgPace; // km/h
    const widthPercent = (interval.duration / totalDuration) * 100;
    const heightPercent = (speed / maxSpeed) * 100;

    return {
      interval,
      widthPercent,
      heightPercent,
      speed,
      color: getPaceColor(interval.avgPace, minPace, maxPace),
    };
  });

  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}min`;
  };

  // Générer des graduations toutes les 10 minutes
  const generateTimeMarks = () => {
    const marks = [];
    const totalSeconds = totalDuration;
    const intervalStep = 10 * 60; // 10 minutes en secondes

    for (let time = 0; time <= totalSeconds; time += intervalStep) {
      const positionPercent = (time / totalSeconds) * 100;
      marks.push({
        time,
        position: positionPercent,
      });
    }

    return marks;
  };

  const timeMarks = generateTimeMarks();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Intervalles
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Graphique des intervalles */}
        <div className="relative bg-background rounded-lg p-2 min-h-[120px]">
          {/* Barres d'intervalles */}
          <div className="absolute left-2 right-2 top-2 bottom-6 flex gap-[2px] items-end">
            {intervalData.map((data, index) => (
              <div
                key={index}
                className="relative cursor-pointer transition-opacity hover:opacity-100"
                style={{
                  width: `${data.widthPercent}%`,
                  height: "100%",
                  opacity: hoveredIndex === index ? 1 : 0.85,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md"
                  style={{
                    backgroundColor: data.color,
                    height: `${data.heightPercent}%`,
                  }}
                  title={`${data.interval.name}: ${formatPace(
                    data.interval.avgPace
                  )}/km`}
                />
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-background border rounded-lg p-3 shadow-lg text-xs space-y-1 pointer-events-none z-20 min-w-[200px]">
              <div className="font-semibold text-foreground">
                {intervalData[hoveredIndex].interval.name}
              </div>
              <div className="text-muted-foreground space-y-0.5">
                <div>
                  Durée :{" "}
                  {Math.floor(intervalData[hoveredIndex].interval.duration / 60)}
                  min {intervalData[hoveredIndex].interval.duration % 60}s
                </div>
                <div>
                  Distance :{" "}
                  {intervalData[hoveredIndex].interval.distance.toFixed(2)} km
                </div>
                <div>
                  Allure :{" "}
                  {formatPace(intervalData[hoveredIndex].interval.avgPace)}/km
                </div>
                <div>
                  Vitesse : {intervalData[hoveredIndex].speed.toFixed(1)} km/h
                </div>
                <div>
                  FC moy : {Math.round(intervalData[hoveredIndex].interval.avgHeartRate)} bpm
                </div>
                <div>
                  FC max : {Math.round(intervalData[hoveredIndex].interval.maxHeartRate)} bpm
                </div>
              </div>
            </div>
          )}

          {/* Labels de temps sur l'axe X - Graduation toutes les 10 minutes */}
          <div className="absolute left-2 right-2 bottom-0 h-6 flex items-center">
            {timeMarks.map((mark, index) => (
              <div
                key={index}
                className="absolute"
                style={{ left: `${mark.position}%`, transform: 'translateX(-50%)' }}
              >
                <span className="text-[9px] text-muted-foreground font-medium">
                  {formatTime(mark.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
