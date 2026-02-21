"use client";

import Link from "next/link";
import { useRef, useMemo, useState } from "react";
import { motion, useInView } from "motion/react";
import { Route, Clock, Gauge, Heart, ArrowRight } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivityListItem {
  id: string;
  title: string;
  distance: number; // km
  duration: number; // minutes
  date: string;
  rawDate: string;
  type: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  running:           { label: "Course",   color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  emoji: "🏃" },
  trail_running:     { label: "Trail",    color: "#34d399", bg: "rgba(52,211,153,0.12)",  emoji: "🏔️" },
  track_running:     { label: "Piste",    color: "#a78bfa", bg: "rgba(167,139,250,0.12)", emoji: "🏟️" },
  treadmill_running: { label: "Tapis",    color: "#f472b6", bg: "rgba(244,114,182,0.12)", emoji: "🏃" },
  hiking:            { label: "Rando",    color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  emoji: "🥾" },
  cycling:           { label: "Cyclisme", color: "#f97316", bg: "rgba(249,115,22,0.12)",  emoji: "🚴" },
};

function getTypeConfig(t: string) {
  return TYPE_CONFIG[t] ?? { label: t, color: "#94a3b8", bg: "rgba(148,163,184,0.12)", emoji: "🏃" };
}

const HR_ZONE_COLORS = ["#64748b", "#38bdf8", "#4ade80", "#fb923c", "#f43f5e"];
const HR_ZONE_LABELS = ["Z1", "Z2", "Z3", "Z4", "Z5"];

// ─── Mock generators (deterministic) ─────────────────────────────────────────

function mkRng(seed: string, salt = 0) {
  let n = seed.split("").reduce((a, c) => a + c.charCodeAt(0), salt);
  return () => { n = (n * 1664525 + 1013904223) & 0xffffffff; return (n >>> 0) / 0xffffffff; };
}

function mockTrace(seed: string, n = 70): [number, number][] {
  const rng = mkRng(seed, 0);
  const pts: [number, number][] = [[0, 0]];
  for (let i = 1; i < n; i++)
    pts.push([pts[i-1][0] + (rng()-0.47)*5, pts[i-1][1] + (rng()-0.5)*4]);
  return pts;
}

function normalizePts(pts: [number, number][], W: number, H: number, pad = 8): [number, number][] {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sc = (v: number, lo: number, hi: number, a: number, b: number) =>
    lo === hi ? (a+b)/2 : a + ((v-lo)/(hi-lo))*(b-a);
  return pts.map(([x,y]) => [sc(x,x0,x1,pad,W-pad), sc(y,y0,y1,H-pad,pad)]);
}

function mockHrZones(seed: string): number[] {
  const rng = mkRng(seed, 42);
  const raw = [rng()*0.07, rng()*0.28, rng()*0.38, rng()*0.2, rng()*0.07];
  const sum = raw.reduce((a,b) => a+b, 0);
  return raw.map(v => Math.round((v/sum)*100));
}

function mockAvgHr(seed: string): number {
  const rng = mkRng(seed, 7);
  return 140 + Math.round(rng() * 34);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatPace(durationMin: number, distanceKm: number) {
  if (!distanceKm) return "—";
  const pace = durationMin / distanceKm;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}'${String(sec).padStart(2, "0")}"`;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m}min`;
}

// ─── Bento cell wrapper ───────────────────────────────────────────────────────

