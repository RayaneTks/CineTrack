"use client";

import { Film, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  onAdd: () => void;
  isFiltering: boolean;
}

export function EmptyState({ onAdd, isFiltering }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-text-muted/10 bg-surface/20 p-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Film className="h-8 w-8 text-primary opacity-50" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">
        {isFiltering ? "Aucun résultat trouvé" : "Votre studio est vide"}
      </h3>
      <p className="mb-8 max-w-sm text-text-muted">
        {isFiltering
          ? "Ajustez vos filtres ou votre recherche pour trouver ce que vous cherchez."
          : "Commencez par ajouter votre premier film à votre collection CineTrack."}
      </p>
      {!isFiltering ? (
        <Button type="button" onClick={onAdd} className="rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une affiche
        </Button>
      ) : null}
    </div>
  );
}
