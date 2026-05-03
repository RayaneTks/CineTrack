import { NextResponse } from "next/server";
import { deletePoster, getPosterById, updatePoster } from "@/lib/posters-store";
import { parseMoviePosterInput } from "@/lib/poster-payload";

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ message: "ID invalide." }, { status: 400 });
  }

  const poster = await getPosterById(id);

  if (!poster) {
    return NextResponse.json({ message: "Affiche introuvable." }, { status: 404 });
  }

  return NextResponse.json(poster);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ message: "ID invalide." }, { status: 400 });
  }

  const body = await request.json();
  const payload = parseMoviePosterInput(body);

  if (!payload) {
    return NextResponse.json({ message: "Données invalides." }, { status: 400 });
  }

  const updated = await updatePoster(id, payload);

  if (!updated) {
    return NextResponse.json({ message: "Affiche introuvable." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) {
    return NextResponse.json({ message: "ID invalide." }, { status: 400 });
  }

  const deleted = await deletePoster(id);

  if (!deleted) {
    return NextResponse.json({ message: "Affiche introuvable." }, { status: 404 });
  }

  return NextResponse.json({ message: "Affiche supprimée." });
}
