"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { UFOIncident, MapStyle } from "@/types/incident";
import { incidentToGeoJSON, ACCURACY_COLORS } from "@/lib/utils";
import { MAP_STYLE_URLS } from "@/lib/map-styles";

interface MapViewProps {
  incidents: UFOIncident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  mapStyle: MapStyle;
  flyToRef: React.MutableRefObject<((lat: number, lng: number) => void) | null>;
  resetViewRef: React.MutableRefObject<(() => void) | null>;
}

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 2;

export default function MapView({
  incidents,
  selectedId,
  onSelect,
  mapStyle,
  flyToRef,
  resetViewRef,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const geojson = useMemo(() => incidentToGeoJSON(incidents), [incidents]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URLS[mapStyle],
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 0,
      bearing: 0,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      "top-right"
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      map.addSource("incidents", {
        type: "geojson",
        data: geojson as GeoJSON.FeatureCollection,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "incidents",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#22c55e",
            5,
            "#f59e0b",
            10,
            "#a855f7",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            5,
            24,
            10,
            30,
          ],
          "circle-opacity": 0.85,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.3)",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "incidents",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "incidents",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "markerColor"],
          "circle-radius": ["get", "markerSize"],
          "circle-opacity": 0.9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.5)",
        },
      });

      map.addLayer({
        id: "unclustered-label",
        type: "symbol",
        source: "incidents",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Regular"],
          "text-size": 10,
          "text-offset": [0, 2.2],
          "text-anchor": "top",
          "text-max-width": 12,
        },
        paint: {
          "text-color": "rgba(255,255,255,0.7)",
          "text-halo-color": "rgba(0,0,0,0.8)",
          "text-halo-width": 1,
        },
      });

      map.on("click", "clusters", async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("incidents") as maplibregl.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        const geometry = features[0].geometry;
        if (geometry.type === "Point") {
          map.flyTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom ?? undefined,
          });
        }
      });

      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onSelect(feature.properties.id);
        }
      });

      map.on("mouseenter", "unclustered-point", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (!feature) return;
        const coords =
          feature.geometry.type === "Point"
            ? (feature.geometry.coordinates.slice() as [number, number])
            : [0, 0] as [number, number];
        const props = feature.properties;

        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 20,
          className: "ufo-popup",
        })
          .setLngLat(coords)
          .setHTML(
            `<div style="padding:8px;font-size:12px;color:#fff;background:#1a1a2e;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
              <strong>${props?.name || ""}</strong><br/>
              <span style="color:rgba(255,255,255,0.5)">${props?.year || ""} · ${props?.country || ""}</span><br/>
              <span style="color:${ACCURACY_COLORS[(props?.locationAccuracy as keyof typeof ACCURACY_COLORS) || "approximate"]};font-size:10px">${props?.locationAccuracy || ""}</span>
            </div>`
          )
          .addTo(map);
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;

    flyToRef.current = (lat: number, lng: number) => {
      map.flyTo({ center: [lng, lat], zoom: 10, duration: 2000 });
    };

    resetViewRef.current = () => {
      map.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: 0,
        bearing: 0,
        duration: 1500,
      });
    };

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource("incidents") as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(geojson as GeoJSON.FeatureCollection);
    }
  }, [geojson]);

  useEffect(() => {
    if (selectedId && flyToRef.current) {
      const inc = incidents.find((i) => i.id === selectedId);
      if (inc) {
        flyToRef.current(inc.latitude, inc.longitude);
      }
    }
  }, [selectedId, incidents, flyToRef]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      role="application"
      aria-label="UFO incident map"
    />
  );
}
