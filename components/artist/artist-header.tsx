
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtistHeaderProps {
  artistName: string;
  artistImageUrl: string;
  totalPlays: number;
  totalListenTime: string;
}

export function ArtistHeader({ artistName, artistImageUrl, totalPlays, totalListenTime }: ArtistHeaderProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle data-testid="artist-name">{artistName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <img
          src={artistImageUrl}
          alt={artistName}
          width={96}
          height={96}
          className="rounded-full mb-3"
        />
        <div className="text-center">
          <p className="text-3xl font-bold">{totalPlays.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">écoutes</p>
        </div>
        <div className="text-center mt-3">
          <p className="text-xl font-bold">{totalListenTime}</p>
          <p className="text-sm text-muted-foreground">temps d'écoute</p>
        </div>
      </CardContent>
    </Card>
  );
}
