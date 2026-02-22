import { Activity, Calendar, MapPin } from "lucide-react";
import type { ActivityType } from "@/types/activity-detail";

interface ActivityHeaderProps {
  title: string;
  date: string;
  type: ActivityType;
  location?: string;
}

const activityTypeConfig: Record<ActivityType, { label: string; color: string; glow: string }> = {
  running: { label: "Course", color: "bg-orange-500", glow: "shadow-orange-500/40" },
  cycling: { label: "Vélo", color: "bg-blue-500", glow: "shadow-blue-500/40" },
  swimming: { label: "Natation", color: "bg-cyan-500", glow: "shadow-cyan-500/40" },
  hiking: { label: "Randonnée", color: "bg-green-500", glow: "shadow-green-500/40" },
  trail: { label: "Trail", color: "bg-amber-600", glow: "shadow-amber-600/40" },
};

export function ActivityHeader({ title, date, type, location }: ActivityHeaderProps) {
  const typeConfig = activityTypeConfig[type];

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        {/* Icon with liquid glass + glow */}
        <div
          className={`rounded-2xl ${typeConfig.color} p-3 shadow-lg ${typeConfig.glow} ring-1 ring-white/30`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <Activity className="h-6 w-6 text-white drop-shadow" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

            {/* Badge liquid glass */}
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest liquid-glass-pill-active"
              style={{ letterSpacing: "0.08em" }}
            >
              {typeConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="text-sm capitalize">{formattedDate}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
