"use client";

import * as React from "react";
import { Dices, Download, Upload, ArrowDownAZ } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type SortKey = "updated" | "title" | "year" | "rating";
export type SortDir = "asc" | "desc";

interface PosterToolbarProps {
  sortKey: SortKey;
  sortDir: SortDir;
  onSortKeyChange: (k: SortKey) => void;
  onSortDirChange: (d: SortDir) => void;
  decade: number | "all";
  onDecadeChange: (d: number | "all") => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onRoulette: () => void;
  rouletteDisabled?: boolean;
}

const DECADES: { label: string; value: number | "all" }[] = [
  { label: "Toutes décennies", value: "all" },
  { label: "1980", value: 1980 },
  { label: "1990", value: 1990 },
  { label: "2000", value: 2000 },
  { label: "2010", value: 2010 },
  { label: "2020", value: 2020 },
];

export function PosterToolbar({
  sortKey,
  sortDir,
  onSortKeyChange,
  onSortDirChange,
  decade,
  onDecadeChange,
  onExport,
  onImportFile,
  onRoulette,
  rouletteDisabled,
}: PosterToolbarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/5 bg-surface/40 p-4 backdrop-blur-sm md:flex-row md:flex-wrap md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-text-muted">Tri</span>
        <select
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          className="h-9 rounded-lg border border-text-muted/15 bg-background/80 px-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Critère de tri"
        >
          <option value="updated">Dernière mise à jour</option>
          <option value="title">Titre</option>
          <option value="year">Année</option>
          <option value="rating">Note</option>
        </select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1 rounded-lg px-2"
          onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
          title={sortDir === "asc" ? "Ordre croissant" : "Ordre décroissant"}
        >
          <ArrowDownAZ className="h-4 w-4" />
          {sortDir === "asc" ? "Croissant" : "Décroissant"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-text-muted">Décennie</span>
        <select
          value={decade === "all" ? "all" : String(decade)}
          onChange={(e) => {
            const v = e.target.value;
            onDecadeChange(v === "all" ? "all" : Number(v));
          }}
          className="h-9 rounded-lg border border-text-muted/15 bg-background/80 px-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Filtrer par décennie"
        >
          {DECADES.map((d) => (
            <option key={String(d.value)} value={d.value === "all" ? "all" : d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:ml-auto">
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg" onClick={onExport}>
          <Download className="mr-1.5 h-4 w-4" />
          Exporter JSON
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-1.5 h-4 w-4" />
          Importer
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-9 rounded-lg"
          onClick={onRoulette}
          disabled={rouletteDisabled}
          title="Choisir au hasard parmi les films « À voir »"
        >
          <Dices className="mr-1.5 h-4 w-4" />
          Roulette « À voir »
        </Button>
      </div>

      <p className="w-full text-center text-[11px] text-text-muted md:text-left">
        Raccourci : <kbd className="rounded border border-text-muted/20 bg-surface px-1 font-mono text-[10px]">N</kbd>{" "}
        pour ajouter une affiche (hors champ de saisie).
      </p>
    </div>
  );
}
