"use client";

import { motion } from "motion/react";
import { Activity, Clock, Route, Flame } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import type { ActivityListItem } from "@/components/activity/activity-list-card";

interface Props {
  activities: ActivityListItem[];
  className?: string;
}

interface StatPillProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  delay: number;
}

function StatPill({ icon: Icon, label, value, suffix, decimals = 0, delay }: StatPillProps) {
  return (
    <BlurFade delay={delay} duration={0.4}>
      <div className="liquid-glass-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{label}</p>
          <p className="text-lg font-bold tabular-nums leading-tight">
            <NumberTicker value={value} decimalPlaces={decimals} />
            <span className="text-sm font-medium text-muted-foreground ml-1">{suffix}</span>
          </p>
        </div>
      </div>
    </BlurFade>
  );
}

export function ActivityListHeader({ activities, className }: Props) {
  const totalDistance = activities.reduce((s, a) => s + a.distance, 0);
  const totalDurationMin = activities.reduce((s, a) => s + a.duration, 0);
  const totalHours = Math.round(totalDurationMin / 60);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Title */}
      <BlurFade delay={0} duration={0.4}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activities.length > 0
              ? `${activities.length} sortie${activities.length > 1 ? "s" : ""} enregistrée${activities.length > 1 ? "s" : ""}`
              : "Vos sorties sportives"}
          </p>
        </div>
      </BlurFade>

      {/* Stats pills */}
      {activities.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <StatPill
            icon={Activity}
            label="Activités"
            value={activities.length}
            suffix="sorties"
            delay={0.06}
          />
          <StatPill
            icon={Route}
            label="Distance totale"
            value={Math.round(totalDistance)}
            suffix="km"
            delay={0.12}
          />
          <StatPill
            icon={Clock}
            label="Temps total"
            value={totalHours}
            suffix="h"
            delay={0.18}
          />
        </div>
      )}
    </div>
  );
}
