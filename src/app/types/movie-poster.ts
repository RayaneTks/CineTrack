export type WatchStatus = "to-watch" | "watching" | "watched";

export interface MoviePoster {
  id: number;
  title: string;
  posterUrl: string;
  director: string;
  year: number;
  rating: number;
  watchStatus: WatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MoviePosterInput {
  title: string;
  posterUrl: string;
  director: string;
  year: number;
  rating: number;
  watchStatus: WatchStatus;
}
