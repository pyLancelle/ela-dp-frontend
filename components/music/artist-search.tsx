"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArtistSearchProps {
  value: string;
  artists: string[];
  onChange: (value: string) => void;
}

export function ArtistSearch({ value, artists, onChange }: ArtistSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync avec la prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filtrer les suggestions
  const suggestions = inputValue
    ? artists.filter(a =>
        a.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 8)
    : [];

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (artist: string) => {
    setInputValue(artist);
    onChange(artist);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      onChange(inputValue);
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setIsOpen(true)}
          placeholder="Rechercher un artiste..."
          className={cn(
            "w-full pl-9 pr-9 py-2 text-sm border rounded-md bg-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          )}
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((artist) => (
            <button
              key={artist}
              type="button"
              onClick={() => handleSelect(artist)}
              className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            >
              {artist}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
