import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ArtistHeatmap } from "@/components/music/artist/ArtistHeatmap";
import { ArtistListeningChart } from "@/components/music/artist/ArtistListeningChart";
import { ArtistListeningKpis } from "@/components/music/artist/ArtistListeningKpis";
import { ExternalLink, Music2, BarChart2, Disc3 } from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockArtist = {
  id: "artist_001",
  name: "Yann Tiersen",
  image: "https://i.scdn.co/image/ab6761610000e5eb",
  genres: ["french soundtrack", "neoclassical", "post-rock"],
  discoveredAt: "2019-03-14",
  spotifyUrl: "https://open.spotify.com/artist/1LZEQNv7sE11VDY3SdxQeN",
  stats: {
    totalMinutes: 15420,
    totalPlays: 1247,
    currentRank: 1,
    streakDays: 12,
    streakRecord: 34,
    favoriteDay: "Dimanche",
    avgListeningHour: 21,
  },
  topTracks: [
    { rank: 1, title: "Comptine d'un autre été", plays: 187, minutes: 312 },
    { rank: 2, title: "La Valse d'Amélie", plays: 143, minutes: 241 },
    { rank: 3, title: "Surf", plays: 98, minutes: 189 },
    { rank: 4, title: "Porz Goret", plays: 87, minutes: 167 },
    { rank: 5, title: "Tyven", plays: 72, minutes: 134 },
  ],
  topAlbums: [
    { rank: 1, title: "Le Fabuleux Destin", year: 2001, plays: 638 },
    { rank: 2, title: "EUSA", year: 2016, plays: 312 },
    { rank: 3, title: "Infinity", year: 2014, plays: 187 },
    { rank: 4, title: "Kerber", year: 2019, plays: 110 },
  ],
  listeningKpis: {
    year:  { current: 4820, previous: 3210 },
    month: { current: 634,  previous: 820  },
    week:  { current: 87,   previous: 54   },
  },
  monthlyData: [
    { month: "Mar 25", plays: 45, minutes: 320 },
    { month: "Avr 25", plays: 38, minutes: 280 },
    { month: "Mai 25", plays: 92, minutes: 670 },
    { month: "Jun 25", plays: 61, minutes: 445 },
    { month: "Jul 25", plays: 28, minutes: 198 },
    { month: "Aoû 25", plays: 44, minutes: 312 },
    { month: "Sep 25", plays: 78, minutes: 567 },
    { month: "Oct 25", plays: 134, minutes: 980 },
    { month: "Nov 25", plays: 156, minutes: 1140 },
    { month: "Déc 25", plays: 189, minutes: 1380 },
    { month: "Jan 26", plays: 201, minutes: 1467 },
    { month: "Fév 26", plays: 87, minutes: 634 },
  ],
};

function generateHeatmapData() {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const weight = 1 - i / 364;
    const minutes = Math.random() < weight * 0.4 ? Math.floor(Math.random() * 120) : 0;
    if (minutes > 0) data.push({ date: dateStr, minutes });
  }
  return data;
}

const heatmapData = generateHeatmapData();

function formatDiscoveredAt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Inner card contents ────────────────────────────────────────────────────────

