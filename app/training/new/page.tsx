"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, Loader2, CheckCircle2, Target, Sparkles, NotebookPen } from "lucide-react";

import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "route", label: "Route" },
  { value: "trail", label: "Trail" },
];

const STRATEGIES = [
  { value: "finisher", label: "Finisher" },
  { value: "chrono", label: "Chrono" },
  { value: "progression", label: "Progression" },
];

const LABEL_CLASS =
  "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1.5 block";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors";

export default function TrainingNewPage() {
  const [nomCourse, setNomCourse] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [distance, setDistance] = useState("");
  const [denivele, setDenivele] = useState("");
  const [type, setType] = useState("route");
  const [strategie, setStrategie] = useState("finisher");
  const [objectifChrono, setObjectifChrono] = useState("");
  const [secondaires, setSecondaires] = useState<{ id: string; value: string }[]>([
    { id: crypto.randomUUID(), value: "" },
  ]);
  const [seances, setSeances] = useState(3);
  const [renforcement, setRenforcement] = useState(0);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function addSecondaire() {
    setSecondaires((prev) => [...prev, { id: crypto.randomUUID(), value: "" }]);
  }

  function updateSecondaire(id: string, value: string) {
    setSecondaires((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  }

  function removeSecondaire(id: string) {
    setSecondaires((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!date || !type) {
      setErrorMsg("Veuillez remplir l'objectif principal (date, type).");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const payload = {
      created_at: new Date().toISOString(),
      objectif_principal: {
        nom_course: nomCourse.trim(),
        date: format(date, "yyyy-MM-dd"),
        distance: distance ? Number(distance) : null,
        denivele: denivele ? Number(denivele) : null,
        type,
        strategie,
        objectif_chrono: objectifChrono.trim() || null,
      },
      objectifs_secondaires: secondaires.map((s) => s.value).filter((v) => v.trim()),
      seances_par_semaine: seances,
      renforcement_par_semaine: renforcement,
      notes: notes.trim(),
    };

    try {
      const res = await fetch("/api/training/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
    } catch {
      setErrorMsg("Échec de l'envoi. Réessaie.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <BentoGrid className="md:auto-rows-auto gap-3">

        {/* Objectif principal */}
        <BlurFade delay={0.05} className="md:col-span-2">
          <MagicCard>
            <div className="liquid-glass-card rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                <AnimatedShinyText className="text-sm font-semibold tracking-tight">
                  Objectif principal
                </AnimatedShinyText>
              </div>

              <div>
                <span className={LABEL_CLASS}>Nom de la course</span>
                <input
                  type="text"
                  value={nomCourse}
                  onChange={(e) => setNomCourse(e.target.value)}
                  placeholder="Ex : Marathon de Paris, Trail du Mont-Blanc…"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <span className={LABEL_CLASS}>Date de la course</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        INPUT_CLASS,
                        "flex items-center justify-between text-left",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <span>
                        {date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Choisir une date"}
                      </span>
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={LABEL_CLASS}>Distance (km)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="42"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <span className={LABEL_CLASS}>Dénivelé (D+)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={denivele}
                    onChange={(e) => setDenivele(e.target.value)}
                    placeholder="1200"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <span className={LABEL_CLASS}>Type</span>
                <div className="flex gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={cn(
                        "rounded-lg px-4 h-9 text-xs font-semibold transition-colors duration-150 cursor-pointer select-none",
                        type === t.value
                          ? "bg-foreground/15 text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={LABEL_CLASS}>Stratégie</span>
                <div className="flex gap-1.5">
                  {STRATEGIES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStrategie(s.value)}
                      className={cn(
                        "rounded-lg px-4 h-9 text-xs font-semibold transition-colors duration-150 cursor-pointer select-none",
                        strategie === s.value
                          ? "bg-foreground/15 text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={LABEL_CLASS}>Objectif de chrono</span>
                <input
                  type="text"
                  value={objectifChrono}
                  onChange={(e) => setObjectifChrono(e.target.value)}
                  placeholder="Ex : 3h45, sub 1h30…"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Objectifs secondaires */}
        <BlurFade delay={0.1} className="md:col-span-2">
          <MagicCard>
            <div className="liquid-glass-card rounded-xl p-5 flex flex-col gap-4 h-full">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <AnimatedShinyText className="text-sm font-semibold tracking-tight">
                  Objectifs secondaires
                </AnimatedShinyText>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {secondaires.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => updateSecondaire(s.id, e.target.value)}
                      placeholder="Ex : courir sous 4h30, ne pas marcher…"
                      className={cn(INPUT_CLASS, "flex-1")}
                    />
                    {secondaires.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSecondaire(s.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSecondaire}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 w-fit"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un objectif
                </button>
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Notes */}
        <BlurFade delay={0.15} className="md:col-span-2">
          <MagicCard>
            <div className="liquid-glass-card rounded-xl p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-emerald-500" />
                <AnimatedShinyText className="text-sm font-semibold tracking-tight">
                  Notes &amp; contraintes
                </AnimatedShinyText>
              </div>

              <div>
                <span className={LABEL_CLASS}>Sorties par semaine</span>
                <div className="flex gap-1.5">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSeances(n)}
                      className={cn(
                        "rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer select-none w-9 h-9 flex items-center justify-center",
                        seances === n
                          ? "bg-foreground/15 text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={LABEL_CLASS}>Renforcement musculaire / semaine</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRenforcement(n)}
                      className={cn(
                        "rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer select-none w-9 h-9 flex items-center justify-center",
                        renforcement === n
                          ? "bg-foreground/15 text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={"Disponibilités, contraintes physiques, objectifs de temps…\n\nEx : dispo lundi/mercredi/samedi, genou fragile, max 1h30 en semaine, sortie longue le week-end OK"}
                rows={6}
                className={cn(INPUT_CLASS, "resize-none flex-1")}
              />
            </div>
          </MagicCard>
        </BlurFade>

        {/* Submit */}
        <BlurFade delay={0.2} className="md:col-span-6">
          <MagicCard beamDuration={3}>
            <div className="liquid-glass-card rounded-xl px-6 py-4 flex items-center justify-between gap-4">
              <div className="text-sm">
                {status === "error" && <p className="text-red-400">{errorMsg}</p>}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Plan envoyé avec succès !</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
                size="lg"
                className="min-w-[160px] ml-auto"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi…
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Envoyé
                  </>
                ) : (
                  <AnimatedShinyText className="text-primary-foreground font-medium">
                    Créer le plan
                  </AnimatedShinyText>
                )}
              </Button>
            </div>
          </MagicCard>
        </BlurFade>

      </BentoGrid>
    </form>
  );
}
