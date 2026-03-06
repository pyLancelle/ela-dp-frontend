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
        artistId?: string;
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

// Types pour la vue BigQuery pct_homepage__sleep_body_battery
export interface SleepBodyBatteryRow {
    date: string;
    day_abbr_french: string;
    sleep_score: number;
    battery_at_bedtime: number;
    battery_at_waketime: number;
    battery_gain: number;
    avg_hrv: number;
    resting_hr: number;
}

export interface SleepBodyBatteryData {
    sleepScores: {
        average: number;
        daily: { day: string; score: number; date: string }[];
    };
    bodyBattery: {
        average: number;
        daily: { day: string; range: [number, number]; delta: number; date: string }[];
    };
    hrv: {
        average: number;
        daily: { day: string; hrv: number; date: string }[];
    };
    restingHr: {
        average: number;
        daily: { day: string; hr: number; date: string }[];
    };
}

export interface RunningWeeklyRow {
    date: string;
    day_of_week: string;
    total_distance_km: number;
    aerobic_score: number;
    anaerobic_score: number;
}

export interface RunningWeeklyData {
    generatedAt: string;
    totalDistance: number;
    sessionCount: number;
    averagePerSession: number;
    daily: {
        day: string;
        date: string;
        distance: number;
        aerobicScore: number;
        anaerobicScore: number;
        aerobicHeightPercentage: number;
        anaerobicHeightPercentage: number;
    }[];
}

export interface RunningWeeklyVolumeData {
    generatedAt: string;
    average: number;
    max: number;
    weeks: {
        week: string;
        volume: number;
        isCurrent: boolean;
        weekNumber: number;
        year: number;
        startDate: string;
    }[];
}

// Types pour les prédictions de course
export interface RacePredictionRow {
    distance: string;
    current_date: string;
    current_time: number;
    previous_date: string;
    previous_time: number;
    diff_seconds: number;
}

export interface RacePredictionsData {
    generatedAt: string;
    predictions: {
        distance: string;
        time: string;
        difference: string;
        isImprovement: boolean;
        diffSeconds: number;
    }[];
}

