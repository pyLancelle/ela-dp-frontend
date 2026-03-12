import type { SleepOverviewRaw, SleepNightRaw } from "@/types/sleep";

// ── Helpers ──────────────────────────────────────────────────────────

const DAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

function dayLabel(date: string) {
  return DAY_LABELS[new Date(date).getDay()];
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDaily(startDate: string, days: number) {
  const daily = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const seed = d.getTime();
    const r = seededRandom(seed);

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseScore = isWeekend ? 82 : 74;
    const baseDuration = isWeekend ? 480 : 420;
    const bedHour = isWeekend ? 0 : 23;
    const bedMin = Math.round(r * 45);

    daily.push({
      date,
      day: dayLabel(date),
      score: Math.round(baseScore + (r - 0.5) * 20),
      duration_minutes: Math.round(baseDuration + (r - 0.5) * 90),
      hrv: Math.round(48 + (r - 0.3) * 18),
      resting_hr: Math.round(52 + (r - 0.5) * 8),
      body_battery_gain: Math.round(35 + r * 25),
      bedtime: `${bedHour}:${bedMin.toString().padStart(2, "0")}`,
      waketime: `${6 + Math.round(r)}:${(Math.round(r * 50)).toString().padStart(2, "0")}`,
    });
  }
  return daily;
}

// ── Overview mock (30 days) ──────────────────────────────────────────

const daily30 = generateDaily("2026-02-11", 30);

export const SLEEP_OVERVIEW_MOCK: SleepOverviewRaw = {
  current_month: {
    avg_score: 77,
    avg_duration_minutes: 438,
    avg_hrv: 52,
    avg_resting_hr: 52,
    avg_body_battery_gain: 42,
    avg_bedtime: "23:25",
    avg_waketime: "6:45",
  },
  previous_month: {
    avg_score: 73,
    avg_duration_minutes: 415,
    avg_hrv: 48,
    avg_resting_hr: 54,
    avg_body_battery_gain: 38,
    avg_bedtime: "23:50",
    avg_waketime: "6:55",
  },
  daily: daily30,
};

// ── Night detail mock (generates on demand) ──────────────────────────

function generateStages(date: string) {
  const bedtime = `${date}T23:22:00`;
  return [
    { level_name: "light", start_time: `${date}T23:22:00`, end_time: `${date}T23:48:00` },
    { level_name: "deep", start_time: `${date}T23:48:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T00:35:00` },
    { level_name: "light", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T00:35:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:10:00` },
    { level_name: "rem", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:10:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:42:00` },
    { level_name: "awake_restless", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:42:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:48:00` },
    { level_name: "light", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T01:48:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T02:30:00` },
    { level_name: "deep", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T02:30:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T03:15:00` },
    { level_name: "rem", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T03:15:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T04:05:00` },
    { level_name: "light", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T04:05:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T05:20:00` },
    { level_name: "rem", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T05:20:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T06:05:00` },
    { level_name: "awake_restless", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T06:05:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T06:12:00` },
    { level_name: "light", start_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T06:12:00`, end_time: `${date.slice(0, 8)}${String(Number(date.slice(8)) + 1).padStart(2, "0")}T06:52:00` },
  ];
}

export function getSleepNightMock(date: string): SleepNightRaw {
  const dailyEntry = daily30.find((d) => d.date === date);
  const r = seededRandom(new Date(date).getTime());

  return {
    date,
    score: dailyEntry?.score ?? 76,
    duration_minutes: dailyEntry?.duration_minutes ?? 430,
    hrv: dailyEntry?.hrv ?? 50,
    resting_hr: dailyEntry?.resting_hr ?? 52,
    body_battery_gain: dailyEntry?.body_battery_gain ?? 40,
    bedtime: dailyEntry?.bedtime ?? "23:20",
    waketime: dailyEntry?.waketime ?? "6:45",
    stress: Math.round(25 + r * 20),
    stages: generateStages(date),
  };
}
