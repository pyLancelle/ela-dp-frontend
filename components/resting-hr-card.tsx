"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"
import { Heart } from "lucide-react"
import { MetricCard } from "@/components/metric-card"

const chartConfig = {
    hr: {
        label: "Resting HR",
        color: "hsl(var(--foreground))",
    },
} satisfies ChartConfig

interface RestingHrCardProps {
    data?: {
        average: number;
        daily: { day: string; hr: number; date: string }[];
    };
}

export function RestingHrCard({ data }: RestingHrCardProps) {
    const defaultData = {
        average: 52,
        daily: [
            { day: "L", hr: 54, date: "" },
            { day: "M", hr: 51, date: "" },
            { day: "M", hr: 53, date: "" },
            { day: "J", hr: 50, date: "" },
            { day: "V", hr: 52, date: "" },
            { day: "S", hr: 55, date: "" },
            { day: "D", hr: 52, date: "" },
        ]
    };

    const displayData = data || defaultData;

    return (
        <MetricCard
            title="FC Repos"
            description=""
            icon={Heart}
            kpi={displayData.average.toString()}
            kpiLabel="bpm"
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
                        dataKey="hr"
                        fill="var(--color-hr)"
                        radius={4}
                        barSize={20}
                    >
                        <LabelList
                            dataKey="hr"
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
