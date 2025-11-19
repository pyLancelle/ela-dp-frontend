import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopSongsListProps {
    songs: { title: string; plays: number; duration: string }[];
    className?: string;
}

export function TopSongsList({ songs, className }: TopSongsListProps) {
    return (
        <Card className={cn("overflow-hidden flex flex-col", className)}>
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-medium">Top Titres</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pt-0">
                <div className="space-y-3">
                    {songs.map((song, index) => (
                        <div key={index} className="flex items-center p-1 rounded-md">
                            <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-none truncate">{song.title}</p>
                                <p className="text-xs text-muted-foreground">{song.plays.toLocaleString()} écoutes</p>
                            </div>
                            <div className="text-xs text-muted-foreground ml-2">{song.duration}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
