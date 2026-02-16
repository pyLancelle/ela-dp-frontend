"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Footprints } from "lucide-react";
import { MetricCard } from "@/components/metric-card";

const chartConfig = {
  steps: {
    label: "Pas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface StepsData {
  average: number;
  goal: number;
  daily: { day: string; steps: number; date: string }[];
}

interface StepsCardProps {
  data?: StepsData;
  className?: string;
}

// Formater le nombre de pas en K (ex: 12543 -> 12.5K)
const formatStepsK = (steps: number) => {
  if (steps === 0) return "";
  const k = steps / 1000;
  // Si c'est un entier (ex: 10000 -> 10K), pas de décimale
  if (k % 1 === 0) {
    return `${Math.round(k)}K`;
  }
  // Sinon afficher une décimale (ex: 12543 -> 12.5K)
  return `${k.toFixed(1)}K`;
};

export function StepsCard({ data, className }: StepsCardProps) {
  const defaultData = {
    average: 9234,
    goal: 10000,
    daily: [
      { day: "L", steps: 12543, date: "" },
      { day: "M", steps: 8234, date: "" },
      { day: "M", steps: 10456, date: "" },
      { day: "J", steps: 7892, date: "" },
      { day: "V", steps: 9123, date: "" },
      { day: "S", steps: 11234, date: "" },
      { day: "D", steps: 5156, date: "" },
    ],
  };

  const displayData = data || defaultData;
  const avgSteps = Math.round(displayData.average);

  const chartData = displayData.daily.map((item) => ({
    day: item.day,
    steps: item.steps,
    stepsLabel: formatStepsK(item.steps),
  }));

  return (
    <MetricCard
      title="Pas"
      description=""
      icon={Footprints}
      kpi={formatStepsK(avgSteps)}
      kpiLabel=""
      className={className || "h-full"}
      hasChart={true}
    >
      <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 15, bottom: 0, left: 0, right: 0 }}
        >
          <YAxis domain={[0, "dataMax + 1000"]} hide={true} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={8}
            height={24}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={20}>
            <LabelList
              dataKey="stepsLabel"
              position="top"
              offset={5}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </MetricCard>
  );
}
