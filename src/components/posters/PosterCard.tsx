"use client";

import * as React from "react";
import { Edit2, Trash2, Calendar, User, Star, Copy } from "lucide-react";
import { motion } from "motion/react";
import type { MoviePoster } from "@/app/types/movie-poster";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PosterCardProps {
  poster: MoviePoster;
  onEdit: (poster: MoviePoster) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

/** Deuxième source quasi toujours joignable si la première URL est bloquée ou invalide. */
function fallbackPosterUrl(poster: MoviePoster) {
  const picId = 500 + poster.id;
  return `https://picsum.photos/id/${picId}/500/750`;
}

export function PosterCard({ poster, onEdit, onDelete, onDuplicate }: PosterCardProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group flex h-full flex-col border-text-muted/5 transition-all duration-500 ease-out hover:border-primary/30">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterSrc}
            alt={poster.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
          <div className="absolute left-3 top-3">
            <Badge
              variant={variant}
              className="border-white/10 bg-opacity-60 px-2 py-1 text-[10px] uppercase tracking-widest shadow-2xl backdrop-blur-md"
            >
              {label}
            </Badge>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-background/60 px-2 py-1 shadow-lg backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-[11px] font-bold text-white">{poster.rating}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full gap-2 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 transition-transform duration-500 ease-out group-hover:translate-y-0 md:flex">
            <Button size="sm" variant="outline" className="h-9 shrink-0 rounded-full px-3" onClick={() => onDuplicate(poster.id)}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="primary" className="h-9 flex-1 rounded-full" onClick={() => onEdit(poster)}>
              <Edit2 className="mr-2 h-3.5 w-3.5" />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="h-9 w-9 shrink-0 rounded-full border border-danger/10 bg-danger/20 p-0 hover:bg-danger"
              onClick={() => onDelete(poster.id)}
              aria-label={`Supprimer ${poster.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 border-t border-text-muted/10 bg-surface/80 p-3 md:hidden">
          <Button size="sm" variant="outline" className="h-10 flex-1 rounded-full" onClick={() => onDuplicate(poster.id)}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copier
          </Button>
          <Button size="sm" variant="primary" className="h-10 flex-1 rounded-full" onClick={() => onEdit(poster)}>
            <Edit2 className="mr-1.5 h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="h-10 w-10 shrink-0 rounded-full border border-danger/10 bg-danger/20 p-0"
            onClick={() => onDelete(poster.id)}
            aria-label={`Supprimer ${poster.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col space-y-3 bg-surface/50 p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-lg font-bold leading-tight text-text-primary transition-colors duration-300 group-hover:text-primary">
              {poster.title}
            </h3>
            <div className="flex items-center text-xs text-text-muted">
              <User className="mr-1.5 h-3 w-3 opacity-50" />
              <span className="line-clamp-1">{poster.director}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-text-muted/5 pt-2">
            <div className="flex items-center text-[11px] font-medium uppercase tracking-wider text-text-muted opacity-60">
              <Calendar className="mr-1.5 h-3 w-3" />
              {poster.year}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
