export type MovaView =
  | "landing"
  | "selector"
  | "motorista-login"
  | "passageiro-login"
  | "motorista-painel"
  | "passageiro-painel";

export const MAP_VIEWS: MovaView[] = [
  "landing",
  "selector",
  "motorista-login",
  "passageiro-login",
];

// Paste a Mapbox public access token here to enable the live 2D→3D map
// animation. When empty, a lightweight animated fallback is shown instead.
export const MAPBOX_TOKEN = "";
