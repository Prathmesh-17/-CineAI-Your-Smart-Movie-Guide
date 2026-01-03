export interface Rating {
  source: string;
  value: string;
}

export interface CastMember {
  name: string;
  imageUrl: string;
  character?: string;
}

export interface Movie {
  title: string;
  year: string;
  tagline: string;
  description: string;
  cast: CastMember[];
  director: string;
  producer: string;
  releaseDate: string;
  budget: string;
  boxOffice: string;
  songs: string[];
  ratings: Rating[];
  streamingPlatforms: string[];
  genre: string[];
  duration: string;
  posterUrl: string;
}

export interface SearchState {
  query: string;
  data: Movie | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}