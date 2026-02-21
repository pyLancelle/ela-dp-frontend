"use client"

import { MetricCard } from "@/components/metric-card"
import { Moon } from "lucide-react"

// Type pour les phases de sommeil
type SleepStage = 'awake' | 'rem' | 'core' | 'deep'

interface SleepData {
  startTime: Date | string
  endTime: Date | string
  stage: SleepStage
}

interface SleepStagesChartProps {
  data?: SleepData[]
  className?: string
}

// Données de simulation pour une nuit de sommeil
const mockSleepData: SleepData[] = [
  { startTime: '2024-01-01T00:31:00', endTime: '2024-01-01T01:01:00', stage: 'awake' },
  { startTime: '2024-01-01T01:01:00', endTime: '2024-01-01T03:01:00', stage: 'deep' },
  { startTime: '2024-01-01T03:01:00', endTime: '2024-01-01T03:46:00', stage: 'core' },
  { startTime: '2024-01-01T03:46:00', endTime: '2024-01-01T05:01:00', stage: 'rem' },
  { startTime: '2024-01-01T05:01:00', endTime: '2024-01-01T05:39:00', stage: 'rem' },
  { startTime: '2024-01-01T05:39:00', endTime: '2024-01-01T06:09:00', stage: 'core' },
  { startTime: '2024-01-01T06:09:00', endTime: '2024-01-01T06:21:00', stage: 'awake' },
  { startTime: '2024-01-01T06:21:00', endTime: '2024-01-01T07:07:00', stage: 'deep' },
  { startTime: '2024-01-01T07:07:00', endTime: '2024-01-01T07:22:00', stage: 'core' },
  { startTime: '2024-01-01T07:22:00', endTime: '2024-01-01T07:45:00', stage: 'rem' },
  { startTime: '2024-01-01T07:45:00', endTime: '2024-01-01T08:15:00', stage: 'core' },
  { startTime: '2024-01-01T08:15:00', endTime: '2024-01-01T08:45:00', stage: 'core' },
  { startTime: '2024-01-01T08:45:00', endTime: '2024-01-01T09:30:00', stage: 'rem' },
  { startTime: '2024-01-01T09:30:00', endTime: '2024-01-01T10:00:00', stage: 'core' },
  { startTime: '2024-01-01T10:00:00', endTime: '2024-01-01T10:15:00', stage: 'core' },
  { startTime: '2024-01-01T10:15:00', endTime: '2024-01-01T10:30:00', stage: 'awake' },
]

// Fonction pour obtenir la couleur de chaque phase
const getStageColor = (stage: SleepStage): string => {
  switch (stage) {
    case 'awake':
      return 'hsl(14 100% 57%)' // Orange/Rouge
    case 'rem':
      return 'hsl(199 89% 48%)' // Cyan
    case 'core':
      return 'hsl(217 91% 60%)' // Bleu moyen
    case 'deep':
      return 'hsl(221 83% 53%)' // Bleu foncé
  }
}

// Fonction pour obtenir la position verticale (0 = haut, 100 = bas)
// Positions centrées pour aligner avec les labels
const getStagePosition = (stage: SleepStage): number => {
  switch (stage) {
    case 'awake':
      return 12.5  // Centre de la zone 0-25%
    case 'rem':
      return 37.5  // Centre de la zone 25-50%
    case 'core':
      return 62.5  // Centre de la zone 50-75%
    case 'deep':
      return 87.5  // Centre de la zone 75-100%
  }
}

export function SleepStagesChart({ data, className }: SleepStagesChartProps = { data: undefined }) {
  // Utiliser les données fournies ou les données mockées
  const sleepData = data || mockSleepData

  // Calculer la durée en minutes pour chaque segment
  const sleepSegments = sleepData.map(segment => {
    const start = new Date(segment.startTime)
    const end = new Date(segment.endTime)
    const durationMs = end.getTime() - start.getTime()
    const durationMinutes = durationMs / (1000 * 60)

    return {
      stage: segment.stage,
      duration: durationMinutes,
      startTime: start,
      endTime: end
    }
  })

  // Calculer le total de chaque phase
  const totals = sleepSegments.reduce((acc, segment) => {
    acc[segment.stage] = (acc[segment.stage] || 0) + segment.duration
    return acc
  }, {} as Record<SleepStage, number>)

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`
  }

  const totalMinutes = sleepSegments.reduce((sum, seg) => sum + seg.duration, 0)
  const totalFormatted = formatDuration(totalMinutes)

  // Heures de début et fin
  const startTime = sleepSegments.length > 0 ? sleepSegments[0].startTime : new Date()
  const endTime = sleepSegments.length > 0 ? sleepSegments[sleepSegments.length - 1].endTime : new Date()

  return (
    <MetricCard
      title="Phases de sommeil"
      description={`Dernière nuit (${formatTime(startTime)} - ${formatTime(endTime)})`}
      icon={Moon}
      kpi={totalFormatted}
      contentClassName="flex flex-col pt-1"
      className={className}
    >
      {/* Graphique des phases de sommeil */}
      <div className="relative flex-1 bg-background rounded-lg p-2 min-h-[120px]">
        {/* Labels verticaux sur la gauche avec durées */}
        <div className="absolute left-1 top-0 bottom-4 text-muted-foreground w-12">
          {/* Awake - center at 12.5% (middle of 0-25% range) */}
          <div className="absolute flex flex-col" style={{ top: '12.5%', transform: 'translateY(-50%)' }}>
            <span className="text-[9px] font-medium leading-tight">Awake</span>
            <span className="text-[9px] opacity-70 leading-tight">{formatDuration(totals.awake || 0)}</span>
          </div>
          {/* REM - center at 37.5% (middle of 25-50% range) */}
          <div className="absolute flex flex-col" style={{ top: '37.5%', transform: 'translateY(-50%)' }}>
            <span className="text-[9px] font-medium leading-tight">REM</span>
            <span className="text-[9px] opacity-70 leading-tight">{formatDuration(totals.rem || 0)}</span>
          </div>
          {/* Core - center at 62.5% (middle of 50-75% range) */}
          <div className="absolute flex flex-col" style={{ top: '62.5%', transform: 'translateY(-50%)' }}>
            <span className="text-[9px] font-medium leading-tight">Core</span>
            <span className="text-[9px] opacity-70 leading-tight">{formatDuration(totals.core || 0)}</span>
          </div>
          {/* Deep - center at 87.5% (middle of 75-100% range) */}
          <div className="absolute flex flex-col" style={{ top: '87.5%', transform: 'translateY(-50%)' }}>
            <span className="text-[9px] font-medium leading-tight">Deep</span>
            <span className="text-[9px] opacity-70 leading-tight">{formatDuration(totals.deep || 0)}</span>
          </div>
        </div>

        {/* Barres de sommeil - chaque barre occupe toute la hauteur et se positionne selon sa phase */}
        <div className="absolute left-14 right-2 top-0 bottom-4 flex gap-[2px]">
          {sleepSegments.map((segment, index) => {
            const widthPercent = (segment.duration / totalMinutes) * 100
            const topPercent = getStagePosition(segment.stage)

            return (
              <div
                key={index}
                className="relative"
                style={{
                  width: `${widthPercent}%`,
                  height: '100%'
                }}
              >
                <div
                  className="absolute left-0 right-0 rounded-sm"
                  style={{
                    backgroundColor: getStageColor(segment.stage),
                    top: `${topPercent}%`,
                    height: '25%',
                    transform: 'translateY(-50%)'
                  }}
                  title={`${segment.stage}: ${formatDuration(segment.duration)}`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </MetricCard>
  )
}
