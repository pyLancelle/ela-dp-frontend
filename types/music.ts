// Types pour la page Recently Played

export interface RecentlyPlayedTrack {
  id: string;
  played_at: string;           // ISO datetime "2024-12-27T14:32:00Z"
  track: {
    id: string;
    name: string;
    duration_ms: number;
    external_url: string;      // Lien Spotify
  };
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    name: string;
    image_url: string;
  };
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface RecentlyPlayedResponse {
  tracks: RecentlyPlayedTrack[];
  pagination: PaginationInfo;
  artists: string[];           // Liste pour autocomplétion
}
