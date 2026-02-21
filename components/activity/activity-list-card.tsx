"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Route, Clock, Gauge, Flame, ArrowRight, PersonStanding, Mountain } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";

export interface ActivityListItem {
  id: string;
  title: string;
  distance: number; // km
  duration: number; // minutes
  date: string;
  type: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  running:           { label: "Course",        color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  trail_running:     { label: "Trail",          color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  track_running:     { label: "Piste",          color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  treadmill_running: { label: "Tapis",          color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  hiking:            { label: "Randonnée",      color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  cycling:           { label: "Cyclisme",       color: "#f97316", bg: "rgba(249,115,22,0.12)"  },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? { label: type, color: "#94a3b8", bg: "rgba(148,163,184,0.12)" };
}

function TypeIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "trail_running":
      return <Mountain className={className} />;
    case "treadmill_running":
      return <PersonStanding className={className} />;
    default:
      return <Route className={className} />;
  }
}

function formatPace(durationMin: number, distanceKm: number) {
  if (!distanceKm || distanceKm === 0) return "—";
  const pace = durationMin / distanceKm;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}'${sec.toString().padStart(2, "0")}"`;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, "0") : ""}` : `${m}min`;
}

interface Props {
  activity: ActivityListItem;
  index: number;
}

export function ActivityListCard({ activity, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const cfg = getTypeConfig(activity.type);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.38, delay: 0.04 + index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/activites/${activity.id}`} className="block group">
        <MagicCard beamDuration={4} beamSize={80}>
          <div className="liquid-glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 group-hover:brightness-105">

            {/* Icône type */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: cfg.bg }}
            >
              <TypeIcon
                type={activity.type}
                className="w-5 h-5"
                style={{ color: cfg.color } as React.CSSProperties}
              />
            </div>

            {/* Titre + date + badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm truncate">{activity.title}</span>
                <span
                  className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  {cfg.label}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{activity.date}</span>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
              <Stat icon={Route} label="Distance" value={`${activity.distance.toFixed(1)} km`} />
              <Stat icon={Clock} label="Durée" value={formatDuration(activity.duration)} />
              <Stat icon={Gauge} label="Allure" value={formatPace(activity.duration, activity.distance)} />
            </div>

            {/* Arrow */}
            <ArrowRight className="flex-shrink-0 w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 transition-all duration-150" />
          </div>
        </MagicCard>
      </Link>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1 text-muted-foreground/60">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  );
}
