"use client";

import { CalendarCheck } from "lucide-react";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

export default function TrainingWeeklyPage() {
  return (
    <div className="px-3 md:px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <BentoGrid className="md:auto-rows-auto gap-3">
        <BlurFade delay={0.05} className="md:col-span-6">
          <MagicCard>
            <div className="liquid-glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
              <CalendarCheck className="h-10 w-10 text-muted-foreground/40" />
              <AnimatedShinyText className="text-lg font-semibold tracking-tight">
                Suivi hebdomadaire
              </AnimatedShinyText>
              <p className="text-sm text-muted-foreground/60 max-w-sm">
                Le suivi de tes semaines d&apos;entraînement apparaîtra ici une fois un plan actif.
              </p>
            </div>
          </MagicCard>
        </BlurFade>
      </BentoGrid>
    </div>
  );
}
