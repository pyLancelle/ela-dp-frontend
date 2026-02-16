"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Brain } from "lucide-react";
import { MetricCard } from "@/components/metric-card";

const chartConfig = {
  stress: {
    label: "Stress",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface StressData {
  average: number;
  daily: { day: string; stress: number; date: string }[];
}

interface StressCardProps {
  data?: StressData;
  className?: string;
}

export function StressCard({ data, className }: StressCardProps) {
  const defaultData = {
    average: 32,
    daily: [
      { day: "L", stress: 28, date: "" },
      { day: "M", stress: 45, date: "" },
      { day: "M", stress: 22, date: "" },
      { day: "J", stress: 38, date: "" },
      { day: "V", stress: 52, date: "" },
      { day: "S", stress: 18, date: "" },
      { day: "D", stress: 24, date: "" },
    ],
  };

  const displayData = data || defaultData;
  const avgStress = Math.round(displayData.average);

  return (
    <MetricCard
      title="Stress"
      description=""
      icon={Brain}
      kpi={avgStress.toString()}
      kpiLabel=""
      className={className || "h-full"}
      hasChart={true}
    >
      <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
        <BarChart
          accessibilityLayer
          data={displayData.daily}
          margin={{ top: 15, bottom: 0, left: 0, right: 0 }}
        >
          <YAxis domain={[0, 100]} hide={true} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={8}
            height={24}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <Bar dataKey="stress" fill="var(--color-stress)" radius={4} barSize={20}>
            <LabelList
              dataKey="stress"
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
