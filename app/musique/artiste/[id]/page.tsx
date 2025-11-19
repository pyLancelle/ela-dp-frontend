import { Metadata } from "next";
import { orelsanData } from "@/lib/mock-data/orelsan";
import { KPICard } from "@/components/artist-focus/kpi-card";
import { ListeningTrendChart } from "@/components/artist-focus/listening-trend-chart";
import { TimeDistributionChart } from "@/components/artist-focus/time-distribution-chart";
import { TopSongsList } from "@/components/artist-focus/top-songs-list";
import { AssociatedArtists } from "@/components/artist-focus/associated-artists";
import { AlbumShowcase } from "@/components/artist-focus/album-showcase";
import { Activity, Calendar, Play, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Focus Artiste - Orelsan",
    description: "Statistiques détaillées pour Orelsan",
};

export default async function ArtistFocusPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // In a real app, we would fetch data based on the ID.
    // For now, we just use the mock data for Orelsan.
    const artist = orelsanData;

    return (
        <div className="container mx-auto p-6 min-h-[calc(100vh-8rem)]">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Focus Artiste</h1>
                <p className="text-muted-foreground">Analyse détaillée de vos écoutes</p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">

                {/* Artist Hero - 2x2 - Top Left */}
                <Card className="md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                        <h2 className="text-4xl font-bold mb-1">{artist.name}</h2>
                        <p className="text-white/80 font-medium">Artiste favori</p>
                    </CardContent>
                </Card>

                {/* KPIs - 1x1 cards - Top Row */}
                <KPICard
                    title="Écoutes Hebdo"
                    value={artist.stats.weeklyListeners.toLocaleString()}
                    icon={Activity}
                    trend="+12%"
                    trendUp={true}
                    className="md:col-span-1 md:col-start-3 md:row-start-1"
                />
                <KPICard
                    title="Écoutes Mensuelles"
                    value={artist.stats.monthlyListeners.toLocaleString()}
                    icon={Calendar}
                    trend="+5%"
                    trendUp={true}
                    className="md:col-span-1 md:col-start-4 md:row-start-1"
                />
                <KPICard
                    title="Total Streams"
                    value={(artist.stats.totalStreams / 1000000).toFixed(1) + "M"}
                    icon={Play}
                    description="Depuis toujours"
                    className="md:col-span-1 md:col-start-5 md:row-start-1"
                />
                <KPICard
                    title="Classement"
                    value={"#" + artist.stats.rank}
                    icon={TrendingUp}
                    description="Top Artistes"
                    className="md:col-span-1 md:col-start-6 md:row-start-1"
                />

                {/* Listening Trend - 4x2 - Middle Row */}
                <ListeningTrendChart
                    data={artist.trends.weekly}
                    title="Tendance d'écoute (7 jours)"
                    className="md:col-span-4 md:row-span-2 md:col-start-3 md:row-start-2"
                />

                {/* Top Songs - 2x3 - Bottom Left Column */}
                <TopSongsList
                    songs={artist.topSongs}
                    className="md:col-span-2 md:row-span-3 md:col-start-1 md:row-start-3"
                />

                {/* Album Showcase - 2x2 - Bottom Middle */}
                <AlbumShowcase
                    album={artist.topAlbum}
                    className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-4"
                />

                {/* Time Distribution - 2x1 - Bottom Right */}
                <TimeDistributionChart
                    data={artist.timeDistribution}
                    className="md:col-span-2 md:row-span-1 md:col-start-5 md:row-start-4"
                />

                {/* Associated Artists - 2x1 - Bottom Right */}
                <AssociatedArtists
                    artists={artist.associatedArtists}
                    className="md:col-span-2 md:row-span-1 md:col-start-5 md:row-start-5"
                />

            </div>
        </div>
    );
}
