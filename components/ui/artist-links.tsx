import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArtistLinksProps {
  artistName: string;
  artistIds?: string[];
  className?: string;
}

export function ArtistLinks({ artistName, artistIds, className }: ArtistLinksProps) {
  const names = artistName.split(", ");

  return (
    <span className={cn("truncate block", className)}>
      {names.map((name, i) => {
        const id = artistIds?.[i];
        const href = id
          ? `/music/artists?id=${encodeURIComponent(id)}`
          : `/music/artists?name=${encodeURIComponent(name.trim())}`;

        return (
          <span key={id ?? name}>
            {i > 0 && ", "}
            <Link
              href={href}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {name.trim()}
            </Link>
          </span>
        );
      })}
    </span>
  );
}
