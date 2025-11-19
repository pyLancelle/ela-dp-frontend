
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Music } from "lucide-react";

interface Track {
  rank: number;
  name: string;
  plays: number;
}

interface TopTracksProps {
  tracks: Track[];
}

export function TopTracks({ tracks }: TopTracksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="h-5 w-5" /> Top Titres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {tracks.slice(0, 3).map(track => (
              <TableRow key={track.rank}>
                <TableCell className="font-medium w-8 text-center">{track.rank}</TableCell>
                <TableCell className="truncate">{track.name}</TableCell>
                <TableCell className="text-right text-muted-foreground whitespace-nowrap">{track.plays.toLocaleString()} écoutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
