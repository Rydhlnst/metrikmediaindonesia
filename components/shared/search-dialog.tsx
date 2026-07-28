"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MagnifyingGlass, Clock } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/pencarian?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        <form onSubmit={handleSearch} className="flex items-center border-b border-border">
          <MagnifyingGlass className="ml-4 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari artikel, berita, atau topik..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="sm" className="mr-2 h-7 bg-brand text-brand-foreground hover:bg-brand/90">
            Cari
          </Button>
        </form>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Ketik kata kunci untuk mulai mencari
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