function HeroContent() {
  const artist = mockArtist;
  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full relative">
      {/* Blurred background */}
      <div className="absolute inset-0 z-0">
        <img
          src={artist.image}
          alt=""
          className="w-full h-full object-cover scale-110 blur-2xl opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full p-5">
        <div className="flex items-start gap-4">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover ring-1 ring-white/20 shadow-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white/90 leading-tight mb-1.5">
              {artist.name}
            </h1>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {artist.genres.map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="text-[10px] border-white/15 text-white/50 bg-white/5 backdrop-blur-sm"
                >
                  {g}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Découvert le {formatDiscoveredAt(artist.discoveredAt)}
            </p>
          </div>
        </div>

        <a
          href={artist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors backdrop-blur-sm w-fit"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Ouvrir dans Spotify
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </div>
  );
}



function TopTracksContent() {
  const { topTracks } = mockArtist;
  const maxPlays = topTracks[0]?.plays ?? 1;
  return (
    <div className="liquid-glass-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Music2 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top Titres</p>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {topTracks.map((track) => {
          const widthPct = (track.plays / maxPlays) * 100;
          return (
            <div key={track.rank} className="group relative flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors">
              <div
                className="absolute left-0 top-0 h-full rounded-lg bg-cyan-500/5"
                style={{ width: `${widthPct}%` }}
              />
              <span className="relative text-xs font-semibold w-5 flex-shrink-0 text-muted-foreground tabular-nums">
                {track.rank}
              </span>
              <div className="relative w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                <Music2 className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>
              <div className="relative flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className="h-[3px] rounded-full bg-white/20"
                    style={{ width: `${widthPct}%`, maxWidth: "100px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">{track.plays} écoutes</span>
                </div>
              </div>
              <span className="relative text-[10px] text-muted-foreground tabular-nums flex-shrink-0">
                {track.minutes} min
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopAlbumsContent() {
  const { topAlbums } = mockArtist;
  return (
    <div className="liquid-glass-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Disc3 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top Albums</p>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {topAlbums.map((album) => (
          <div key={album.rank} className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-center p-2 hover:scale-[1.03] transition-transform cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <Disc3 className="relative w-7 h-7 text-muted-foreground/30 mb-1" />
            <p className="relative text-[10px] font-semibold text-center leading-tight line-clamp-2">{album.title}</p>
            <p className="relative text-[9px] text-muted-foreground mt-0.5">{album.year}</p>
            <p className="relative text-[9px] text-muted-foreground mt-0.5">{album.plays} écoutes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page (Server Component) ────────────────────────────────────────────────────

export default function ArtistPage() {
  return (
    <div className="px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      {/* Back link */}
      <a
        href="/musique/classements"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <BarChart2 className="w-3.5 h-3.5" />
        Classements
      </a>

      <BentoGrid>

        {/* Hero — col 1-4, row 1 */}
        <BlurFade delay={0.05} className="md:col-span-4 md:row-span-1 md:col-start-1 md:row-start-1">
          <MagicCard beamDuration={7}>
            <HeroContent />
          </MagicCard>
        </BlurFade>

        {/* Listening KPIs — col 5, row 1 */}
        <BlurFade delay={0.10} className="md:col-span-1 md:col-start-5 md:row-start-1 md:row-span-1">
          <MagicCard>
            <ArtistListeningKpis {...mockArtist.listeningKpis} />
          </MagicCard>
        </BlurFade>

        {/* Courbe — col 1-2, row 2 */}
        <BlurFade delay={0.15} className="md:col-span-2 md:col-start-1 md:row-start-2 md:row-span-1">
          <MagicCard>
            <ArtistListeningChart data={mockArtist.monthlyData} />
          </MagicCard>
        </BlurFade>

        {/* Heatmap — col 3-6, row 2 */}
        <BlurFade delay={0.20} className="md:col-span-2 md:col-start-3 md:row-start-2 md:row-span-1">
          <MagicCard beamDuration={7}>
            <ArtistHeatmap data={heatmapData} />
          </MagicCard>
        </BlurFade>

        {/* Top Tracks — col 1-4, row 3 */}
        <BlurFade delay={0.25} className="md:col-span-4 md:col-start-1 md:row-start-3 md:row-span-1">
          <MagicCard>
            <TopTracksContent />
          </MagicCard>
        </BlurFade>

        {/* Top Albums — col 5-6, row 3 */}
        <BlurFade delay={0.30} className="md:col-span-2 md:col-start-5 md:row-start-3 md:row-span-1">
          <MagicCard beamDuration={7}>
            <TopAlbumsContent />
          </MagicCard>
        </BlurFade>

        {/* Rang & streak — col 5-6, row 1 (superposé KPI, décalé en row 2 si besoin) */}
        {/* → Placé en col 5-6, row 1 : les 2 KPIs prennent col5 et col6
            On le déplace à col 5-6 row 2 pour ne pas collisionner */}

      </BentoGrid>
    </div>
  );
}
