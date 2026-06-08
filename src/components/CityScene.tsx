import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MapMarkers } from "./Marcadores";

function SceneSetup() {
  const { gl, scene, raycaster } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color("#cfe8ff");
    scene.fog = new THREE.Fog("#cfe8ff", 160, 520);
    const handleCanvasClick = () => {
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const { x, y, z } = intersects[0].point;
        console.log(`"posicao": { "x": ${x.toFixed(2)}, "y": ${y.toFixed(2)}, "z": ${z.toFixed(2)} }`);
      }
    };
    const canvasElement = gl.domElement;
    canvasElement.addEventListener("click", handleCanvasClick);
    return () => canvasElement.removeEventListener("click", handleCanvasClick);
  }, [gl, scene, raycaster]);
  return null;
}

function CityModel() {
  const { scene } = useGLTF("/city.glb");
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.envMapIntensity = 1.2;
          mesh.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

interface CitySceneProps {
  onSelectPOI?: (id: string, nome: string) => void;
  children?: React.ReactNode;
}

export default function CityScene({ onSelectPOI, children }: CitySceneProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [-26, 2.3, -47], fov: 19, near: 0.001, far: 500 }}
    >
      <SceneSetup />
      <ambientLight intensity={0.34} color="#022396" />
      <directionalLight position={[38.3, 40, -32.1]} intensity={0.97} color="#FFF9AD" castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-32.1, 25, -38.3]} intensity={0.74} color="#342E77" />
      <directionalLight position={[-38.3, 30, 32.1]} intensity={0.13} color="#FFFFFF" />
      <Suspense fallback={null}>
        <CityModel />
        <MapMarkers onSelectPOI={onSelectPOI || ((id, nome) => console.log("Clicou em:", id, nome))} />
        {children}
      </Suspense>
      <OrbitControls target={[-24, 1.3, -44]} enablePan enableZoom enableRotate minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}