
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Disc } from "lucide-react";

interface Album {
  rank: number;
  name: string;
  plays: number;
}

interface TopAlbumsProps {
  albums: Album[];
}

export function TopAlbums({ albums }: TopAlbumsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Disc className="h-5 w-5" /> Top Albums
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {albums.slice(0, 3).map(album => (
              <TableRow key={album.rank}>
                <TableCell className="font-medium w-8 text-center">{album.rank}</TableCell>
                <TableCell className="truncate">{album.name}</TableCell>
                <TableCell className="text-right text-muted-foreground whitespace-nowrap">{album.plays.toLocaleString()} écoutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
