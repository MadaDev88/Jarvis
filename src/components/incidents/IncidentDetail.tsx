"use client";

import { UFOIncident } from "@/types/incident";
import {
  ACCURACY_LABELS,
  ACCURACY_COLORS,
  STATUS_LABELS,
} from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import CredibilityMeter from "@/components/ui/CredibilityMeter";
import {
  X,
  MapPin,
  Calendar,
  Shield,
  Radar,
  Camera,
  Video,
  FileSearch,
  Users,
  Copy,
  Navigation,
  ExternalLink,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useState, useCallback } from "react";

interface IncidentDetailProps {
  incident: UFOIncident;
  onClose: () => void;
  onFlyTo: (lat: number, lng: number) => void;
}

export default function IncidentDetail({
  incident,
  onClose,
  onFlyTo,
}: IncidentDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyCoords = useCallback(() => {
    navigator.clipboard.writeText(
      `${incident.latitude}, ${incident.longitude}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [incident]);

  const accuracyBadgeVariant = {
    exact: "green" as const,
    approximate: "amber" as const,
    regional: "purple" as const,
    "aerial-route": "blue" as const,
    maritime: "cyan" as const,
  };

  const statusBadgeVariant = {
    unresolved: "amber" as const,
    disputed: "red" as const,
    explained: "green" as const,
    "partially-explained": "purple" as const,
    "insufficient-evidence": "default" as const,
  };

  const evidenceItems = [
    { label: "Radar Evidence", value: incident.radarEvidence, icon: Radar },
    {
      label: "Military Involvement",
      value: incident.militaryInvolvement,
      icon: Shield,
    },
    {
      label: "Photo Evidence",
      value: incident.photoEvidence,
      icon: Camera,
    },
    { label: "Video Evidence", value: incident.videoEvidence, icon: Video },
    {
      label: "Physical Evidence",
      value: incident.physicalEvidence,
      icon: AlertTriangle,
    },
    {
      label: "Official Investigation",
      value: incident.officialInvestigation,
      icon: FileSearch,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-white">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold truncate pr-2">
          {incident.name}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close detail panel"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant={accuracyBadgeVariant[incident.locationAccuracy]}>
            {ACCURACY_LABELS[incident.locationAccuracy]}
          </Badge>
          <Badge variant={statusBadgeVariant[incident.status]}>
            {STATUS_LABELS[incident.status]}
          </Badge>
          <Badge>{incident.category}</Badge>
        </div>

        <p className="text-sm text-white/70 leading-relaxed">
          {incident.summary}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar size={14} />
            <span>{incident.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <MapPin size={14} />
            <span>{incident.country}</span>
          </div>
          {incident.region && (
            <div className="col-span-2 text-white/60 text-xs">
              {incident.region} &mdash; {incident.locationName}
            </div>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Coordinates</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${ACCURACY_COLORS[incident.locationAccuracy]}20`,
                color: ACCURACY_COLORS[incident.locationAccuracy],
              }}
            >
              {incident.locationAccuracy}
            </span>
          </div>
          <div className="font-mono text-sm text-white/80">
            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
          </div>
          {incident.locationAccuracy !== "exact" && (
            <p className="text-xs text-white/40 italic">
              This coordinate represents an{" "}
              {incident.locationAccuracy === "maritime"
                ? "approximate maritime encounter area"
                : incident.locationAccuracy === "aerial-route"
                  ? "approximate point along an aerial route"
                  : incident.locationAccuracy === "regional"
                    ? "regional midpoint or town centre"
                    : "approximate location"}{" "}
              based on publicly reported information.
            </p>
          )}
        </div>

        {(incident.witnessType || incident.witnessCount) && (
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Users size={12} />
              Witnesses
            </div>
            {incident.witnessType && (
              <div className="flex flex-wrap gap-1">
                {incident.witnessType.map((w) => (
                  <Badge key={w}>{w}</Badge>
                ))}
              </div>
            )}
            {incident.witnessCount && (
              <div className="text-sm text-white/70">
                Reported witness count: {incident.witnessCount}
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Evidence & Investigation
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {evidenceItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className={`flex items-center gap-2 text-xs rounded-lg px-2.5 py-2 ${
                  value
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/5 text-white/30"
                }`}
              >
                <Icon size={12} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Credibility Score
          </h3>
          <CredibilityMeter score={incident.credibilityScore} />
          <p className="text-xs text-white/40 mt-1">
            Score reflects publicly available evidence and investigation
            status. It does not imply confirmation of any particular
            explanation.
          </p>
        </div>

        {incident.sources.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Sources
            </h3>
            <ul className="space-y-1">
              {incident.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <button
          onClick={() => onFlyTo(incident.latitude, incident.longitude)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors"
          aria-label="Centre map on this incident"
        >
          <Navigation size={14} />
          Centre Map
        </button>
        <button
          onClick={copyCoords}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          aria-label="Copy coordinates"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Coords"}
        </button>
        <a
          href={`https://www.openstreetmap.org/?mlat=${incident.latitude}&mlon=${incident.longitude}#map=12/${incident.latitude}/${incident.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          aria-label="Open in external map"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
