
"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { DateRangeFilter, DateFilterPreset } from "@/components/date-range-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { ArtistHeader } from "@/components/artist/artist-header";
import { TopTracks } from "@/components/artist/top-tracks";
import { TopAlbums } from "@/components/artist/top-albums";
import { ListeningEvolution } from "@/components/artist/listening-evolution";
import { ListeningByHour } from "@/components/artist/listening-by-hour";

const artists = [
  { id: "the-weeknd", name: "The Weeknd" },
  { id: "daft-punk", name: "Daft Punk" },
  { id: "arctic-monkeys", name: "Arctic Monkeys" },
];

const mockData = {
  "the-weeknd": {
    name: "The Weeknd",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ff02",
    totalPlays: 12345,
    totalListenTime: "450h 30m",
    topTracks: [
      { rank: 1, name: "Blinding Lights", plays: 2500 },
      { rank: 2, name: "Save Your Tears", plays: 2200 },
      { rank: 3, name: "Starboy", plays: 1800 },
    ],
    topAlbums: [
      { rank: 1, name: "After Hours", plays: 8000 },
      { rank: 2, name: "Starboy", plays: 6000 },
      { rank: 3, name: "Beauty Behind the Madness", plays: 4000 },
    ],
    evolution: [
      { date: "Jan", plays: 1000 },
      { date: "Fev", plays: 1200 },
      { date: "Mar", plays: 1500 },
      { date: "Avr", plays: 1300 },
      { date: "Mai", plays: 1600 },
      { date: "Juin", plays: 1800 },
    ],
    listeningByHour: [
      { name: 'Matin', plays: 400, fill: '#8884d8' },
      { name: 'Après-midi', plays: 800, fill: '#83a6ed' },
      { name: 'Soir', plays: 1200, fill: '#8dd1e1' },
      { name: 'Nuit', plays: 600, fill: '#a4de6c' },
    ]
  },
  "daft-punk": {
    name: "Daft Punk",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebddc1372c541602517822dda2",
    totalPlays: 9876,
    totalListenTime: "380h 15m",
    topTracks: [
      { rank: 1, name: "One More Time", plays: 2000 },
      { rank: 2, name: "Harder, Better, Faster, Stronger", plays: 1800 },
      { rank: 3, name: "Around the World", plays: 1500 },
    ],
    topAlbums: [
      { rank: 1, name: "Discovery", plays: 7000 },
      { rank: 2, name: "Random Access Memories", plays: 5000 },
      { rank: 3, name: "Homework", plays: 3000 },
    ],
    evolution: [
        { date: "Jan", plays: 800 },
        { date: "Fev", plays: 900 },
        { date: "Mar", plays: 1100 },
        { date: "Avr", plays: 1000 },
        { date: "Mai", plays: 1200 },
        { date: "Juin", plays: 1400 },
    ],
    listeningByHour: [
      { name: 'Matin', plays: 300, fill: '#8884d8' },
      { name: 'Après-midi', plays: 700, fill: '#83a6ed' },
      { name: 'Soir', plays: 1100, fill: '#8dd1e1' },
      { name: 'Nuit', plays: 500, fill: '#a4de6c' },
    ]
  },
  "arctic-monkeys": {
    name: "Arctic Monkeys",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebc8a2b6d0c0e8f323c520b4c6",
    totalPlays: 7654,
    totalListenTime: "290h 45m",
    topTracks: [
      { rank: 1, name: "Do I Wanna Know?", plays: 1800 },
      { rank: 2, name: "505", plays: 1600 },
      { rank: 3, name: "R U Mine?", plays: 1300 },
    ],
    topAlbums: [
        { rank: 1, name: "AM", plays: 6000 },
        { rank: 2, name: "Whatever People Say I Am, That's What I'm Not", plays: 4000 },
        { rank: 3, name: "Favourite Worst Nightmare", plays: 3000 },
    ],
    evolution: [
        { date: "Jan", plays: 600 },
        { date: "Fev", plays: 700 },
        { date: "Mar", plays: 900 },
        { date: "Avr", plays: 800 },
        { date: "Mai", plays: 1000 },
        { date: "Juin", plays: 1200 },
    ],
    listeningByHour: [
      { name: 'Matin', plays: 200, fill: '#8884d8' },
      { name: 'Après-midi', plays: 600, fill: '#83a6ed' },
      { name: 'Soir', plays: 1000, fill: '#8dd1e1' },
      { name: 'Nuit', plays: 400, fill: '#a4de6c' },
    ]
  }
};

export default function ArtistFocusPage() {
  const [selectedPreset, setSelectedPreset] = useState<DateFilterPreset>("allTime");
  const [selectedArtist, setSelectedArtist] = useState(artists[0].id);

  const handleFilterChange = (preset: DateFilterPreset, range?: DateRange) => {
    setSelectedPreset(preset);
  };

  const currentArtistData = mockData[selectedArtist as keyof typeof mockData];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-8 w-8" />
          Focus Artiste
        </h1>
        <p className="text-muted-foreground">
          Analysez en détail vos écoutes d'un artiste spécifique
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Artist Selector */}
        <Select value={selectedArtist} onValueChange={setSelectedArtist}>
          <SelectTrigger className="w-[280px]" data-testid="artist-select">
            <SelectValue placeholder="Sélectionnez un artiste" />
          </SelectTrigger>
          <SelectContent>
            {artists.map(artist => (
              <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <DateRangeFilter selectedPreset={selectedPreset} onFilterChange={handleFilterChange} />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">

        <div className="md:col-span-1 md:row-span-2">
          <ArtistHeader
            artistName={currentArtistData.name}
            artistImageUrl={currentArtistData.imageUrl}
            totalPlays={currentArtistData.totalPlays}
            totalListenTime={currentArtistData.totalListenTime}
          />
        </div>

        <div className="md:col-span-2">
          <ListeningEvolution data={currentArtistData.evolution} />
        </div>

        <TopTracks tracks={currentArtistData.topTracks} />

        <TopAlbums albums={currentArtistData.topAlbums} />

        <ListeningByHour data={currentArtistData.listeningByHour} />

      </div>
    </div>
  );
}
