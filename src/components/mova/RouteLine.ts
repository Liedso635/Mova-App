import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PontoRota {
  id: string;
  posicao: [number, number, number];
}

interface RouteLineProps {
  rotaIds: string[];                    // Rota Visual FIXA (Branca)
  rotaAltIds?: string[];               // Rota Visual FIXA (Azul)
  caminhoCarro?: string[];             // (NOVO) O trilho invisível que guia o carro
  pontos: PontoRota[];
  animando: boolean;
  onFimRota?: () => void;
  pontoJuncaoId?: string | null;
}

// ── Estado global partilhado entre RouteLine e Carro ─────────────────────────
export const rotaInterpolada = {
  pontos: [] as THREE.Vector3[],
  progresso: { current: 0 },
  ativa: false,
};

// Pontos da rota alternativa (para o botão "Mudar Caminho")
export const rotaAlternativaInterpolada = {
  pontos: [] as THREE.Vector3[],
};

// ── Utilitário: construir pontos de navegação ─────────────────────────────────
function buildNavPoints(rotaIds: string[], pontos: PontoRota[]): THREE.Vector3[] {
  const ALTURA = 0.42;
  const PASSO_NAVEGACAO = 0.25;
  const result: THREE.Vector3[] = [];

  for (let i = 0; i < rotaIds.length - 1; i++) {
    const a = pontos.find(p => p.id === rotaIds[i]);
    const b = pontos.find(p => p.id === rotaIds[i + 1]);
    if (!a || !b) continue;

    const from = new THREE.Vector3(a.posicao[0], ALTURA, a.posicao[2]);
    const to   = new THREE.Vector3(b.posicao[0], ALTURA, b.posicao[2]);
    const dist = from.distanceTo(to);
    const navSteps = Math.max(1, Math.floor(dist / PASSO_NAVEGACAO));

    for (let s = 0; s < navSteps; s++) {
      result.push(new THREE.Vector3().lerpVectors(from, to, s / navSteps));
    }
  }

  const ultimo = pontos.find(p => p.id === rotaIds[rotaIds.length - 1]);
  if (ultimo) {
    result.push(new THREE.Vector3(ultimo.posicao[0], ALTURA, ultimo.posicao[2]));
  }
  return result;
}

function buildCircles(
  rotaIds: string[],
  pontos: PontoRota[],
  color: number,
  passo: number = 1.2
): THREE.Mesh[] {
  const ALTURA = 0.42;
  const meshes: THREE.Mesh[] = [];

  const geom = new THREE.CircleGeometry(0.12, 16);
  const mat  = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });

  for (let i = 0; i < rotaIds.length - 1; i++) {
    const a = pontos.find(p => p.id === rotaIds[i]);
    const b = pontos.find(p => p.id === rotaIds[i + 1]);
    if (!a || !b) continue;

    const from = new THREE.Vector3(a.posicao[0], ALTURA, a.posicao[2]);
    const to   = new THREE.Vector3(b.posicao[0], ALTURA, b.posicao[2]);
    const dist = from.distanceTo(to);
    const visualSteps = Math.max(1, Math.floor(dist / passo));

    for (let s = 0; s < visualSteps; s++) {
      const t   = (s + 0.5) / visualSteps;
      const pos = new THREE.Vector3().lerpVectors(from, to, t);
      const circle = new THREE.Mesh(geom, mat);
      circle.position.set(pos.x, ALTURA, pos.z);
      circle.rotation.x = -Math.PI / 2;
      meshes.push(circle);
    }
  }
  return meshes;
}

// Cria círculos amarelos maiores no ponto de junção (3 círculos concêntricos pulsantes)
function buildJuncaoCircles(ponto: PontoRota): THREE.Mesh[] {
  const ALTURA = 0.45;
  const meshes: THREE.Mesh[] = [];

  const radii = [0.35, 0.22, 0.12];
  const alphas = [0.4, 0.65, 1.0];

  for (let i = 0; i < radii.length; i++) {
    const geom = new THREE.CircleGeometry(radii[i], 24);
    const mat  = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: alphas[i],
    });
    const circle = new THREE.Mesh(geom, mat);
    circle.position.set(ponto.posicao[0], ALTURA + i * 0.001, ponto.posicao[2]);
    circle.rotation.x = -Math.PI / 2;
    meshes.push(circle);
  }
  return meshes;
}

