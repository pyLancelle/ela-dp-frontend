"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
const getStagePosition = (stage: SleepStage): number => {
  switch (stage) {
    case 'awake':
      return 0
    case 'rem':
      return 25
    case 'core':
      return 50
    case 'deep':
      return 75
  }
}

export function SleepStagesChart({ data }: SleepStagesChartProps = { data: undefined }) {
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
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <CardTitle className="text-sm">Phases de sommeil</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{totalFormatted}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
        <CardDescription className="text-xs">
          Dernière nuit ({formatTime(startTime)} - {formatTime(endTime)})
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        {/* Graphique des phases de sommeil */}
        <div className="relative h-48 bg-background rounded-lg p-4">
          {/* Labels verticaux sur la gauche avec durées */}
          <div className="absolute left-1 top-0 bottom-12 flex flex-col justify-between text-muted-foreground">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium">Awake</span>
              <span className="text-[9px] opacity-70">{formatDuration(totals.awake || 0)}</span>
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-[11px] font-medium">REM</span>
              <span className="text-[9px] opacity-70">{formatDuration(totals.rem || 0)}</span>
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-[11px] font-medium">Core</span>
              <span className="text-[9px] opacity-70">{formatDuration(totals.core || 0)}</span>
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-[11px] font-medium">Deep</span>
              <span className="text-[9px] opacity-70">{formatDuration(totals.deep || 0)}</span>
            </div>
          </div>

          {/* Barres de sommeil - chaque barre occupe toute la hauteur et se positionne selon sa phase */}
          <div className="absolute left-16 right-4 top-0 bottom-12 flex gap-[3px]">
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
                      height: '25%'
                    }}
                    title={`${segment.stage}: ${formatDuration(segment.duration)}`}
                  />
                </div>
              )
            })}
          </div>

          {/* Labels temporels en bas */}
          <div className="absolute left-16 right-4 bottom-0 flex justify-between text-[11px] text-muted-foreground">
            <span>{formatTime(startTime)}</span>
            <span>{formatTime(endTime)}</span>
          </div>
        </div>

        {/* Légende et statistiques */}
        <div className="grid grid-cols-4 gap-3 pt-4 mt-2 border-t">
          {/* Awake */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getStageColor('awake') }}
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Awake</div>
              <div className="text-sm font-semibold">{formatDuration(totals.awake || 0)}</div>
            </div>
          </div>

          {/* REM */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getStageColor('rem') }}
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">REM</div>
              <div className="text-sm font-semibold">{formatDuration(totals.rem || 0)}</div>
            </div>
          </div>

          {/* Core */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getStageColor('core') }}
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Core</div>
              <div className="text-sm font-semibold">{formatDuration(totals.core || 0)}</div>
            </div>
          </div>

          {/* Deep */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getStageColor('deep') }}
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Deep</div>
              <div className="text-sm font-semibold">{formatDuration(totals.deep || 0)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
