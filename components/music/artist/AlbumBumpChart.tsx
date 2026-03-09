"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BorderBeam } from "@/components/magicui/border-beam";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AlbumRankEntry {
  month: string; // "2024-10"
  album_name: string;
  album_year: number;
  rank: number;
  play_count: number;
  listen_time_minutes: number;
  cover_url?: string;
}

interface AlbumBumpChartProps {
  data?: AlbumRankEntry[];
  title?: string;
}

// ── Mock ──────────────────────────────────────────────────────────────────────

const COVERS: Record<string, string> = {
  "Hyperdrama":          "https://i.scdn.co/image/ab67616d0000b273730e327760fe592ad69bf18e",
  "Woman":               "https://i.scdn.co/image/ab67616d0000b273d4a2f9a24620e329d2db7078",
  "Woman Worldwide":     "https://i.scdn.co/image/ab67616d0000b27314a99b6cf89499f1c4ca200c",
  "†":                   "https://i.scdn.co/image/ab67616d0000b2731c0bcf8b536295438d26c70d",
  "Audio, Video, Disco.":"https://i.scdn.co/image/ab67616d0000b273f9171c2b7bab0956cdfbd1fa",
};

export const ALBUM_BUMP_MOCK: AlbumRankEntry[] = [
  // Mar 2024 — 4 albums (Hyperdrama pas encore sorti)
  { month: "2024-03", album_name: "†",                    album_year: 2007, rank: 1, play_count: 32, listen_time_minutes: 96,  cover_url: COVERS["†"] },
  { month: "2024-03", album_name: "Woman Worldwide",      album_year: 2018, rank: 2, play_count: 20, listen_time_minutes: 80,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-03", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 3, play_count: 12, listen_time_minutes: 48,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-03", album_name: "Woman",                album_year: 2016, rank: 4, play_count: 7,  listen_time_minutes: 28,  cover_url: COVERS["Woman"] },
  // Avr 2024
  { month: "2024-04", album_name: "Woman Worldwide",      album_year: 2018, rank: 1, play_count: 28, listen_time_minutes: 112, cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-04", album_name: "†",                    album_year: 2007, rank: 2, play_count: 25, listen_time_minutes: 75,  cover_url: COVERS["†"] },
  { month: "2024-04", album_name: "Woman",                album_year: 2016, rank: 3, play_count: 14, listen_time_minutes: 56,  cover_url: COVERS["Woman"] },
  { month: "2024-04", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 8,  listen_time_minutes: 32,  cover_url: COVERS["Audio, Video, Disco."] },
  // Mai 2024 — sortie Hyperdrama
  { month: "2024-05", album_name: "Hyperdrama",           album_year: 2024, rank: 1, play_count: 55, listen_time_minutes: 220, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-05", album_name: "†",                    album_year: 2007, rank: 2, play_count: 22, listen_time_minutes: 66,  cover_url: COVERS["†"] },
  { month: "2024-05", album_name: "Woman Worldwide",      album_year: 2018, rank: 3, play_count: 10, listen_time_minutes: 40,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-05", album_name: "Woman",                album_year: 2016, rank: 4, play_count: 6,  listen_time_minutes: 24,  cover_url: COVERS["Woman"] },
  { month: "2024-05", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 5, play_count: 3,  listen_time_minutes: 12,  cover_url: COVERS["Audio, Video, Disco."] },
  // Juin 2024
  { month: "2024-06", album_name: "Hyperdrama",           album_year: 2024, rank: 1, play_count: 48, listen_time_minutes: 192, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-06", album_name: "†",                    album_year: 2007, rank: 2, play_count: 30, listen_time_minutes: 90,  cover_url: COVERS["†"] },
  { month: "2024-06", album_name: "Woman",                album_year: 2016, rank: 3, play_count: 18, listen_time_minutes: 72,  cover_url: COVERS["Woman"] },
  { month: "2024-06", album_name: "Woman Worldwide",      album_year: 2018, rank: 4, play_count: 9,  listen_time_minutes: 36,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-06", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 5, play_count: 4,  listen_time_minutes: 16,  cover_url: COVERS["Audio, Video, Disco."] },
  // Juil 2024
  { month: "2024-07", album_name: "†",                    album_year: 2007, rank: 1, play_count: 40, listen_time_minutes: 120, cover_url: COVERS["†"] },
  { month: "2024-07", album_name: "Hyperdrama",           album_year: 2024, rank: 2, play_count: 35, listen_time_minutes: 140, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-07", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 3, play_count: 20, listen_time_minutes: 80,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-07", album_name: "Woman",                album_year: 2016, rank: 4, play_count: 10, listen_time_minutes: 40,  cover_url: COVERS["Woman"] },
  { month: "2024-07", album_name: "Woman Worldwide",      album_year: 2018, rank: 5, play_count: 5,  listen_time_minutes: 20,  cover_url: COVERS["Woman Worldwide"] },
  // Août 2024
  { month: "2024-08", album_name: "Hyperdrama",           album_year: 2024, rank: 1, play_count: 38, listen_time_minutes: 152, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-08", album_name: "†",                    album_year: 2007, rank: 2, play_count: 28, listen_time_minutes: 84,  cover_url: COVERS["†"] },
  { month: "2024-08", album_name: "Woman Worldwide",      album_year: 2018, rank: 3, play_count: 15, listen_time_minutes: 60,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-08", album_name: "Woman",                album_year: 2016, rank: 4, play_count: 9,  listen_time_minutes: 36,  cover_url: COVERS["Woman"] },
  { month: "2024-08", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 5, play_count: 4,  listen_time_minutes: 16,  cover_url: COVERS["Audio, Video, Disco."] },
  // Sep 2024
  { month: "2024-09", album_name: "Woman Worldwide",      album_year: 2018, rank: 1, play_count: 42, listen_time_minutes: 168, cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-09", album_name: "Hyperdrama",           album_year: 2024, rank: 2, play_count: 30, listen_time_minutes: 120, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-09", album_name: "†",                    album_year: 2007, rank: 3, play_count: 18, listen_time_minutes: 54,  cover_url: COVERS["†"] },
  { month: "2024-09", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 10, listen_time_minutes: 40,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-09", album_name: "Woman",                album_year: 2016, rank: 5, play_count: 3,  listen_time_minutes: 12,  cover_url: COVERS["Woman"] },
  // Oct 2024
  { month: "2024-10", album_name: "†",                    album_year: 2007, rank: 1, play_count: 34, listen_time_minutes: 102, cover_url: COVERS["†"] },
  { month: "2024-10", album_name: "Woman Worldwide",      album_year: 2018, rank: 2, play_count: 22, listen_time_minutes: 88,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-10", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 3, play_count: 14, listen_time_minutes: 56,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-10", album_name: "Hyperdrama",           album_year: 2024, rank: 4, play_count: 8,  listen_time_minutes: 32,  cover_url: COVERS["Hyperdrama"] },
  { month: "2024-10", album_name: "Woman",                album_year: 2016, rank: 5, play_count: 4,  listen_time_minutes: 16,  cover_url: COVERS["Woman"] },
  // Nov 2024
  { month: "2024-11", album_name: "Woman",                album_year: 2016, rank: 1, play_count: 36, listen_time_minutes: 144, cover_url: COVERS["Woman"] },
  { month: "2024-11", album_name: "†",                    album_year: 2007, rank: 2, play_count: 25, listen_time_minutes: 75,  cover_url: COVERS["†"] },
  { month: "2024-11", album_name: "Hyperdrama",           album_year: 2024, rank: 3, play_count: 18, listen_time_minutes: 72,  cover_url: COVERS["Hyperdrama"] },
  { month: "2024-11", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 9,  listen_time_minutes: 36,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-11", album_name: "Woman Worldwide",      album_year: 2018, rank: 5, play_count: 5,  listen_time_minutes: 20,  cover_url: COVERS["Woman Worldwide"] },
  // Déc 2024
  { month: "2024-12", album_name: "Hyperdrama",           album_year: 2024, rank: 1, play_count: 45, listen_time_minutes: 180, cover_url: COVERS["Hyperdrama"] },
  { month: "2024-12", album_name: "†",                    album_year: 2007, rank: 2, play_count: 28, listen_time_minutes: 84,  cover_url: COVERS["†"] },
  { month: "2024-12", album_name: "Woman Worldwide",      album_year: 2018, rank: 3, play_count: 16, listen_time_minutes: 64,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2024-12", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 8,  listen_time_minutes: 32,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2024-12", album_name: "Woman",                album_year: 2016, rank: 5, play_count: 3,  listen_time_minutes: 12,  cover_url: COVERS["Woman"] },
  // Jan 2025
  { month: "2025-01", album_name: "Hyperdrama",           album_year: 2024, rank: 1, play_count: 42, listen_time_minutes: 168, cover_url: COVERS["Hyperdrama"] },
  { month: "2025-01", album_name: "†",                    album_year: 2007, rank: 2, play_count: 30, listen_time_minutes: 90,  cover_url: COVERS["†"] },
  { month: "2025-01", album_name: "Woman Worldwide",      album_year: 2018, rank: 3, play_count: 18, listen_time_minutes: 72,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2025-01", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 10, listen_time_minutes: 40,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2025-01", album_name: "Woman",                album_year: 2016, rank: 5, play_count: 4,  listen_time_minutes: 16,  cover_url: COVERS["Woman"] },
  // Fév 2025
  { month: "2025-02", album_name: "†",                    album_year: 2007, rank: 1, play_count: 38, listen_time_minutes: 114, cover_url: COVERS["†"] },
  { month: "2025-02", album_name: "Hyperdrama",           album_year: 2024, rank: 2, play_count: 25, listen_time_minutes: 100, cover_url: COVERS["Hyperdrama"] },
  { month: "2025-02", album_name: "Woman",                album_year: 2016, rank: 3, play_count: 16, listen_time_minutes: 64,  cover_url: COVERS["Woman"] },
  { month: "2025-02", album_name: "Woman Worldwide",      album_year: 2018, rank: 4, play_count: 9,  listen_time_minutes: 36,  cover_url: COVERS["Woman Worldwide"] },
  { month: "2025-02", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 5, play_count: 4,  listen_time_minutes: 16,  cover_url: COVERS["Audio, Video, Disco."] },
  // Mar 2025
  { month: "2025-03", album_name: "Woman Worldwide",      album_year: 2018, rank: 1, play_count: 40, listen_time_minutes: 160, cover_url: COVERS["Woman Worldwide"] },
  { month: "2025-03", album_name: "†",                    album_year: 2007, rank: 2, play_count: 22, listen_time_minutes: 88,  cover_url: COVERS["†"] },
  { month: "2025-03", album_name: "Hyperdrama",           album_year: 2024, rank: 3, play_count: 15, listen_time_minutes: 60,  cover_url: COVERS["Hyperdrama"] },
  { month: "2025-03", album_name: "Audio, Video, Disco.", album_year: 2011, rank: 4, play_count: 8,  listen_time_minutes: 32,  cover_url: COVERS["Audio, Video, Disco."] },
  { month: "2025-03", album_name: "Woman",                album_year: 2016, rank: 5, play_count: 3,  listen_time_minutes: 12,  cover_url: COVERS["Woman"] },
];

// ── Fallback palette ──────────────────────────────────────────────────────────

const FALLBACK_PALETTE = [
  { solid: "#7dd3fc", glow: "rgba(125,211,252,0.3)" },
  { solid: "#f9a8d4", glow: "rgba(249,168,212,0.3)" },
  { solid: "#c4b5fd", glow: "rgba(196,181,253,0.3)" },
  { solid: "#fcd34d", glow: "rgba(252,211,77,0.28)"  },
  { solid: "#6ee7b7", glow: "rgba(110,231,183,0.28)" },
];

const MAX_ALBUMS = 5;

// ── Extract dominant color from image via canvas ───────────────────────────────

function extractDominantColor(url: string): Promise<{ solid: string; glow: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(FALLBACK_PALETTE[0]); return; }
        ctx.drawImage(img, 0, 0, 16, 16);
        const pixels = ctx.getImageData(0, 0, 16, 16).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const pr = pixels[i], pg = pixels[i + 1], pb = pixels[i + 2];
          const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
          if (max < 30 || max - min < 20) continue;
          r += pr; g += pg; b += pb; count++;
        }
        if (count === 0) { resolve(FALLBACK_PALETTE[0]); return; }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const avg = (r + g + b) / 3;
        const boost = 1.3;
        r = Math.min(255, Math.round(avg + (r - avg) * boost));
        g = Math.min(255, Math.round(avg + (g - avg) * boost));
        b = Math.min(255, Math.round(avg + (b - avg) * boost));
        resolve({
          solid: `rgb(${r},${g},${b})`,
          glow:  `rgba(${r},${g},${b},0.3)`,
        });
      } catch {
        resolve(FALLBACK_PALETTE[0]);
      }
    };
    img.onerror = () => resolve(FALLBACK_PALETTE[0]);
    img.src = url;
  });
}

// ── SVG helpers ───────────────────────────────────────────────────────────────

function catmullRomPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1, 1)
    .toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

// ── Layout constants ──────────────────────────────────────────────────────────

const VW      = 600;
const VH      = 200;
const COVER_R = 10;  // circle radius for covers
const PAD_R   = 4;
const PAD_TOP = COVER_R + 4;  // enough room for top circle
const PAD_BOT = 20;           // room for month labels

// ── Composant ─────────────────────────────────────────────────────────────────

export function AlbumBumpChart({ data = ALBUM_BUMP_MOCK, title = "Classement albums" }: AlbumBumpChartProps) {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);
  const [tooltipMonth, setTooltipMonth] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [coverColors, setCoverColors] = useState<Record<string, { solid: string; glow: string }>>({});

  // ── Top 5 albums par rang moyen, re-rankés par mois ──────────────────────
  const filteredData = useMemo(() => {
    const names = Array.from(new Set(data.map((d) => d.album_name)));
    const avgRank: Record<string, number> = {};
    for (const name of names) {
      const e = data.filter((d) => d.album_name === name);
      avgRank[name] = e.reduce((s, x) => s + x.rank, 0) / e.length;
    }
    const topSet = new Set(names.sort((a, b) => avgRank[a] - avgRank[b]).slice(0, MAX_ALBUMS));
    const perMonth = new Map<string, AlbumRankEntry[]>();
    for (const entry of data) {
      if (!topSet.has(entry.album_name)) continue;
      if (!perMonth.has(entry.month)) perMonth.set(entry.month, []);
      perMonth.get(entry.month)!.push(entry);
    }
    const result: AlbumRankEntry[] = [];
    for (const [, entries] of perMonth) {
      [...entries].sort((a, b) => a.rank - b.rank).forEach((e, i) =>
        result.push({ ...e, rank: i + 1 })
      );
    }
    return result;
  }, [data]);

  const months  = useMemo(() => Array.from(new Set(filteredData.map((d) => d.month))).sort(), [filteredData]);
  const maxRank = useMemo(() => Math.max(...filteredData.map((d) => d.rank)), [filteredData]);

  const albums = useMemo(() => {
    const names = Array.from(new Set(filteredData.map((d) => d.album_name)));
    const avgRank: Record<string, number> = {};
    for (const name of names) {
      const e = filteredData.filter((d) => d.album_name === name);
      avgRank[name] = e.reduce((s, x) => s + x.rank, 0) / e.length;
    }
    return names.sort((a, b) => avgRank[a] - avgRank[b]);
  }, [filteredData]);

  const albumMeta = useMemo(() => {
    const m: Record<string, { fallbackColor: typeof FALLBACK_PALETTE[0]; year: number; cover?: string }> = {};
    albums.forEach((name, i) => {
      const entry = filteredData.find((d) => d.album_name === name);
      m[name] = {
        fallbackColor: FALLBACK_PALETTE[i % FALLBACK_PALETTE.length],
        year:  entry?.album_year ?? 0,
        cover: entry?.cover_url ?? COVERS[name],
      };
    });
    return m;
  }, [albums, filteredData]);

  useEffect(() => {
    for (const name of albums) {
      const cover = albumMeta[name].cover;
      if (!cover || coverColors[name]) continue;
      extractDominantColor(cover).then((c) => {
        setCoverColors((prev) => ({ ...prev, [name]: c }));
      });
    }
  }, [albums, albumMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  const getColor = useCallback((name: string) => {
    return coverColors[name] ?? albumMeta[name]?.fallbackColor ?? FALLBACK_PALETTE[0];
  }, [coverColors, albumMeta]);

  const chartH = VH - PAD_TOP - PAD_BOT;
  // Curves span full width — covers sit on the first data point
  const chartW = VW - PAD_R - COVER_R * 2 - 4;
  const curveOffsetX = COVER_R * 2 + 4; // left margin so first circle fits

  const xOf = useCallback(
    (mi: number) => curveOffsetX + (mi / Math.max(months.length - 1, 1)) * chartW,
    [months.length, chartW, curveOffsetX]
  );
  const yOf = useCallback(
    (rank: number) => PAD_TOP + ((rank - 1) / Math.max(maxRank - 1, 1)) * chartH,
    [maxRank, chartH]
  );

  // First month entries — covers anchor on the first data point of each curve
  const firstMonth = months[0];
  const firstMonthEntries = useMemo(
    () => filteredData.filter((d) => d.month === firstMonth).sort((a, b) => a.rank - b.rank),
    [filteredData, firstMonth]
  );

  // Paths
  const albumPaths = useMemo(() => {
    return albums.map((name) => {
      const pts: { x: number; y: number; entry: AlbumRankEntry }[] = [];
      months.forEach((m, mi) => {
        const e = filteredData.find((d) => d.month === m && d.album_name === name);
        if (e) pts.push({ x: xOf(mi), y: yOf(e.rank), entry: e });
      });
      const segments: { x: number; y: number }[][] = [];
      let cur: { x: number; y: number }[] = [];
      let lastMi = -2;
      pts.forEach(({ x, y }, idx) => {
        const mi = months.indexOf(pts[idx].entry.month);
        if (mi !== lastMi + 1 && cur.length) { segments.push(cur); cur = []; }
        cur.push({ x, y });
        lastMi = mi;
      });
      if (cur.length) segments.push(cur);
      return { name, pts, path: segments.map(catmullRomPath).join(" ") };
    });
  }, [albums, months, filteredData, xOf, yOf]);

  // Tooltip entries
  const tooltipEntries = useMemo(() => {
    if (!tooltipMonth) return [];
    return filteredData
      .filter((d) => d.month === tooltipMonth)
      .sort((a, b) => a.rank - b.rank)
      .map((d) => ({ ...d, color: getColor(d.album_name) }));
  }, [tooltipMonth, filteredData, getColor]);

  // Snap to nearest month
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * VW;
      let closest = 0, minDist = Infinity;
      months.forEach((_, mi) => {
        const dist = Math.abs(svgX - xOf(mi));
        if (dist < minDist) { minDist = dist; closest = mi; }
      });
      setTooltipMonth(months[closest]);
    },
    [months, xOf]
  );

  const tooltipXPct = tooltipMonth
    ? (xOf(months.indexOf(tooltipMonth)) / VW) * 100
    : 50;

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-4 pt-3 pb-3 w-full relative">
      {hoveredAlbum && (
        <BorderBeam
          size={120}
          duration={5}
          colorFrom={getColor(hoveredAlbum).solid}
          colorTo="transparent"
          borderWidth={1}
        />
      )}

      {/* Titre */}
      <p className="text-[10px] font-light uppercase tracking-widest text-slate-500 mb-2 flex-shrink-0">
        {title}
      </p>

      {/* Corps — SVG full width */}
      <div className="flex-1 min-h-0 relative" style={{ minHeight: 160 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltipMonth(null)}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Circle clip per album */}
            {albums.map((name) => {
              const firstEntry = firstMonthEntries.find((e) => e.album_name === name);
              const cy = firstEntry ? yOf(firstEntry.rank) : yOf(albums.indexOf(name) + 1);
              const cx = xOf(0);
              const safeId = name.replace(/[^a-zA-Z0-9]/g, "_");
              return (
                <clipPath key={`clip-${name}`} id={`cover-clip-${safeId}`}>
                  <circle cx={cx} cy={cy} r={COVER_R} />
                </clipPath>
              );
            })}

            {/* Uniform solid stroke per album (no horizontal gradient — cleaner at 1.2px) */}
            {/* Glow filter per album — subtle aura */}
            {albums.map((name, i) => {
              const { solid } = getColor(name);
              return (
                <filter key={`glow-${i}`} id={`bump-glow-${i}`} x="-80%" y="-800%" width="260%" height="1700%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feFlood floodColor={solid} floodOpacity="0.3" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              );
            })}

            {/* Tooltip vertical line gradient */}
            <linearGradient id="vline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)"   />
            </linearGradient>
          </defs>

          {/* Baseline X-axis — very subtle */}
          <line
            x1={xOf(0)} y1={yOf(maxRank)}
            x2={VW - PAD_R} y2={yOf(maxRank)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.5}
          />

          {/* Month labels */}
          {months.map((m, mi) => {
            const skip = months.length > 8 && mi % 2 !== 0;
            if (skip) return null;
            return (
              <text
                key={m}
                x={xOf(mi)} y={VH - 5}
                textAnchor="middle"
                fontSize={7.5}
                fontWeight={300}
                fill="rgba(100,116,139,0.7)"
                fontFamily="inherit"
                letterSpacing={0.5}
              >
                {formatMonth(m)}
              </text>
            );
          })}

          {/* Tooltip vertical line */}
          <AnimatePresence>
            {tooltipMonth && (
              <motion.line
                key="vline"
                x1={xOf(months.indexOf(tooltipMonth))} y1={PAD_TOP}
                x2={xOf(months.indexOf(tooltipMonth))} y2={VH - PAD_BOT}
                stroke="url(#vline-grad)"
                strokeWidth={0.75}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.08 }}
              />
            )}
          </AnimatePresence>

          {/* Curves */}
          {albumPaths.map(({ name, path }, i) => {
            const isHov = hoveredAlbum === name;
            const isDim = hoveredAlbum !== null && !isHov;
            const { solid } = getColor(name);
            return (
              <motion.path
                key={name}
                d={path}
                fill="none"
                stroke={solid}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  strokeWidth: isHov ? 2 : 1.2,
                  opacity:     isDim ? 0.03 : isHov ? 1 : 0.75,
                }}
                transition={{ duration: 0.2 }}
                filter={isHov ? `url(#bump-glow-${i})` : undefined}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredAlbum(name)}
                onMouseLeave={() => setHoveredAlbum(null)}
              />
            );
          })}

          {/* Dots */}
          {albumPaths.map(({ name, pts }, i) => {
            const { solid, glow } = getColor(name);
            const isHov = hoveredAlbum === name;
            const isDim = hoveredAlbum !== null && !isHov;
            return pts.map(({ x, y, entry }) => {
              const isActive = tooltipMonth === entry.month;
              const show     = (isHov || isActive) && !isDim;
              return (
                <g key={`${name}-${entry.month}`}>
                  <AnimatePresence>
                    {show && (
                      <motion.circle
                        cx={x} cy={y} r={8}
                        fill="transparent"
                        stroke={glow}
                        strokeWidth={1}
                        initial={{ opacity: 0, r: 4 }}
                        animate={{ opacity: 0.4, r: 8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {show && (
                      <motion.circle
                        cx={x} cy={y}
                        fill={solid}
                        initial={{ opacity: 0, r: 0 }}
                        animate={{ opacity: isDim ? 0 : 0.95, r: 2.5 }}
                        exit={{ opacity: 0, r: 0 }}
                        transition={{ duration: 0.15 }}
                        filter={`url(#bump-glow-${i})`}
                        style={{ cursor: "pointer", mixBlendMode: "screen" }}
                        onMouseEnter={() => setHoveredAlbum(name)}
                        onMouseLeave={() => setHoveredAlbum(null)}
                      />
                    )}
                  </AnimatePresence>
                </g>
              );
            });
          })}

          {/* Covers — circles anchored on each album's first data point */}
          {albums.map((name) => {
            const firstEntry = firstMonthEntries.find((e) => e.album_name === name);
            if (!firstEntry) return null;
            const cx     = xOf(0);
            const cy     = yOf(firstEntry.rank);
            const isHov  = hoveredAlbum === name;
            const isDim  = hoveredAlbum !== null && !isHov;
            const { solid, glow } = getColor(name);
            const cover  = albumMeta[name].cover;
            const safeId = name.replace(/[^a-zA-Z0-9]/g, "_");
            return (
              <motion.g
                key={`cover-${name}`}
                style={{ cursor: "pointer" }}
                animate={{ opacity: isDim ? 0.08 : 1, scale: isHov ? 1.18 : 1 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setHoveredAlbum(name)}
                onMouseLeave={() => setHoveredAlbum(null)}
              >
                {/* Glow halo on hover */}
                {isHov && (
                  <circle
                    cx={cx} cy={cy} r={COVER_R + 5}
                    fill="none"
                    stroke={glow}
                    strokeWidth={6}
                    opacity={0.3}
                  />
                )}
                {/* Ring border */}
                <circle
                  cx={cx} cy={cy} r={COVER_R}
                  fill="none"
                  stroke={isHov ? solid : "rgba(255,255,255,0.1)"}
                  strokeWidth={0.5}
                  style={{ transition: "stroke 0.2s" }}
                />
                {/* Cover image clipped to circle */}
                {cover ? (
                  <image
                    href={cover}
                    x={cx - COVER_R} y={cy - COVER_R}
                    width={COVER_R * 2} height={COVER_R * 2}
                    clipPath={`url(#cover-clip-${safeId})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle
                    cx={cx} cy={cy} r={COVER_R}
                    fill="rgba(255,255,255,0.08)"
                  />
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltipMonth && tooltipEntries.length > 0 && (
            <motion.div
              key={tooltipMonth}
              className="absolute pointer-events-none z-20"
              style={{
                left:      `${Math.min(Math.max(tooltipXPct, 8), 78)}%`,
                top:       "4%",
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div
                className="rounded-xl px-3 py-2.5 min-w-[148px]"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: "rgba(10,10,18,0.55)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-[9px] font-light uppercase tracking-widest text-slate-500 mb-2">
                  {formatMonth(tooltipMonth)}
                </p>
                {tooltipEntries.map((e) => (
                  <div key={e.album_name} className="flex items-center gap-2 mb-1 last:mb-0">
                    <span
                      className="text-[9px] font-light w-3 text-right tabular-nums"
                      style={{ color: e.color.solid }}
                    >
                      {e.rank}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: e.color.solid, boxShadow: `0 0 4px ${e.color.glow}` }}
                    />
                    <span
                      className={`flex-1 truncate text-[11px] font-normal transition-opacity ${
                        hoveredAlbum && hoveredAlbum !== e.album_name ? "opacity-20" : ""
                      }`}
                    >
                      {e.album_name}
                    </span>
                    <span className="text-slate-500 tabular-nums text-[9px]">{e.play_count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