// ── Componente RouteLine ──────────────────────────────────────────────────────
export function RouteLine({
  rotaIds,
  rotaAltIds = [],
  caminhoCarro = [],
  pontos,
  animando,
  onFimRota,
  pontoJuncaoId,
}: RouteLineProps) {
  const { scene } = useThree();
  const meshesRef       = useRef<THREE.Mesh[]>([]);
  const meshesAltRef    = useRef<THREE.Mesh[]>([]);
  const meshesJuncaoRef = useRef<THREE.Mesh[]>([]);
  const tempoRef        = useRef(0);

  const removeMeshes = (arr: THREE.Mesh[]) => {
    arr.forEach(m => {
      scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material | THREE.Material[]);
      if (Array.isArray(m.material)) {
        m.material.forEach(mat => mat.dispose());
      } else {
        m.material.dispose();
      }
    });
    arr.length = 0;
  };

  // ── 1. Rota Visual BRANCA (Fica sempre estática, não muda) ────────────────
  useEffect(() => {
    removeMeshes(meshesRef.current);
    if (!rotaIds.length || !pontos.length) return;

    const circles = buildCircles(rotaIds, pontos, 0xffffff);
    circles.forEach(c => { scene.add(c); meshesRef.current.push(c); });

    return () => removeMeshes(meshesRef.current);
  }, [rotaIds, pontos, scene]);

  // ── 2. Rota Visual AZUL (Fica sempre estática, não muda) ─────────────────
  useEffect(() => {
    removeMeshes(meshesAltRef.current);
    if (!rotaAltIds.length || !pontos.length) return;

    const circles = buildCircles(rotaAltIds, pontos, 0x4488ff);
    circles.forEach(c => { scene.add(c); meshesAltRef.current.push(c); });

    return () => removeMeshes(meshesAltRef.current);
  }, [rotaAltIds, pontos, scene]);

  // ── 3. CAMINHO INVISÍVEL para o carro (pode mudar em tempo real) ──────────
  useEffect(() => {
    // Se não passarem caminhoCarro, usa rotaIds normal
    const rotaAtiva = caminhoCarro.length > 0 ? caminhoCarro : rotaIds;
    if (!rotaAtiva.length || !pontos.length) return;

    // Guardar a posição actual do carro antes de mudar de rota
    let posAtualCarro: THREE.Vector3 | null = null;
    if (rotaInterpolada.pontos.length > 0 && rotaInterpolada.ativa) {
      const idx = Math.min(Math.floor(rotaInterpolada.progresso.current), rotaInterpolada.pontos.length - 1);
      posAtualCarro = rotaInterpolada.pontos[idx];
    }

    // Construir os novos pontos de navegação
    const novosPontos = buildNavPoints(rotaAtiva, pontos);

    // Se o carro estava em movimento, encontra o ponto mais próximo na nova rota
    if (posAtualCarro && novosPontos.length > 0) {
      let minDist = Infinity;
      let bestIdx = 0;
      for (let i = 0; i < novosPontos.length; i++) {
        const d = posAtualCarro.distanceTo(novosPontos[i]);
        if (d < minDist) {
          minDist = d;
          bestIdx = i;
        }
      }
      // Ajustar o progresso para ficar no ponto mais próximo (sem resetar!)
      rotaInterpolada.progresso.current = bestIdx;
    } else {
      // Se o carro não estava em movimento, começar do início
      rotaInterpolada.progresso.current = 0;
    }

    // Atualizar os pontos globais
    rotaInterpolada.pontos = novosPontos;

    // Se estávamos animando, manter ativo
    if (animando) {
      rotaInterpolada.ativa = true;
    }
  }, [caminhoCarro, rotaIds, pontos]);

  // ── 4. Círculos de junção amarelos ──────────────────────────────────────
  useEffect(() => {
    removeMeshes(meshesJuncaoRef.current);

    if (!pontoJuncaoId) return;
    const ponto = pontos.find(p => p.id === pontoJuncaoId);
    if (!ponto) return;

    const juncaoMeshes = buildJuncaoCircles(ponto);
    juncaoMeshes.forEach(m => { scene.add(m); meshesJuncaoRef.current.push(m); });

    return () => removeMeshes(meshesJuncaoRef.current);
  }, [pontoJuncaoId, pontos, scene]);

  // ── 5. Controlo da animação (apenas liga/desliga) ────────────────────────
  useEffect(() => {
    if (animando && rotaInterpolada.pontos.length > 0) {
      rotaInterpolada.ativa = true;
    } else {
      rotaInterpolada.ativa = false;
    }
  }, [animando]);

  // ── 6. Frame loop: avança progresso + pulsa círculos ───────────────────
  useFrame((_, delta) => {
    // Progresso do carro
    if (rotaInterpolada.ativa) {
      const total = rotaInterpolada.pontos.length - 1;
      if (total > 0) {
        rotaInterpolada.progresso.current += 0.012;
        if (rotaInterpolada.progresso.current >= total) {
          rotaInterpolada.progresso.current = total;
          rotaInterpolada.ativa = false;
          onFimRota?.();
        }
      }
    }

    // Pulsação dos círculos de junção amarelos
    if (meshesJuncaoRef.current.length > 0) {
      tempoRef.current += delta;
      const pulse = 0.75 + 0.25 * Math.sin(tempoRef.current * 4);
      const exterior = meshesJuncaoRef.current[0];
      exterior.scale.setScalar(pulse);
      const mat = exterior.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + 0.3 * Math.sin(tempoRef.current * 4);
    }
  });

  return null;
}