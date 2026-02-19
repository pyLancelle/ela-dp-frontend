"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ListeningTimeChartProps {
    data?: {
        averagePerDay: number | string; // minutes (number) or formatted string (temporary backward compatibility)
        days: {
            date: string;
            day: string;
            duration: number;
            formatted: string;
            heightPercentage: number;
        }[];
    };
    loading?: boolean;
}

// Format minutes to "Xh Ym" or "Xm"
function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours === 0) {
        return `${mins}m`;
    }
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
}

// Get formatted average - handles both number (minutes) and string formats
function getFormattedAverage(averagePerDay: number | string): string {
    if (typeof averagePerDay === 'number') {
        return formatMinutes(averagePerDay);
    }
    // If it's already a string, return it as is (backward compatibility)
    return averagePerDay;
}

export function ListeningTimeChart({ data, loading = false }: ListeningTimeChartProps) {
    const defaultData = {
        averagePerDay: 252, // 4h 12m in minutes
        days: [
            { date: "", day: "Lun", duration: 0, formatted: "3h 45m", heightPercentage: 75 },
            { date: "", day: "Mar", duration: 0, formatted: "4h 30m", heightPercentage: 90 },
            { date: "", day: "Mer", duration: 0, formatted: "2h 15m", heightPercentage: 45 },
            { date: "", day: "Jeu", duration: 0, formatted: "5h 00m", heightPercentage: 100 },
            { date: "", day: "Ven", duration: 0, formatted: "3h 20m", heightPercentage: 67 },
            { date: "", day: "Sam", duration: 0, formatted: "4h 50m", heightPercentage: 97 },
            { date: "", day: "Dim", duration: 0, formatted: "3h 10m", heightPercentage: 63 },
        ]
    };

    const displayData = data || defaultData;

    // Calculate heights based on actual duration values
    const maxDuration = Math.max(...displayData.days.map(day => day.duration), 1); // Avoid division by 0
    const daysWithCalculatedHeight = displayData.days.map(day => ({
        ...day,
        calculatedHeight: (day.duration / maxDuration) * 100
    }));

    // Convert French day names to English single letters
    const dayMap: { [key: string]: string } = {
        'Lun': 'M', 'Mar': 'T', 'Mer': 'W', 'Jeu': 'T',
        'Ven': 'F', 'Sam': 'S', 'Dim': 'S'
    };

    return (
        <Card className="md:col-span-2 md:col-start-5 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm">Temps d'écoute</CardTitle>
                        <CardDescription className="text-xs">10 derniers jours</CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{getFormattedAverage(displayData.averagePerDay)}</div>
                        <p className="text-xs text-muted-foreground">Moyenne/jour</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2 pb-3">
                {loading ? (
                    <div className="h-28 flex items-center justify-center text-muted-foreground text-xs">
                        Chargement...
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {/*
                          h-20 = hauteur CSS explicite (height: 5rem = 80px)
                          → les colonnes enfant peuvent utiliser h-full (= 80px défini)
                          → les barres peuvent utiliser height: X% de 80px fiablement
                          Contrairement à flex-1 (flex-grow), h-20 est une hauteur résoluble
                          par les enfants pour le calcul des pourcentages CSS.
                        */}
                        <div className="flex items-end justify-between gap-1 px-1 h-20">
                            {daysWithCalculatedHeight.map((day, index) => (
                                <div key={index} className="flex-1 h-full flex justify-center items-end">
                                    <div
                                        className="w-5 bg-black dark:bg-white rounded"
                                        style={{ height: `${day.calculatedHeight}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between gap-1 px-1">
                            {daysWithCalculatedHeight.map((day, index) => {
                                const englishDay = dayMap[day.day] || day.day.charAt(0);
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-0.5">
                                        <span className="text-[10px] font-medium leading-none">{day.formatted}</span>
                                        <span className="text-xs text-muted-foreground leading-none">{englishDay}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
