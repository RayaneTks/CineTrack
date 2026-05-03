import { NextResponse } from "next/server";
import { createManyPosters } from "@/lib/posters-store";
import { parseMoviePosterInput } from "@/lib/poster-payload";
import type { MoviePosterInput } from "@/app/types/movie-poster";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "JSON invalide." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Corps de requête invalide." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const rawItems = record.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ message: "Le champ « items » doit être un tableau non vide." }, { status: 400 });
  }

  const inputs: MoviePosterInput[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    const row = parseMoviePosterInput(rawItems[i]);
    if (!row) {
      return NextResponse.json(
        { message: `Entrée invalide à l'index ${i} (titre, URL, réalisateur, année, note ou statut).` },
        { status: 400 },
      );
    }
    inputs.push(row);
  }

  const created = await createManyPosters(inputs);

  return NextResponse.json({ count: created.length, posters: created }, { status: 201 });
}
