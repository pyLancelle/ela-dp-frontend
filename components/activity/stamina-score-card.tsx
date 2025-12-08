"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Zap } from "lucide-react";

interface StaminaScoreCardProps {
  score: number; // 0-100
}

export function StaminaScoreCard({ score }: StaminaScoreCardProps) {
  const chartData = [{ name: "stamina", value: score, fill: "hsl(var(--chart-1))" }];

  const chartConfig = {
    stamina: {
      label: "Stamina",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500" />
          Stamina
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={90}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "hsl(var(--muted))" }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl font-bold"
            >
              {score}
            </text>
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
            >
              / 100
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
