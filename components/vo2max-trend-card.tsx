"use client"

import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { LineChartSimple } from "@/components/ui/line-chart-simple"

interface Vo2maxTrendCardProps {
  className?: string
  data?: {
    currentVo2max: number
    weeklyVo2maxArray: number[]
    vo2maxDelta6Months: number
  } | null
  loading?: boolean
}

export function Vo2maxTrendCard({ className, data, loading }: Vo2maxTrendCardProps = {}) {
  if (loading || !data) {
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

  const currentVo2max = data.currentVo2max
  const delta = data.vo2maxDelta6Months
  const weeklyData = data.weeklyVo2maxArray

  const isImprovement = delta > 0
  const isDecline = delta < 0
  const deltaAbs = Math.abs(delta)

  // Préparer les données pour le line chart
  const chartData = weeklyData.map((value, index) => ({ x: index, y: value }))

  // Déterminer la couleur en fonction de la tendance
  const chartColor = isImprovement
    ? "hsl(var(--chart-2))" // Vert
    : isDecline
    ? "hsl(var(--destructive))" // Rouge
    : "hsl(var(--primary))" // Bleu

  // Calculer les limites Y du graphique avec une marge de 10%
  const minVo2 = Math.min(...weeklyData)
  const maxVo2 = Math.max(...weeklyData)
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
