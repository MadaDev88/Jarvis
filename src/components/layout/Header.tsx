"use client";

import { Filter, Map, RotateCcw, List } from "lucide-react";
import SearchBar from "./SearchBar";
import { MapStyle } from "@/types/incident";
import { MAP_STYLE_LABELS } from "@/lib/map-styles";
import Link from "next/link";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSearchSelect: (id: string) => void;
  onFilterToggle: () => void;
  hasActiveFilters: boolean;
  visibleCount: number;
  mapStyle: MapStyle;
  onMapStyleChange: (s: MapStyle) => void;
  onResetView: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onSearchSelect,
  onFilterToggle,
  hasActiveFilters,
  visibleCount,
  mapStyle,
  onMapStyleChange,
  onResetView,
}: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="p-3 md:p-4 flex flex-wrap items-center gap-2 md:gap-3">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            UFO Atlas
          </h1>
        </div>

        <div className="pointer-events-auto flex-1 min-w-[200px] max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onSelect={onSearchSelect}
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onFilterToggle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors border ${
              hasActiveFilters
                ? "bg-emerald-600/90 border-emerald-500 text-white"
                : "bg-[#1a1a2e]/90 backdrop-blur-md border-white/10 text-white/70 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle filters"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          <select
            value={mapStyle}
            onChange={(e) => onMapStyleChange(e.target.value as MapStyle)}
            className="px-2 py-2 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg text-sm text-white/70 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
            aria-label="Map style"
          >
            {(Object.keys(MAP_STYLE_LABELS) as MapStyle[]).map((s) => (
              <option key={s} value={s} className="bg-[#1a1a2e]">
                {MAP_STYLE_LABELS[s]}
              </option>
            ))}
          </select>

          <button
            onClick={onResetView}
            className="p-2 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Reset map view"
          >
            <RotateCcw size={14} />
          </button>

          <Link
            href="/directory"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="View incident directory"
          >
            <List size={14} />
            <span className="hidden sm:inline">Directory</span>
          </Link>

          <div className="px-2 py-1 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg text-xs text-white/50">
            {visibleCount} incidents
          </div>
        </div>
      </div>
    </header>
  );
}
