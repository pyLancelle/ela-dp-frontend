import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RacePrediction {
  distance: string
  time: string
  difference: string
  isImprovement: boolean
}

interface RacePredictionsCardProps {
  className?: string
  predictions?: RacePrediction[]
  loading?: boolean
}

const defaultPredictions: RacePrediction[] = [
  { distance: "5K", time: "20:25", difference: "-1:15", isImprovement: true },
  { distance: "10K", time: "42:15", difference: "-2:30", isImprovement: true },
  { distance: "21K", time: "1:32:45", difference: "-5:15", isImprovement: true },
  { distance: "42K", time: "3:18:30", difference: "-12:20", isImprovement: true },
]

export function RacePredictionsCard({
  className,
  predictions = defaultPredictions,
  loading = false
}: RacePredictionsCardProps) {
  return (
    <Card className={cn(
      "md:col-span-1 md:row-span-2 md:col-start-4 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden flex flex-col",
      className
    )}>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm">Prédictions courses</CardTitle>
        <CardDescription className="text-xs">Temps estimés (vs 30j)</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-3 flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Chargement...
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            {predictions.map((prediction) => {
              const Icon = prediction.isImprovement ? ArrowDownRight : ArrowUpRight
              const colorClass = prediction.isImprovement ? "text-green-500" : "text-red-500"

              return (
                <div
                  key={prediction.distance}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 -mx-2"
                >
                  <div className="min-w-[95px]">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {prediction.distance}
                    </div>
                    <div className="text-xl font-bold">{prediction.time}</div>
                  </div>
                  <div className={cn("flex items-center gap-1 min-w-[70px]", colorClass)}>
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold tabular-nums">
                      {prediction.difference}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
