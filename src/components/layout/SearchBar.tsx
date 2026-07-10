"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { UFOIncident } from "@/types/incident";
import { searchIncidents } from "@/lib/utils";
import { incidents } from "@/data/incidents";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSelect: (id: string) => void;
}

export default function SearchBar({ value, onChange, onSelect }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<UFOIncident[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      setSuggestions(searchIncidents(incidents, value).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      setFocused(false);
      onChange("");
    },
    [onSelect, onChange]
  );

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search incidents, countries, years..."
          className="w-full pl-9 pr-8 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          aria-label="Search incidents"
          role="combobox"
          aria-expanded={focused && suggestions.length > 0}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
            aria-label="Clear search"
          >
            <X size={14} className="text-white/40" />
          </button>
        )}
      </div>
      {focused && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
          role="listbox"
        >
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className="w-full text-left px-3 py-2.5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
              role="option"
              aria-selected={false}
            >
              <div className="text-sm text-white font-medium">{s.name}</div>
              <div className="text-xs text-white/40">
                {s.year} &middot; {s.country} &middot; {s.locationName}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
