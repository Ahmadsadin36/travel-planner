// app/trips/[id]/locations/_components/LocationForm.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createLocation } from "../actions";

export default function LocationForm({ tripId }: { tripId: number }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Controlled inputs to sync with the map
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // // Initialize Mapbox and enable click-to-drop pin
  // useEffect(() => {
  //   if (!mapRef.current || mapInstance.current) return;
  //   if (!token) {
  //     setError("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
  //     return;
  //   }
  //   mapboxgl.accessToken = token;

  //   const map = new mapboxgl.Map({
  //     container: mapRef.current,
  //     style: "mapbox://styles/mapbox/streets-v12",
  //     center: [12.4964, 41.9028], // default view (Rome)
  //     zoom: 4.5,
  //   });
  //   mapInstance.current = map;

  //   // Click => drop/move marker + sync inputs
  //   map.on("click", (e) => {
  //     const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
  //     setLng(String(lngLat[0]));
  //     setLat(String(lngLat[1]));

  //     if (!markerRef.current) {
  //       markerRef.current = new mapboxgl.Marker({ draggable: true })
  //         .setLngLat(lngLat)
  //         .addTo(map);
  //       markerRef.current.on("dragend", () => {
  //         const p = markerRef.current!.getLngLat();
  //         setLng(String(p.lng));
  //         setLat(String(p.lat));
  //       });
  //     } else {
  //       markerRef.current.setLngLat(lngLat);
  //     }
  //   });

  //   return () => {
  //     markerRef.current?.remove();
  //     map.remove();
  //   };
  // }, [token]);

  // Initialize Mapbox and enable click-to-drop pin
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    if (!token) {
      setError("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }
    mapboxgl.accessToken = token;

    // Defer to the next paint to ensure container has a real size
    const rafId = requestAnimationFrame(() => {
      const container = mapRef.current!;
      const map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [12.4964, 41.9028], // default view (Rome)
        zoom: 4.5,
      });
      mapInstance.current = map;

      // Ensure map picks up size after style/assets load
      map.on("load", () => {
        map.resize();
      });

      // Also resize on container size changes (client-side navigation/layout shifts)
      const ro = new ResizeObserver(() => {
        if (map) map.resize();
      });
      ro.observe(container);

      // If page/tab was hidden during nav, resize when it becomes visible
      const onVis = () => map.resize();
      const onShow = () => map.resize();
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("pageshow", onShow);

      // Click => drop/move marker + sync inputs
      map.on("click", (e) => {
        const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setLng(String(lngLat[0]));
        setLat(String(lngLat[1]));

        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat(lngLat)
            .addTo(map);
          markerRef.current.on("dragend", () => {
            const p = markerRef.current!.getLngLat();
            setLng(String(p.lng));
            setLat(String(p.lat));
          });
        } else {
          markerRef.current.setLngLat(lngLat);
        }
      });

      // Cleanup
      return () => {
        markerRef.current?.remove();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pageshow", onShow);
        ro.disconnect();
        map.remove();
      };
    });

    return () => cancelAnimationFrame(rafId);
  }, [token]);

  // Submit -> server action (will redirect back on success)
  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData(ev.currentTarget);
      await createLocation(String(tripId), fd);
    } catch (err: any) {
      setError(err.message ?? "Failed to add location");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Title (required) */}
      <div className="form-control flex flex-col">
        <label className="label">
          <span className="label-text">Title *</span>
        </label>
        <input
          required
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered rounded-md w-full"
          placeholder="e.g., Colosseum"
        />
      </div>

      {/* Address (optional) */}
      <div className="form-control flex flex-col ">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <input
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input input-bordered rounded-md w-full"
          placeholder="Via dei Fori Imperiali, Rome"
        />
        <p className="text-xs opacity-60 mt-1">
          Tip: Click on the map to drop a pin. Lat/Lng will be filled
          automatically.
        </p>
      </div>

      {/* Lat/Lng (required, synced with map) */}
      <div className="grid grid-cols-1 max-md:gap-2 md:grid-cols-2 md:gap-1">
        <div className="form-control flex max-lg:flex-col lg:gap-2">
          <label className="label">
            <span className="label-text">Latitude *</span>
          </label>
          <input
            required
            name="lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            type="number"
            step="any"
            className="input input-bordered rounded-md w-full"
            placeholder="41.8902"
          />
        </div>
        <div className="form-control flex max-lg:flex-col lg:gap-2">
          <label className="label">
            <span className="label-text">Longitude *</span>
          </label>
          <input
            required
            name="lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            type="number"
            step="any"
            className="input input-bordered rounded-md w-full"
            placeholder="12.4922"
          />
        </div>
      </div>

      {/* Map preview + click-to-pin */}
      <div className="">
        <label className="label">
          <span className="label-text">Pick on map</span>
        </label>
        <div ref={mapRef} className="w-full h-72 rounded-lg border" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="btn btn-primary rounded-md"
          disabled={saving}
        >
          {saving ? "Saving…" : "Add location"}
        </button>
        {error && <span className="text-error text-sm">{error}</span>}
      </div>
    </form>
  );
}
