"use client";

import { useState, useRef, useEffect } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Brain,
  Heart,
  Dumbbell,
  Utensils,
  Smile,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLast30Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2);
}

function formatDayNumber(d: Date) {
  return d.getDate();
}

function formatMonthLabel(d: Date) {
  return d.toLocaleDateString("fr-FR", { month: "short" });
}

function formatFullDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayEntry {
  date: string; // ISO
  energy: number | null;       // 1–5
  mood: number | null;         // 1–5
  sleep_quality: number | null;// 1–5
  stress: number | null;       // 1–5
  motivation: number | null;   // 1–5
  soreness: number | null;     // 1–5
  nutrition: number | null;    // 1–5
  social: number | null;       // 1–5
  highlight: string;
  notes: string;
  ready_to_train: boolean | null;
}

const defaultEntry = (): Omit<DayEntry, "date"> => ({
  energy: null,
  mood: null,
  sleep_quality: null,
  stress: null,
  motivation: null,
  soreness: null,
  nutrition: null,
  social: null,
  highlight: "",
  notes: "",
  ready_to_train: null,
});

// ── Sub-components ─────────────────────────────────────────────────────────────

const SCALE_LABELS: Record<number, string> = {
  1: "Très bas",
  2: "Bas",
  3: "Moyen",
  4: "Bon",
  5: "Excellent",
};

const SCALE_COLORS: Record<number, string> = {
  1: "bg-red-500/80",
  2: "bg-orange-400/80",
  3: "bg-yellow-400/80",
  4: "bg-emerald-400/80",
  5: "bg-emerald-500",
};

