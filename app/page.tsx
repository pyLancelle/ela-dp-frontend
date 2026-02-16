"use client";

import { useState } from "react";
import { useHomepage } from "@/hooks/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  User,
  Footprints,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SleepStagesChart } from "@/components/sleep-stages-chart";
import { BodyBatteryChart } from "@/components/body-battery-chart";
import { SleepScoreChart } from "@/components/sleep-score-chart";
import { HrvCard } from "@/components/hrv-card";
import { RestingHrCard } from "@/components/resting-hr-card";
import { WeeklyVolumeChart } from "@/components/weekly-volume-chart";
import { ListeningTimeChart } from "@/components/listening-time-chart";
import { RacePredictionsCard } from "@/components/race-predictions-card";
import { Vo2maxTrendCard } from "@/components/vo2max-trend-card";
import { StressCard } from "@/components/stress-card";
import { StepsCard } from "@/components/steps-card";

// Generate a consistent color gradient based on a string
const getGradientColors = (name: string) => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-cyan-600',
    'from-red-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export default function Home() {
  const { data, isLoading } = useHomepage();
  const [showArtists, setShowArtists] = useState(true);

  return (
    <div className="px-6 py-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Etienne !</h1>
        <p className="text-muted-foreground">Overview</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">

        {/* Sleep Stages Chart - 2x1 */}
        <div className="md:col-span-2 md:col-start-1 md:row-start-1">
          <SleepStagesChart data={data?.sleepStages} />
        </div>


        {/* Sleep Score Chart - 1x1 */}
        <div className="md:col-span-1 md:col-start-1 md:row-start-2">
          <SleepScoreChart data={data?.sleepBodyBattery?.sleepScores} />
        </div>

        {/* Body Battery Chart - 1x1 */}
        <div className="md:col-span-1 md:col-start-2 md:row-start-2">
          <BodyBatteryChart data={data?.sleepBodyBattery?.bodyBattery} />
        </div>

        {/* HRV Recent Days - 1x1 */}
        <HrvCard data={data?.sleepBodyBattery?.hrv} />

        {/* Resting Heart Rate - 1x1 */}
        <RestingHrCard data={data?.sleepBodyBattery?.restingHr} />

        {/* Stress - 1x1 */}
        <StressCard data={data?.stress} className="md:col-span-1 md:col-start-1 md:row-start-3" />

        {/* Steps - 1x1 */}
        <StepsCard data={data?.steps} className="md:col-span-1 md:col-start-2 md:row-start-3" />

        {/* Spotify Listening Time Chart - 2x1 */}
        <ListeningTimeChart data={data?.music?.listeningTime} loading={isLoading} />

        {/* Top Artists/Tracks - 2x3 */}
        <Card className="md:col-span-2 md:row-span-3 md:col-start-5 md:row-start-2 hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showArtists ? <User className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                <CardTitle>{showArtists ? "Top Artistes" : "Top Titres"}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant={showArtists ? "default" : "ghost"} size="sm" onClick={() => setShowArtists(true)} className="h-7 px-2">
                  <User className="h-3.5 w-3.5" />
                </Button>
                <Button variant={!showArtists ? "default" : "ghost"} size="sm" onClick={() => setShowArtists(false)} className="h-7 px-2">
                  <Music className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Chargement...</div>
              ) : showArtists ? (
                <>
                  {data?.music?.topArtists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-sm font-semibold w-5 flex-shrink-0 ${index < 3 ? '' : 'text-xs text-muted-foreground'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : artist.rank}
                        </span>
                        {artist.imageUrl ? (
                          <img src={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className={`w-10 h-10 rounded bg-gradient-to-br ${getGradientColors(artist.name)} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs font-semibold">{artist.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{artist.name}</div>
                          <div className="text-xs text-muted-foreground">{artist.trackCount} plays</div>
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
                  {data?.music?.topTracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-sm font-semibold w-5 flex-shrink-0 ${index < 3 ? '' : 'text-xs text-muted-foreground'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : track.rank}
                        </span>
                        {track.imageUrl && <img src={track.imageUrl} alt={track.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />}
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
            </div>
          </CardContent>
        </Card>

        {/* Running Card - 2x2 */}
        <Card className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-1 hover:shadow-lg transition-shadow overflow-hidden">
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
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{data?.running?.totalDistance.toFixed(1) || '0'}</div>
                <div className="text-xs text-muted-foreground">km total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data?.running?.sessionCount || 0}</div>
                <div className="text-xs text-muted-foreground">sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data?.running?.averagePerSession.toFixed(1) || '0'}</div>
                <div className="text-xs text-muted-foreground">km/session</div>
              </div>
            </div>

            <div className="relative h-12 mb-3">
              <div className="flex items-end justify-between h-full gap-1">
                {(data?.running?.daily || []).map((d, index) => {
                  const maxDistance = Math.max(...(data?.running?.daily || []).map(d => d.distance), 1);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 h-full justify-end relative">
                      {d.distance > 0 && (
                        <>
                          <span className="text-[8px] font-medium mb-0.5">{d.distance.toFixed(1)}</span>
                          <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(d.distance / maxDistance) * 100}%` }}></div>
                        </>
                      )}
                      {d.distance === 0 && <div className="w-full h-1 bg-muted rounded"></div>}
                      <span className="absolute -bottom-4 text-[9px] text-muted-foreground">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative h-32 mb-2 mt-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-border"></div>
              <div className="flex items-center justify-between h-full gap-1.5">
                {(data?.running?.daily || []).map((d, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-center">
                    <div className="w-full flex items-end justify-center" style={{ height: '50%' }}>
                      {d.aerobicScore > 0 && <div className="w-full bg-blue-500 rounded-t" style={{ height: `${d.aerobicHeightPercentage}%` }} title={`Aérobie: ${d.aerobicScore.toFixed(1)}`}></div>}
                    </div>
                    <div className="w-full flex items-start justify-center" style={{ height: '50%' }}>
                      {d.anaerobicScore > 0 && <div className="w-full bg-orange-500 rounded-b" style={{ height: `${d.anaerobicHeightPercentage}%` }} title={`Anaérobie: ${d.anaerobicScore.toFixed(1)}`}></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
        </Card>

        {/* Weekly Running Volume - 1x1 */}
        <div className="md:col-span-1 md:col-start-3 md:row-start-3">
          <WeeklyVolumeChart data={data?.weeklyVolume || undefined} />
        </div>

        {/* VO2 Max Trend - 1x1 */}
        <Vo2maxTrendCard
          className="md:col-span-1 md:col-start-3 md:row-start-4 hover:shadow-lg transition-shadow"
          data={data?.vo2maxTrend}
          loading={isLoading}
        />

        {/* Race Predictions - 1x2 */}
        <RacePredictionsCard predictions={data?.racePredictions?.predictions} loading={isLoading} />



      </div>
    </div>
  );
}
