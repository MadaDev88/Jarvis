"use client";

import { ACCURACY_COLORS, ACCURACY_LABELS } from "@/lib/utils";
import { LocationAccuracy } from "@/types/incident";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const markerTypes = [
  { label: "Standard sighting", shape: "circle" },
  { label: "Military encounter", shape: "shield" },
  { label: "Radar confirmed", shape: "radar" },
  { label: "Mass / school sighting", shape: "group" },
  { label: "Crash or landing claim", shape: "diamond" },
  { label: "Maritime incident", shape: "wave" },
  { label: "Aerial route", shape: "aircraft" },
];

export default function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-20">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors shadow-lg"
        aria-expanded={open}
        aria-label="Toggle legend"
      >
        Legend
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl space-y-3 min-w-[200px]">
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Location Accuracy (colour)
            </h4>
            <div className="space-y-1">
              {(Object.keys(ACCURACY_COLORS) as LocationAccuracy[]).map(
                (k) => (
                  <div key={k} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ACCURACY_COLORS[k] }}
                    />
                    <span className="text-white/60">
                      {ACCURACY_LABELS[k]}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Marker Types (shape)
            </h4>
            <div className="space-y-1">
              {markerTypes.map((m) => (
                <div key={m.shape} className="flex items-center gap-2 text-xs">
                  <span className="text-white/40 w-3 text-center font-mono">
                    {m.shape === "circle"
                      ? "●"
                      : m.shape === "shield"
                        ? "⛨"
                        : m.shape === "radar"
                          ? "◎"
                          : m.shape === "group"
                            ? "⊕"
                            : m.shape === "diamond"
                              ? "◆"
                              : m.shape === "wave"
                                ? "≋"
                                : "✈"}
                  </span>
                  <span className="text-white/60">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
