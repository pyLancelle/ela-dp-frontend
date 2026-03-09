"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Star,
  Moon,
  Zap,
  Brain,
  Briefcase,
  Utensils,
  Droplets,
  Smile,
  Dumbbell,
  Coffee,
  Wine,
  FileText,
  Send,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  MapPin,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CoreFields {
  overall_score: number | null;
  sleep_quality: number | null;
  wake_energy: number | null;
  stress_level: number | null;
  productivity: number | null;
  food_quality: number | null;
  hydration: number | null;
  mood_evening: number | null;
}

interface TrainingFields {
  has_training: boolean;
  rpe: number | null;
  training_enjoyment: number | null;
  pain_flag: "none" | "light" | "marked" | "";
  pain_location: string;
}

interface OptionalFields {
  coffee_count: number | null;
  alcohol: boolean;
  alcohol_units: number | null;
  free_note: string;
}

type WorkLocation = "remote" | "client" | "eulidia" | null;

// ── Helpers ────────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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

function dateToISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2);
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

function boxColor(value: number, min = 1, max = 10): string {
  const pct = (value - min) / (max - min);
  if (pct <= 0.3) return "red";
  if (pct <= 0.6) return "yellow";
  return "green";
}

function boxColorClasses(color: string, active: boolean): string {
  if (!active)
    return "bg-background/50 border-border/40 text-muted-foreground/50 hover:border-border hover:text-muted-foreground";
  if (color === "red") return "bg-red-500 border-red-500 text-white shadow-sm";
  if (color === "yellow")
    return "bg-yellow-400 border-yellow-400 text-white shadow-sm";
  return "bg-emerald-500 border-emerald-500 text-white shadow-sm";
}

// ── DayStrip ──────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -160 : 160,
        behavior: "smooth",
      });
    }
  };

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
            <div
              key={day.toISOString()}
              className="flex flex-col items-center flex-shrink-0"
            >
              {showMonth ? (
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1 px-1">
                  {formatMonthLabel(day)}
                </span>
              ) : (
                <span className="mb-1 h-3" />
              )}
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
                <span
                  className={cn(
                    "text-sm font-bold leading-none",
                    isToday && !isSelected && "text-primary"
                  )}
                >
                  {day.getDate()}
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

// ── SectionCard ───────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <BlurFade delay={delay} duration={0.35}>
      <div className="liquid-glass-card rounded-2xl p-5 flex flex-col gap-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
          {title}
        </h3>
        {children}
      </div>
    </BlurFade>
  );
}

// ── ScoreRow ──────────────────────────────────────────────────────────────────

