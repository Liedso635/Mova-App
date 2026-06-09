import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PontoRota {
  id: string;
  posicao: [number, number, number];
}

interface RouteLineProps {
  rotaIds: string[];
  pontos: PontoRota[];
  animando: boolean;
  onFimRota?: () => void;
}

// Estado global partilhado entre RouteLine e Carro
export const rotaInterpolada = {
  pontos: [] as THREE.Vector3[],
  progresso: { current: 0 },
  ativa: false,
};

export function RouteLine({
  rotaIds,
  pontos,
  animando,
  onFimRota,
}: RouteLineProps) {
  const { scene } = useThree();
  const meshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    // limpar anterior
    meshesRef.current.forEach((m) => {
      scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });

    meshesRef.current = [];
    rotaInterpolada.pontos = [];
    rotaInterpolada.progresso.current = 0;
    rotaInterpolada.ativa = false;

    if (!rotaIds.length || !pontos.length) return;

    const ALTURA = 0.42;

    const PASSO_NAVEGACAO = 0.25; // pontos para o carro seguir
    const PASSO_VISUAL = 1.2;     // distância entre círculos

    // círculo no chão
    const circleGeometry = new THREE.CircleGeometry(0.12, 16);
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < rotaIds.length - 1; i++) {
      const a = pontos.find((p) => p.id === rotaIds[i]);
      const b = pontos.find((p) => p.id === rotaIds[i + 1]);
      if (!a || !b) continue;

      const from = new THREE.Vector3(a.posicao[0], ALTURA, a.posicao[2]);
      const to = new THREE.Vector3(b.posicao[0], ALTURA, b.posicao[2]);

      const dir = new THREE.Vector3().subVectors(to, from);
      const dist = dir.length();

      // ── pontos para movimento do carro ──
      const navSteps = Math.max(1, Math.floor(dist / PASSO_NAVEGACAO));

      for (let s = 0; s < navSteps; s++) {
        const pos = new THREE.Vector3().lerpVectors(from, to, s / navSteps);
        rotaInterpolada.pontos.push(pos.clone());
      }

      // ── círculos visuais na rota ──
      const visualSteps = Math.max(1, Math.floor(dist / PASSO_VISUAL));

      for (let s = 0; s < visualSteps; s++) {
        const t = (s + 0.5) / visualSteps;

        const pos = new THREE.Vector3().lerpVectors(from, to, t);

        const circle = new THREE.Mesh(circleGeometry, circleMaterial);

        circle.position.set(pos.x, ALTURA, pos.z);

        // 🔥 CORREÇÃO: deitar o círculo no chão (XZ)
        circle.rotation.x = -Math.PI / 2;

        scene.add(circle);
        meshesRef.current.push(circle);
      }
    }

    // último ponto garantido
    const ultimo = pontos.find(
      (p) => p.id === rotaIds[rotaIds.length - 1]
    );

    if (ultimo) {
      rotaInterpolada.pontos.push(
        new THREE.Vector3(
          ultimo.posicao[0],
          ALTURA,
          ultimo.posicao[2]
        )
      );
    }

    return () => {
      meshesRef.current.forEach((m) => {
        scene.remove(m);
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      meshesRef.current = [];
    };
  }, [rotaIds, pontos, scene]);

  // controlo da animação
  useEffect(() => {
    if (animando && rotaInterpolada.pontos.length > 0) {
      rotaInterpolada.progresso.current = 0;
      rotaInterpolada.ativa = true;
    } else {
      rotaInterpolada.ativa = false;
    }
  }, [animando]);

  // animação da rota
  useFrame(() => {
    if (!rotaInterpolada.ativa) return;

    const total = rotaInterpolada.pontos.length - 1;
    if (total <= 0) return;

    rotaInterpolada.progresso.current += 0.012;

    if (rotaInterpolada.progresso.current >= total) {
      rotaInterpolada.progresso.current = total;
      rotaInterpolada.ativa = false;
      onFimRota?.();
    }
  });

  return null;
}