import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MapMarkers } from "./Marcadores";
import { PONTOS_DA_CIDADE } from "./Marcadores";
import { rotaInterpolada } from "../components/mova/RouteLine";

// ─── SceneSetup ────────────────────────────────────────────────────────────────
function SceneSetup() {
  const { gl, scene, raycaster } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color("#b5b5b5");
    scene.fog = new THREE.Fog("#b5b5b5", 160, 520);

    const handleCanvasClick = () => {
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const { x, y, z } = intersects[0].point;
        console.log(
          `"posicao": { "x": ${x.toFixed(2)}, "y": ${y.toFixed(2)}, "z": ${z.toFixed(2)} }`
        );
      }
    };

    const canvasElement = gl.domElement;
    canvasElement.addEventListener("click", handleCanvasClick);
    return () => canvasElement.removeEventListener("click", handleCanvasClick);
  }, [gl, scene, raycaster]);

  return null;
}

// ─── CameraInfo ────────────────────────────────────────────────────────────────
function CameraInfo() {
  const { camera } = useThree();

  useEffect(() => {
    const interval = setInterval(() => {
      const { x, y, z } = camera.position;
      const el = document.getElementById("cam-info");
      if (el) {
        el.innerText = `position: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`;
      }
    }, 100);
    return () => clearInterval(interval);
  }, [camera]);

  return null;
}

// ─── Lights ────────────────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <spotLight
        color="#FFA500"
        intensity={2000}
        distance={1000}
        angle={Math.PI / 4}
        penumbra={0.5}
        decay={2}
        position={[-27.28, 57.51, -72.14]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={1500}
        shadow-bias={-0.001}
        shadow-radius={5}
      />
      <spotLight
        color="#FFFFFF"
        intensity={2000}
        distance={500}
        angle={Math.PI / 4}
        penumbra={0.5}
        decay={2}
        position={[-95.79, 37.83, -72.55]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={1000}
        shadow-bias={-0.001}
        shadow-radius={5}
      />
      <hemisphereLight
        color="rgb(0, 35, 200)"
        groundColor="#444444"
        intensity={0.6}
        position={[0, 50, 0]}
      />
      <ambientLight color="#FFFFFF" intensity={0.1} />
    </>
  );
}

// ─── Referência global ao mesh do carro ────────────────────────────────────────
export const carroRef = { current: null as THREE.Group | null };

// ─── Carro ─────────────────────────────────────────────────────────────────────
function Carro({ origemId }: { origemId?: string | null }) {
  const { scene } = useGLTF("/car1.glb");

  const ALTURA_CARRO = 0.36;
  const POSICAO_PADRAO: [number, number, number] = [-24.98, ALTURA_CARRO, -45.02];

  // Activa sombras em todos os meshes do carro
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  // Posição inicial baseada na origem seleccionada
  useEffect(() => {
    if (!origemId || !carroRef.current) return;
    const ponto = PONTOS_DA_CIDADE.find((p) => p.id === origemId);
    if (!ponto) return;
    carroRef.current.position.set(ponto.posicao[0], ALTURA_CARRO, ponto.posicao[2]);
  }, [origemId]);

  // Animação frame-a-frame — o carro segue os pontos interpolados da rota
  useFrame(() => {
    if (!carroRef.current) return;

    const pts = rotaInterpolada.pontos;
    if (pts.length < 2) return;

    // Só anima se a rota estiver activa OU se ainda estiver a terminar (progresso > 0)
    if (!rotaInterpolada.ativa && rotaInterpolada.progresso.current === 0) return;

    const t = rotaInterpolada.progresso.current;
    const idx = Math.min(Math.floor(t), pts.length - 2);
    const frac = Math.min(t - idx, 1);

    // Posição interpolada no segmento actual
    const alvo = new THREE.Vector3().lerpVectors(pts[idx], pts[idx + 1], frac);

    // Suavização extra da posição (lerp)
    carroRef.current.position.lerp(alvo, 0.18);

    // Orientação suave na direcção do movimento
    const nextIdx = Math.min(idx + 1, pts.length - 1);
    const dir = new THREE.Vector3().subVectors(pts[nextIdx], pts[idx]);
    if (dir.lengthSq() > 0.0001) {
      const angle = Math.atan2(dir.x, dir.z);
      const targetQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, angle, 0)
      );
      carroRef.current.quaternion.slerp(targetQuat, 0.12);
    }
  });

  return (
    <primitive
      ref={carroRef}
      object={scene}
      position={POSICAO_PADRAO}
      scale={[0.05, 0.04, 0.05]}
    />
  );
}

// ─── SeguirCarro ───────────────────────────────────────────────────────────────
// Move câmara + target juntos para manter o offset (distância/ângulo) constante
function SeguirCarro({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const prevTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!carroRef.current || !controlsRef.current) return;
    if (!rotaInterpolada.ativa && rotaInterpolada.progresso.current === 0) return;

    const carroPos = carroRef.current.position;
    const novoTarget = new THREE.Vector3(carroPos.x, carroPos.y, carroPos.z);

    // Target suavizado frame a frame
    const targetAtual = controlsRef.current.target as THREE.Vector3;
    const targetSuave = targetAtual.clone().lerp(novoTarget, 0.08);

    // Delta entre frame anterior e agora -> aplica à câmara para manter o offset
    const delta = new THREE.Vector3().subVectors(targetSuave, prevTarget.current);
    camera.position.add(delta);

    controlsRef.current.target.copy(targetSuave);
    controlsRef.current.update();

    prevTarget.current.copy(targetSuave);
  });

  return null;
}

// ─── CityModel ─────────────────────────────────────────────────────────────────
function CityModel() {
  const { scene } = useGLTF("/city.glb");
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.envMapIntensity = 1.2;
          mesh.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

// ─── CityScene ─────────────────────────────────────────────────────────────────
interface CitySceneProps {
  onSelectPOI?: (id: string, nome: string) => void;
  origemId?: string | null;
  children?: React.ReactNode;
}

export default function CityScene({ onSelectPOI, origemId, children }: CitySceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        id="cam-info"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "6px 10px",
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 13,
        }}
      />
      <Canvas
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: [-22.99, 1.48, -42.96], fov: 40, near: 0.001, far: 500 }}
      >
        <SceneSetup />
        <CameraInfo />
        <SeguirCarro controlsRef={controlsRef} />
        <Lights />
        <Suspense fallback={null}>
          <CityModel />
          <Carro origemId={origemId} />
          <MapMarkers
            onSelectPOI={
              onSelectPOI || ((id, nome) => console.log("Clicou em:", id, nome))
            }
          />
          {children}
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          target={[-24.98, 0.5, -45.02]}
          enablePan
          enableZoom
          enableRotate
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}