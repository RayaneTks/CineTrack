import type { MoviePosterInput, WatchStatus } from "@/app/types/movie-poster";

const VALID_STATUS: WatchStatus[] = ["to-watch", "watching", "watched"];

export function parseMoviePosterInput(body: unknown): MoviePosterInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const title = String(payload.title ?? "").trim();
  const posterUrl = String(payload.posterUrl ?? "").trim();
  const director = String(payload.director ?? "").trim();
  const year = Number(payload.year);
  const rating = Number(payload.rating);
  const watchStatus = String(payload.watchStatus ?? "").trim() as WatchStatus;

  if (!title || !posterUrl || !director) {
    return null;
  }

  if (!Number.isInteger(year) || year < 1888 || year > 2100) {
    return null;
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
    return null;
  }

  if (!VALID_STATUS.includes(watchStatus)) {
    return null;
  }

  return { title, posterUrl, director, year, rating, watchStatus };
}
