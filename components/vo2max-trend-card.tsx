"use client"

import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { useVo2maxTrend } from "@/hooks/queries/use-vo2max-trend"
import { MetricCard } from "@/components/metric-card"
import { LineChartSimple } from "@/components/ui/line-chart-simple"

interface Vo2maxTrendCardProps {
  className?: string
}

export function Vo2maxTrendCard({ className }: Vo2maxTrendCardProps = {}) {
  const { data, isLoading, error } = useVo2maxTrend()

  // Données par défaut pour l'affichage
  const currentVo2max = data?.current_vo2max ?? 54
  const delta = data?.vo2max_delta_6_months ?? 0
  const weeklyData = data?.weekly_vo2max_array ?? []

  const isImprovement = delta > 0
  const isDecline = delta < 0
  const deltaAbs = Math.abs(delta)

  // Préparer les données pour le line chart
  const chartData = weeklyData.length > 0
    ? weeklyData.map((value, index) => ({ x: index, y: value }))
    : Array.from({ length: 24 }, (_, i) => ({ x: i, y: 54 - i * 0.5 })) // Données par défaut

  // Déterminer la couleur en fonction de la tendance
  const chartColor = isImprovement
    ? "hsl(var(--chart-2))" // Vert
    : isDecline
    ? "hsl(var(--destructive))" // Rouge
    : "hsl(var(--primary))" // Bleu

  // Calculer les limites Y du graphique avec une marge de 10%
  const minVo2 = weeklyData.length > 0 ? Math.min(...weeklyData) : 55
  const maxVo2 = weeklyData.length > 0 ? Math.max(...weeklyData) : 60
  const range = maxVo2 - minVo2
  const margin = range * 0.1
  const yMin = Math.floor(minVo2 - margin)
  const yMax = Math.ceil(maxVo2 + margin)

  // Construire le KPI avec le delta
  const kpiContent = (
    <div className="text-right">
      <div className="text-2xl font-bold leading-none">{currentVo2max.toFixed(1)}</div>
      <p className="text-[10px] text-muted-foreground mt-0.5">ml/kg/min</p>
      <div className={`flex items-center gap-1 justify-end mt-1 ${
        isImprovement ? 'text-green-500' : isDecline ? 'text-red-500' : 'text-muted-foreground'
      }`}>
        {isImprovement && <ArrowUpRight className="h-3 w-3" />}
        {isDecline && <ArrowDownRight className="h-3 w-3" />}
        <span className="text-xs font-semibold">
          {isImprovement && '+'}{deltaAbs.toFixed(1)}
        </span>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <MetricCard
        title="VO2 Max"
        icon={Activity}
        className={className}
        hasChart={false}
      >
        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          Chargement...
        </div>
      </MetricCard>
    )
  }

  if (error) {
    return (
      <MetricCard
        title="VO2 Max"
        icon={Activity}
        className={className}
        hasChart={false}
      >
        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          Erreur de chargement
        </div>
      </MetricCard>
    )
  }

  return (
    <MetricCard
      title="VO2 Max"
      icon={Activity}
      kpi={kpiContent}
      className={className}
      contentClassName="pb-4"
      hasChart={true}
    >
      <LineChartSimple
        data={chartData}
        color={chartColor}
        showXAxis={false}
        showYAxis={false}
        yDomain={[yMin, yMax]}
        strokeWidth={2}
      />
    </MetricCard>
  )
}
