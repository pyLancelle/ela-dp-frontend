import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

export function KPICard({ title, value, icon: Icon, description, trend, trendUp, className }: KPICardProps) {
    return (
        <Card className={cn("flex flex-col justify-between overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {trend && (
                            <span className={cn("font-medium mr-1", trendUp ? "text-green-500" : "text-red-500")}>
                                {trend}
                            </span>
                        )}
                        <span className="opacity-80">{description}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
