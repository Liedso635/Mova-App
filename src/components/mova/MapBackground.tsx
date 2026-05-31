import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "@/lib/mova-views";

/**
 * Full-screen background that simulates a 2D→3D map fly-through, inspired by
 * Mapbox. Uses Mapbox GL JS when a token is provided, otherwise renders a
 * performant animated CSS grid fallback. A glassmorphism overlay keeps the
 * foreground content readable.
 */
export function MapBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;

    let map: any;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;
      // Maputo, Mozambique
      const center: [number, number] = [32.5732, -25.9692];

      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: 14,
        pitch: 0,
        bearing: 0,
        interactive: false,
        attributionControl: false,
      });

      let is3D = false;
      const cycle = () => {
        is3D = !is3D;
        map.flyTo({
          center,
          zoom: is3D ? 16 : 14,
          pitch: is3D ? 62 : 0,
          bearing: is3D ? 40 : 0,
          duration: 5000,
          essential: true,
        });
      };

      map.on("load", () => {
        setTimeout(cycle, 1500);
        timer = setInterval(cycle, 15000);
      });
    })();

    return () => {
      cancelled = true;
      clearInterval(timer);
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gray-100">
      {MAPBOX_TOKEN ? (
        <div ref={containerRef} className="absolute inset-0" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
          <div
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(var(--gray-300) 1px, transparent 1px), linear-gradient(90deg, var(--gray-300) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              animation: "mapDrift 12s linear infinite alternate",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundImage:
                "linear-gradient(120deg, transparent 46%, var(--primary) 49%, var(--primary) 51%, transparent 54%)",
              backgroundSize: "240px 240px",
              opacity: 0.18,
              animation: "mapDrift 18s linear infinite alternate, mapPulse 6s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Glassmorphism legibility overlay */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[6px]" />
    </div>
  );
}
