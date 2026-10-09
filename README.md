# CineTrack — Gestion d’une collection de films

Application web réalisée dans un cadre scolaire pour gérer des fiches de films et leurs affiches. Le projet met en pratique les opérations CRUD, les formulaires React et une API avec persistance locale.

## Fonctionnalités

- Création, modification, suppression et duplication de fiches de films.
- Saisie du titre, du réalisateur, de l’année, de la note, du statut et de l’affiche.
- Tri, filtrage par décennie et sélection aléatoire d’un film à voir.
- Import et export des données au format JSON.

## Technologies

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion.

Les données sont enregistrées côté serveur dans `data/posters.json`. Ce stockage sur fichier convient à l’exercice ; il nécessite un environnement conservant les fichiers écrits.

## Installation

```bash
git clone https://github.com/RayaneTks/CineTrack.git
cd CineTrack
npm ci
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Commandes

```bash
npm run build  # Compiler l’application
npm run start  # Démarrer la version compilée
npm run lint   # Vérifier et corriger le code avec ESLint
```

## Organisation

| Chemin | Rôle |
|---|---|
| `src/app/` | Pages et routes API. |
| `src/components/posters/` | Formulaires, filtres et affichage des films. |
| `src/lib/` | Validation des données et stockage. |
| `data/` | Données persistées au format JSON. |

## API

| Méthode | Route | Action |
|---|---|---|
| GET / POST | `/api/posters` | Lister ou créer les fiches. |
| GET / PUT / DELETE | `/api/posters/:id` | Consulter, modifier ou supprimer une fiche. |
| POST | `/api/posters/:id/duplicate` | Dupliquer une fiche. |
| POST | `/api/posters/import` | Importer un objet JSON `{ "items": [...] }`. |
