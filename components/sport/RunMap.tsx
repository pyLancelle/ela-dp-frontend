"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RunMapProps {
  coordinates: [number, number][];
  accentColor?: string;
  isDark?: boolean;
}

function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 0) {
      map.fitBounds(coordinates as [number, number][], { padding: [20, 20] });
    }
  }, [map, coordinates]);
  return null;
}

export default function RunMap({ coordinates, accentColor = "#FF6B35", isDark = true }: RunMapProps) {
  if (coordinates.length === 0) return null;

  const center = coordinates[0];
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const bgColor = isDark ? "#1a1a2e" : "#f5f5f0";

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", background: bgColor }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <TileLayer
        url={tileUrl}
        attribution=""
      />
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: accentColor,
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <FitBounds coordinates={coordinates} />
    </MapContainer>
  );
}
