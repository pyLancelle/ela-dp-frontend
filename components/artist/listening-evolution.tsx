
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface EvolutionData {
  date: string;
  plays: number;
}

interface ListeningEvolutionProps {
  data: EvolutionData[];
}

export function ListeningEvolution({ data }: ListeningEvolutionProps) {
  return (
    <Card className="md:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp /> Évolution des écoutes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Bar dataKey="plays" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
