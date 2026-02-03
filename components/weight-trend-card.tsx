"use client"

import { ArrowUpRight, ArrowDownRight, Scale } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { LineChartSimple } from "@/components/ui/line-chart-simple"

interface WeightTrendCardProps {
  className?: string
}

export function WeightTrendCard({ className }: WeightTrendCardProps = {}) {
  // Données statiques pour l'instant - à remplacer par un hook useWeightTrend
  const currentWeight = 72.5
  const delta = -1.2 // Variation sur 30 jours
  const targetWeight = 71.0

  // Données simulées sur 30 jours (du plus ancien au plus récent)
  const weeklyData = [73.8, 73.6, 73.5, 73.3, 73.1, 72.9, 72.8, 72.5]

  const isLoss = delta < 0
  const isGain = delta > 0
  const deltaAbs = Math.abs(delta)

  // Préparer les données pour le line chart
  const chartData = weeklyData.map((value, index) => ({ x: index, y: value }))

  // Couleur : vert si perte (objectif atteint), rouge si gain
  const chartColor = isLoss
    ? "hsl(var(--chart-2))" // Vert
    : isGain
    ? "hsl(var(--destructive))" // Rouge
    : "hsl(var(--primary))" // Bleu

  // Limites Y : +/- 2kg par rapport au poids actuel
  const yMin = currentWeight - 2
  const yMax = currentWeight + 2

  // Construire le KPI avec le delta
  const kpiContent = (
    <div className="text-right">
      <div className="text-2xl font-bold leading-none">{currentWeight.toFixed(1)}</div>
      <p className="text-[10px] text-muted-foreground mt-0.5">kg</p>
      <div className={`flex items-center gap-1 justify-end mt-1 ${
        isLoss ? 'text-green-500' : isGain ? 'text-red-500' : 'text-muted-foreground'
      }`}>
        {isGain && <ArrowUpRight className="h-3 w-3" />}
        {isLoss && <ArrowDownRight className="h-3 w-3" />}
        <span className="text-xs font-semibold">
          {isGain && '+'}{delta.toFixed(1)} kg
        </span>
      </div>
    </div>
  )

  return (
    <MetricCard
      title="Poids"
      description={`Objectif : ${targetWeight} kg`}
      icon={Scale}
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
