import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArtistLinksProps {
  artistName: string;
  className?: string;
}

export function ArtistLinks({ artistName, className }: ArtistLinksProps) {
  const artists = artistName.split(", ");

  return (
    <span className={cn("truncate block", className)}>
      {artists.map((name, i) => (
        <span key={name}>
          {i > 0 && ", "}
          <Link
            href={`/music/artists?name=${encodeURIComponent(name.trim())}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {name.trim()}
          </Link>
        </span>
      ))}
    </span>
  );
}
