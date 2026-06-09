import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MapMarkers } from "./Marcadores";

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
        console.log(`"posicao": { "x": ${x.toFixed(2)}, "y": ${y.toFixed(2)}, "z": ${z.toFixed(2)} }`);
      }
    };

    const canvasElement = gl.domElement;
    canvasElement.addEventListener("click", handleCanvasClick);
    return () => canvasElement.removeEventListener("click", handleCanvasClick);
  }, [gl, scene, raycaster]);

  return null;
}

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

const carroRef = { current: null as THREE.Group | null };

function Carro() {
  const { scene } = useGLTF("/car1.glb");

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={carroRef}
      object={scene}
      position={[-24.98, 0.36, -45.02]}
      scale={[0.05, 0.04, 0.05]}
      rotation={[
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(-130),
        THREE.MathUtils.degToRad(0),
      ]}
    />
  );
}

function SeguirCarro({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  useFrame(() => {
    if (!carroRef.current || !controlsRef.current) return;

    const pos = carroRef.current.position;
    controlsRef.current.target.set(pos.x, pos.y, pos.z);
    controlsRef.current.update();
  });

  return null;
}

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

interface CitySceneProps {
  onSelectPOI?: (id: string, nome: string) => void;
  children?: React.ReactNode;
}

export default function CityScene({ onSelectPOI, children }: CitySceneProps) {
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
          <Carro />
          <MapMarkers onSelectPOI={onSelectPOI || ((id, nome) => console.log("Clicou em:", id, nome))} />
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