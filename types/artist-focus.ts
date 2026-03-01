// ── Artist Focus Index ────────────────────────────────────────────────────────

export interface ArtistSummary {
  artist_id: string;
  artist_name: string;
  image_url: string | null;
  total_plays: number;
  total_duration: string;
  current_streak: number;
}

export interface ArtistFocusIndexResponse {
  artists: ArtistSummary[];
  _generated_at: string;
}

// ── Artist Focus Detail ──────────────────────────────────────────────────────

export interface ArtistOverview {
  artist_id: string;
  artist_name: string;
  artist_url: string;
  image_url: string | null;
  image_url_medium: string | null;
  genres: string[];
  spotify_popularity: number;
  follower_count: number;
  total_plays: number;
  total_duration: string;
  total_duration_ms: number;
  unique_tracks: number;
  unique_albums: number;
  first_heard: string;
  last_heard: string;
  days_with_listens: number;
  days_since_discovery: number;
  consistency_score: number;
  avg_plays_per_active_day: number;
  current_streak: number;
}

export interface ArtistTopTrack {
  artist_id: string;
  track_rank: number;
  track_id: string;
  track_name: string;
  album_name: string;
  album_image_url: string | null;
  track_url: string;
  play_count: number;
  total_duration: string;
  total_duration_ms: number;
  first_played_at: string;
  last_played_at: string;
  pct_of_artist_time: number;
}

export interface ArtistAlbum {
  artist_id: string;
  album_id: string;
  album_name: string;
  album_image_url: string | null;
  album_url: string;
  album_type: string;
  release_date: string;
  total_tracks: number;
  artist_names: string;
  tracks_heard: number;
  total_plays: number;
  total_duration: string;
  total_duration_ms: number;
  first_played_at: string;
  last_played_at: string;
  completion_rate: number;
  listen_depth: "complete" | "partial" | "shallow";
}

export interface ArtistCalendarDay {
  artist_id: string;
  listen_date: string;
  play_count: number;
  total_duration_ms: number;
  total_duration: string;
}

export interface ArtistHeatmapEntry {
  artist_id: string;
  hour_of_day: number;
  day_of_week: number;
  day_name: string;
  play_count: number;
  total_duration_ms: number;
}

export interface ArtistEvolution {
  artist_id: string;
  year_month: string;
  play_count: number;
  unique_tracks: number;
  total_duration_ms: number;
  total_duration: string;
}

export interface ArtistFocusDetailResponse {
  overview: ArtistOverview;
  top_tracks: ArtistTopTrack[];
  albums: ArtistAlbum[];
  calendar: ArtistCalendarDay[];
  heatmap: ArtistHeatmapEntry[];
  evolution: ArtistEvolution[];
  _generated_at: string;
}
