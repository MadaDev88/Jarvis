"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { incidents } from "@/data/incidents";
import { UFOIncident } from "@/types/incident";
import {
  searchIncidents,
  ACCURACY_LABELS,
  STATUS_LABELS,
  ACCURACY_COLORS,
  incidentsToCSV,
  incidentsToGeoJSONExport,
  downloadFile,
} from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import CredibilityMeter from "@/components/ui/CredibilityMeter";
import {
  ArrowLeft,
  Search,
  Download,
  LayoutGrid,
  LayoutList,
  ChevronUp,
  ChevronDown,
  MapPin,
  Calendar,
  Shield,
  X,
} from "lucide-react";

type SortKey = "year" | "credibilityScore" | "country" | "name";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"table" | "card">("table");
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const searched = useMemo(
    () => searchIncidents(incidents, query),
    [query]
  );

  const sorted = useMemo(() => {
    const arr = [...searched];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return arr;
  }, [searched, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(0);
    },
    [sortKey]
  );

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  };

  const exportCSV = () => {
    downloadFile(incidentsToCSV(sorted), "ufo-atlas-incidents.csv", "text/csv");
  };

  const exportGeoJSON = () => {
    downloadFile(
      incidentsToGeoJSONExport(sorted),
      "ufo-atlas-incidents.geojson",
      "application/geo+json"
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Map
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Incident Directory</h1>
            <p className="text-sm text-white/50">
              {sorted.length} incidents
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
              aria-label="Search incidents"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X size={14} className="text-white/40" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setView("table")}
              className={`p-2 rounded ${view === "table" ? "bg-emerald-600" : "hover:bg-white/10"} transition-colors`}
              aria-label="Table view"
            >
              <LayoutList size={14} />
            </button>
            <button
              onClick={() => setView("card")}
              className={`p-2 rounded ${view === "card" ? "bg-emerald-600" : "hover:bg-white/10"} transition-colors`}
              aria-label="Card view"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              <Download size={14} />
              CSV
            </button>
            <button
              onClick={exportGeoJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              <Download size={14} />
              GeoJSON
            </button>
          </div>
        </div>

        {view === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th
                    className="text-left px-4 py-3 font-medium text-white/60 cursor-pointer hover:text-white"
                    onClick={() => toggleSort("name")}
                  >
                    <span className="flex items-center gap-1">
                      Name <SortIcon col="name" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-white/60 cursor-pointer hover:text-white"
                    onClick={() => toggleSort("year")}
                  >
                    <span className="flex items-center gap-1">
                      Year <SortIcon col="year" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-white/60 cursor-pointer hover:text-white"
                    onClick={() => toggleSort("country")}
                  >
                    <span className="flex items-center gap-1">
                      Country <SortIcon col="country" />
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/60">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/60">
                    Status
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-white/60 cursor-pointer hover:text-white"
                    onClick={() => toggleSort("credibilityScore")}
                  >
                    <span className="flex items-center gap-1">
                      Credibility <SortIcon col="credibilityScore" />
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((inc) => (
                  <tr
                    key={inc.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{inc.name}</td>
                    <td className="px-4 py-3 text-white/60">{inc.year}</td>
                    <td className="px-4 py-3 text-white/60">{inc.country}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          {
                            exact: "green",
                            approximate: "amber",
                            regional: "purple",
                            "aerial-route": "blue",
                            maritime: "cyan",
                          }[inc.locationAccuracy] as
                            | "green"
                            | "amber"
                            | "purple"
                            | "blue"
                            | "cyan"
                        }
                      >
                        {ACCURACY_LABELS[inc.locationAccuracy]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white/50">
                        {STATUS_LABELS[inc.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-32">
                      <CredibilityMeter score={inc.credibilityScore} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/?incident=${inc.id}`}
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs"
                      >
                        <MapPin size={12} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((inc) => (
              <div
                key={inc.id}
                className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{inc.name}</h3>
                  <Badge
                    variant={
                      {
                        exact: "green",
                        approximate: "amber",
                        regional: "purple",
                        "aerial-route": "blue",
                        maritime: "cyan",
                      }[inc.locationAccuracy] as
                        | "green"
                        | "amber"
                        | "purple"
                        | "blue"
                        | "cyan"
                    }
                  >
                    {inc.locationAccuracy}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {inc.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {inc.country}
                  </span>
                  {inc.militaryInvolvement && (
                    <span className="flex items-center gap-1 text-amber-400/60">
                      <Shield size={10} />
                      Military
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 mb-3 line-clamp-2">
                  {inc.summary}
                </p>
                <div className="flex items-center justify-between">
                  <CredibilityMeter score={inc.credibilityScore} />
                  <Link
                    href={`/?incident=${inc.id}`}
                    className="ml-3 flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs whitespace-nowrap"
                  >
                    <MapPin size={12} />
                    Map
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-white/50">
              {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
            >
              Next
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-xs text-white/30 leading-relaxed">
            <strong>Disclaimer:</strong> Locations are based on publicly
            reported information. Some coordinates identify an approximate
            encounter area, witness location, military base, airport, town
            centre, or regional midpoint rather than a verified exact
            position. Credibility scores reflect publicly available evidence
            and investigation status. No entry should be interpreted as
            confirmation of extraterrestrial activity.
          </p>
        </div>
      </div>
    </div>
  );
}
