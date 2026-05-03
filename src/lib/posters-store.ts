import { promises as fs } from "node:fs";
import path from "node:path";
import { MoviePoster, MoviePosterInput } from "@/app/types/movie-poster";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posters.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readPosters(): Promise<MoviePoster[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw) as MoviePoster[];
  return parsed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function writePosters(posters: MoviePoster[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posters, null, 2), "utf-8");
}

export async function getAllPosters() {
  return readPosters();
}

export async function createPoster(input: MoviePosterInput) {
  const posters = await readPosters();
  const now = new Date().toISOString();
  const nextId = posters.length > 0 ? Math.max(...posters.map((p) => p.id)) + 1 : 1;

  const newPoster: MoviePoster = {
    id: nextId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  posters.push(newPoster);
  await writePosters(posters);
  return newPoster;
}

export async function updatePoster(id: number, input: MoviePosterInput) {
  const posters = await readPosters();
  const posterIndex = posters.findIndex((poster) => poster.id === id);

  if (posterIndex === -1) {
    return null;
  }

  const updatedPoster: MoviePoster = {
    ...posters[posterIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  posters[posterIndex] = updatedPoster;
  await writePosters(posters);
  return updatedPoster;
}

export async function deletePoster(id: number) {
  const posters = await readPosters();
  const exists = posters.some((poster) => poster.id === id);

  if (!exists) {
    return false;
  }

  const filtered = posters.filter((poster) => poster.id !== id);
  await writePosters(filtered);
  return true;
}

export async function getPosterById(id: number) {
  const posters = await readPosters();
  return posters.find((poster) => poster.id === id) ?? null;
}

export async function createManyPosters(inputs: MoviePosterInput[]) {
  if (inputs.length === 0) {
    return [];
  }
  const posters = await readPosters();
  const now = new Date().toISOString();
  let nextId = posters.length > 0 ? Math.max(...posters.map((p) => p.id)) + 1 : 1;
  const created: MoviePoster[] = inputs.map((input) => {
    const row: MoviePoster = {
      id: nextId++,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    return row;
  });
  posters.push(...created);
  await writePosters(posters);
  return created;
}
