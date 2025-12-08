'use client';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

interface MapViewProps {
  center: [number, number];
  zoom: number;
  route?: LatLngExpression[];
}

export default function MapView({ center, zoom, route }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-md"
      style={{ height: '100%', minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: 'hsl(var(--primary))',
            weight: 3,
            opacity: 0.8
          }}
        />
      )}
    </MapContainer>
  );
}
