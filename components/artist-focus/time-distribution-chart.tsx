"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimeDistributionChartProps {
    data: { hour: string; count: number }[];
    className?: string;
}

export function TimeDistributionChart({ data, className }: TimeDistributionChartProps) {
    return (
        <Card className={cn("overflow-hidden flex flex-col", className)}>
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-medium">Distribution Horaire</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="hour"
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
