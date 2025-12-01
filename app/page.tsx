"use client";

import { useState, useEffect } from "react";
import { MusicDashboardData } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  Sparkles,
  Activity,
  FileText,
  Globe,
  Heart,
  Zap,
  Clock,
  Target,
  Award,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Moon,
  User,
  Footprints,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SleepStagesChart } from "@/components/sleep-stages-chart";

export default function Home() {
  const [showArtists, setShowArtists] = useState(true);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; month: string; km2025: number; km2024: number } | null>(null);
  const [musicData, setMusicData] = useState<MusicDashboardData | null>(null);
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [sleepData, setSleepData] = useState<any[] | undefined>(undefined);
  const [loadingSleep, setLoadingSleep] = useState(true);

  useEffect(() => {
    async function fetchMusicData() {
      try {
        const res = await fetch('/api/homepage/music?period=last_7_days');
        if (res.ok) {
          const data = await res.json();
          setMusicData(data);
        }
      } catch (error) {
        console.error("Failed to fetch music data", error);
      } finally {
        setLoadingMusic(false);
      }
    }
    fetchMusicData();
  }, []);

  useEffect(() => {
    async function fetchSleepData() {
      try {
        const res = await fetch('/api/homepage/sleep/stages');
        if (res.ok) {
          const data = await res.json();
          console.log('Sleep data received:', data);
          console.log('Number of records:', data?.length);
          setSleepData(data);
        } else {
          console.error('API error:', res.status, await res.text());
        }
      } catch (error) {
        console.error("Failed to fetch sleep data", error);
      } finally {
        setLoadingSleep(false);
      }
    }
    fetchSleepData();
  }, []);

  // Données pour le graphique de progression (valeurs cumulées par mois)
  // 2025: s'arrête fin août (on est en septembre, donc pas de données pour sep-déc)
  const runningData2025 = [0, 18, 42, 68, 95, 125, 158, 189, 215, 215, 215, 215]; // km cumulés par mois
  // 2024: année complète
  const runningData2024 = [0, 15, 38, 62, 88, 115, 145, 172, 195, 221, 248, 278];

  const handleRunningChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const chartWidth = rect.width;

    // Calculer le mois basé sur la position x (0-11 pour 12 mois)
    const monthIndex = Math.floor((x / chartWidth) * 12);
    const clampedIndex = Math.max(0, Math.min(11, monthIndex));

    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    setTooltipData({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      month: months[clampedIndex],
      km2025: runningData2025[clampedIndex],
      km2024: runningData2024[clampedIndex]
    });
  };

  const handleRunningChartMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos activités</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">

        {/* Health Metrics Gauges - 2x1 - Left column (health) row 1 */}
        <Card className="md:col-span-2 md:col-start-1 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Indicateurs Santé</CardTitle>
            <CardDescription className="text-xs">Valeurs actuelles</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="grid grid-cols-4 gap-4">
              {/* Sleep Score Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    {/* Progress circle - 88% */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-blue-500"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.88)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">88</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">Sommeil</div>
              </div>

              {/* HRV Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    {/* Progress circle - 58/100 = 58% */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-green-500"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.58)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">58</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">HRV (ms)</div>
              </div>

              {/* Resting Heart Rate Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    {/* Progress circle - Lower is better, 52/100 = inverse 48% */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-orange-500"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.52)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">52</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">BPM repos</div>
              </div>

              {/* Body Battery Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted opacity-20"
                    />
                    {/* Progress circle - 75% */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-purple-500"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.75)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">75</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">Body Battery</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Chart - 1x1 - Left column row 2 */}
        <Card className="md:col-span-1 md:col-start-1 md:row-start-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Sommeil</CardTitle>
            <CardDescription className="text-xs">7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="pt-1 pb-3">
            <div className="relative h-24 mb-6">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
              </div>

              {/* Bar Chart - Mock data structure that will come from API */}
              <div className="flex items-end h-full gap-2 px-1">
                {[
                  { day: 'L', score: 55, isLow: false },
                  { day: 'M', score: 75, isLow: false },
                  { day: 'M', score: 38, isLow: true },
                  { day: 'J', score: 78, isLow: false },
                  { day: 'V', score: 69, isLow: false },
                  { day: 'S', score: 85, isLow: false },
                  { day: 'D', score: 88, isLow: false },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-end relative">
                    <span className={`text-xs font-medium mb-1 ${data.isLow ? 'opacity-60' : ''}`}>
                      {data.score}
                    </span>
                    <div
                      className={`w-full bg-foreground rounded-t ${data.isLow ? 'opacity-60' : ''}`}
                      style={{ height: `${data.score}%` }}
                    ></div>
                    {/* Day label directly below each bar */}
                    <span className="absolute -bottom-6 text-xs text-muted-foreground">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HRV Recent Days - 1x1 - Left column row 2 */}
        <Card className="md:col-span-1 md:col-start-2 md:row-start-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">HRV</CardTitle>
            <CardDescription className="text-xs">7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-3xl font-bold">58</div>
                <p className="text-xs text-muted-foreground">ms</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Baseline: 52ms
              </div>
            </div>

            <div className="relative h-24">
              {/* Baseline zone */}
              <div className="absolute inset-x-0 top-[30%] h-[40%] bg-green-500/10 rounded"></div>

              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between h-full gap-1.5">
                {/* J-6: 52ms (65%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">52</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '65%' }}></div>
                </div>

                {/* J-5: 48ms (60%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5 opacity-60">48</span>
                  <div className="w-full bg-foreground opacity-60 rounded-t" style={{ height: '60%' }}></div>
                </div>

                {/* J-4: 55ms (68%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">55</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '68%' }}></div>
                </div>

                {/* J-3: 61ms (76%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">61</span>
                  <div className="w-full bg-green-500 rounded-t" style={{ height: '76%' }}></div>
                </div>

                {/* J-2: 54ms (67%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">54</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '67%' }}></div>
                </div>

                {/* J-1: 50ms (62%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">50</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '62%' }}></div>
                </div>

                {/* Aujourd'hui: 58ms (72%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5 text-blue-500">58</span>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: '72%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weight Trend - 1x1 - Left column row 3 */}
        <Card className="md:col-span-1 md:col-start-1 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Poids</CardTitle>
            <CardDescription className="text-xs">Tendance 30 jours</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-3xl font-bold">72.5</div>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-semibold">-1.2 kg</span>
              </div>
            </div>

            <div className="relative h-24">
              {/* Target zone */}
              <div className="absolute inset-x-0 top-[40%] h-[20%] bg-green-500/10 rounded"></div>

              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
              </div>

              {/* Line chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points="0,35 10,36 20,37 30,38 40,40 50,42 60,45 70,47 80,48 90,49 100,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-blue-500"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="mt-3 pt-2 border-t flex justify-between text-xs">
              <div>
                <div className="text-muted-foreground">Objectif</div>
                <div className="font-semibold">71.0 kg</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Reste</div>
                <div className="font-semibold">-1.5 kg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Stress - 1x1 - Left column row 3 */}
        <Card className="md:col-span-1 md:col-start-2 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Stress quotidien</CardTitle>
            <CardDescription className="text-xs">Aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="w-15 h-15 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <span className="text-1xl font-bold text-green-500">32</span>
              </div>
              <span className="text-sm px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 font-medium">Faible</span>
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-center text-muted-foreground">
              Échelle 0-100
            </div>
          </CardContent>
        </Card>

        {/* Sleep Stages Chart (Apple Health Style) - 2x1 - Left column row 5 */}
        <div className="md:col-span-2 md:col-start-1 md:row-start-5">
          <SleepStagesChart data={sleepData} />
        </div>

        {/* Spotify Listening Time Chart - 2x1 - Right column row 1 */}
        <Card className="md:col-span-2 md:col-start-5 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-1 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <CardTitle>Temps d'écoute</CardTitle>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">4h 12m</div>
                <p className="text-xs text-muted-foreground">Moyenne/jour</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-8">
            <div className="relative h-24 mb-6">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between h-full gap-2 px-1">
                {loadingMusic ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Chargement...</div>
                ) : musicData?.listeningTime?.days.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className={`text-xs font-medium mb-1 ${day.heightPercentage < 50 ? 'opacity-60' : ''}`}>{day.formatted}</span>
                    <div
                      className={`w-full bg-foreground rounded-t ${day.heightPercentage < 50 ? 'opacity-60' : ''}`}
                      style={{ height: `${day.heightPercentage}%` }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Day labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground px-1">
                {loadingMusic ? null : musicData?.listeningTime?.days.map((day, index) => (
                  <span key={index} className="flex-1 text-center">{day.day}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Artists/Tracks - 2x3 - Right column under Temps d'écoute */}
        <Card className="md:col-span-2 md:row-span-3 md:col-start-5 md:row-start-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showArtists ? <User className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                <CardTitle>{showArtists ? "Top Artistes" : "Top Titres"}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={showArtists ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowArtists(true)}
                  className="h-7 px-2"
                >
                  <User className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={!showArtists ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowArtists(false)}
                  className="h-7 px-2"
                >
                  <Music className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {loadingMusic ? (
                <div className="text-center py-10 text-muted-foreground">Chargement...</div>
              ) : showArtists ? (
                <>
                  {musicData?.topArtists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-sm font-semibold w-5 ${index < 3 ? '' : 'text-xs text-muted-foreground'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : artist.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{artist.name}</div>
                          <div className="text-xs text-muted-foreground">{artist.trackCount} titres</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{artist.totalDuration}</div>
                        <div className="text-xs text-muted-foreground">{artist.playCount} plays</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {musicData?.topTracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-sm font-semibold w-5 ${index < 3 ? '' : 'text-xs text-muted-foreground'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : track.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{track.name}</div>
                          <div className="text-xs text-muted-foreground">{track.artistName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{track.totalDuration}</div>
                        <div className="text-xs text-muted-foreground">{track.playCount} plays</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div >
          </CardContent >
        </Card >

  {/* Running Card with Aerobic/Anaerobic Chart - 2x2 - Central column row 1-2 */ }
  < Card className = "md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Footprints className="h-5 w-5" />
                <CardTitle className="text-sm">Course à pied</CardTitle>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Objectif atteint
              </span>
            </div>
            <CardDescription className="text-xs">Scores Aérobie / Anaérobie</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            {/* Stats du haut */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold">18.5</div>
                <div className="text-xs text-muted-foreground">km total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4</div>
                <div className="text-xs text-muted-foreground">sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.6</div>
                <div className="text-xs text-muted-foreground">km/session</div>
              </div>
            </div>

            {/* Mini bar chart pour km par jour */}
            <div className="relative h-12 mb-3">
              <div className="flex items-end justify-between h-full gap-1">
                {[
                  { day: 'L', km: 0 },
                  { day: 'M', km: 5.2 },
                  { day: 'M', km: 0 },
                  { day: 'J', km: 4.8 },
                  { day: 'V', km: 8.5 },
                  { day: 'S', km: 0 },
                  { day: 'D', km: 0 },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-end relative">
                    {data.km > 0 && (
                      <>
                        <span className="text-[8px] font-medium mb-0.5">{data.km}</span>
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(data.km / 8.5) * 100}%` }}></div>
                      </>
                    )}
                    {data.km === 0 && <div className="w-full h-1 bg-muted rounded"></div>}
                    <span className="absolute -bottom-4 text-[9px] text-muted-foreground">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symmetric bar chart pour aérobie/anaérobie */}
            <div className="relative h-32 mb-2 mt-6">
              {/* Zero line */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-border"></div>

              <div className="flex items-center justify-between h-full gap-1.5">
                {[
                  { day: 'L', aerobic: 0, anaerobic: 0 },
                  { day: 'M', aerobic: 85, anaerobic: 15 },
                  { day: 'M', aerobic: 0, anaerobic: 0 },
                  { day: 'J', aerobic: 78, anaerobic: 22 },
                  { day: 'V', aerobic: 92, anaerobic: 38 },
                  { day: 'S', aerobic: 0, anaerobic: 0 },
                  { day: 'D', aerobic: 0, anaerobic: 0 },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-center">
                    {/* Aerobic (top half) */}
                    <div className="w-full flex items-end justify-center" style={{ height: '50%' }}>
                      {data.aerobic > 0 && (
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${data.aerobic}%` }} title={`Aérobie: ${data.aerobic}`}></div>
                      )}
                    </div>
                    {/* Anaerobic (bottom half) */}
                    <div className="w-full flex items-start justify-center" style={{ height: '50%' }}>
                      {data.anaerobic > 0 && (
                        <div className="w-full bg-orange-500 rounded-b" style={{ height: `${data.anaerobic}%` }} title={`Anaérobie: ${data.anaerobic}`}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Aérobie</span>
                <span className="text-green-500 font-medium text-[10px]">(+5 max)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-muted-foreground">Anaérobie</span>
                <span className="text-orange-500 font-medium text-[10px]">(-5 max)</span>
              </div>
            </div>
          </CardContent>
        </Card >

  {/* Weekly Running Volume - 1x1 - Central column row 3 */ }
  < Card className = "md:col-span-1 md:col-start-3 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Volume hebdomadaire</CardTitle>
            <CardDescription className="text-xs">10 dernières semaines</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="relative h-32">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
                <div className="h-px bg-border opacity-20"></div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between h-full gap-1">
                {/* S-10: 22 km (55%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">22</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '55%' }}></div>
                </div>

                {/* S-9: 28 km (70%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">28</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '70%' }}></div>
                </div>

                {/* S-8: 18 km (45%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5 opacity-60">18</span>
                  <div className="w-full bg-foreground opacity-60 rounded-t" style={{ height: '45%' }}></div>
                </div>

                {/* S-7: 32 km (80%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">32</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '80%' }}></div>
                </div>

                {/* S-6: 25 km (62.5%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">25</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '62.5%' }}></div>
                </div>

                {/* S-5: 35 km (87.5%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">35</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '87.5%' }}></div>
                </div>

                {/* S-4: 30 km (75%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">30</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '75%' }}></div>
                </div>

                {/* S-3: 38 km (95%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">38</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '95%' }}></div>
                </div>

                {/* S-2: 40 km (100%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5">40</span>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }}></div>
                </div>

                {/* S-1 (semaine en cours): 18.5 km (46.25%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] font-medium mb-0.5 text-blue-500">18.5</span>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: '46.25%' }}></div>
                </div>
              </div>
            </div>

            {/* Stats en dessous */}
            <div className="mt-3 pt-2 border-t flex justify-between text-xs">
              <div>
                <div className="text-muted-foreground">Moyenne</div>
                <div className="font-semibold">28.7 km</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Max</div>
                <div className="font-semibold">40 km</div>
              </div>
            </div>
          </CardContent>
        </Card >

  {/* Training Status - 1x1 - Central column row 4 */ }
  < Card className = "md:col-span-1 md:col-start-3 md:row-start-4 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Status d'entraînement</CardTitle>
            <CardDescription className="text-xs">Forme actuelle</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <span className="text-sm px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 font-medium">Productif</span>
            </div>
          </CardContent>
        </Card >

  {/* Acute:Chronic Workload Ratio - 1x1 - Central column row 5 */ }
  < Card className = "md:col-span-1 md:col-start-3 md:row-start-5 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Ratio de charge</CardTitle>
            <CardDescription className="text-xs">Aiguë / Chronique</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-2">
            <div className="space-y-2.5">
              {/* Ratio principal */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Ratio actuel</div>
                  <div className="text-2xl font-bold">1.15</div>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>

              {/* Zone de sécurité */}
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Zone (0.8 - 1.3)</div>
                <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                  {/* Zone rouge basse < 0.8 */}
                  <div className="absolute left-0 top-0 h-full bg-red-500/30" style={{ width: '20%' }}></div>
                  {/* Zone verte 0.8 - 1.3 */}
                  <div className="absolute left-[20%] top-0 h-full bg-green-500/30" style={{ width: '50%' }}></div>
                  {/* Zone rouge haute > 1.3 */}
                  <div className="absolute left-[70%] top-0 h-full bg-red-500/30" style={{ width: '30%' }}></div>
                  {/* Indicateur position actuelle (1.15 = 57.5% de l'échelle 0-2) */}
                  <div className="absolute top-0 h-full w-1 bg-blue-500 shadow-sm" style={{ left: '57.5%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >

  {/* VO2 Max Trend - 1x1 - Central column row 6 */ }
  < Card className = "md:col-span-1 md:col-start-4 md:row-start-5 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">VO2 Max</CardTitle>
            <CardDescription className="text-xs">Tendance 6 mois</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-3xl font-bold">54</div>
                <p className="text-xs text-muted-foreground">ml/kg/min</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">+2</span>
              </div>
            </div>

            <div className="relative h-20 mt-3">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
              </div>

              {/* Line chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points="0,60 17,58 33,55 50,52 67,48 83,45 100,40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-green-500"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </CardContent>
        </Card >

  {/* Race Predictions - 1x2 - Column 4 row 3 */ }
  < Card className = "md:col-span-1 md:row-span-2 md:col-start-4 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Prédictions courses</CardTitle>
            <CardDescription className="text-xs">Temps estimés</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="space-y-3">
              {/* 5K */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">5K</div>
                  <div className="text-xl font-bold">20:25</div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">-1:15</span>
                </div>
              </div>

              {/* 10K */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">10K</div>
                  <div className="text-xl font-bold">42:15</div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">-2:30</span>
                </div>
              </div>

              {/* Semi Marathon */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Semi-Marathon</div>
                  <div className="text-xl font-bold">1:32:45</div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">-5:15</span>
                </div>
              </div>

              {/* Marathon */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Marathon</div>
                  <div className="text-xl font-bold">3:18:30</div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">-12:20</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >

  {/* Annual Running Distance - 1x1 - Central column row 7 */ }
  < Card className = "md:col-span-1 md:col-start-3 md:row-start-7 hover:shadow-lg transition-shadow overflow-hidden" >
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Kilométrage annuel</CardTitle>
            <CardDescription className="text-xs">Au même jour</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="space-y-4">
              {/* 2025 - Année en cours */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">2025</span>
                  <span className="text-2xl font-bold">215 km</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* 2024 - Année précédente au même jour */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">2024</span>
                  <span className="text-2xl font-bold opacity-60">195 km</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground opacity-40 rounded-full" style={{ width: '90.7%' }}></div>
                </div>
              </div>

              {/* Comparaison */}
              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Différence</span>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">+20 km</span>
                  <span className="text-xs text-muted-foreground ml-1">(+10.3%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >

  {/* Running Progress Year Comparison - 1x1 - Central column row 8 */ }
  < Card className = "md:col-span-1 md:col-start-3 md:row-start-8 hover:shadow-lg transition-shadow overflow-hidden relative" >
          <CardHeader className="pb-0 pt-3">
            <CardTitle className="text-sm">Progression annuelle</CardTitle>
            <CardDescription className="text-xs">Cumul km à date</CardDescription>
          </CardHeader>
          <CardContent className="pt-1 pb-2">
            {/* Interactive Tooltip */}
            {tooltipData && (
              <div
                className="absolute bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md z-20 whitespace-nowrap text-xs pointer-events-none"
                style={{
                  left: `${tooltipData.x}px`,
                  top: `${tooltipData.y - 60}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-semibold mb-1">{tooltipData.month}</div>
                <div className="space-y-0.5">
                  <div className="text-blue-500 font-medium">2025: {tooltipData.km2025} km</div>
                  <div className="opacity-60">2024: {tooltipData.km2024} km</div>
                </div>
              </div>
            )}

            <div
              className="relative h-[140px] cursor-crosshair"
              onMouseMove={handleRunningChartMouseMove}
              onMouseLeave={handleRunningChartMouseLeave}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[30px]">
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
                <div className="h-px bg-border opacity-10"></div>
              </div>

              {/* SVG for line chart */}
              <svg className="w-full h-[calc(100%-30px)]" viewBox="0 0 365 100" preserveAspectRatio="none">
                {/* 2024 curve (previous year) - dashed, année complète */}
                <polyline
                  points="0,95 10,93 20,91 30,89 40,87 50,85 60,83 70,81 80,79 90,77 100,75 110,73 120,71 130,69 140,67 150,66 160,65 170,64 180,63 190,62 200,61 210,60 220,59 230,58 240,58 250,57 260,57 270,56 280,56 290,56 300,55 310,55 320,55 330,55 340,55 350,55 365,55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  className="opacity-40"
                  vectorEffect="non-scaling-stroke"
                />

                {/* 2025 curve (current year) - solid, s'arrête fin août (jour ~243) puis plateau */}
                <polyline
                  points="0,95 10,92 20,89 30,86 40,83 50,80 60,77 70,74 80,71 90,68 100,65 110,62 120,60 130,58 140,56 150,54 160,52 170,50 180,48 190,46 200,44 210,42 220,41 230,40 240,39 243,38 250,38 260,38 270,38 280,38 290,38 300,38 310,38 320,38 330,38 340,38 350,38 365,38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-blue-500"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* X-axis labels (months) */}
              <div className="absolute bottom-[14px] left-0 right-0 flex justify-between text-[9px] text-muted-foreground px-1">
                <span>J</span>
                <span>F</span>
                <span>M</span>
                <span>A</span>
                <span>M</span>
                <span>J</span>
                <span>J</span>
                <span>A</span>
                <span>S</span>
                <span>O</span>
                <span>N</span>
                <span>D</span>
              </div>

              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 text-[9px]">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-0.5 bg-blue-500"></div>
                  <span className="text-muted-foreground">2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-0.5 bg-foreground opacity-40 border-dashed" style={{ borderTop: '1px dashed currentColor', height: 0 }}></div>
                  <span className="text-muted-foreground">2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >

      </div >
    </div >
  );
}
