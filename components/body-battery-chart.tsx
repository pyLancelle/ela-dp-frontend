"use client"

import { Bar, BarChart, XAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Battery } from "lucide-react"
import { MetricCard } from "@/components/metric-card"

const data = {
    summary: {
        kpi: "+81",
        label: "Max delta"
    },
    daily: [
        { day: "L", range: [15, 85], delta: 70 },
        { day: "M", range: [20, 92], delta: 72 },
        { day: "M", range: [10, 65], delta: 55 },
        { day: "J", range: [25, 88], delta: 63 },
        { day: "V", range: [18, 95], delta: 77 },
        { day: "S", range: [30, 98], delta: 68 },
        { day: "D", range: [10, 91], delta: 81 },
    ]
}

const chartConfig = {
    range: {
        label: "Body Battery",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function BodyBatteryChart() {
    return (
        <MetricCard
            title="Body Battery"
            description=""
            icon={Battery}
            kpi={data.summary.kpi}
            kpiLabel=""
            className="h-full"
        >
            <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart accessibilityLayer data={data.daily} margin={{ top: 20, bottom: 0 }}>
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={5}
                        axisLine={false}
                        interval={0}
                    />
                    <Bar
                        dataKey="range"
                        fill="var(--color-range)"
                        radius={4}
                    >
                        <LabelList
                            dataKey="delta"
                            position="top"
                            offset={8}
                            className="fill-foreground"
                            fontSize={8}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </MetricCard>
    )
}
