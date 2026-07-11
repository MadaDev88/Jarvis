"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { UFOIncident } from "@/types/incident";
import { getIncidentsPerDecade } from "@/lib/utils";
import { Play, Pause, SkipBack } from "lucide-react";

interface TimelineControlProps {
  incidents: UFOIncident[];
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
}

export default function TimelineControl({
  incidents,
  yearRange,
  onYearRangeChange,
}: TimelineControlProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const decades = useMemo(
    () => getIncidentsPerDecade(incidents),
    [incidents]
  );

  const allDecades = useMemo(() => {
    const d: string[] = [];
    for (let y = 1940; y <= 2020; y += 10) d.push(`${y}s`);
    return d;
  }, []);

  const maxCount = useMemo(
    () => Math.max(...Object.values(decades), 1),
    [decades]
  );

  const play = useCallback(() => {
    setPlaying(true);
    let current = 1940;
    intervalRef.current = setInterval(() => {
      current += 10;
      if (current > 2020) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPlaying(false);
        onYearRangeChange([1947, 2030]);
        return;
      }
      onYearRangeChange([current, current + 9]);
    }, 1500);
  }, [onYearRangeChange]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    onYearRangeChange([1947, 2030]);
  }, [stop, onYearRangeChange]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="absolute bottom-4 right-4 z-20 flex items-end gap-2">
      <div className="flex items-center gap-1 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-lg">
        <button
          onClick={playing ? stop : play}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
          aria-label={playing ? "Pause timeline" : "Play timeline"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={reset}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
          aria-label="Reset timeline"
        >
          <SkipBack size={14} />
        </button>
      </div>

      <div className="flex items-end gap-px bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-lg">
        {allDecades.map((d) => {
          const count = decades[d] || 0;
          const h = Math.max(4, (count / maxCount) * 40);
          const decadeStart = parseInt(d);
          const active =
            decadeStart >= yearRange[0] && decadeStart <= yearRange[1];

          return (
            <button
              key={d}
              onClick={() => onYearRangeChange([decadeStart, decadeStart + 9])}
              className="flex flex-col items-center gap-1 group"
              aria-label={`Filter to ${d}: ${count} incidents`}
            >
              <div
                className={`w-5 rounded-t transition-all duration-300 ${
                  active
                    ? "bg-emerald-500"
                    : "bg-white/20 group-hover:bg-white/30"
                }`}
                style={{ height: h }}
              />
              <span
                className={`text-[9px] ${
                  active ? "text-emerald-400" : "text-white/30"
                }`}
              >
                {d.slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
