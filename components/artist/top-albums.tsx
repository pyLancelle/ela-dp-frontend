
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Disc /> Top Albums
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {albums.map(album => (
              <TableRow key={album.rank}>
                <TableCell className="font-medium">{album.rank}</TableCell>
                <TableCell>{album.name}</TableCell>
                <TableCell className="text-right">{album.plays.toLocaleString()} écoutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