function ScaleInput({
  label,
  icon: Icon,
  value,
  onChange,
  invertColors = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number | null;
  onChange: (v: number) => void;
  invertColors?: boolean;
}) {
  const colors: Record<number, string> = invertColors
    ? { 1: "bg-emerald-500", 2: "bg-emerald-400/80", 3: "bg-yellow-400/80", 4: "bg-orange-400/80", 5: "bg-red-500/80" }
    : SCALE_COLORS;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            title={SCALE_LABELS[v]}
            className={cn(
              "h-8 flex-1 rounded-lg text-xs font-semibold transition-all duration-150 border",
              value === v
                ? cn(colors[v], "border-transparent text-white shadow-sm scale-105")
                : "bg-background/60 border-border/50 text-muted-foreground hover:border-border hover:bg-muted/40"
            )}
          >
            {v}
          </button>
        ))}
      </div>
      {value && (
        <p className="text-[11px] text-muted-foreground">{SCALE_LABELS[value]}</p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="liquid-glass-card rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Day strip ─────────────────────────────────────────────────────────────────

function DayStrip({
  days,
  selected,
  onSelect,
}: {
  days: Date[];
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // Scroll to end (today) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
    }
  };

  // Group days by month for separators
  let lastMonth = -1;

  return (
    <div className="liquid-glass-card rounded-2xl p-3 flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="flex-shrink-0 rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          const month = day.getMonth();
          const showMonth = month !== lastMonth;
          if (showMonth) lastMonth = month;

          return (
            <div key={day.toISOString()} className="flex flex-col items-center flex-shrink-0">
              {showMonth && (
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1 px-1">
                  {formatMonthLabel(day)}
                </span>
              )}
              {!showMonth && <span className="mb-1 h-3" />}
              <button
                type="button"
                onClick={() => onSelect(day)}
                className={cn(
                  "w-10 flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 transition-all duration-150",
                  isSelected
                    ? "bg-foreground text-background shadow-md"
                    : isToday
                    ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                    : "hover:bg-muted/40 text-foreground/70"
                )}
              >
                <span className="text-[10px] font-medium uppercase leading-none">
                  {formatDayLabel(day)}
                </span>
                <span className={cn("text-sm font-bold leading-none", isToday && !isSelected && "text-primary")}>
                  {formatDayNumber(day)}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="flex-shrink-0 rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const days = getLast30Days();
  const [selectedDay, setSelectedDay] = useState<Date>(days[days.length - 1]);
  const [entries, setEntries] = useState<Record<string, DayEntry>>({});

  const dayKey = selectedDay.toISOString().slice(0, 10);
  const entry: DayEntry = entries[dayKey] ?? { date: dayKey, ...defaultEntry() };

  function updateEntry(patch: Partial<Omit<DayEntry, "date">>) {
    setEntries((prev) => ({
      ...prev,
      [dayKey]: { ...entry, ...patch },
    }));
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto pb-8">
      {/* Day strip */}
      <BlurFade delay={0} duration={0.35}>
        <DayStrip days={days} selected={selectedDay} onSelect={setSelectedDay} />
      </BlurFade>

      {/* Date headline */}
      <BlurFade delay={0.05} duration={0.35}>
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold capitalize">{formatFullDate(selectedDay)}</h2>
          {entry.ready_to_train !== null && (
            <span
              className={cn(
                "text-xs font-semibold px-3 py-1 rounded-full",
                entry.ready_to_train
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400"
              )}
            >
              {entry.ready_to_train ? "Pret a s'entrainer" : "Pas en forme"}
            </span>
          )}
        </div>
      </BlurFade>

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Energie & Humeur */}
        <BlurFade delay={0.08} duration={0.35}>
          <SectionCard title="Energie & Mental">
            <ScaleInput
              label="Niveau d'energie"
              icon={Zap}
              value={entry.energy}
              onChange={(v) => updateEntry({ energy: v })}
            />
            <ScaleInput
              label="Humeur generale"
              icon={Smile}
              value={entry.mood}
              onChange={(v) => updateEntry({ mood: v })}
            />
            <ScaleInput
              label="Motivation"
              icon={Brain}
              value={entry.motivation}
              onChange={(v) => updateEntry({ motivation: v })}
            />
          </SectionCard>
        </BlurFade>

        {/* Sommeil & Récupération */}
        <BlurFade delay={0.12} duration={0.35}>
          <SectionCard title="Recuperation">
            <ScaleInput
              label="Qualite du sommeil"
              icon={Moon}
              value={entry.sleep_quality}
              onChange={(v) => updateEntry({ sleep_quality: v })}
            />
            <ScaleInput
              label="Courbatures / Fatigue musculaire"
              icon={Dumbbell}
              value={entry.soreness}
              onChange={(v) => updateEntry({ soreness: v })}
              invertColors
            />
            <ScaleInput
              label="Stress / Anxiete"
              icon={Brain}
              value={entry.stress}
              onChange={(v) => updateEntry({ stress: v })}
              invertColors
            />
          </SectionCard>
        </BlurFade>

        {/* Hygiène de vie */}
        <BlurFade delay={0.16} duration={0.35}>
          <SectionCard title="Hygiene de vie">
            <ScaleInput
              label="Alimentation"
              icon={Utensils}
              value={entry.nutrition}
              onChange={(v) => updateEntry({ nutrition: v })}
            />
            <ScaleInput
              label="Vie sociale / Interactions"
              icon={Heart}
              value={entry.social}
              onChange={(v) => updateEntry({ social: v })}
            />
          </SectionCard>
        </BlurFade>

        {/* Prêt à s'entraîner */}
        <BlurFade delay={0.2} duration={0.35}>
          <SectionCard title="Entrainement">
            <p className="text-sm text-muted-foreground">
              Globalement, es-tu pret a t'entrainer aujourd'hui ?
            </p>
            <div className="flex gap-3">
              {[
                { label: "Oui, en forme", value: true, color: "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400" },
                { label: "Non, pas aujourd'hui", value: false, color: "bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-400" },
              ].map(({ label, value, color }) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => updateEntry({ ready_to_train: value })}
                  className={cn(
                    "flex-1 rounded-xl py-3 px-3 text-sm font-semibold border transition-all duration-150",
                    entry.ready_to_train === value
                      ? color + " shadow-sm scale-[1.02]"
                      : "bg-background/60 border-border/50 text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <ScaleInput
              label="Envie de s'entrainer"
              icon={Sun}
              value={entry.motivation}
              onChange={(v) => updateEntry({ motivation: v })}
            />
          </SectionCard>
        </BlurFade>

        {/* Highlight du jour + Notes */}
        <BlurFade delay={0.24} duration={0.35} className="md:col-span-2">
          <SectionCard title="Notes libres">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">
                Highlight de la journee
              </label>
              <input
                type="text"
                placeholder="Le moment fort du jour..."
                value={entry.highlight}
                onChange={(e) => updateEntry({ highlight: e.target.value })}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">
                Notes additionnelles
              </label>
              <textarea
                rows={4}
                placeholder="Contexte, evenements, remarques..."
                value={entry.notes}
                onChange={(e) => updateEntry({ notes: e.target.value })}
                className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
              />
            </div>
          </SectionCard>
        </BlurFade>
      </div>

      {/* Save button (mock) */}
      <BlurFade delay={0.28} duration={0.35}>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-foreground text-background px-6 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Enregistrer
          </button>
        </div>
      </BlurFade>
    </div>
  );
}
