import { Html } from "@react-three/drei";

export interface PontoCidade {
  id: string;
  nome: string;
  tipo: "lazer" | "hotel" | "restaurante" | "loja" | "saude" | "waypoint";
  posicao: [number, number, number];
}

export const PONTOS_DA_CIDADE: PontoCidade[] = [
  // --- LOCAIS PRINCIPAIS (POIs - BALÕES VISÍVEIS) ---
  { id: "fonte", nome: "Fonte de Água", tipo: "lazer", posicao: [-22.46, 1.5, -44.97] },
  { id: "p1", nome: "Hotel Central", tipo: "hotel", posicao: [-27.11, 3.5, -41.26] },
  { id: "p2", nome: "Restaurante Baixa", tipo: "restaurante", posicao: [-31.45, 3.5, -45.89] },
  { id: "p3", nome: "Mercado Municipal", tipo: "loja", posicao: [-26.63, 3.5, -52.17] },
  { id: "p4", nome: "Hospital Mova", tipo: "saude", posicao: [-45.40, 4.0, -45.71] },
  { id: "p5", nome: "Café Costa", tipo: "restaurante", posicao: [-30.07, 3.5, -37.23] },

  // --- WAYPOINTS (ESQUINAS INVISÍVEIS PARA CRIAÇÃO DAS ROTAS) ---
  // Bloco 1: Arredores da Fonte de Água e Hotel Central
  { id: "w1", nome: "", tipo: "waypoint", posicao: [-24.98, 0.41, -45.02] },
  { id: "w2", nome: "", tipo: "waypoint", posicao: [-27.54, 0.41, -47.50] },
  { id: "w3", nome: "", tipo: "waypoint", posicao: [-28.76, 0.41, -46.31] },
  { id: "w4", nome: "", tipo: "waypoint", posicao: [-26.31, 0.41, -43.77] },
  { id: "w5", nome: "", tipo: "waypoint", posicao: [-25.02, 0.41, -49.87] },
  { id: "w6", nome: "", tipo: "waypoint", posicao: [-22.52, 0.41, -47.52] },
  { id: "w7", nome: "", tipo: "waypoint", posicao: [-23.42, 0.41, -45.07] },
  { id: "w8", nome: "", tipo: "waypoint", posicao: [-23.71, 0.41, -43.84] },
  { id: "w9", nome: "", tipo: "waypoint", posicao: [-25.10, 0.41, -42.39] },
  { id: "w10", nome: "", tipo: "waypoint", posicao: [-26.28, 0.41, -41.17] },
  { id: "w11", nome: "", tipo: "waypoint", posicao: [-27.52, 0.41, -42.65] },

  // Bloco 2: Caminhos conectando ao Mercado Municipal e Restaurante Baixa
  { id: "w12", nome: "", tipo: "waypoint", posicao: [-22.48, 0.41, -52.58] },
  { id: "w13", nome: "", tipo: "waypoint", posicao: [-23.85, 0.41, -53.82] },
  { id: "w14", nome: "", tipo: "waypoint", posicao: [-26.25, 0.41, -51.14] },
  { id: "w15", nome: "", tipo: "waypoint", posicao: [-28.72, 0.41, -48.74] },
  { id: "w16", nome: "", tipo: "waypoint", posicao: [-29.82, 0.41, -47.46] },
  { id: "w17", nome: "", tipo: "waypoint", posicao: [-28.64, 0.41, -46.28] },
  { id: "w18", nome: "", tipo: "waypoint", posicao: [-30.05, 0.41, -44.88] },
  { id: "w19", nome: "", tipo: "waypoint", posicao: [-31.10, 0.41, -45.98] },

  // Bloco 3: Conexões superiores em direção ao Café Costa
  { id: "w20", nome: "", tipo: "waypoint", posicao: [-27.48, 0.41, -39.93] },
  { id: "w21", nome: "", tipo: "waypoint", posicao: [-27.32, 0.41, -38.01] },
  { id: "w22", nome: "", tipo: "waypoint", posicao: [-25.04, 0.41, -39.98] },
  { id: "w23", nome: "", tipo: "waypoint", posicao: [-27.50, 0.41, -35.88] },
  { id: "w24", nome: "", tipo: "waypoint", posicao: [-24.19, 0.41, -41.26] },
  { id: "w25", nome: "", tipo: "waypoint", posicao: [-29.74, 0.41, -37.23] },

  // Bloco 4: Fechamento de malha ao redor do Café e rotas alternativas
  { id: "w26", nome: "", tipo: "waypoint", posicao: [-28.80, 0.41, -41.33] },
  { id: "w27", nome: "", tipo: "waypoint", posicao: [-30.26, 0.41, -42.57] },
  { id: "w28", nome: "", tipo: "waypoint", posicao: [-34.22, 0.41, -42.25] },
  { id: "w29", nome: "", tipo: "waypoint", posicao: [-32.61, 0.41, -39.95] },
  { id: "w30", nome: "", tipo: "waypoint", posicao: [-34.18, 0.41, -37.58] },
  { id: "w31", nome: "", tipo: "waypoint", posicao: [-31.30, 0.41, -37.45] }
];

interface MapMarkersProps {
  onSelectPOI: (nome: string) => void;
}

export function MapMarkers({ onSelectPOI }: MapMarkersProps) {
  return (
    <>
      {/* O .filter garante que apenas os locais com nome ganhem o balão HTML na tela */}
      {PONTOS_DA_CIDADE.filter((poi) => poi.nome !== "").map((poi) => (
        <mesh key={poi.id} position={poi.posicao}>
          <Html 
            center 
            distanceFactor={22} // Aumentei um pouco para estabilizar o tamanho com o zoom
            style={{ transition: 'all 0.2s', pointerEvents: 'auto' }}
          >
            <button
              onClick={() => onSelectPOI(poi.nome)}
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