function BentoCell({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── Tracé SVG ───────────────────────────────────────────────────────────────

function TraceCell({ seed, color, inView }: { seed: string; color: string; inView: boolean }) {
  const W = 200, H = 120;
  const raw = useMemo(() => mockTrace(seed), [seed]);
  const pts = useMemo(() => normalizePts(raw, W, H), [raw]);
  const d = pts.map(([x,y],i) => `${i===0?"M":"L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const len = pts.reduce((acc,p,i) => i===0 ? 0 : acc + Math.hypot(p[0]-pts[i-1][0], p[1]-pts[i-1][1]), 0);
  const gid = `tg-${seed.slice(-5)}`;

  return (
    <BentoCell className="relative" style={{ background: `radial-gradient(ellipse at 50% 60%, ${color}08, transparent 70%)` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
      >
        <defs>
          <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke={color} strokeWidth="5" strokeOpacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
        <motion.path
          d={d} fill="none"
          stroke={`url(#${gid})`} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: len }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
        <circle cx={pts[0][0]} cy={pts[0][1]} r="3.5" fill={color} opacity="0.5" />
        <motion.circle
          cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.25 }}
        />
      </svg>
      <span className="absolute bottom-2 right-2.5 text-[8px] text-muted-foreground/30">tracé simulé</span>
    </BentoCell>
  );
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

function KpiCell({ distance, duration, avgHr, color }: { distance: number; duration: number; avgHr: number; color: string }) {
  const items = [
    { icon: Route,  label: "Distance", value: `${distance.toFixed(1)} km`       },
    { icon: Clock,  label: "Durée",    value: formatDuration(duration)           },
    { icon: Gauge,  label: "Allure",   value: formatPace(duration, distance)     },
    { icon: Heart,  label: "FC moy.",  value: `${avgHr} bpm`                    },
  ];

  return (
    <BentoCell className="grid grid-cols-2 gap-px bg-white/[0.04]">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-black/10 flex flex-col gap-1 p-3">
          <div className="flex items-center gap-1" style={{ color }}>
            <Icon className="w-2.5 h-2.5 opacity-70" />
            <span className="text-[9px] font-semibold uppercase tracking-widest opacity-60">{label}</span>
          </div>
          <span className="text-sm font-bold tabular-nums leading-tight">{value}</span>
        </div>
      ))}
    </BentoCell>
  );
}

// ─── Zones cardio ─────────────────────────────────────────────────────────────

function ZonesCell({ zones, inView }: { zones: number[]; inView: boolean }) {
  return (
    <BentoCell className="flex flex-col justify-center gap-1.5 px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-0.5">Zones cardio</p>
      {zones.map((pct, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[9px] font-bold w-4 text-right tabular-nums" style={{ color: HR_ZONE_COLORS[i] }}>
            {HR_ZONE_LABELS[i]}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: HR_ZONE_COLORS[i] }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: "easeOut" }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground/50 w-6 tabular-nums">{pct}%</span>
        </div>
      ))}
    </BentoCell>
  );
}

// ─── Card principale ──────────────────────────────────────────────────────────

interface Props {
  activity: ActivityListItem;
  index: number;
}

export function ActivityRichCard({ activity, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const cfg = getTypeConfig(activity.type);
  const [hovered, setHovered] = useState(false);

  const hrZones = useMemo(() => mockHrZones(activity.id), [activity.id]);
  const avgHr   = useMemo(() => mockAvgHr(activity.id),   [activity.id]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.4, delay: 0.04 + index * 0.06, ease: "easeOut" }}
    >
      <Link href={`/activites/${activity.id}`} className="block group h-full">
        <div
          className="liquid-glass-card rounded-2xl overflow-hidden relative transition-all duration-200 group-hover:brightness-105 h-full flex flex-col"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && <BorderBeam colorFrom={cfg.color} colorTo="#818cf8" duration={6} size={80} borderWidth={1} />}

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: cfg.bg }}
              >
                {cfg.emoji}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm leading-tight block truncate">{activity.title}</span>
                <span className="text-[10px] text-muted-foreground">{activity.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all duration-150" />
            </div>
          </div>

          {/* Bento body — 3 colonnes */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 p-2.5 flex-1">
            <KpiCell distance={activity.distance} duration={activity.duration} avgHr={avgHr} color={cfg.color} />
            <ZonesCell zones={hrZones} inView={inView} />
            <TraceCell seed={activity.id} color={cfg.color} inView={inView} />
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
