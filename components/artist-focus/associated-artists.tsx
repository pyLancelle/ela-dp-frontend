import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AssociatedArtistsProps {
    artists: { name: string; image: string }[];
    className?: string;
}

export function AssociatedArtists({ artists, className }: AssociatedArtistsProps) {
    return (
        <Card className={cn("overflow-hidden flex flex-col", className)}>
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-medium">Artistes Associés</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-around">
                {artists.slice(0, 4).map((artist, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1.5">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={artist.image} alt={artist.name} />
                            <AvatarFallback>{artist.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-medium text-center w-16 truncate text-muted-foreground">{artist.name}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
