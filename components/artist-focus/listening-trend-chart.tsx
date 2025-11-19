"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListeningTrendChartProps {
    data: { day: string; listeners: number }[] | { week: string; listeners: number }[];
    title: string;
    className?: string;
}

export function ListeningTrendChart({ data, title, className }: ListeningTrendChartProps) {
    return (
        <Card className={cn("overflow-hidden flex flex-col", className)}>
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 flex-1 min-h-0 pb-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorListeners" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey={data[0] && "day" in data[0] ? "day" : "week"}
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <Area
                            type="monotone"
                            dataKey="listeners"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#colorListeners)"
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
