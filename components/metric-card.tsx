import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    description?: string
    icon?: LucideIcon
    kpi?: string | number | React.ReactNode
    kpiLabel?: string
    children: React.ReactNode
    className?: string
    contentClassName?: string
    hasChart?: boolean
}

export function MetricCard({
    title,
    description,
    icon: Icon,
    kpi,
    kpiLabel,
    children,
    className,
    contentClassName,
    hasChart = true
}: MetricCardProps) {
    return (
        <Card className={cn("flex flex-col overflow-hidden h-full", className)}>
            <CardHeader className="pb-2 pt-3">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                            <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        </div>
                        {description && <CardDescription className="text-xs mt-0">{description}</CardDescription>}
                    </div>
                    {kpi && (
                        typeof kpi === 'string' || typeof kpi === 'number' ? (
                            <div className="text-right">
                                <div className="text-2xl font-bold leading-none">{kpi}</div>
                                {kpiLabel && <p className="text-[10px] text-muted-foreground mt-0.5">{kpiLabel}</p>}
                            </div>
                        ) : (
                            kpi
                        )
                    )}
                </div>
            </CardHeader>
            <CardContent className={cn("flex-1 min-h-0 pt-0 relative", contentClassName)}>
                {hasChart ? (
                    <div className="w-full h-full">
                        <div className="absolute inset-0 bottom-4 px-2">
                            {children}
                        </div>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    )
}