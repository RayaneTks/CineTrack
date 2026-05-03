"use client";

import { Search, Plus } from "lucide-react";
import type { WatchStatus } from "@/app/types/movie-poster";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface PosterFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  status: WatchStatus | "all";
  setStatus: (s: WatchStatus | "all") => void;
  onAdd: () => void;
}

export function PosterFilters({ search, setSearch, status, setStatus, onAdd }: PosterFiltersProps) {
  const tabs: { label: string; value: WatchStatus | "all" }[] = [
    { label: "Tous", value: "all" },
    { label: "À voir", value: "to-watch" },
    { label: "En cours", value: "watching" },
    { label: "Vus", value: "watched" },
  ];

  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="group relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Rechercher un film..."
          className="h-11 rounded-full border-text-muted/10 bg-surface/50 pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
        <div className="flex rounded-full border border-text-muted/10 bg-surface/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300",
                status === tab.value ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mx-2 hidden h-4 w-px bg-text-muted/20 sm:block" />
        <Button
          type="button"
          onClick={onAdd}
          className="h-11 rounded-full px-6 shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une affiche
        </Button>
      </div>
    </div>
  );
}
