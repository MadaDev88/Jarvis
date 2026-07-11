"use client";

import { FilterState, LocationAccuracy, IncidentStatus } from "@/types/incident";
import { incidents } from "@/data/incidents";
import {
  getUniqueCountries,
  getUniqueCategories,
  ACCURACY_LABELS,
  STATUS_LABELS,
} from "@/lib/utils";
import { X, RotateCcw } from "lucide-react";
import { useMemo } from "react";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
  hasActive: boolean;
}

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  onClose,
  hasActive,
}: FilterPanelProps) {
  const countries = useMemo(() => getUniqueCountries(incidents), []);
  const categories = useMemo(() => getUniqueCategories(incidents), []);

  const toggleArray = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const toggleBool = (current: boolean | null, val: boolean): boolean | null =>
    current === val ? null : val;

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-white">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex gap-2">
          {hasActive && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Clear all filters"
            >
              <RotateCcw size={12} />
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Year Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1940}
              max={2030}
              value={filters.yearRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  yearRange: [Number(e.target.value), filters.yearRange[1]],
                })
              }
              className="w-20 bg-white/10 border border-white/10 rounded px-2 py-1 text-sm"
              aria-label="Start year"
            />
            <span className="text-white/30">&ndash;</span>
            <input
              type="number"
              min={1940}
              max={2030}
              value={filters.yearRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  yearRange: [filters.yearRange[0], Number(e.target.value)],
                })
              }
              className="w-20 bg-white/10 border border-white/10 rounded px-2 py-1 text-sm"
              aria-label="End year"
            />
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Country
          </label>
          <div className="flex flex-wrap gap-1.5">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() =>
                  onChange({
                    ...filters,
                    countries: toggleArray(filters.countries, c),
                  })
                }
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  filters.countries.includes(c)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() =>
                  onChange({
                    ...filters,
                    categories: toggleArray(filters.categories, c),
                  })
                }
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  filters.categories.includes(c)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Location Accuracy
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(
              Object.keys(ACCURACY_LABELS) as LocationAccuracy[]
            ).map((a) => (
              <button
                key={a}
                onClick={() =>
                  onChange({
                    ...filters,
                    locationAccuracy: toggleArray(
                      filters.locationAccuracy,
                      a
                    ),
                  })
                }
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  filters.locationAccuracy.includes(a)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {ACCURACY_LABELS[a]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(
              Object.keys(STATUS_LABELS) as IncidentStatus[]
            ).map((s) => (
              <button
                key={s}
                onClick={() =>
                  onChange({
                    ...filters,
                    statuses: toggleArray(filters.statuses, s),
                  })
                }
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  filters.statuses.includes(s)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Evidence & Investigation
          </label>
          <div className="space-y-2">
            {[
              {
                label: "Military Involvement",
                key: "militaryInvolvement" as const,
              },
              { label: "Radar Evidence", key: "radarEvidence" as const },
              { label: "Video Evidence", key: "videoEvidence" as const },
              {
                label: "Physical Evidence",
                key: "physicalEvidence" as const,
              },
              {
                label: "Official Investigation",
                key: "officialInvestigation" as const,
              },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{label}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      onChange({
                        ...filters,
                        [key]: toggleBool(filters[key], true),
                      })
                    }
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      filters[key] === true
                        ? "bg-emerald-600 text-white"
                        : "bg-white/10 text-white/40 hover:bg-white/20"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() =>
                      onChange({
                        ...filters,
                        [key]: toggleBool(filters[key], false),
                      })
                    }
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      filters[key] === false
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-white/40 hover:bg-white/20"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Minimum Credibility Score: {filters.minCredibility}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.minCredibility}
            onChange={(e) =>
              onChange({
                ...filters,
                minCredibility: Number(e.target.value),
              })
            }
            className="w-full accent-emerald-500"
            aria-label="Minimum credibility score"
          />
        </section>
      </div>
    </div>
  );
}
