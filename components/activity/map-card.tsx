'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  ),
});

interface MapCardProps {
  title?: string;
  center?: [number, number];
  zoom?: number;
  route?: [number, number][]; // [lat, lon][]
}

export function MapCard({
  title = 'Tracé',
  center,
  zoom = 14,
  route
}: MapCardProps) {
  // Calculate center from route if not provided
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (route && route.length > 0) {
      const midIndex = Math.floor(route.length / 2);
      return route[midIndex];
    }
    return [46.603354, 1.888334] as [number, number]; // Centre de la France par défaut
  }, [center, route]);

  return (
    <Card className="col-span-3 row-span-2 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 pb-6 px-6">
        <MapView center={mapCenter} zoom={zoom} route={route} />
      </CardContent>
    </Card>
  );
}
