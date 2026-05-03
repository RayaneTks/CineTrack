import { NextResponse } from "next/server";
import { createPoster, getPosterById } from "@/lib/posters-store";

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ message: "ID invalide." }, { status: 400 });
  }

  const poster = await getPosterById(id);

  if (!poster) {
    return NextResponse.json({ message: "Affiche introuvable." }, { status: 404 });
  }

  const created = await createPoster({
    title: `${poster.title} (copie)`,
    posterUrl: poster.posterUrl,
    director: poster.director,
    year: poster.year,
    rating: poster.rating,
    watchStatus: poster.watchStatus,
  });

  return NextResponse.json(created, { status: 201 });
}
