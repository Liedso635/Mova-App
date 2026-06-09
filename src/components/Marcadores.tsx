import { Html } from "@react-three/drei";

export interface PontoCidade {
  id: string;
  nome: string;
  tipo: "lazer" | "hotel" | "restaurante" | "loja" | "saude" | "waypoint";
  posicao: [number, number, number];
}

export const PONTOS_DA_CIDADE: PontoCidade[] = [
  // --- LOCAIS PRINCIPAIS (POIs) ---
  { id: "fonte", nome: "Fonte de Água", tipo: "lazer", posicao: [-22.46, 1.5, -44.97] },
  { id: "p1", nome: "Hotel Central", tipo: "hotel", posicao: [-27.11, 3.5, -41.26] },
  { id: "p2", nome: "Restaurante Baixa", tipo: "restaurante", posicao: [-31.45, 3.5, -45.89] },
  { id: "p3", nome: "Mercado Municipal", tipo: "loja", posicao: [-26.63, 3.5, -52.17] },
  { id: "p4", nome: "Hospital Mova", tipo: "saude", posicao: [-45.40, 4.0, -45.71] },
  { id: "p5", nome: "Café Costa", tipo: "restaurante", posicao: [-30.07, 3.5, -37.23] },

  // --- WAYPOINTS (todos os que você tem) ---
  { id: "w1", nome: "", tipo: "waypoint", posicao: [-24.98, 1.41, -45.02] },
  { id: "w2", nome: "", tipo: "waypoint", posicao: [-27.54, 1.41, -47.50] },
  { id: "w3", nome: "", tipo: "waypoint", posicao: [-28.76, 1.41, -46.31] },
  { id: "w4", nome: "", tipo: "waypoint", posicao: [-26.31, 1.41, -43.77] },
  { id: "w5", nome: "", tipo: "waypoint", posicao: [-27.54, 1.41, -42.65] },
];

interface MapMarkersProps {
  onSelectPOI: (id: string, nome: string) => void;
}

function WaypointConnections() {
  const waypoints = PONTOS_DA_CIDADE
    .filter((poi) => poi.tipo === "waypoint")
    .sort((a, b) => {
      const na = Number(a.id.replace("w", ""));
      const nb = Number(b.id.replace("w", ""));
      return na - nb;
    });

  const pois = PONTOS_DA_CIDADE.filter((poi) => poi.nome !== "" && poi.tipo !== "waypoint");

  if (waypoints.length < 2 || pois.length === 0) return null;

  // Linha branca: segmentos explícitos w1→w2, w2→w3, w3→w4, w4→w5
  const segmentos: Array<[number, number, number, number, number, number]> = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [x1, y1, z1] = waypoints[i].posicao;
    const [x2, y2, z2] = waypoints[i + 1].posicao;
    segmentos.push([x1, y1 + 0.25, z1, x2, y2 + 0.25, z2]);
  }

  // Linhas azuis: cada POI liga ao waypoint mais próximo (igual ao original)
  const nearestConnections = pois.map((poi) => {
    const [px, py, pz] = poi.posicao;
    let nearestWaypoint = waypoints[0];
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const waypoint of waypoints) {
      const [wx, wy, wz] = waypoint.posicao;
      const distance = Math.sqrt((px - wx) ** 2 + (py - wy) ** 2 + (pz - wz) ** 2);
      if (distance < bestDistance) {
        bestDistance = distance;
        nearestWaypoint = waypoint;
      }
    }

    return { poi, waypoint: nearestWaypoint };
  });

  return (
    <>
      {/* Linha branca: segmentos explícitos w1→w2, w2→w3, w3→w4, w4→w5 */}
      {segmentos.map((seg, idx) => {
        const [x1, y1, z1, x2, y2, z2] = seg;
        return (
          <line key={`seg-${idx}`}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([x1, y1, z1, x2, y2, z2])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" linewidth={60} />
          </line>
        );
      })}

      {/* Linhas azuis: POI → waypoint mais próximo (igual ao original) */}
      {nearestConnections.map(({ poi, waypoint }) => {
        const [px, py, pz] = poi.posicao;
        const [wx, wy, wz] = waypoint.posicao;

        return (
          <line key={`${poi.id}-${waypoint.id}`}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([px, py + 0.25, pz, wx, wy + 0.25, wz])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#2563eb" linewidth={2} />
          </line>
        );
      })}

      {/* Labels verdes dos waypoints */}
      {waypoints.map((poi) => {
        const [x, y, z] = poi.posicao;
        return (
          <group key={poi.id} position={[x, y, z]}>
            <Html center distanceFactor={18} style={{ pointerEvents: "none" }}>
              <span
                style={{
                  color: "#16a34a",
                  fontSize: "11px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {poi.id}
              </span>
            </Html>
          </group>
        );
      })}
    </>
  );
}

export function MapMarkers({ onSelectPOI }: MapMarkersProps) {
  return (
    <>
      <WaypointConnections />
      {PONTOS_DA_CIDADE.filter((poi) => poi.nome !== "").map((poi) => (
        <mesh key={poi.id} position={poi.posicao}>
          <Html center distanceFactor={8} style={{ transition: 'all 0.2s', pointerEvents: 'auto' }}>
            <button
              onClick={() => onSelectPOI(poi.id, poi.nome)}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer select-none font-sans"
            >
              <span className="text-sm">
                {poi.tipo === "restaurante" && "🍴"}
                {poi.tipo === "hotel" && "🏨"}
                {poi.tipo === "lazer" && "⛲"}
                {poi.tipo === "saude" && "🏥"}
                {poi.tipo === "loja" && "🛍️"}
              </span>
              <span className="text-xs font-bold text-slate-800">{poi.nome}</span>
            </button>
          </Html>
        </mesh>
      ))}
    </>
  );
}