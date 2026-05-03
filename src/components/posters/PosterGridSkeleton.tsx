"use client";

import { Card } from "@/components/ui/Card";

export function PosterGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex h-full animate-pulse flex-col border-text-muted/5 bg-surface/30">
          <div className="aspect-[2/3] bg-text-muted/10" />
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <div className="h-5 w-[75%] rounded-full bg-text-muted/10" />
              <div className="h-3 w-1/2 rounded-full bg-text-muted/10" />
            </div>
            <div className="flex justify-between border-t border-text-muted/5 pt-4">
              <div className="h-3 w-12 rounded-full bg-text-muted/10" />
              <div className="h-3 w-8 rounded-full bg-text-muted/10" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
