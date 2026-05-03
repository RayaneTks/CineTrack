"use client";

import * as React from "react";
import { Edit2, Trash2, Calendar, User, Star, Copy } from "lucide-react";
import { motion } from "motion/react";
import type { MoviePoster } from "@/app/types/movie-poster";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PosterListRowProps {
  poster: MoviePoster;
  onEdit: (poster: MoviePoster) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

function fallbackPosterUrl(poster: MoviePoster) {
  const picId = 500 + poster.id;
  return `https://picsum.photos/id/${picId}/500/750`;
}

export function PosterListRow({ poster, onEdit, onDelete, onDuplicate }: PosterListRowProps) {
  const [posterSrc, setPosterSrc] = React.useState(poster.posterUrl);

  React.useEffect(() => {
    setPosterSrc(poster.posterUrl);
  }, [poster.posterUrl, poster.id]);

  const statusConfig = {
    "to-watch": { label: "À voir", variant: "outline" as const },
    watching: { label: "En cours", variant: "secondary" as const },
    watched: { label: "Vu", variant: "success" as const },
  };

  const { label, variant } = statusConfig[poster.watchStatus];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="flex flex-col gap-4 border-text-muted/5 p-4 transition-colors hover:border-primary/20 sm:flex-row sm:items-stretch">
        <div className="relative mx-auto aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:w-24">
          <img
            src={posterSrc}
            alt={poster.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => {
              setPosterSrc((current) => {
                const fallback = fallbackPosterUrl(poster);
                return current === fallback ? current : fallback;
              });
            }}
          />
          <div className="absolute left-2 top-2">
            <Badge variant={variant} className="px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
              {label}
            </Badge>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight text-text-primary">{poster.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3 opacity-60" />
              {poster.director}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 opacity-60" />
              {poster.year}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-yellow-500">
              <Star className="h-3 w-3 fill-yellow-500" />
              {poster.rating}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-text-muted/5 pt-3 sm:border-t-0 sm:pt-0">
          <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => onDuplicate(poster.id)}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Dupliquer
          </Button>
          <Button size="sm" variant="primary" className="h-9 rounded-full" onClick={() => onEdit(poster)}>
            <Edit2 className="mr-1.5 h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="h-9 w-9 rounded-full border border-danger/10 bg-danger/20 p-0 hover:bg-danger"
            onClick={() => onDelete(poster.id)}
            aria-label={`Supprimer ${poster.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
