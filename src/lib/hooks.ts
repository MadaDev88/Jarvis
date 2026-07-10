"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { UFOIncident, FilterState } from "@/types/incident";
import { incidents as allIncidents } from "@/data/incidents";
import { DEFAULT_FILTERS, filterIncidents, searchIncidents } from "./utils";

export function useIncidents() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterIncidents(allIncidents, filters),
    [filters]
  );

  const searched = useMemo(
    () => searchIncidents(filtered, searchQuery),
    [filtered, searchQuery]
  );

  const selected = useMemo(
    () => allIncidents.find((i) => i.id === selectedId) ?? null,
    [selectedId]
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.countries.length > 0 ||
      filters.categories.length > 0 ||
      filters.locationAccuracy.length > 0 ||
      filters.militaryInvolvement !== null ||
      filters.radarEvidence !== null ||
      filters.videoEvidence !== null ||
      filters.physicalEvidence !== null ||
      filters.officialInvestigation !== null ||
      filters.statuses.length > 0 ||
      filters.minCredibility > 0 ||
      filters.yearRange[0] !== DEFAULT_FILTERS.yearRange[0] ||
      filters.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]
    );
  }, [filters]);

  return {
    allIncidents,
    filtered: searched,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    selectedId,
    setSelectedId,
    selected,
    resetFilters,
    hasActiveFilters,
  };
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
