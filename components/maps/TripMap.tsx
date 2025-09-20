// components/maps/TripMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Loc = { title: string; lat: number; lng: number };

export default function TripMap({ locations }: { locations: Loc[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!ref.current) return;
    if (!token) {
      console.warn("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    mapboxgl.accessToken = token;

    // Init map
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [12.5674, 41.8719], // Italy fallback [lng, lat]
      zoom: 4,
      attributionControl: true,
    });

    // Add nav controls (zoom/rotate)
    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    // Early exit if no locations
    if (!locations || locations.length === 0) {
      return () => map.remove();
    }

    const markers: mapboxgl.Marker[] = [];
    const popups: mapboxgl.Popup[] = [];

    // Bounds for fit
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers with hover popups
    locations.forEach((l) => {
      const lngLat: [number, number] = [l.lng, l.lat];
      bounds.extend(lngLat);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat(lngLat)
        .setHTML(`<div style="font-size:12px">${l.title}</div>`);

      const marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

      // Show/Hide popup on hover
      const el = marker.getElement();
      el.addEventListener("mouseenter", () => popup.addTo(map));
      el.addEventListener("mouseleave", () => popup.remove());

      markers.push(marker);
      popups.push(popup);
    });

    // Draw a line connecting locations in order
    const lineGeoJSON = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: locations.map((l) => [l.lng, l.lat]),
      },
      properties: {},
    };

    map.on("load", () => {
      if (locations.length > 1) {
        map.addSource("trip-route", {
          type: "geojson",
          data: lineGeoJSON,
        });

        map.addLayer({
          id: "trip-route",
          type: "line",
          source: "trip-route",
          paint: {
            "line-width": 3,
            "line-color": "#3b82f6", // Tailwind primary-ish; Mapbox needs a hex
            "line-opacity": 0.9,
          },
        });
      }

      // Fit map to markers
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 48, maxZoom: 12, duration: 600 });
      }
    });

    // Cleanup on unmount
    return () => {
      popups.forEach((p) => p.remove());
      markers.forEach((m) => m.remove());
      map.remove();
    };
  }, [locations, token]);

  return (
    <div
      ref={ref}
      className="w-full h-[420px] rounded-lg border"
      aria-label="Trip map"
    />
  );
}
