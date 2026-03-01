"use client";

import { useState } from "react";
import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type { ArtistSummary } from "@/types/artist-focus";

function formatHours(duration: string): string {
  const hMatch = duration.match(/(\d+)h/);
  const mMatch = duration.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1]) : 0;
  const m = mMatch ? parseInt(mMatch[1]) : 0;
  return `${Math.round(h + m / 60)}h`;
}

interface ArtistSelectorProps {
  artists: ArtistSummary[];
  selectedId: string | null;
  onSelect: (artistId: string) => void;
  isLoading?: boolean;
}

export function ArtistSelector({
  artists,
  selectedId,
  onSelect,
  isLoading,
}: ArtistSelectorProps) {
  const [open, setOpen] = useState(false);
  const sorted = [...artists].sort((a, b) =>
    a.artist_name.localeCompare(b.artist_name, "fr", { sensitivity: "base" })
  );
  const selected = artists.find((a) => a.artist_id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="liquid-glass-card inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors min-w-[260px]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : selected ? (
            <>
              {selected.image_url && (
                <img
                  src={selected.image_url}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"
                />
              )}
              <span className="truncate">{selected.artist_name}</span>
              <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                {formatHours(selected.total_duration)}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">Choisir un artiste...</span>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un artiste..." />
          <CommandList>
            <CommandEmpty>Aucun artiste trouvé.</CommandEmpty>
            <CommandGroup>
              {sorted.map((artist) => (
                <CommandItem
                  key={artist.artist_id}
                  value={artist.artist_name}
                  onSelect={() => {
                    onSelect(artist.artist_id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  {artist.image_url ? (
                    <img
                      src={artist.image_url}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {artist.artist_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatHours(artist.total_duration)}
                    </p>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      selectedId === artist.artist_id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
