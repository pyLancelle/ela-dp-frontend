import { Activity, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ActivityType } from "@/types/activity-detail";

interface ActivityHeaderProps {
  title: string;
  date: string;
  type: ActivityType;
  location?: string;
}

const activityTypeConfig: Record<ActivityType, { label: string; color: string }> = {
  running: { label: "Course", color: "bg-orange-500" },
  cycling: { label: "Vélo", color: "bg-blue-500" },
  swimming: { label: "Natation", color: "bg-cyan-500" },
  hiking: { label: "Randonnée", color: "bg-green-500" },
  trail: { label: "Trail", color: "bg-amber-600" },
};

export function ActivityHeader({ title, date, type, location }: ActivityHeaderProps) {
  const typeConfig = activityTypeConfig[type];

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className={`rounded-full ${typeConfig.color} p-3`}>
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <Badge variant="secondary" className="text-sm">
              {typeConfig.label}
            </Badge>
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
