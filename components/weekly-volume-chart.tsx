"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Footprints } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { RunningWeeklyVolumeData } from "@/types/dashboard"

const chartConfig = {
    volume: {
        label: "Volume",
        color: "hsl(var(--foreground))",
    },
} satisfies ChartConfig

interface WeeklyVolumeChartProps {
    data?: RunningWeeklyVolumeData;
}

export function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
    const defaultData: RunningWeeklyVolumeData = {
        generatedAt: new Date().toISOString(),
        average: 25,
        max: 45,
        weeks: [
            { week: "S-9", volume: 20, isCurrent: false, weekNumber: 1, year: 2025, startDate: "" },
            { week: "S-8", volume: 25, isCurrent: false, weekNumber: 2, year: 2025, startDate: "" },
            { week: "S-7", volume: 30, isCurrent: false, weekNumber: 3, year: 2025, startDate: "" },
            { week: "S-6", volume: 22, isCurrent: false, weekNumber: 4, year: 2025, startDate: "" },
            { week: "S-5", volume: 28, isCurrent: false, weekNumber: 5, year: 2025, startDate: "" },
            { week: "S-4", volume: 35, isCurrent: false, weekNumber: 6, year: 2025, startDate: "" },
            { week: "S-3", volume: 32, isCurrent: false, weekNumber: 7, year: 2025, startDate: "" },
            { week: "S-2", volume: 38, isCurrent: false, weekNumber: 8, year: 2025, startDate: "" },
            { week: "S-1", volume: 40, isCurrent: false, weekNumber: 9, year: 2025, startDate: "" },
            { week: "S0", volume: 42, isCurrent: true, weekNumber: 10, year: 2025, startDate: "" },
        ]
    };

    const displayData = data || defaultData;

    return (
        <MetricCard
            title="Volume hebdo"
            description=""
            icon={Footprints}
            kpi={displayData.average.toFixed(1)}
            kpiLabel="km moy"
            className="h-full"
            hasChart={true}
        >
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                <BarChart
                    accessibilityLayer
                    data={displayData.weeks}
                    margin={{ top: 15, bottom: 0, left: 0, right: 0 }}
                >
                    <YAxis domain={[0, Math.ceil(displayData.max * 1.2)]} hide={true} />
                    <XAxis
                        dataKey="week"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickMargin={8}
                        height={24}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    />
                    <Bar
                        dataKey="volume"
                        fill="var(--color-volume)"
                        radius={4}
                        barSize={12}
                    >
                        <LabelList
                            dataKey="volume"
                            position="top"
                            offset={5}
                            className="fill-foreground"
                            fontSize={10}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </MetricCard>
    )
}
