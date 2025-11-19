
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music /> Top Titres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {tracks.map(track => (
              <TableRow key={track.rank}>
                <TableCell className="font-medium">{track.rank}</TableCell>
                <TableCell>{track.name}</TableCell>
                <TableCell className="text-right">{track.plays.toLocaleString()} écoutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
