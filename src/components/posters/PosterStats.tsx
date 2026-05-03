"use client";

import { Film, CheckCircle2, PlayCircle, Library } from "lucide-react";
import type { MoviePoster } from "@/app/types/movie-poster";
import { Card } from "@/components/ui/Card";

interface PosterStatsProps {
  posters: MoviePoster[];
}

export function PosterStats({ posters }: PosterStatsProps) {
  const stats = [
    {
      label: "Total affiches",
      value: posters.length,
      icon: Library,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "À voir",
      value: posters.filter((p) => p.watchStatus === "to-watch").length,
      icon: Film,
      color: "text-text-muted",
      bg: "bg-surface",
    },
    {
      label: "En cours",
      value: posters.filter((p) => p.watchStatus === "watching").length,
      icon: PlayCircle,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Vus",
      value: posters.filter((p) => p.watchStatus === "watched").length,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 transition-all duration-300 border-text-muted/5 hover:border-text-muted/20"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
