import { Html } from "@react-three/drei";

export interface PontoCidade {
  id: string;
  nome: string;
  tipo: "lazer" | "hotel" | "restaurante" | "loja" | "saude" | "waypoint";
  posicao: [number, number, number];
}

export const PONTOS_DA_CIDADE: PontoCidade[] = [
  // --- LOCAIS PRINCIPAIS (POIs) ---
  { id: "fonte", nome: "Fonte de Água",    tipo: "lazer",       posicao: [-23.11, 0.5, -44.54] },
  { id: "p1",    nome: "Hotel Central",    tipo: "hotel",       posicao: [-27.11, 3.5, -41.26] },
  { id: "p2",    nome: "Restaurante Baixa",tipo: "restaurante", posicao: [-31.45, 3.5, -45.89] },
  { id: "p3",    nome: "Mercado Municipal",tipo: "loja",        posicao: [-26.63, 3.5, -52.17] },
  { id: "p4",    nome: "Hospital Mova",    tipo: "saude",       posicao: [-45.40, 4.0, -45.71] },
  { id: "p5",    nome: "Café Costa",       tipo: "restaurante", posicao: [-30.07, 3.5, -37.23] },

  // --- WAYPOINTS ---
{ id: "w1",  nome: "", tipo: "waypoint", posicao: [-24.98, 1.41, -45.02] },
{ id: "w2",  nome: "", tipo: "waypoint", posicao: [-27.54, 1.41, -47.50] },
{ id: "w3",  nome: "", tipo: "waypoint", posicao: [-28.76, 1.41, -46.31] },
{ id: "w4",  nome: "", tipo: "waypoint", posicao: [-26.31, 1.41, -43.77] },

{ id: "w5",  nome: "", tipo: "waypoint", posicao: [-27.52, 1.41, -42.65] },
{ id: "w6",  nome: "", tipo: "waypoint", posicao: [-26.28, 1.41, -41.17] },
{ id: "w7",  nome: "", tipo: "waypoint", posicao: [-25.10, 1.41, -42.39] },
{ id: "w8",  nome: "", tipo: "waypoint", posicao: [-24.19, 1.41, -41.26] },
{ id: "w9",  nome: "", tipo: "waypoint", posicao: [-25.04, 1.41, -39.98] },

{ id: "w10", nome: "", tipo: "waypoint", posicao: [-27.48, 1.41, -39.93] },
{ id: "w11", nome: "", tipo: "waypoint", posicao: [-27.32, 1.41, -38.01] },
{ id: "w12", nome: "", tipo: "waypoint", posicao: [-27.50, 1.41, -35.88] },

{ id: "w13", nome: "", tipo: "waypoint", posicao: [-29.74, 1.41, -37.23] },
{ id: "w14", nome: "", tipo: "waypoint", posicao: [-31.30, 1.41, -37.45] },
{ id: "w15", nome: "", tipo: "waypoint", posicao: [-32.61, 1.41, -39.95] },
{ id: "w16", nome: "", tipo: "waypoint", posicao: [-34.18, 1.41, -37.58] },
{ id: "w17", nome: "", tipo: "waypoint", posicao: [-34.22, 1.41, -42.25] },

{ id: "w18", nome: "", tipo: "waypoint", posicao: [-30.26, 1.41, -42.57] },
{ id: "w19", nome: "", tipo: "waypoint", posicao: [-30.05, 1.41, -44.88] },
{ id: "w20", nome: "", tipo: "waypoint", posicao: [-31.10, 1.41, -45.98] },
{ id: "w21", nome: "", tipo: "waypoint", posicao: [-29.82, 1.41, -47.46] },
{ id: "w22", nome: "", tipo: "waypoint", posicao: [-28.72, 1.41, -48.74] },

{ id: "w23", nome: "", tipo: "waypoint", posicao: [-26.25, 1.41, -51.14] },
{ id: "w24", nome: "", tipo: "waypoint", posicao: [-23.85, 1.41, -53.82] },

{ id: "w25", nome: "", tipo: "waypoint", posicao: [-22.48, 1.41, -52.58] },
{ id: "w26", nome: "", tipo: "waypoint", posicao: [-25.02, 1.41, -49.87] },

{ id: "w27", nome: "", tipo: "waypoint", posicao: [-22.52, 1.41, -47.52] },
{ id: "w28", nome: "", tipo: "waypoint", posicao: [-23.71, 1.41, -43.84] },
];

interface MapMarkersProps {
  onSelectPOI: (id: string, nome: string) => void;
}

export const ARESTAS: [string, string][] = [
  // POIs → waypoints de entrada
  ["fonte","w1"],["fonte","w28"],["fonte","w27"],
  ["p1","w6"],["p1","w5"],
  ["p2","w19"],["p2","w20"],
  ["p3","w23"],
  ["p5","w13"],["p5","w14"],


["w1","w2"],["w2","w3"],["w3","w4"],
["w4","w5"],["w5","w6"],
["w6","w7"],["w7","w8"],["w8","w9"],["w9","w10"],

["w10","w11"],["w6","w7"],["w7","w8"],["w8","w9"],
["w9","w10"],["w10","w11"],["w11","w12"],["w12","w13"],
["w13","w14"],["w14","w15"],["w15","w16"],["w16","w17"],
["w17","w18"],["w18","w19"],["w19","w20"],
["w21","w22"],["w22","w23"],["w23","w24"],["w24","w25"],
["w25","w26"],["w26","w27"],

["w1", "w4"],["w1", "w28"],["w7", "w28"],["w6", "w9"],
["w2", "w26"],["w23", "w26"],["w2", "w22"],["w3", "w21"],
["w4", "w7"],["w6", "w10"],["w11", "w9"], ["w3", "w19"], ["w19", "w5"], ["w14", "w16"],
["w15", "w17"],
];

function WaypointConnections() {
  const pontoMap = new Map(PONTOS_DA_CIDADE.map((p) => [p.id, p]));

  return (
    <>
      {/* Linhas brancas: arestas do grafo */}
      {ARESTAS.map(([idA, idB]) => {
        const a = pontoMap.get(idA);
        const b = pontoMap.get(idB);
        if (!a || !b) return null;
        const [ax, ay, az] = a.posicao;
        const [bx, by, bz] = b.posicao;
        return (
          <line key={`${idA}-${idB}`}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([ax, ay + 0.25, az, bx, by + 0.25, bz])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" linewidth={60} />
          </line>
        );
      })}

      {/* Labels verdes nos waypoints */}
      {PONTOS_DA_CIDADE.filter((p) => p.tipo === "waypoint").map((poi) => {
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
          <Html center distanceFactor={8} style={{ transition: "all 0.2s", pointerEvents: "auto" }}>
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