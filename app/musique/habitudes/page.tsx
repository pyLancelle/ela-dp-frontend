"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Clock, TrendingUp, Headphones } from "lucide-react";

// Mock data
const mockData = {
  totalListeningTime: 1847, // minutes in last 7 days
  totalTracks: 342,
  avgSessionDuration: 23, // minutes
  topArtist: {
    name: "Daft Punk",
    plays: 47,
    image: "🎧"
  },
  // Listening by hour (24h format)
  listeningByHour: [
    { hour: 0, plays: 2 },
    { hour: 1, plays: 1 },
    { hour: 2, plays: 0 },
    { hour: 3, plays: 0 },
    { hour: 4, plays: 0 },
    { hour: 5, plays: 0 },
    { hour: 6, plays: 3 },
    { hour: 7, plays: 8 },
    { hour: 8, plays: 15 },
    { hour: 9, plays: 22 },
    { hour: 10, plays: 18 },
    { hour: 11, plays: 14 },
    { hour: 12, plays: 12 },
    { hour: 13, plays: 10 },
    { hour: 14, plays: 16 },
    { hour: 15, plays: 20 },
    { hour: 16, plays: 25 },
    { hour: 17, plays: 28 },
    { hour: 18, plays: 24 },
    { hour: 19, plays: 20 },
    { hour: 20, plays: 18 },
    { hour: 21, plays: 15 },
    { hour: 22, plays: 12 },
    { hour: 23, plays: 8 }
  ],
  // Genre distribution
  genreDistribution: [
    { genre: "Electronic", count: 125, color: "hsl(var(--chart-1))" },
    { genre: "Rock", count: 89, color: "hsl(var(--chart-2))" },
    { genre: "Hip-Hop", count: 67, color: "hsl(var(--chart-3))" },
    { genre: "Jazz", count: 43, color: "hsl(var(--chart-4))" },
    { genre: "Pop", count: 18, color: "hsl(var(--chart-5))" }
  ],
  // Daily listening time (last 14 days)
  dailyListening: [
    { day: "Lun", minutes: 245 },
    { day: "Mar", minutes: 198 },
    { day: "Mer", minutes: 312 },
    { day: "Jeu", minutes: 276 },
    { day: "Ven", minutes: 289 },
    { day: "Sam", minutes: 412 },
    { day: "Dim", minutes: 367 },
    { day: "Lun", minutes: 223 },
    { day: "Mar", minutes: 267 },
    { day: "Mer", minutes: 301 },
    { day: "Jeu", minutes: 289 },
    { day: "Ven", minutes: 334 },
    { day: "Sam", minutes: 398 },
    { day: "Dim", minutes: 356 }
  ],
  // Listening by day of week
  weekdayDistribution: [
    { day: "Lun", percentage: 12 },
    { day: "Mar", percentage: 11 },
    { day: "Mer", percentage: 16 },
    { day: "Jeu", percentage: 15 },
    { day: "Ven", percentage: 17 },
    { day: "Sam", percentage: 18 },
    { day: "Dim", percentage: 11 }
  ]
};

