import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Disc } from "lucide-react";

interface AlbumShowcaseProps {
    album: { title: string; cover: string; year: number; totalPlays: number };
    className?: string;
}

export function AlbumShowcase({ album, className }: AlbumShowcaseProps) {
    return (
        <Card className={cn("overflow-hidden relative", className)}>
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    className="object-cover opacity-20 blur-xl scale-110"
                />
            </div>

            <CardHeader className="pb-2 pt-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Disc className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Album Phare</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center justify-center h-full pb-8">
                <div className="relative h-32 w-32 overflow-hidden rounded-md shadow-2xl mb-3">
                    <Image
                        src={album.cover}
                        alt={album.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold leading-tight">{album.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{album.year} • {album.totalPlays.toLocaleString()} écoutes</p>
                </div>
            </CardContent>
        </Card>
    );
}
