"use client";

import { Loader2, Inbox } from "lucide-react";
import { useActivitiesList } from "@/hooks/queries";
import { ActivityRichCard, type ActivityListItem } from "@/components/activity/activity-rich-card";
import { BlurFade } from "@/components/magicui/blur-fade";

function monthKey(rawDate: string): string {
  const d = new Date(rawDate);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabel(rawDate: string): string {
  return new Date(rawDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

type GridItem =
  | { kind: "separator"; label: string; key: string }
  | { kind: "card"; activity: ActivityListItem; index: number };

function buildGridItems(activities: ActivityListItem[]): GridItem[] {
  const items: GridItem[] = [];
  let currentMonth = "";
  let cardIndex = 0;

  for (const activity of activities) {
    const mk = monthKey(activity.rawDate);
    if (mk !== currentMonth) {
      currentMonth = mk;
      items.push({ kind: "separator", label: monthLabel(activity.rawDate), key: `sep-${mk}` });
    }
    items.push({ kind: "card", activity, index: cardIndex++ });
  }

  return items;
}

export default function ActivitesPage() {
  const { data: activities = [], isLoading, isError, error } = useActivitiesList();

  return (
    <div className="flex flex-col gap-6 p-3 md:p-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin" />
          <span className="text-sm">Chargement des activités…</span>
        </div>
      ) : isError ? (
        <BlurFade delay={0.1}>
          <div className="liquid-glass-card rounded-xl p-8 text-center text-red-400 text-sm">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </div>
        </BlurFade>
      ) : activities.length === 0 ? (
        <BlurFade delay={0.1}>
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Inbox className="h-8 w-8 opacity-40" />
            <span className="text-sm">Aucune activité trouvée</span>
          </div>
        </BlurFade>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {buildGridItems(activities).map((item) =>
            item.kind === "separator" ? (
              <div key={item.key} className="col-span-1 md:col-span-6 flex items-center gap-4 pt-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 capitalize">
                  {item.label}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            ) : (
              <div key={item.activity.id} className="col-span-1 md:col-span-2">
                <ActivityRichCard activity={item.activity} index={item.index} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
