"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"

interface LineChartSimpleProps {
    data: Array<{ x: string | number; y: number }>
    color?: string
    showXAxis?: boolean
    showYAxis?: boolean
    yDomain?: [number, number] | ["auto", "auto"]
    strokeWidth?: number
}

export function LineChartSimple({
    data,
    color = "hsl(var(--foreground))",
    showXAxis = false,
    showYAxis = false,
    yDomain = ["auto", "auto"],
    strokeWidth = 2
}: LineChartSimpleProps) {
    const chartConfig = {
        y: {
            label: "Value",
            color: color,
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{ top: 10, bottom: 10, left: 5, right: 5 }}
            >
                <YAxis domain={yDomain} hide={!showYAxis} />
                {showXAxis && (
                    <XAxis
                        dataKey="x"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                )}
                <Line
                    type="monotone"
                    dataKey="y"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ChartContainer>
    )
}
