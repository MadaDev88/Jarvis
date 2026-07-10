import { UFOIncident, FilterState, LocationAccuracy, IncidentStatus } from "@/types/incident";

export const DEFAULT_FILTERS: FilterState = {
  yearRange: [1947, 2030],
  countries: [],
  categories: [],
  locationAccuracy: [],
  militaryInvolvement: null,
  radarEvidence: null,
  videoEvidence: null,
  physicalEvidence: null,
  officialInvestigation: null,
  statuses: [],
  minCredibility: 0,
};

export function filterIncidents(
  incidents: UFOIncident[],
  filters: FilterState
): UFOIncident[] {
  return incidents.filter((inc) => {
    if (inc.year < filters.yearRange[0] || inc.year > filters.yearRange[1])
      return false;
    if (
      filters.countries.length > 0 &&
      !filters.countries.includes(inc.country)
    )
      return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(inc.category)
    )
      return false;
    if (
      filters.locationAccuracy.length > 0 &&
      !filters.locationAccuracy.includes(inc.locationAccuracy)
    )
      return false;
    if (
      filters.militaryInvolvement !== null &&
      inc.militaryInvolvement !== filters.militaryInvolvement
    )
      return false;
    if (
      filters.radarEvidence !== null &&
      inc.radarEvidence !== filters.radarEvidence
    )
      return false;
    if (
      filters.videoEvidence !== null &&
      inc.videoEvidence !== filters.videoEvidence
    )
      return false;
    if (
      filters.physicalEvidence !== null &&
      inc.physicalEvidence !== filters.physicalEvidence
    )
      return false;
    if (
      filters.officialInvestigation !== null &&
      inc.officialInvestigation !== filters.officialInvestigation
    )
      return false;
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(inc.status)
    )
      return false;
    if (inc.credibilityScore < filters.minCredibility) return false;
    return true;
  });
}

export function searchIncidents(
  incidents: UFOIncident[],
  query: string
): UFOIncident[] {
  const q = query.toLowerCase().trim();
  if (!q) return incidents;
  return incidents.filter(
    (inc) =>
      inc.name.toLowerCase().includes(q) ||
      inc.country.toLowerCase().includes(q) ||
      (inc.region && inc.region.toLowerCase().includes(q)) ||
      inc.locationName.toLowerCase().includes(q) ||
      inc.year.toString().includes(q) ||
      inc.category.toLowerCase().includes(q)
  );
}

export function getUniqueCountries(incidents: UFOIncident[]): string[] {
  return [...new Set(incidents.map((i) => i.country))].sort();
}

export function getUniqueCategories(incidents: UFOIncident[]): string[] {
  return [...new Set(incidents.map((i) => i.category))].sort();
}

export function getYearRange(incidents: UFOIncident[]): [number, number] {
  const years = incidents.map((i) => i.year);
  return [Math.min(...years), Math.max(...years)];
}

export function getDecade(year: number): string {
  const d = Math.floor(year / 10) * 10;
  return `${d}s`;
}

export function getIncidentsPerDecade(
  incidents: UFOIncident[]
): Record<string, number> {
  const map: Record<string, number> = {};
  incidents.forEach((i) => {
    const d = getDecade(i.year);
    map[d] = (map[d] || 0) + 1;
  });
  return map;
}

export const ACCURACY_COLORS: Record<LocationAccuracy, string> = {
  exact: "#22c55e",
  approximate: "#f59e0b",
  regional: "#a855f7",
  "aerial-route": "#3b82f6",
  maritime: "#06b6d4",
};

export const ACCURACY_LABELS: Record<LocationAccuracy, string> = {
  exact: "Exact Location",
  approximate: "Approximate Location",
  regional: "Regional Area",
  "aerial-route": "Aerial Route",
  maritime: "Maritime Area",
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  unresolved: "Unresolved",
  disputed: "Disputed",
  explained: "Conventionally Explained",
  "partially-explained": "Partially Explained",
  "insufficient-evidence": "Insufficient Evidence",
};

export function getMarkerShape(incident: UFOIncident): string {
  const cat = incident.category.toLowerCase();
  if (incident.locationAccuracy === "maritime") return "wave";
  if (incident.locationAccuracy === "aerial-route") return "aircraft";
  if (cat.includes("crash") || cat.includes("landing")) return "diamond";
  if (cat.includes("school") || cat.includes("mass")) return "group";
  if (incident.radarEvidence) return "radar";
  if (incident.militaryInvolvement) return "shield";
  return "circle";
}

export function incidentToGeoJSON(incidents: UFOIncident[]) {
  return {
    type: "FeatureCollection" as const,
    features: incidents.map((inc) => ({
      type: "Feature" as const,
      id: inc.id,
      geometry: {
        type: "Point" as const,
        coordinates: [inc.longitude, inc.latitude],
      },
      properties: {
        id: inc.id,
        name: inc.name,
        year: inc.year,
        country: inc.country,
        category: inc.category,
        locationAccuracy: inc.locationAccuracy,
        credibilityScore: inc.credibilityScore,
        status: inc.status,
        militaryInvolvement: inc.militaryInvolvement,
        radarEvidence: inc.radarEvidence,
        markerShape: getMarkerShape(inc),
        markerColor: ACCURACY_COLORS[inc.locationAccuracy],
        markerSize: Math.max(16, Math.min(28, inc.credibilityScore / 4)),
      },
    })),
  };
}

export function incidentsToCSV(incidents: UFOIncident[]): string {
  const headers = [
    "id",
    "rank",
    "name",
    "date",
    "year",
    "country",
    "region",
    "locationName",
    "latitude",
    "longitude",
    "locationAccuracy",
    "category",
    "summary",
    "witnessType",
    "witnessCount",
    "radarEvidence",
    "militaryInvolvement",
    "photoEvidence",
    "videoEvidence",
    "physicalEvidence",
    "officialInvestigation",
    "credibilityScore",
    "status",
  ];
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = incidents.map((i) =>
    headers
      .map((h) => {
        const val = i[h as keyof UFOIncident];
        if (Array.isArray(val)) return escape(val.join("; "));
        return escape(val);
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function incidentsToGeoJSONExport(incidents: UFOIncident[]): string {
  return JSON.stringify(incidentToGeoJSON(incidents), null, 2);
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
