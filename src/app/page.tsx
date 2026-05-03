"use client";

import * as React from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { MoviePoster, MoviePosterInput, WatchStatus } from "./types/movie-poster";
import { PosterCard } from "@/components/posters/PosterCard";
import { PosterListRow } from "@/components/posters/PosterListRow";
import { PosterFilters } from "@/components/posters/PosterFilters";
import { PosterStats } from "@/components/posters/PosterStats";
import { PosterForm } from "@/components/posters/PosterForm";
import { PosterGridSkeleton } from "@/components/posters/PosterGridSkeleton";
import { EmptyState } from "@/components/posters/EmptyState";
import { PosterToolbar, type SortDir, type SortKey } from "@/components/posters/PosterToolbar";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function exportPayload(posters: MoviePoster[]) {
  return {
    items: posters.map((p) => ({
      title: p.title,
      posterUrl: p.posterUrl,
      director: p.director,
      year: p.year,
      rating: p.rating,
      watchStatus: p.watchStatus,
    })),
  };
}

export default function Home() {
  const [posters, setPosters] = React.useState<MoviePoster[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<WatchStatus | "all">("all");
  const [decade, setDecade] = React.useState<number | "all">("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("updated");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPoster, setEditingPoster] = React.useState<MoviePoster | undefined>(undefined);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);
  const [roulettePick, setRoulettePick] = React.useState<MoviePoster | null>(null);

  const showSuccess = React.useCallback((msg: string) => {
    setSuccess(msg);
    window.setTimeout(() => setSuccess(null), 3200);
  }, []);

  async function loadPosters() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/posters");
      if (!response.ok) throw new Error("load_failed");
      const data = (await response.json()) as MoviePoster[];
      setPosters(data);
    } catch {
      setError("Impossible de charger les affiches. Vérifie que le serveur tourne.");
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    void loadPosters();
  }, []);

  const filteredPosters = React.useMemo(() => {
    return posters.filter((poster) => {
      const matchesSearch =
        poster.title.toLowerCase().includes(search.toLowerCase()) ||
        poster.director.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || poster.watchStatus === statusFilter;
      const matchesDecade =
        decade === "all" || Math.floor(poster.year / 10) * 10 === decade;
      return matchesSearch && matchesStatus && matchesDecade;
    });
  }, [posters, search, statusFilter, decade]);

  const sortedPosters = React.useMemo(() => {
    const arr = [...filteredPosters];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "title":
          cmp = a.title.localeCompare(b.title, "fr");
          break;
        case "year":
          cmp = a.year - b.year;
          break;
        case "rating":
          cmp = a.rating - b.rating;
          break;
        case "updated":
        default:
          cmp = a.updatedAt.localeCompare(b.updatedAt);
          break;
      }
      return cmp * dir;
    });
    return arr;
  }, [filteredPosters, sortKey, sortDir]);

  const toWatchPool = React.useMemo(
    () => posters.filter((p) => p.watchStatus === "to-watch"),
    [posters],
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPoster(undefined);
  };

  const handleAdd = async (data: MoviePosterInput) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/posters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("save_failed");
      closeModal();
      await loadPosters();
      showSuccess("Affiche ajoutée.");
    } catch {
      setError("Enregistrement impossible. Vérifie les champs et réessaie.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (data: MoviePosterInput) => {
    if (!editingPoster) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/posters/${editingPoster.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("update_failed");
      closeModal();
      await loadPosters();
      showSuccess("Affiche mise à jour.");
    } catch {
      setError("Mise à jour impossible.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteTargetId == null) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setError(null);
    try {
      const response = await fetch(`/api/posters/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      if (editingPoster?.id === id) closeModal();
      await loadPosters();
      showSuccess("Affiche supprimée.");
    } catch {
      setError("Suppression impossible.");
    }
  };

  const handleDuplicate = async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`/api/posters/${id}/duplicate`, { method: "POST" });
      if (!response.ok) throw new Error("dup_failed");
      await loadPosters();
      showSuccess("Copie créée.");
    } catch {
      setError("Duplication impossible.");
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportPayload(posters), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cinetrack-affiches.json";
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Export téléchargé.");
  };

  const handleImportFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const response = await fetch("/api/posters/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const body = (await response.json().catch(() => ({}))) as { message?: string; count?: number };
      if (!response.ok) {
        setError(body.message ?? "Import impossible.");
        return;
      }
      await loadPosters();
      showSuccess(`${body.count ?? 0} affiche(s) importée(s).`);
    } catch {
      setError("Fichier JSON illisible ou invalide.");
    }
  };

  const handleRoulette = () => {
    if (toWatchPool.length === 0) {
      setError("Aucun film « À voir » dans la collection.");
      return;
    }
    const pick = toWatchPool[Math.floor(Math.random() * toWatchPool.length)];
    setRoulettePick(pick);
  };

  const openAddModal = React.useCallback(() => {
    setEditingPoster(undefined);
    setIsModalOpen(true);
  }, []);

  const openEditModal = (poster: MoviePoster) => {
    setEditingPoster(poster);
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) {
        return;
      }
      if (e.key === "n" || e.key === "N") {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        openAddModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAddModal]);

  const isFiltering = search !== "" || statusFilter !== "all" || decade !== "all";

  return (
    <div className="min-h-screen pb-20 selection:bg-primary/30">
      <nav className="sticky top-0 z-40 w-full border-b border-text-muted/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 rotate-45 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-text-muted bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Cine<span className="font-black text-primary">Track</span>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-surface/50 p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={viewMode === "grid" ? "bg-primary/10 text-primary" : "text-text-muted"}
              onClick={() => setViewMode("grid")}
              aria-label="Vue grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={viewMode === "list" ? "bg-primary/10 text-primary" : "text-text-muted"}
              onClick={() => setViewMode("list")}
              aria-label="Vue liste"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-12">
        <section className="group relative mb-12 overflow-hidden rounded-[2.5rem] border border-white/5 bg-surface p-8 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px] transition-colors duration-1000 group-hover:bg-primary/10" />

          <div className="relative z-10 max-w-2xl">
            <Badge variant="secondary" className="mb-6 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
              Suivi de collection cinéma
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Organisez votre <span className="text-primary">odyssée</span> cinématographique.
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-muted">
              Gestion CRUD des affiches : collection, statuts de visionnage et notes — données persistées côté
              serveur (fichier JSON).
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                type="button"
                onClick={openAddModal}
                className="h-14 rounded-full px-8 text-lg shadow-2xl shadow-primary/30"
              >
                <Plus className="mr-3 h-5 w-5" />
                Démarrer la collection
              </Button>
            </div>
          </div>
        </section>

        <PosterStats posters={posters} />

        {success ? (
          <div
            className="mb-4 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
            role="status"
          >
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/5 bg-surface/30 p-6 backdrop-blur-sm md:p-8">
          <PosterFilters
            search={search}
            setSearch={setSearch}
            status={statusFilter}
            setStatus={setStatusFilter}
            onAdd={openAddModal}
          />

          {!isLoading && posters.length > 0 ? (
            <PosterToolbar
              sortKey={sortKey}
              sortDir={sortDir}
              onSortKeyChange={setSortKey}
              onSortDirChange={setSortDir}
              decade={decade}
              onDecadeChange={setDecade}
              onExport={handleExport}
              onImportFile={handleImportFile}
              onRoulette={handleRoulette}
              rouletteDisabled={toWatchPool.length === 0}
            />
          ) : null}

          {isLoading ? (
            <PosterGridSkeleton />
          ) : sortedPosters.length > 0 ? (
            <motion.div
              layout
              className={cn(
                "grid gap-6",
                viewMode === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              )}
            >
              <AnimatePresence mode="popLayout">
                {viewMode === "list"
                  ? sortedPosters.map((poster) => (
                      <PosterListRow
                        key={poster.id}
                        poster={poster}
                        onEdit={openEditModal}
                        onDelete={(id) => setDeleteTargetId(id)}
                        onDuplicate={handleDuplicate}
                      />
                    ))
                  : sortedPosters.map((poster) => (
                      <PosterCard
                        key={poster.id}
                        poster={poster}
                        onEdit={openEditModal}
                        onDelete={(id) => setDeleteTargetId(id)}
                        onDuplicate={handleDuplicate}
                      />
                    ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState onAdd={openAddModal} isFiltering={isFiltering} />
          )}
        </div>
      </main>

      <footer className="container mx-auto mt-20 border-t border-white/5 px-4 py-8 text-center">
        <p className="text-sm text-text-muted">CineTrack — CRUD affiches de films (Next.js)</p>
      </footer>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPoster ? "Modifier l'affiche" : "Nouvelle affiche de film"}
      >
        <PosterForm
          key={editingPoster?.id ?? "new"}
          initialData={editingPoster}
          onCancel={closeModal}
          onSubmit={editingPoster ? handleEdit : handleAdd}
          isLoading={isSaving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Supprimer l'affiche ?"
        message="Cette action est définitive. Les données seront retirées du fichier de stockage."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ConfirmDialog
        isOpen={roulettePick !== null}
        title="Suggestion du moment"
        message={
          roulettePick
            ? `Pourquoi ne pas regarder « ${roulettePick.title} » (${roulettePick.year}) — ${roulettePick.director} ?`
            : ""
        }
        confirmLabel="Ouvrir la fiche"
        cancelLabel="Fermer"
        variant="default"
        onConfirm={() => {
          if (roulettePick) openEditModal(roulettePick);
          setRoulettePick(null);
        }}
        onCancel={() => setRoulettePick(null)}
      />
    </div>
  );
}
