import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PONTOS_DA_CIDADE } from '@/components/Marcadores';

interface RouteLineProps {
  rotaIds: string[];
}

export function RouteLine({ rotaIds }: RouteLineProps) {
  const { scene } = useThree();

  useEffect(() => {
    if (!rotaIds.length) return;

    const points: THREE.Vector3[] = [];
    for (const id of rotaIds) {
      const ponto = PONTOS_DA_CIDADE.find(p => p.id === id);
      if (ponto) {
        points.push(new THREE.Vector3(ponto.posicao[0], ponto.posicao[1] + 0.2, ponto.posicao[2]));
      }
    }
    if (points.length < 2) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff3366 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    return () => {
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    };
  }, [rotaIds, scene]);

  return null;
}