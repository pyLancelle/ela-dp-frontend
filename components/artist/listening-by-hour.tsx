
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis, Legend } from "recharts";

interface ListeningByHourData {
  name: string;
  plays: number;
  fill: string;
}

interface ListeningByHourProps {
  data: ListeningByHourData[];
}

export function ListeningByHour({ data }: ListeningByHourProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" /> Écoutes par heure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            innerRadius="20%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
            cx="50%"
            cy="50%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, Math.max(...data.map(d => d.plays))]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey='plays'
              angleAxisId={0}
              data={data}
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
