"use client";

import * as React from "react";
import type { MoviePoster, MoviePosterInput, WatchStatus } from "@/app/types/movie-poster";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface PosterFormProps {
  initialData?: MoviePoster;
  onSubmit: (data: MoviePosterInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function emptyInput(): MoviePosterInput {
  return {
    title: "",
    posterUrl: "",
    director: "",
    year: new Date().getFullYear(),
    rating: 5,
    watchStatus: "to-watch",
  };
}

export function PosterForm({ initialData, onSubmit, onCancel, isLoading }: PosterFormProps) {
  const [formData, setFormData] = React.useState<MoviePosterInput>(() =>
    initialData
      ? {
          title: initialData.title,
          posterUrl: initialData.posterUrl,
          director: initialData.director,
          year: initialData.year,
          rating: initialData.rating,
          watchStatus: initialData.watchStatus,
        }
      : emptyInput(),
  );

  const [errors, setErrors] = React.useState<Partial<Record<keyof MoviePosterInput, string>>>({});

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        posterUrl: initialData.posterUrl,
        director: initialData.director,
        year: initialData.year,
        rating: initialData.rating,
        watchStatus: initialData.watchStatus,
      });
    } else {
      setFormData(emptyInput());
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof MoviePosterInput, string>> = {};
    if (!formData.title) newErrors.title = "Le titre est requis";
    if (!formData.director) newErrors.director = "Le réalisateur est requis";
    if (!formData.posterUrl) newErrors.posterUrl = "L'URL de l'image est requise";
    if (formData.year < 1888) newErrors.year = "Année invalide";
    if (formData.rating < 0 || formData.rating > 10) newErrors.rating = "Note entre 0 et 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "rating"
          ? Number(value)
          : name === "watchStatus"
            ? (value as WatchStatus)
            : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-muted">Titre du film</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="ex: Inception"
          disabled={isLoading}
        />
        {errors.title ? <p className="text-xs text-danger">{errors.title}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-muted">Réalisateur</label>
        <Input
          name="director"
          value={formData.director}
          onChange={handleChange}
          placeholder="ex: Christopher Nolan"
          disabled={isLoading}
        />
        {errors.director ? <p className="text-xs text-danger">{errors.director}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-muted">URL de l&apos;affiche</label>
        <Input
          name="posterUrl"
          value={formData.posterUrl}
          onChange={handleChange}
          placeholder="https://..."
          disabled={isLoading}
        />
        {errors.posterUrl ? <p className="text-xs text-danger">{errors.posterUrl}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-muted">Année</label>
          <Input type="number" name="year" value={formData.year} onChange={handleChange} disabled={isLoading} />
          {errors.year ? <p className="text-xs text-danger">{errors.year}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-muted">Note (0-10)</label>
          <Input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.rating ? <p className="text-xs text-danger">{errors.rating}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-muted">Statut de visionnage</label>
        <Select name="watchStatus" value={formData.watchStatus} onChange={handleChange} disabled={isLoading}>
          <option value="to-watch">À voir</option>
          <option value="watching">En cours</option>
          <option value="watched">Vu</option>
        </Select>
      </div>

      <div className="flex gap-3 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 rounded-full" disabled={isLoading}>
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-full px-8 shadow-lg shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : initialData ? "Enregistrer" : "Ajouter au studio"}
        </Button>
      </div>
    </form>
  );
}
