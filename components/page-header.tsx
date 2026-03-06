"use client";

import { usePathname } from "next/navigation";
import { AuroraText } from "@/components/magicui/aurora-text";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Welcome, Etienne !",
  "/activites": "Activités",
  "/musique/classements": "Classements Musicaux",
  "/music/artists": "Focus Artiste",
};

export function PageHeader() {
  const pathname = usePathname();

  // Routes dynamiques ex: /activites/[id]
  const title =
    ROUTE_TITLES[pathname] ??
    (pathname.startsWith("/activites/") ? null :
    pathname.startsWith("/music/artists/") ? "Artiste" : null);

  if (!title) return null;

  return (
    <h1 className="text-xl font-bold tracking-tight leading-none">
      <AuroraText colors={["#1DB954", "#9c40ff", "#3b82f6", "#06b6d4"]} speed={0.8}>
        {title}
      </AuroraText>
    </h1>
  );
}
