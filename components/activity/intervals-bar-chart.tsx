"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityInterval } from "@/types/activity-detail";
import { Timer } from "lucide-react";
import { useState } from "react";

interface IntervalsBarChartProps {
  intervals: ActivityInterval[];
}

// Fonction pour calculer la couleur en fonction de l'allure
// Allure rapide (faible valeur) = bleu foncé
// Allure lente (valeur élevée) = bleu clair
function getPaceColor(pace: number, minPace: number, maxPace: number): string {
  // Normaliser entre 0 et 1 (0 = le plus rapide, 1 = le plus lent)
  const normalized = (pace - minPace) / (maxPace - minPace);

  // Inverser pour que rapide = foncé
  const reversed = 1 - normalized;

  // Gradient de bleu : du bleu clair (#BFDBFE - 191,219,254) au bleu foncé (#1E40AF - 30,64,175)
  const lightBlue = { r: 191, g: 219, b: 254 };
  const darkBlue = { r: 30, g: 64, b: 175 };

  const r = Math.round(lightBlue.r + (darkBlue.r - lightBlue.r) * reversed);
  const g = Math.round(lightBlue.g + (darkBlue.g - lightBlue.g) * reversed);
  const b = Math.round(lightBlue.b + (darkBlue.b - lightBlue.b) * reversed);

  return `rgb(${r}, ${g}, ${b})`;
}

export function IntervalsBarChart({ intervals }: IntervalsBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Trouver l'allure min et max pour le gradient et l'échelle
  const paces = intervals.map((i) => i.avgPace);
  const minPace = Math.min(...paces);
  const maxPace = Math.max(...paces);

  // Calculer la vitesse (km/h) depuis l'allure (min/km)
  const speeds = intervals.map((i) => 60 / i.avgPace);
  const maxSpeed = Math.max(...speeds);

  // Dimensions du graphique
  const width = 800;
  const height = 180;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculer la durée totale pour la largeur
  const totalDuration = intervals.reduce((sum, i) => sum + i.duration, 0);

  // Préparer les données pour le graphique avec espaces
  let cumulativeX = 0;
  const gap = 4; // Espace entre les barres
  const bars = intervals.map((interval, index) => {
    const speed = 60 / interval.avgPace; // km/h
    const durationMinutes = interval.duration / 60;

    // Largeur proportionnelle à la durée (moins les espaces)
    const totalGaps = (intervals.length - 1) * gap;
    const availableWidth = chartWidth - totalGaps;
    const barWidth = (interval.duration / totalDuration) * availableWidth;

    // Hauteur proportionnelle à la vitesse
    const barHeight = (speed / maxSpeed) * chartHeight;

    const x = cumulativeX;
    const y = chartHeight - barHeight;

    const color = getPaceColor(interval.avgPace, minPace, maxPace);

    cumulativeX += barWidth + gap;

    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      interval,
      color,
      speed,
      durationMinutes,
    };
  });

  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Intervalles de course
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative w-full">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto"
          >
            {/* Barres uniquement - design minimaliste */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {bars.map((bar, index) => (
                <rect
                  key={index}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={bar.color}
                  rx={8}
                  ry={8}
                  opacity={hoveredIndex === index ? 1 : 0.85}
                  className="transition-all cursor-pointer hover:opacity-100"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-background border rounded-lg p-3 shadow-lg text-xs space-y-1 pointer-events-none z-20 min-w-[200px]">
              <div className="font-semibold text-foreground">
                {bars[hoveredIndex].interval.name}
              </div>
              <div className="text-muted-foreground space-y-0.5">
                <div>
                  Durée : {Math.floor(bars[hoveredIndex].interval.duration / 60)}min{" "}
                  {bars[hoveredIndex].interval.duration % 60}s
                </div>
                <div>
                  Distance : {bars[hoveredIndex].interval.distance.toFixed(2)} km
                </div>
                <div>
                  Allure : {formatPace(bars[hoveredIndex].interval.avgPace)}/km
                </div>
                <div>
                  Vitesse : {bars[hoveredIndex].speed.toFixed(1)} km/h
                </div>
                <div>FC moy : {bars[hoveredIndex].interval.avgHeartRate} bpm</div>
                <div>FC max : {bars[hoveredIndex].interval.maxHeartRate} bpm</div>
              </div>
            </div>
          )}
        </div>

        {/* Légende minimaliste */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground px-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: getPaceColor(minPace, minPace, maxPace) }} />
            <span className="whitespace-nowrap">Rapide</span>
          </div>
          <div className="text-center flex-1 px-2">
            <div className="font-medium whitespace-nowrap text-[9px]">Largeur = Durée | Hauteur = Vitesse</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: getPaceColor(maxPace, minPace, maxPace) }} />
            <span className="whitespace-nowrap">Lent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
