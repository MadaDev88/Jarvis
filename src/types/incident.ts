export type LocationAccuracy =
  | "exact"
  | "approximate"
  | "regional"
  | "aerial-route"
  | "maritime";

export type IncidentStatus =
  | "unresolved"
  | "disputed"
  | "explained"
  | "partially-explained"
  | "insufficient-evidence";

export interface UFOIncident {
  id: string;
  rank: number;
  name: string;
  date: string;
  year: number;
  country: string;
  region?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  locationAccuracy: LocationAccuracy;
  category: string;
  summary: string;
  witnessType?: string[];
  witnessCount?: number;
  radarEvidence: boolean;
  militaryInvolvement: boolean;
  photoEvidence: boolean;
  videoEvidence: boolean;
  physicalEvidence: boolean;
  officialInvestigation: boolean;
  credibilityScore: number;
  status: IncidentStatus;
  sources: {
    title: string;
    url: string;
  }[];
  dataReviewStatus?: "unverified" | "verified" | "needs-review";
}

export interface FilterState {
  yearRange: [number, number];
  countries: string[];
  categories: string[];
  locationAccuracy: LocationAccuracy[];
  militaryInvolvement: boolean | null;
  radarEvidence: boolean | null;
  videoEvidence: boolean | null;
  physicalEvidence: boolean | null;
  officialInvestigation: boolean | null;
  statuses: IncidentStatus[];
  minCredibility: number;
}

export type MapStyle = "streets" | "satellite" | "terrain" | "dark";

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}
