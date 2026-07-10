"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useIncidents } from "@/lib/hooks";
import { MapStyle } from "@/types/incident";
import Header from "@/components/layout/Header";
import IncidentDetail from "@/components/incidents/IncidentDetail";
import FilterPanel from "@/components/filters/FilterPanel";
import Legend from "@/components/map/Legend";
import TimelineControl from "@/components/timeline/TimelineControl";
import { incidents as allIncidentsData } from "@/data/incidents";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0f0f23]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-white/50">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const {
    filtered,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    selectedId,
    setSelectedId,
    selected,
    resetFilters,
    hasActiveFilters,
  } = useIncidents();

  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");
  const [showFilters, setShowFilters] = useState(false);
  const flyToRef = useRef<((lat: number, lng: number) => void) | null>(null);
  const resetViewRef = useRef<(() => void) | null>(null);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setShowFilters(false);
      const url = new URL(window.location.href);
      url.searchParams.set("incident", id);
      window.history.pushState({}, "", url.toString());
    },
    [setSelectedId]
  );

  const handleClose = useCallback(() => {
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("incident");
    window.history.pushState({}, "", url.toString());
  }, [setSelectedId]);

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    flyToRef.current?.(lat, lng);
  }, []);

  const handleResetView = useCallback(() => {
    resetViewRef.current?.();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incidentId = params.get("incident");
    if (incidentId) setSelectedId(incidentId);
  }, [setSelectedId]);

  useEffect(() => {
    const handler = () => {
      const params = new URLSearchParams(window.location.search);
      const incidentId = params.get("incident");
      setSelectedId(incidentId);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [setSelectedId]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapView
        incidents={filtered}
        selectedId={selectedId}
        onSelect={handleSelect}
        mapStyle={mapStyle}
        flyToRef={flyToRef}
        resetViewRef={resetViewRef}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSelect={handleSelect}
        onFilterToggle={() => setShowFilters(!showFilters)}
        hasActiveFilters={hasActiveFilters}
        visibleCount={filtered.length}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
        onResetView={handleResetView}
      />

      {showFilters && (
        <div className="absolute top-0 left-0 bottom-0 w-80 z-40 shadow-2xl animate-in slide-in-from-left">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            onClose={() => setShowFilters(false)}
            hasActive={hasActiveFilters}
          />
        </div>
      )}

      {selected && (
        <div className="absolute top-0 right-0 bottom-0 w-96 max-w-full z-40 shadow-2xl">
          <IncidentDetail
            incident={selected}
            onClose={handleClose}
            onFlyTo={handleFlyTo}
          />
        </div>
      )}

      <Legend />

      <TimelineControl
        incidents={allIncidentsData}
        yearRange={filters.yearRange}
        onYearRangeChange={(range) =>
          setFilters({ ...filters, yearRange: range })
        }
      />

      <div className="absolute bottom-14 left-4 z-10 max-w-xs">
        <p className="text-[10px] text-white/30 leading-tight">
          Locations are based on publicly reported information. Some
          coordinates identify an approximate encounter area, witness
          location, military base, airport, town centre, or regional
          midpoint rather than a verified exact position.
        </p>
      </div>
    </div>
  );
}
