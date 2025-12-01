"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Moon } from "lucide-react"
import { MetricCard } from "@/components/metric-card"

const chartConfig = {
    score: {
        label: "Score de sommeil",
        color: "hsl(var(--foreground))",
    },
} satisfies ChartConfig

interface SleepScoreChartProps {
    data?: {
        average: number;
        daily: { day: string; score: number; date: string }[];
    };
}

export function SleepScoreChart({ data }: SleepScoreChartProps) {
    const defaultData = {
        average: 72,
        daily: [
            { day: "L", score: 55, date: "" },
            { day: "M", score: 75, date: "" },
            { day: "M", score: 38, date: "" },
            { day: "J", score: 78, date: "" },
            { day: "V", score: 69, date: "" },
            { day: "S", score: 85, date: "" },
            { day: "D", score: 88, date: "" },
        ]
    };

    const displayData = data || defaultData;

    return (
        <MetricCard
            title="Sommeil"
            description=""
            icon={Moon}
            kpi={displayData.average.toString()}
            kpiLabel=""
            className="h-full"
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
                    <Bar
                        dataKey="score"
                        fill="var(--color-score)"
                        radius={4}
                        barSize={20}
                    >
                        <LabelList
                            dataKey="score"
                            position="top"
                            offset={5}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </MetricCard>
    )
}