export default function ListeningHabitsPage() {
  const maxHourlyPlays = Math.max(...mockData.listeningByHour.map(h => h.plays));
  const maxGenreCount = Math.max(...mockData.genreDistribution.map(g => g.count));
  const maxDailyMinutes = Math.max(...mockData.dailyListening.map(d => d.minutes));

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden p-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px] h-full">

        {/* Total Listening Time - Large Card */}
        <Card className="md:col-span-2 md:row-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Temps d'écoute total
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-4xl font-bold">{Math.floor(mockData.totalListeningTime / 60)}h {mockData.totalListeningTime % 60}m</div>
            <p className="text-xs text-muted-foreground mt-1">Ces 7 derniers jours</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div>
                <div className="text-2xl font-semibold">{mockData.totalTracks}</div>
                <div className="text-xs text-muted-foreground">Titres écoutés</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">{mockData.avgSessionDuration}min</div>
                <div className="text-xs text-muted-foreground">Durée moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Artist */}
        <Card className="md:col-span-1 md:row-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Artiste</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center">
            <div className="text-5xl mb-2">{mockData.topArtist.image}</div>
            <div className="text-lg font-semibold text-center">{mockData.topArtist.name}</div>
            <div className="text-sm text-muted-foreground">{mockData.topArtist.plays} écoutes</div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-1 md:row-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-3xl font-bold text-green-500">+23%</div>
            <p className="text-xs text-muted-foreground mt-1">vs semaine dernière</p>
            <div className="mt-3 text-sm">
              <div className="text-xl font-semibold">5.2h</div>
              <div className="text-xs text-muted-foreground">Moyenne par jour</div>
            </div>
          </CardContent>
        </Card>

        {/* Most Active Day */}
        <Card className="md:col-span-2 md:row-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jour le plus actif</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full flex items-center justify-between gap-2">
              {mockData.weekdayDistribution.map((day) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div className="text-xs font-medium mb-1">{day.percentage}%</div>
                  <div
                    className="w-full bg-foreground rounded-t transition-all"
                    style={{ height: `${day.percentage * 4}%` }}
                  />
                  <div className="text-xs text-muted-foreground mt-2">{day.day}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Listening Clock - Circular Chart */}
        <Card className="md:col-span-2 md:row-span-2 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horloge d'écoute
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-2">
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Background concentric circles */}
              {[20, 40, 60, 80].map((percentage) => (
                <circle
                  key={percentage}
                  cx="120"
                  cy="120"
                  r={30 + (percentage / 100) * 70}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}

              {/* Listening bars */}
              {mockData.listeningByHour.map((item) => {
                // Start from top (12 o'clock position) and go clockwise
                const angle = (item.hour * 15) - 90;
                const normalizedValue = item.plays / maxHourlyPlays;
                const barLength = normalizedValue * 70; // Max length of 70
                const innerRadius = 30;
                const outerRadius = innerRadius + barLength;

                const x1 = 120 + innerRadius * Math.cos((angle * Math.PI) / 180);
                const y1 = 120 + innerRadius * Math.sin((angle * Math.PI) / 180);
                const x2 = 120 + outerRadius * Math.cos((angle * Math.PI) / 180);
                const y2 = 120 + outerRadius * Math.sin((angle * Math.PI) / 180);

                return (
                  <g key={item.hour}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#barGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity={0.5 + normalizedValue * 0.5}
                      className="transition-all duration-300 hover:opacity-100"
                    />
                  </g>
                );
              })}

              {/* Hour labels at key positions */}
              {[0, 6, 12, 18].map((hour) => {
                const angle = (hour * 15) - 90;
                const labelRadius = 110;
                const labelX = 120 + labelRadius * Math.cos((angle * Math.PI) / 180);
                const labelY = 120 + labelRadius * Math.sin((angle * Math.PI) / 180);

                return (
                  <text
                    key={hour}
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground font-semibold"
                    style={{ fontSize: '14px' }}
                  >
                    {hour}
                  </text>
                );
              })}

              {/* Hour markers for all 24 hours */}
              {mockData.listeningByHour.map((item) => {
                const angle = (item.hour * 15) - 90;
                const markerRadius = 105;
                const x = 120 + markerRadius * Math.cos((angle * Math.PI) / 180);
                const y = 120 + markerRadius * Math.sin((angle * Math.PI) / 180);

                return (
                  <circle
                    key={`marker-${item.hour}`}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="hsl(var(--muted-foreground))"
                    opacity="0.5"
                  />
                );
              })}

              {/* Center circle with stats */}
              <circle cx="120" cy="120" r="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
              <text
                x="120"
                y="118"
                textAnchor="middle"
                className="fill-foreground font-bold"
                style={{ fontSize: '16px' }}
              >
                {maxHourlyPlays}
              </text>
              <text
                x="120"
                y="130"
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: '9px' }}
              >
                max/h
              </text>
            </svg>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card className="md:col-span-2 md:row-span-2 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Music className="h-4 w-4" />
              Distribution par genre
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full flex flex-col justify-center gap-3">
              {mockData.genreDistribution.map((genre, index) => (
                <div key={genre.genre} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{genre.genre}</span>
                    <span className="text-muted-foreground">{genre.count} écoutes</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(genre.count / maxGenreCount) * 100}%`,
                        backgroundColor: genre.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Listening Trend */}
        <Card className="md:col-span-2 md:row-span-2 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Évolution sur 14 jours</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full flex flex-col">
              {/* Chart */}
              <div className="flex-1 flex items-end justify-between gap-1">
                {mockData.dailyListening.map((day, index) => {
                  const height = (day.minutes / maxDailyMinutes) * 100;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
                        {day.minutes}min
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-foreground to-foreground/70 rounded-t transition-all duration-300 group-hover:from-primary group-hover:to-primary/70"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Semaine -2</span>
                <span>Semaine -1</span>
                <span>Aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
