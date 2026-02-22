"use client";

import { Activity, Timer, Route, Heart, TrendingUp, Mountain } from "lucide-react";
import type { ActivitySummary, PerformanceScores } from "@/types/activity-detail";

interface ActivityKpisCardProps {
  summary: ActivitySummary;
  scores: PerformanceScores;
}

export function ActivityKpisCard({ summary, scores }: ActivityKpisCardProps) {
  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const kpis = [
    {
      icon: Route,
      label: "Distance",
      value: summary.distance.toFixed(2),
      unit: "km",
      color: "text-blue-500",
      glow: "rgba(59,130,246,0.15)",
    },
    {
      icon: Timer,
      label: "Temps",
      value: formatDuration(summary.duration),
      unit: "",
      color: "text-purple-500",
      glow: "rgba(168,85,247,0.15)",
    },
    {
      icon: Activity,
      label: "Allure moy",
      value: formatPace(summary.avgPace),
      unit: "/km",
      color: "text-green-500",
      glow: "rgba(34,197,94,0.15)",
    },
    {
      icon: Mountain,
      label: "Dénivelé +",
      value: summary.elevationGain.toString(),
      unit: "m",
      color: "text-amber-600",
      glow: "rgba(217,119,6,0.15)",
    },
    {
      icon: Heart,
      label: "FC moyenne",
      value: Math.round(summary.avgHeartRate).toString(),
      unit: "bpm",
      color: "text-red-500",
      glow: "rgba(239,68,68,0.15)",
    },
    {
      icon: Heart,
      label: "FC max",
      value: Math.round(summary.maxHeartRate).toString(),
      unit: "bpm",
      color: "text-orange-500",
      glow: "rgba(249,115,22,0.15)",
    },
    {
      icon: TrendingUp,
      label: "Aérobie",
      value: scores.aerobicScore.toFixed(1),
      unit: "",
      color: "text-cyan-500",
      glow: "rgba(6,182,212,0.15)",
    },
    {
      icon: TrendingUp,
      label: "Anaérobie",
      value: scores.anaerobicScore.toFixed(1),
      unit: "",
      color: "text-pink-500",
      glow: "rgba(236,72,153,0.15)",
    },
  ];

  return (
    <div className="liquid-glass-card rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Shimmer top bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 grid-rows-4 gap-x-3 gap-y-4 h-full">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="flex flex-col gap-0.5 group"
              >
                <div className="flex items-center gap-1">
                  <Icon
                    className={`h-3 w-3 ${kpi.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
                    {kpi.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-lg font-bold transition-all"
                    style={{ textShadow: `0 0 12px ${kpi.glow}` }}
                  >
                    {kpi.value}
                  </span>
                  {kpi.unit && (
                    <span className="text-[10px] text-muted-foreground">
                      {kpi.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shimmer bottom bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
