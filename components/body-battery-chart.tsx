"use client"

import { Bar, BarChart, XAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Battery } from "lucide-react"
import { MetricCard } from "@/components/metric-card"

const chartConfig = {
    range: {
        label: "Body Battery",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

interface BodyBatteryChartProps {
    data?: {
        average: number;
        daily: { day: string; range: [number, number]; delta: number; date: string }[];
    };
    className?: string;
}

export function BodyBatteryChart({ data, className }: BodyBatteryChartProps) {
    const defaultData = {
        average: 81,
        daily: [
            { day: "L", range: [15, 85] as [number, number], delta: 70, date: "" },
            { day: "M", range: [20, 92] as [number, number], delta: 72, date: "" },
            { day: "M", range: [10, 65] as [number, number], delta: 55, date: "" },
            { day: "J", range: [25, 88] as [number, number], delta: 63, date: "" },
            { day: "V", range: [18, 95] as [number, number], delta: 77, date: "" },
            { day: "S", range: [30, 98] as [number, number], delta: 68, date: "" },
            { day: "D", range: [10, 91] as [number, number], delta: 81, date: "" },
        ]
    };

    const displayData = data || defaultData;

    return (
        <MetricCard
            title="Body Battery"
            description=""
            icon={Battery}
            kpi={`+${displayData.average}`}
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
                        dataKey="range"
                        fill="var(--color-range)"
                        radius={4}
                        barSize={20}
                    >
                        <LabelList
                            dataKey="range[1]"
                            position="top"
                            offset={5}
                            className="fill-foreground"
                            fontSize={10}
                        />
                        <LabelList
                            dataKey="range[0]"
                            position="bottom"
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
