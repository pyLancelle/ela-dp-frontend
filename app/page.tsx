"use client";

import { useState } from "react";
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

export default function Home() {
  const [showArtists, setShowArtists] = useState(true);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; month: string; km2025: number; km2024: number } | null>(null);

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

        {/* Sleep Chart - 2x1 */}
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-1 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <CardTitle>Sommeil</CardTitle>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">82</div>
                <p className="text-xs text-muted-foreground">Score moyen</p>
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
                {/* Lun - 55% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">55</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '55%' }}></div>
                </div>

                {/* Mar - 75% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">75</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '75%' }}></div>
                </div>

                {/* Mer - 38% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1 opacity-60">38</span>
                  <div className="w-full bg-foreground opacity-60 rounded-t" style={{ height: '38%' }}></div>
                </div>

                {/* Jeu - 78% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">78</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '78%' }}></div>
                </div>

                {/* Ven - 69% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">69</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '69%' }}></div>
                </div>

                {/* Sam - 85% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">85</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '85%' }}></div>
                </div>

                {/* Dim - 88% */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">88</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '88%' }}></div>
                </div>
              </div>

              {/* Day labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground px-1">
                <span className="flex-1 text-center">Lun</span>
                <span className="flex-1 text-center">Mar</span>
                <span className="flex-1 text-center">Mer</span>
                <span className="flex-1 text-center">Jeu</span>
                <span className="flex-1 text-center">Ven</span>
                <span className="flex-1 text-center">Sam</span>
                <span className="flex-1 text-center">Dim</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spotify Listening Time Chart - 2x1 - Right column */}
        <Card className="md:col-span-2 md:col-start-5 hover:shadow-lg transition-shadow overflow-hidden">
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
                {/* Lun - 3h 15m (65%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">3h 15m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '65%' }}></div>
                </div>

                {/* Mar - 5h 30m (92%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">5h 30m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '92%' }}></div>
                </div>

                {/* Mer - 2h 45m (46%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1 opacity-60">2h 45m</span>
                  <div className="w-full bg-foreground opacity-60 rounded-t" style={{ height: '46%' }}></div>
                </div>

                {/* Jeu - 4h 20m (72%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">4h 20m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '72%' }}></div>
                </div>

                {/* Ven - 3h 50m (64%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">3h 50m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '64%' }}></div>
                </div>

                {/* Sam - 6h 00m (100%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">6h 00m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '100%' }}></div>
                </div>

                {/* Dim - 3h 30m (58%) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-xs font-medium mb-1">3h 30m</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '58%' }}></div>
                </div>
              </div>

              {/* Day labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground px-1">
                <span className="flex-1 text-center">Lun</span>
                <span className="flex-1 text-center">Mar</span>
                <span className="flex-1 text-center">Mer</span>
                <span className="flex-1 text-center">Jeu</span>
                <span className="flex-1 text-center">Ven</span>
                <span className="flex-1 text-center">Sam</span>
                <span className="flex-1 text-center">Dim</span>
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
              {showArtists ? (
                <>
                  {/* Artist 1 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥇</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">The Weeknd</div>
                        <div className="text-xs text-muted-foreground">42 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">12h 34m</div>
                      <div className="text-xs text-muted-foreground">342 plays</div>
                    </div>
                  </div>

                  {/* Artist 2 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥈</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Daft Punk</div>
                        <div className="text-xs text-muted-foreground">38 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">10h 22m</div>
                      <div className="text-xs text-muted-foreground">289 plays</div>
                    </div>
                  </div>

                  {/* Artist 3 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥉</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Arctic Monkeys</div>
                        <div className="text-xs text-muted-foreground">31 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">8h 45m</div>
                      <div className="text-xs text-muted-foreground">234 plays</div>
                    </div>
                  </div>

                  {/* Artist 4 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">4</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Tame Impala</div>
                        <div className="text-xs text-muted-foreground">28 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">7h 18m</div>
                      <div className="text-xs text-muted-foreground">198 plays</div>
                    </div>
                  </div>

                  {/* Artist 5 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">5</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Flume</div>
                        <div className="text-xs text-muted-foreground">24 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">6h 52m</div>
                      <div className="text-xs text-muted-foreground">176 plays</div>
                    </div>
                  </div>

                  {/* Artist 6 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">6</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Frank Ocean</div>
                        <div className="text-xs text-muted-foreground">22 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">5h 30m</div>
                      <div className="text-xs text-muted-foreground">145 plays</div>
                    </div>
                  </div>

                  {/* Artist 7 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">7</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Radiohead</div>
                        <div className="text-xs text-muted-foreground">19 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">4h 55m</div>
                      <div className="text-xs text-muted-foreground">132 plays</div>
                    </div>
                  </div>

                  {/* Artist 8 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">8</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Bon Iver</div>
                        <div className="text-xs text-muted-foreground">17 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">4h 12m</div>
                      <div className="text-xs text-muted-foreground">118 plays</div>
                    </div>
                  </div>

                  {/* Artist 9 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">9</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Mac DeMarco</div>
                        <div className="text-xs text-muted-foreground">15 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">3h 48m</div>
                      <div className="text-xs text-muted-foreground">102 plays</div>
                    </div>
                  </div>

                  {/* Artist 10 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">10</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Phoenix</div>
                        <div className="text-xs text-muted-foreground">14 titres</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">3h 21m</div>
                      <div className="text-xs text-muted-foreground">89 plays</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Track 1 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥇</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Blinding Lights</div>
                        <div className="text-xs text-muted-foreground">The Weeknd</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">3h 45m</div>
                      <div className="text-xs text-muted-foreground">68 plays</div>
                    </div>
                  </div>

                  {/* Track 2 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥈</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">One More Time</div>
                        <div className="text-xs text-muted-foreground">Daft Punk</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">3h 12m</div>
                      <div className="text-xs text-muted-foreground">52 plays</div>
                    </div>
                  </div>

                  {/* Track 3 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-semibold w-5">🥉</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Do I Wanna Know?</div>
                        <div className="text-xs text-muted-foreground">Arctic Monkeys</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2h 56m</div>
                      <div className="text-xs text-muted-foreground">47 plays</div>
                    </div>
                  </div>

                  {/* Track 4 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">4</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">The Less I Know The Better</div>
                        <div className="text-xs text-muted-foreground">Tame Impala</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2h 34m</div>
                      <div className="text-xs text-muted-foreground">42 plays</div>
                    </div>
                  </div>

                  {/* Track 5 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">5</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Never Be Like You</div>
                        <div className="text-xs text-muted-foreground">Flume</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2h 18m</div>
                      <div className="text-xs text-muted-foreground">38 plays</div>
                    </div>
                  </div>

                  {/* Track 6 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">6</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Nights</div>
                        <div className="text-xs text-muted-foreground">Frank Ocean</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2h 02m</div>
                      <div className="text-xs text-muted-foreground">31 plays</div>
                    </div>
                  </div>

                  {/* Track 7 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">7</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Karma Police</div>
                        <div className="text-xs text-muted-foreground">Radiohead</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">1h 51m</div>
                      <div className="text-xs text-muted-foreground">28 plays</div>
                    </div>
                  </div>

                  {/* Track 8 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">8</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Holocene</div>
                        <div className="text-xs text-muted-foreground">Bon Iver</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">1h 42m</div>
                      <div className="text-xs text-muted-foreground">25 plays</div>
                    </div>
                  </div>

                  {/* Track 9 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">9</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Chamber of Reflection</div>
                        <div className="text-xs text-muted-foreground">Mac DeMarco</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">1h 33m</div>
                      <div className="text-xs text-muted-foreground">23 plays</div>
                    </div>
                  </div>

                  {/* Track 10 */}
                  <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">10</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">1901</div>
                        <div className="text-xs text-muted-foreground">Phoenix</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">1h 24m</div>
                      <div className="text-xs text-muted-foreground">21 plays</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Running Card with Aerobic/Anaerobic Chart - 2x2 - Column 2, Row 1-2 */}
        <Card className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Footprints className="h-5 w-5" />
                <CardTitle>Course à pied</CardTitle>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Objectif atteint</span>
                </div>
              </div>
            </div>
            <CardDescription>Scores Aérobie / Anaérobie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Métriques principales */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">18.5</div>
                <p className="text-xs text-muted-foreground">km total</p>
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">sessions</p>
              </div>
              <div>
                <div className="text-2xl font-bold">4.6</div>
                <p className="text-xs text-muted-foreground">km/session</p>
              </div>
            </div>

            {/* Mini Bar Chart - Daily km */}
            <div className="relative h-16">
              <div className="flex items-end justify-between h-full gap-1.5">
                {/* Lun - No session */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-muted rounded-t" style={{ height: '5%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1">L</span>
                </div>

                {/* Mar - 5.2 km */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[10px] font-medium mb-0.5">5.2</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '65%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">M</span>
                </div>

                {/* Mer - No session */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-muted rounded-t" style={{ height: '5%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1">M</span>
                </div>

                {/* Jeu - 8.5 km */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[10px] font-medium mb-0.5">8.5</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '100%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">J</span>
                </div>

                {/* Ven - No session */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-muted rounded-t" style={{ height: '5%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1">V</span>
                </div>

                {/* Sam - 4.8 km */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[10px] font-medium mb-0.5">4.8</span>
                  <div className="w-full bg-foreground rounded-t" style={{ height: '56%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">S</span>
                </div>

                {/* Dim - No session */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full bg-muted rounded-t" style={{ height: '5%' }}></div>
                  <span className="text-[10px] text-muted-foreground mt-1">D</span>
                </div>
              </div>
            </div>

            {/* Symmetric Bar Chart - Scale -3 to +3 for display, real values in labels */}
            <div className="relative h-32">
              {/* Axis line at 0 */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border"></div>

              <div className="flex items-center justify-between h-full gap-2 px-1">
                {/* Lun - No session */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full bg-blue-500 opacity-20 rounded-t" style={{ height: '2%' }}></div>
                  </div>
                  <div className="flex-1 flex items-start w-full">
                    <div className="w-full bg-orange-500 opacity-20 rounded-b" style={{ height: '2%' }}></div>
                  </div>
                </div>

                {/* Mar - Aero: +3.5 (display as 3.5/3*100% = 100%), Anaero: -1.2 (display as 1.2/3*100% = 40%) */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex flex-col items-center justify-end w-full">
                    <span className="text-[10px] font-medium mb-0.5 text-blue-600">+3.5</span>
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-start w-full">
                    <div className="w-full bg-orange-500 rounded-b" style={{ height: '40%' }}></div>
                    <span className="text-[10px] font-medium mt-0.5 text-orange-600">-1.2</span>
                  </div>
                </div>

                {/* Mer - No session */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full bg-blue-500 opacity-20 rounded-t" style={{ height: '2%' }}></div>
                  </div>
                  <div className="flex-1 flex items-start w-full">
                    <div className="w-full bg-orange-500 opacity-20 rounded-b" style={{ height: '2%' }}></div>
                  </div>
                </div>

                {/* Jeu - Aero: +2.8 (display as 2.8/3*100% = 93%), Anaero: -3.5 but capped at -3 (display as 3/3*100% = 100%) */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex flex-col items-center justify-end w-full">
                    <span className="text-[10px] font-medium mb-0.5 text-blue-600">+2.8</span>
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '93%' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-start w-full">
                    <div className="w-full bg-orange-500 rounded-b" style={{ height: '100%' }}></div>
                    <span className="text-[10px] font-medium mt-0.5 text-orange-600">-3.5</span>
                  </div>
                </div>

                {/* Ven - No session */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full bg-blue-500 opacity-20 rounded-t" style={{ height: '2%' }}></div>
                  </div>
                  <div className="flex-1 flex items-start w-full">
                    <div className="w-full bg-orange-500 opacity-20 rounded-b" style={{ height: '2%' }}></div>
                  </div>
                </div>

                {/* Sam - Aero: +4.2 but capped at +3 (display as 3/3*100% = 100%), Anaero: -0.8 (display as 0.8/3*100% = 27%) */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex flex-col items-center justify-end w-full">
                    <span className="text-[10px] font-medium mb-0.5 text-blue-600">+4.2</span>
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-start w-full">
                    <div className="w-full bg-orange-500 rounded-b" style={{ height: '27%' }}></div>
                    <span className="text-[10px] font-medium mt-0.5 text-orange-600">-0.8</span>
                  </div>
                </div>

                {/* Dim - No session */}
                <div className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full bg-blue-500 opacity-20 rounded-t" style={{ height: '2%' }}></div>
                  </div>
                  <div className="flex-1 flex items-start w-full">
                    <div className="w-full bg-orange-500 opacity-20 rounded-b" style={{ height: '2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend at bottom */}
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Aérobie (+5 max)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-muted-foreground">Anaérobie (-5 max)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Running Volume - 1x1 */}
        <Card className="md:col-span-1 md:col-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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
        </Card>

        {/* Acute:Chronic Workload Ratio - 1x1 - Central column (sport) */}
        <Card className="md:col-span-1 md:col-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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

              {/* Charges */}
              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t">
                <div>
                  <div className="text-[10px] text-muted-foreground">Aiguë (7j)</div>
                  <div className="text-sm font-semibold">23 km</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">Chronique (28j)</div>
                  <div className="text-sm font-semibold">20 km</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VO2 Max Trend - 1x1 */}
        <Card className="md:col-span-1 md:col-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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
        </Card>

        {/* Race Predictions - 1x3 */}
        <Card className="md:col-span-1 md:row-span-3 md:col-start-4 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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
        </Card>

        {/* Health Metrics Gauges - 2x1 - Left column (health) row 2 */}
        <Card className="md:col-span-2 md:col-start-1 md:row-start-2 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* HRV Recent Days - 1x1 - Left column (health) row 3 */}
        <Card className="md:col-span-1 md:col-start-1 md:row-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* Weight Trend - 1x1 - Left column (health) row 4 */}
        <Card className="md:col-span-1 md:col-start-1 md:row-start-4 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* Daily Stress - 1x1 - Left column (health) row 5 */}
        <Card className="md:col-span-1 md:col-start-1 md:row-start-5 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Stress quotidien</CardTitle>
            <CardDescription className="text-xs">Aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-green-500">32</span>
              </div>
              <span className="text-sm px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 font-medium">Faible</span>
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-center text-muted-foreground">
              Échelle 0-100
            </div>
          </CardContent>
        </Card>

        {/* Sleep Stages Timeline - 2x1 - Left column (health) row 6 */}
        <Card className="md:col-span-2 md:col-start-1 md:row-start-6 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Phases de sommeil</CardTitle>
            <CardDescription className="text-xs">Dernière nuit - 7h 32m</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="space-y-4">
              {/* Timeline bar */}
              <div className="relative">
                <div className="flex h-6 w-full rounded-full overflow-hidden shadow-sm">
                  {/* Awake (début) - 5m - Gris clair */}
                  <div className="bg-gray-300/60" style={{ width: '1.1%' }} title="Éveillé: 5m">
                  </div>

                  {/* Light Sleep - 45m - Bleu clair */}
                  <div className="bg-blue-300" style={{ width: '10%' }} title="Léger: 45m">
                  </div>

                  {/* Deep Sleep - 1h 20m - Bleu foncé */}
                  <div className="bg-blue-900" style={{ width: '17.7%' }} title="Profond: 1h 20m">
                  </div>

                  {/* Light Sleep - 1h 15m - Bleu clair */}
                  <div className="bg-blue-300" style={{ width: '16.5%' }} title="Léger: 1h 15m">
                  </div>

                  {/* REM - 1h 53m - Rose/magenta */}
                  <div className="bg-pink-500" style={{ width: '25%' }} title="REM: 1h 53m">
                  </div>

                  {/* Light Sleep - 1h 01m - Bleu clair */}
                  <div className="bg-blue-300" style={{ width: '13.5%' }} title="Léger: 1h 01m">
                  </div>

                  {/* Awake - 12m - Gris clair */}
                  <div className="bg-gray-300/60" style={{ width: '2.6%' }} title="Éveillé: 12m">
                  </div>

                  {/* Deep Sleep - 46m - Bleu foncé */}
                  <div className="bg-blue-900" style={{ width: '10.2%' }} title="Profond: 46m">
                  </div>

                  {/* Awake (fin) - 15m - Gris clair */}
                  <div className="bg-gray-300/60" style={{ width: '3.3%' }} title="Éveillé: 15m">
                  </div>
                </div>
              </div>

              {/* Legend and stats */}
              <div className="grid grid-cols-4 gap-3 pt-2 border-t">
                {/* Deep Sleep */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-900 rounded"></div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Profond</div>
                    <div className="text-sm font-semibold">2h 06m</div>
                  </div>
                </div>

                {/* REM Sleep */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded"></div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">REM</div>
                    <div className="text-sm font-semibold">1h 53m</div>
                  </div>
                </div>

                {/* Light Sleep */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Léger</div>
                    <div className="text-sm font-semibold">3h 01m</div>
                  </div>
                </div>

                {/* Awake */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300/60 rounded"></div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Éveillé</div>
                    <div className="text-sm font-semibold">32m</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Annual Running Distance - 1x1 - Central column (sport) */}
        <Card className="md:col-span-1 md:col-start-3 hover:shadow-lg transition-shadow overflow-hidden">
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
        </Card>

        {/* Running Progress Year Comparison - 1x1 - Central column (sport) */}
        <Card className="md:col-span-1 md:col-start-3 hover:shadow-lg transition-shadow overflow-hidden relative">
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
        </Card>

      </div>
    </div>
  );
}
