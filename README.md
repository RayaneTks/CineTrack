# CineTrack — CRUD d'affiches de films

**Contexte :** petit rendu scolaire — application web en **React** (via [Next.js](https://nextjs.org/), App Router et composants client) avec persistance locale côté serveur. Il s’agit d’un exercice de mise en pratique (CRUD, formulaires, état UI), pas d’un produit complet.

Application pour gérer des affiches de films en CRUD complet :

- Créer une affiche (titre, réalisateur, année, note, statut, URL d'image)
- Lire la liste des affiches
- Mettre à jour une affiche
- Supprimer une affiche
- Dupliquer une affiche, exporter/importer un fichier JSON (`{ "items": [...] }`), tri, filtre par décennie, roulette parmi les films « À voir »

Les données sont persistées dans `data/posters.json`.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Endpoints API

- `GET /api/posters` — liste des affiches
- `POST /api/posters` — création d'une affiche
- `GET /api/posters/:id` — détail d'une affiche
- `PUT /api/posters/:id` — modification d'une affiche
- `DELETE /api/posters/:id` — suppression d'une affiche
- `POST /api/posters/:id/duplicate` — duplication (nouvelle ligne, titre suffixé « (copie) »)
- `POST /api/posters/import` — corps JSON `{ "items": [ MoviePosterInput, ... ] }` pour créer plusieurs affiches

## Build de production

```bash
npm run build
npm run start
```
