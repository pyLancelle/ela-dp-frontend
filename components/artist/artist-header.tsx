
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtistHeaderProps {
  artistName: string;
  artistImageUrl: string;
  totalPlays: number;
  totalListenTime: string;
}

export function ArtistHeader({ artistName, artistImageUrl, totalPlays, totalListenTime }: ArtistHeaderProps) {
  return (
    <Card className="md:col-span-2 md:row-span-2 flex flex-col">
      <CardHeader>
        <CardTitle data-testid="artist-name">{artistName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <img
          src={artistImageUrl}
          alt={artistName}
          width={128}
          height={128}
          className="rounded-full mb-4"
        />
        <div className="text-center">
          <p className="text-4xl font-bold">{totalPlays.toLocaleString()}</p>
          <p className="text-muted-foreground">écoutes</p>
        </div>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold">{totalListenTime}</p>
          <p className="text-muted-foreground">temps d'écoute</p>
        </div>
      </CardContent>
    </Card>
  );
}
