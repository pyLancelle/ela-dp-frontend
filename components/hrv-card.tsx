"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Heart } from "lucide-react"
import { MetricCard } from "@/components/metric-card"

const chartConfig = {
    hrv: {
        label: "HRV",
        color: "hsl(var(--foreground))",
    },
} satisfies ChartConfig

interface HrvCardProps {
    data?: {
        average: number;
        daily: { day: string; hrv: number; date: string }[];
    };
}

export function HrvCard({ data }: HrvCardProps) {
    const defaultData = {
        average: 58,
        daily: [
            { day: "L", hrv: 52, date: "" },
            { day: "M", hrv: 48, date: "" },
            { day: "M", hrv: 55, date: "" },
            { day: "J", hrv: 61, date: "" },
            { day: "V", hrv: 54, date: "" },
            { day: "S", hrv: 50, date: "" },
            { day: "D", hrv: 58, date: "" },
        ]
    };

    const displayData = data || defaultData;

    return (
        <MetricCard
            title="HRV"
            description=""
            icon={Heart}
            kpi={displayData.average.toString()}
            kpiLabel="ms"
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
                        dataKey="hrv"
                        fill="var(--color-hrv)"
                        radius={4}
                        barSize={20}
                    >
                        <LabelList
                            dataKey="hrv"
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
