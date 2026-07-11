import { describe, it, expect } from "vitest";
import {
  DEFAULT_FILTERS,
  filterIncidents,
  searchIncidents,
  getUniqueCountries,
  getUniqueCategories,
  getDecade,
  getIncidentsPerDecade,
  getMarkerShape,
  incidentToGeoJSON,
  incidentsToCSV,
  incidentsToGeoJSONExport,
  ACCURACY_COLORS,
} from "./utils";
import { incidents } from "@/data/incidents";

describe("filterIncidents", () => {
  it("returns all incidents with default filters", () => {
    expect(filterIncidents(incidents, DEFAULT_FILTERS)).toHaveLength(
      incidents.length
    );
  });

  it("filters by year range", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      yearRange: [1947, 1950],
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((i) => {
      expect(i.year).toBeGreaterThanOrEqual(1947);
      expect(i.year).toBeLessThanOrEqual(1950);
    });
  });

  it("filters by country", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      countries: ["Canada"],
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((i) => expect(i.country).toBe("Canada"));
  });

  it("filters by military involvement", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      militaryInvolvement: true,
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((i) => expect(i.militaryInvolvement).toBe(true));
  });

  it("filters by minimum credibility", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      minCredibility: 85,
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((i) =>
      expect(i.credibilityScore).toBeGreaterThanOrEqual(85)
    );
  });

  it("filters by location accuracy", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      locationAccuracy: ["maritime"],
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((i) => expect(i.locationAccuracy).toBe("maritime"));
  });

  it("combines multiple filters", () => {
    const result = filterIncidents(incidents, {
      ...DEFAULT_FILTERS,
      countries: ["United States"],
      radarEvidence: true,
    });
    result.forEach((i) => {
      expect(i.country).toBe("United States");
      expect(i.radarEvidence).toBe(true);
    });
  });
});

describe("searchIncidents", () => {
  it("returns all incidents for empty query", () => {
    expect(searchIncidents(incidents, "")).toHaveLength(incidents.length);
  });

  it("matches by name", () => {
    const result = searchIncidents(incidents, "roswell");
    expect(result.some((i) => i.id === "roswell-1947")).toBe(true);
  });

  it("matches by country", () => {
    const result = searchIncidents(incidents, "zimbabwe");
    expect(result.some((i) => i.id === "ariel-school-1994")).toBe(true);
  });

  it("matches by year", () => {
    const result = searchIncidents(incidents, "1980");
    expect(result.length).toBeGreaterThan(0);
  });

  it("matches by location name", () => {
    const result = searchIncidents(incidents, "rainier");
    expect(result.some((i) => i.id === "kenneth-arnold-1947")).toBe(true);
  });

  it("returns empty array for no matches", () => {
    expect(searchIncidents(incidents, "zzzznotfound")).toHaveLength(0);
  });
});

describe("aggregation helpers", () => {
  it("returns sorted unique countries", () => {
    const countries = getUniqueCountries(incidents);
    expect(countries).toContain("United States");
    expect(countries).toEqual([...countries].sort());
    expect(new Set(countries).size).toBe(countries.length);
  });

  it("returns unique categories", () => {
    const cats = getUniqueCategories(incidents);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("computes decades", () => {
    expect(getDecade(1947)).toBe("1940s");
    expect(getDecade(2004)).toBe("2000s");
  });

  it("counts incidents per decade", () => {
    const perDecade = getIncidentsPerDecade(incidents);
    const total = Object.values(perDecade).reduce((a, b) => a + b, 0);
    expect(total).toBe(incidents.length);
  });
});

describe("getMarkerShape", () => {
  it("assigns wave to maritime incidents", () => {
    const nimitz = incidents.find((i) => i.id === "nimitz-tic-tac-2004")!;
    expect(getMarkerShape(nimitz)).toBe("wave");
  });

  it("assigns aircraft to aerial-route incidents", () => {
    const arnold = incidents.find((i) => i.id === "kenneth-arnold-1947")!;
    expect(getMarkerShape(arnold)).toBe("aircraft");
  });

  it("assigns diamond to crash claims", () => {
    const roswell = incidents.find((i) => i.id === "roswell-1947")!;
    expect(getMarkerShape(roswell)).toBe("diamond");
  });
});

describe("GeoJSON conversion", () => {
  it("produces one feature per incident", () => {
    const geo = incidentToGeoJSON(incidents);
    expect(geo.type).toBe("FeatureCollection");
    expect(geo.features).toHaveLength(incidents.length);
  });

  it("uses [longitude, latitude] coordinate order", () => {
    const geo = incidentToGeoJSON([incidents[0]]);
    expect(geo.features[0].geometry.coordinates).toEqual([
      incidents[0].longitude,
      incidents[0].latitude,
    ]);
  });

  it("assigns marker colours from accuracy", () => {
    const geo = incidentToGeoJSON(incidents);
    geo.features.forEach((f) => {
      expect(f.properties.markerColor).toBe(
        ACCURACY_COLORS[
          f.properties.locationAccuracy as keyof typeof ACCURACY_COLORS
        ]
      );
    });
  });

  it("exports valid JSON", () => {
    const json = incidentsToGeoJSONExport(incidents);
    expect(() => JSON.parse(json)).not.toThrow();
  });
});

describe("CSV export", () => {
  it("includes a header row and one row per incident", () => {
    const csv = incidentsToCSV(incidents);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(incidents.length + 1);
    expect(lines[0]).toContain("id");
    expect(lines[0]).toContain("latitude");
  });

  it("escapes fields containing commas", () => {
    const csv = incidentsToCSV(incidents);
    // Every data row should parse back to the same column count
    const headerCols = csv.split("\n")[0].split(",").length;
    const parseRow = (row: string) => {
      const cols: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (inQuotes) {
          if (ch === '"' && row[i + 1] === '"') {
            cur += '"';
            i++;
          } else if (ch === '"') {
            inQuotes = false;
          } else {
            cur += ch;
          }
        } else if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          cols.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      cols.push(cur);
      return cols;
    };
    csv
      .split("\n")
      .slice(1)
      .forEach((row) => {
        expect(parseRow(row)).toHaveLength(headerCols);
      });
  });
});

describe("data integrity", () => {
  it("has unique incident ids", () => {
    const ids = incidents.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid coordinates", () => {
    incidents.forEach((i) => {
      expect(i.latitude).toBeGreaterThanOrEqual(-90);
      expect(i.latitude).toBeLessThanOrEqual(90);
      expect(i.longitude).toBeGreaterThanOrEqual(-180);
      expect(i.longitude).toBeLessThanOrEqual(180);
    });
  });

  it("has credibility scores between 0 and 100", () => {
    incidents.forEach((i) => {
      expect(i.credibilityScore).toBeGreaterThanOrEqual(0);
      expect(i.credibilityScore).toBeLessThanOrEqual(100);
    });
  });

  it("has year matching the date field", () => {
    incidents.forEach((i) => {
      expect(i.date.startsWith(String(i.year))).toBe(true);
    });
  });

  it("only uses https source URLs", () => {
    incidents.forEach((i) => {
      i.sources.forEach((s) => {
        expect(s.url).toMatch(/^https:\/\//);
      });
    });
  });
});
