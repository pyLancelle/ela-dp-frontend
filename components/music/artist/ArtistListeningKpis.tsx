"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";

interface PeriodStat {
  current: number;
  previous: number;
}

interface ArtistListeningKpisProps {
  year: PeriodStat;
  month: PeriodStat;
  week: PeriodStat;
}

function formatMinutes(minutes: number): { value: number; unit: string } {
  if (minutes >= 60) return { value: Math.round(minutes / 60), unit: "h" };
  return { value: minutes, unit: "min" };
}

function Delta({ current, previous }: PeriodStat) {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (Math.abs(pct) < 2)
    return <span className="text-[10px] text-muted-foreground/40 font-medium">stable</span>;

  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
      up ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
    }`}>
      {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {up ? "+" : ""}{pct}%
    </span>
  );
}

function StatBlock({ label, stat }: { label: string; stat: PeriodStat }) {
  const { value, unit } = formatMinutes(stat.current);
  return (
    <div className="flex-1 flex flex-col justify-center px-1 py-2 gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        {label}
      </span>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <NumberTicker value={value} className="text-2xl font-black tabular-nums leading-none" />
          <span className="text-xs font-semibold text-muted-foreground/60 leading-none mb-0.5">
            {unit}
          </span>
        </div>
        <Delta current={stat.current} previous={stat.previous} />
      </div>
    </div>
  );
}

export function ArtistListeningKpis({ year, month, week }: ArtistListeningKpisProps) {
  return (
    <div className="liquid-glass-card rounded-xl px-4 pt-3 pb-2 h-full flex flex-col">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 mb-1">
        Temps d'écoute
      </p>
      <div className="flex flex-col flex-1 divide-y divide-white/[0.06]">
        <StatBlock label="Cette année" stat={year} />
        <StatBlock label="Ce mois" stat={month} />
        <StatBlock label="Cette semaine" stat={week} />
      </div>
    </div>
  );
}
