import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    description?: string
    icon?: LucideIcon
    kpi?: string | number
    kpiLabel?: string
    children: React.ReactNode
    className?: string
    contentClassName?: string
}

export function MetricCard({
    title,
    description,
    icon: Icon,
    kpi,
    kpiLabel,
    children,
    className,
    contentClassName
}: MetricCardProps) {
    return (
        <Card className={cn("flex flex-col overflow-hidden h-full", className)}>
            <CardHeader className="pb-2 pt-3 space-y-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </div>
                    {kpi && (
                        <div className="text-right">
                            <div className="text-2xl font-bold leading-none">{kpi}</div>
                            {kpiLabel && <p className="text-[10px] text-muted-foreground mt-0.5">{kpiLabel}</p>}
                        </div>
                    )}
                </div>
                {description && <CardDescription className="text-xs mt-1">{description}</CardDescription>}
            </CardHeader>
            <CardContent className={cn("flex-1 min-h-0 pt-0 pb-3", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    )
}
