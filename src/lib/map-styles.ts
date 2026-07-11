import { MapStyle } from "@/types/incident";

export const MAP_STYLE_URLS: Record<MapStyle, string> = {
  streets:
    "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  satellite:
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  terrain:
    "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export const MAP_STYLE_LABELS: Record<MapStyle, string> = {
  streets: "Streets",
  satellite: "Dark Matter",
  terrain: "Terrain",
  dark: "Dark",
};