function ScoreRow({
  label,
  icon: Icon,
  value,
  min = 1,
  max = 10,
  isNA,
  onChange,
  onNA,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number | null;
  min?: number;
  max?: number;
  isNA: boolean;
  onChange: (v: number) => void;
  onNA: () => void;
}) {
  const boxes = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </div>
      <div className="flex gap-1 items-center">
        <div className="flex gap-1 flex-1">
          {boxes.map((v) => {
            const active = !isNA && value === v;
            const color = boxColor(v, min, max);
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={cn(
                  "flex-1 h-9 rounded-lg border text-xs font-bold transition-all duration-100",
                  isNA
                    ? "opacity-30 pointer-events-none bg-background/50 border-border/40 text-muted-foreground/50"
                    : boxColorClasses(active ? color : "", active)
                )}
              >
                {v}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onNA}
          className={cn(
            "ml-1.5 h-9 px-2.5 rounded-lg border text-xs font-semibold transition-all duration-100 flex-shrink-0",
            isNA
              ? "bg-muted border-muted-foreground/30 text-muted-foreground shadow-sm"
              : "bg-background/50 border-border/40 text-muted-foreground/40 hover:border-border hover:text-muted-foreground"
          )}
        >
          N/A
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const WORK_LOCATIONS: {
  value: WorkLocation;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "remote", label: "Teletravail", icon: Home },
  { value: "client", label: "Chez le client", icon: Users },
  { value: "eulidia", label: "Eulidia", icon: MapPin },
];

export default function CheckinPage() {
  const days = getLast30Days();
  const [selectedDay, setSelectedDay] = useState<Date>(days[days.length - 1]);
  const checkinDate = dateToISO(selectedDay);

  // Core — null = non répondu, number = valeur, "na" tracked via naCore
  const [core, setCore] = useState<CoreFields>({
    overall_score: null,
    sleep_quality: null,
    wake_energy: null,
    stress_level: null,
    productivity: null,
    food_quality: null,
    hydration: null,
    mood_evening: null,
  });
  const [naCore, setNaCore] = useState<Record<keyof CoreFields, boolean>>({
    overall_score: false,
    sleep_quality: false,
    wake_energy: false,
    stress_level: false,
    productivity: false,
    food_quality: false,
    hydration: false,
    mood_evening: false,
  });

  // Work location
  const [workLocation, setWorkLocation] = useState<WorkLocation>(null);

  // Training
  const [training, setTraining] = useState<TrainingFields>({
    has_training: false,
    rpe: null,
    training_enjoyment: null,
    pain_flag: "",
    pain_location: "",
  });
  const [naTraining, setNaTraining] = useState({ rpe: false, training_enjoyment: false });

  // Optional
  const [optional, setOptional] = useState<OptionalFields>({
    coffee_count: null,
    alcohol: false,
    alcohol_units: null,
    free_note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  // Un champ core est "rempli" si une valeur est choisie OU N/A coché
  const coreFilled = (Object.keys(core) as (keyof CoreFields)[]).every(
    (k) => core[k] !== null || naCore[k]
  );
  const trainingFilled =
    !training.has_training ||
    ((training.rpe !== null || naTraining.rpe) &&
      (training.training_enjoyment !== null || naTraining.training_enjoyment) &&
      training.pain_flag !== "");

  const isValid =
    coreFilled && trainingFilled && checkinDate <= todayISO();

  // ── Handlers ───────────────────────────────────────────────────────────────

  function setCoreProp<K extends keyof CoreFields>(key: K, value: number) {
    setCore((prev) => ({ ...prev, [key]: value }));
    setNaCore((prev) => ({ ...prev, [key]: false }));
  }

  function toggleCoreNA(key: keyof CoreFields) {
    setNaCore((prev) => {
      const next = !prev[key];
      if (next) setCore((c) => ({ ...c, [key]: null }));
      return { ...prev, [key]: next };
    });
  }

  function setTrainingProp<K extends keyof TrainingFields>(
    key: K,
    value: TrainingFields[K]
  ) {
    setTraining((prev) => ({ ...prev, [key]: value }));
    if (key === "rpe") setNaTraining((prev) => ({ ...prev, rpe: false }));
    if (key === "training_enjoyment")
      setNaTraining((prev) => ({ ...prev, training_enjoyment: false }));
  }

  function toggleTrainingNA(key: "rpe" | "training_enjoyment") {
    setNaTraining((prev) => {
      const next = !prev[key];
      if (next) setTraining((t) => ({ ...t, [key]: null }));
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      checkin_date: checkinDate,
      submitted_at: new Date().toISOString(),
      work_location: workLocation,
      core: {
        overall_score: naCore.overall_score ? "na" : core.overall_score,
        sleep_quality: naCore.sleep_quality ? "na" : core.sleep_quality,
        wake_energy: naCore.wake_energy ? "na" : core.wake_energy,
        stress_level: naCore.stress_level ? "na" : core.stress_level,
        productivity: naCore.productivity ? "na" : core.productivity,
        food_quality: naCore.food_quality ? "na" : core.food_quality,
        hydration: naCore.hydration ? "na" : core.hydration,
        mood_evening: naCore.mood_evening ? "na" : core.mood_evening,
      },
      training: training.has_training
        ? {
            has_training: true,
            rpe: naTraining.rpe ? "na" : training.rpe,
            training_enjoyment: naTraining.training_enjoyment
              ? "na"
              : training.training_enjoyment,
            pain_flag: training.pain_flag,
            pain_location:
              training.pain_flag === "light" || training.pain_flag === "marked"
                ? training.pain_location || null
                : null,
          }
        : {
            has_training: false,
            rpe: null,
            training_enjoyment: null,
            pain_flag: null,
            pain_location: null,
          },
      optional: {
        coffee_count: optional.coffee_count,
        alcohol: optional.alcohol,
        alcohol_units: optional.alcohol ? optional.alcohol_units : null,
        free_note: optional.free_note.trim() || null,
      },
    };

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      toast.success("Check-in enregistre !", {
        description: `Fichier : ${data.filename}`,
      });
    } catch {
      toast.error("Erreur lors de l'envoi", {
        description: "Verifie ta connexion ou reessaie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-10">

      {/* Day strip */}
      <BlurFade delay={0} duration={0.35}>
        <DayStrip days={days} selected={selectedDay} onSelect={setSelectedDay} />
      </BlurFade>

      {/* Date headline */}
      <BlurFade delay={0.03} duration={0.35}>
        <div className="px-1">
          <h2 className="text-xl font-bold capitalize">
            {formatFullDate(selectedDay)}
          </h2>
        </div>
      </BlurFade>

      {/* ── Lieu de travail ───────────────────────────────────────────────── */}

      <SectionCard title="Lieu de travail" delay={0.06}>
        <div className="flex gap-2">
          {WORK_LOCATIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setWorkLocation((prev) => (prev === value ? null : value))
              }
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 border text-xs font-semibold transition-all duration-150",
                workLocation === value
                  ? "bg-foreground/90 border-foreground text-background shadow-sm"
                  : "bg-background/50 border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Bloc Core ─────────────────────────────────────────────────────── */}

      <SectionCard title="Bilan global" delay={0.09}>
        <ScoreRow
          label="Note globale de la journee"
          icon={Star}
          value={core.overall_score}
          isNA={naCore.overall_score}
          onChange={(v) => setCoreProp("overall_score", v)}
          onNA={() => toggleCoreNA("overall_score")}
        />
        <ScoreRow
          label="Humeur en fin de journee"
          icon={Smile}
          value={core.mood_evening}
          isNA={naCore.mood_evening}
          onChange={(v) => setCoreProp("mood_evening", v)}
          onNA={() => toggleCoreNA("mood_evening")}
        />
        <ScoreRow
          label="Productivite au travail"
          icon={Briefcase}
          value={core.productivity}
          isNA={naCore.productivity}
          onChange={(v) => setCoreProp("productivity", v)}
          onNA={() => toggleCoreNA("productivity")}
        />
      </SectionCard>

      <SectionCard title="Sommeil & Energie" delay={0.12}>
        <ScoreRow
          label="Qualite du sommeil (nuit passee)"
          icon={Moon}
          value={core.sleep_quality}
          isNA={naCore.sleep_quality}
          onChange={(v) => setCoreProp("sleep_quality", v)}
          onNA={() => toggleCoreNA("sleep_quality")}
        />
        <ScoreRow
          label="Energie au reveil"
          icon={Zap}
          value={core.wake_energy}
          isNA={naCore.wake_energy}
          onChange={(v) => setCoreProp("wake_energy", v)}
          onNA={() => toggleCoreNA("wake_energy")}
        />
      </SectionCard>

      <SectionCard title="Mental & Corps" delay={0.15}>
        <ScoreRow
          label="Niveau de stress"
          icon={Brain}
          value={core.stress_level}
          isNA={naCore.stress_level}
          onChange={(v) => setCoreProp("stress_level", v)}
          onNA={() => toggleCoreNA("stress_level")}
        />
        <ScoreRow
          label="Qualite de l'alimentation"
          icon={Utensils}
          value={core.food_quality}
          isNA={naCore.food_quality}
          onChange={(v) => setCoreProp("food_quality", v)}
          onNA={() => toggleCoreNA("food_quality")}
        />
        <ScoreRow
          label="Hydratation"
          icon={Droplets}
          value={core.hydration}
          isNA={naCore.hydration}
          onChange={(v) => setCoreProp("hydration", v)}
          onNA={() => toggleCoreNA("hydration")}
        />
      </SectionCard>

      {/* ── Bloc Entrainement ─────────────────────────────────────────────── */}

      <BlurFade delay={0.18} duration={0.35}>
        <div className="liquid-glass-card rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              Entrainement
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Seance aujourd'hui ?
              </span>
              <Switch
                checked={training.has_training}
                onCheckedChange={(v) => setTrainingProp("has_training", v)}
              />
            </div>
          </div>

          <AnimatePresence initial={false}>
            {training.has_training && (
              <motion.div
                key="training-block"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-5">
                  <ScoreRow
                    label="RPE — Effort percu"
                    icon={Dumbbell}
                    value={training.rpe}
                    min={1}
                    max={10}
                    isNA={naTraining.rpe}
                    onChange={(v) => setTrainingProp("rpe", v)}
                    onNA={() => toggleTrainingNA("rpe")}
                  />
                  <ScoreRow
                    label="Plaisir de la seance"
                    icon={Smile}
                    value={training.training_enjoyment}
                    isNA={naTraining.training_enjoyment}
                    onChange={(v) => setTrainingProp("training_enjoyment", v)}
                    onNA={() => toggleTrainingNA("training_enjoyment")}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground/80">
                      Douleur / Gene physique
                    </label>
                    <Select
                      value={training.pain_flag}
                      onValueChange={(v) =>
                        setTrainingProp("pain_flag", v as "none" | "light" | "marked")
                      }
                    >
                      <SelectTrigger className="rounded-xl border-border/60 bg-background/60">
                        <SelectValue placeholder="Selectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        <SelectItem value="light">Legere</SelectItem>
                        <SelectItem value="marked">Marquee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <AnimatePresence initial={false}>
                    {(training.pain_flag === "light" ||
                      training.pain_flag === "marked") && (
                      <motion.div
                        key="pain-location"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Localisation de la douleur
                          </label>
                          <input
                            type="text"
                            placeholder="ex: genou droit, mollet gauche..."
                            value={training.pain_location}
                            onChange={(e) =>
                              setTrainingProp("pain_location", e.target.value)
                            }
                            className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BlurFade>

      {/* ── Bloc Optionnel ────────────────────────────────────────────────── */}

      <SectionCard title="Optionnel" delay={0.21}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <Coffee className="h-3.5 w-3.5 text-muted-foreground" />
            Nombre de cafes
          </div>
          <Select
            value={optional.coffee_count !== null ? String(optional.coffee_count) : ""}
            onValueChange={(v) =>
              setOptional((prev) => ({ ...prev, coffee_count: Number(v) }))
            }
          >
            <SelectTrigger className="rounded-xl border-border/60 bg-background/60">
              <SelectValue placeholder="— non renseigne —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 cafe</SelectItem>
              <SelectItem value="1">1 cafe</SelectItem>
              <SelectItem value="2">2 cafes</SelectItem>
              <SelectItem value="3">3 cafes</SelectItem>
              <SelectItem value="4">4 cafes</SelectItem>
              <SelectItem value="5">5+ cafes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Wine className="h-3.5 w-3.5 text-muted-foreground" />
              Alcool
            </div>
            <Switch
              checked={optional.alcohol}
              onCheckedChange={(v) =>
                setOptional((prev) => ({ ...prev, alcohol: v, alcohol_units: null }))
              }
            />
          </div>
          <AnimatePresence initial={false}>
            {optional.alcohol && (
              <motion.div
                key="alcohol-units"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Select
                  value={
                    optional.alcohol_units !== null
                      ? String(optional.alcohol_units)
                      : ""
                  }
                  onValueChange={(v) =>
                    setOptional((prev) => ({ ...prev, alcohol_units: Number(v) }))
                  }
                >
                  <SelectTrigger className="rounded-xl border-border/60 bg-background/60">
                    <SelectValue placeholder="Nombre de verres..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 verre</SelectItem>
                    <SelectItem value="2">2 verres</SelectItem>
                    <SelectItem value="3">3 verres</SelectItem>
                    <SelectItem value="4">4 verres</SelectItem>
                    <SelectItem value="5">5+ verres</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Note libre
            </div>
            <span className="text-xs text-muted-foreground/60 tabular-nums">
              {optional.free_note.length} / 500
            </span>
          </div>
          <Textarea
            placeholder="Contexte, evenement marquant, remarque..."
            maxLength={500}
            rows={4}
            value={optional.free_note}
            onChange={(e) =>
              setOptional((prev) => ({ ...prev, free_note: e.target.value }))
            }
            className="resize-none rounded-xl border-border/60 bg-background/60 text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring/40 transition"
          />
        </div>
      </SectionCard>

      {/* ── Send button ───────────────────────────────────────────────────── */}

      <BlurFade delay={0.24} duration={0.35}>
        <div className="flex flex-col gap-2">
          {!coreFilled && (
            <p className="text-xs text-muted-foreground text-center">
              Reponds a chaque question core (ou coche N/A) pour activer l'envoi.
            </p>
          )}
          {coreFilled && training.has_training && !trainingFilled && (
            <p className="text-xs text-muted-foreground text-center">
              Complete les champs entrainement (RPE, plaisir, douleur).
            </p>
          )}

          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-150",
              isValid && !isSubmitting
                ? "bg-foreground text-background hover:opacity-80 shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Envoi en cours..." : "Send"}
          </button>
        </div>
      </BlurFade>
    </div>
  );
}
