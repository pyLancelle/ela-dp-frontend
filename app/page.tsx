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

        {/* Spotify Listening Time Chart - 2x1 */}
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* Top Artists/Tracks - 2x3 - NOW HERE AFTER TEMPS D'ÉCOUTE */}
        <Card className="md:col-span-2 md:row-span-3 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* Running Card with Aerobic/Anaerobic Chart - 2x2 */}
        <Card className="md:col-span-2 md:row-span-2 hover:shadow-lg transition-shadow overflow-hidden">
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

        {/* Large featured card - spans 2x2 */}
        <Card className="md:col-span-2 md:row-span-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <CardTitle>Musique</CardTitle>
            </div>
            <CardDescription>Statistiques d'écoute</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-end h-[calc(100%-5rem)]">
            <div className="space-y-2">
              <div className="text-4xl font-bold">2,847</div>
              <p className="text-sm text-muted-foreground">Morceaux</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  142h
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <TrendingUp className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Croissance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">vs. mois dernier</p>
          </CardContent>
        </Card>

        {/* Activity card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Activity className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        {/* Tall Analytics card */}
        <Card className="md:col-span-2 md:row-span-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Analytics</CardTitle>
            </div>
            <CardDescription>Métriques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Vues</span>
                <span className="text-sm font-medium">45.2K</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground w-[75%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground w-[89%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Conversion</span>
                <span className="text-sm font-medium">12.4%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground w-[12%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Super Tall Statistics card - 3 rows! */}
        <Card className="md:col-span-1 md:row-span-3 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle className="text-base">Stats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Revenus</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
              <div className="text-2xl font-bold">$45.2K</div>
              <p className="text-xs text-muted-foreground">+12.5%</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Users</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
              <div className="text-2xl font-bold">8,234</div>
              <p className="text-xs text-muted-foreground">+8.1%</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sessions</span>
                <ArrowDownRight className="h-3 w-3" />
              </div>
              <div className="text-2xl font-bold">12.4K</div>
              <p className="text-xs text-muted-foreground">-2.3%</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Taux conv.</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">+0.4%</p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Calendar className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>

        {/* Target card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Target className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>

        {/* Wide Users card */}
        <Card className="md:col-span-3 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Communauté</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-6">
              <div>
                <div className="text-3xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Membres</p>
              </div>
              <div>
                <div className="text-2xl font-semibold">856</div>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
              <div>
                <div className="text-2xl font-semibold">45</div>
                <p className="text-xs text-muted-foreground">Nouveaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Globe card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Globe className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Mondial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Pays</p>
          </CardContent>
        </Card>

        {/* Heart/Likes card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Heart className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Favoris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4K</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        {/* Documents card */}
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Fichiers</p>
              </div>
              <div>
                <div className="text-2xl font-bold">2.4GB</div>
                <p className="text-xs text-muted-foreground">Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Zap className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Perf.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>

        {/* Awards card */}
        <Card className="md:col-span-1 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <Award className="h-5 w-5 mb-1" />
            <CardTitle className="text-base">Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Débloqués</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
