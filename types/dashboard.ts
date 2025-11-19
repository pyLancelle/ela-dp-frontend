export interface MusicDashboardData {
    generatedAt: string;
    period: string;

    listeningTime: {
        averagePerDay: string;
        days: {
            date: string;
            day: string;
            duration: number;
            formatted: string;
            heightPercentage: number;
        }[];
    };

    topArtists: {
        rank: number;
        name: string;
        trackCount: number;
        totalDuration: string;
        playCount: number;
        imageUrl: string | null;
        externalUrl: string | null;
    }[];

    topTracks: {
        rank: number;
        name: string;
        artistName: string;
        totalDuration: string;
        playCount: number;
        imageUrl: string | null;
        externalUrl: string | null;
    }[];
}

export interface HealthDashboardData {
    generatedAt: string;
    indicators: {
        sleepScore: { value: number; date: string; percentage: number };
        hrv: { value: number; date: string; baseline: number; percentage: number };
        restingHeartRate: { value: number; date: string; percentage: number };
        bodyBattery: { value: number; date: string; percentage: number };
    };
    sleepWeek: { day: string; date: string; score: number; isLow: boolean }[];
    hrvWeek: {
        current: number;
        baseline: number;
        daily: { date: string; value: number; displayHeight: number; isAboveBaseline: boolean }[];
    };
    weight: {
        current: { value: number; date: string };
        trend: { change: number; percentChange: number; direction: "up" | "down" | "stable" };
        target: { value: number; remaining: number };
        chartPoints: number[];
    };
    stress: { value: number; date: string; level: "Faible" | "Modéré" | "Élevé"; color: "green" | "orange" | "red" };
    sleepTimeline: {
        totalDuration: string;
        date: string;
        stages: { type: "awake" | "light" | "deep" | "rem"; duration: number; startTime: string; endTime: string; widthPercentage: number }[];
        summary: { deep: number; rem: number; light: number; awake: number };
    };
}

export interface RunningDashboardData {
    generatedAt: string;
    weeklyStats: {
        totalDistance: number;
        sessionCount: number;
        averagePerSession: number;
        goalStatus: "achieved" | "in_progress" | "not_achieved";
        weeklyGoal: number;
        daily: { date: string; day: string; distance: number; aerobicScore: number; anaerobicScore: number }[];
        maxAerobicChange: number;
        maxAnaerobicChange: number;
    };
    weeklyVolume: {
        weeks: { weekNumber: number; year: number; totalKm: number; startDate: string; endDate: string; isCurrent: boolean }[];
        average: number;
        max: number;
    };
    trainingStatus: {
        status: "Productif" | "Maintien" | "Récupération" | "Surcharge" | "Déconditionnement";
        color: "green" | "blue" | "yellow" | "orange" | "red";
        icon: "CheckCircle2" | "Activity" | "Moon" | "AlertTriangle" | "TrendingDown";
        updatedAt: string;
        description: string;
    };
    workloadRatio: {
        ratio: number;
        acuteLoad: number;
        chronicLoad: number;
        zone: "safe" | "low" | "high";
        safeZone: { min: number; max: number };
        positionPercentage: number;
    };
    vo2max: {
        current: number;
        previousMonth: number;
        change: number;
        trend: "up" | "down" | "stable";
        history: { date: string; value: number }[];
    };
    predictions: {
        distance: "5K" | "10K" | "Semi-Marathon" | "Marathon";
        predictedTime: string;
        previousPrediction: string;
        improvement: string;
        improvementSeconds: number;
        trend: "improving" | "stable" | "declining";
    }[];
    annualMileage: {
        current: { year: number; totalKm: number; isCurrent: true };
        previous: { year: number; totalKm: number; isCurrent: false };
        difference: { km: number; percentage: number; trend: "up" | "down" | "equal" };
        currentWidthPercentage: number;
        previousWidthPercentage: number;
    };
    annualProgress: {
        currentYear: { year: number; lastMonthWithData: number; data: { month: number; monthName: string; cumulativeKm: number }[] };
        previousYear: { year: number; data: { month: number; monthName: string; cumulativeKm: number }[] };
    };
}
