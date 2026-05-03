import { NextResponse } from "next/server";
import { createPoster, getAllPosters } from "@/lib/posters-store";
import { parseMoviePosterInput } from "@/lib/poster-payload";

export async function GET() {
  const posters = await getAllPosters();
  return NextResponse.json(posters);
}

export async function POST(request: Request) {
  const body = await request.json();
  const payload = parseMoviePosterInput(body);

  if (!payload) {
    return NextResponse.json({ message: "Données invalides." }, { status: 400 });
  }

  const created = await createPoster(payload);
  return NextResponse.json(created, { status: 201 });
}
