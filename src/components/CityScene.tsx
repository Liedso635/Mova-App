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

    // Função que roda a cada clique no Canvas
    const handleCanvasClick = () => {
      // O R3F atualiza o 'raycaster' com a posição do mouse automaticamente.
      // O 'true' serve para ele caçar o clique no fundo do arquivo .glb
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Pegamos o primeiro ponto de impacto (o mais próximo da câmera)
        const { x, y, z } = intersects[0].point;
        
        console.log(`"posicao": { "x": ${x.toFixed(2)}, "y": ${y.toFixed(2)}, "z": ${z.toFixed(2)} }`);
      }
    };

    // Adiciona o evento direto no elemento do Canvas
    const canvasElement = gl.domElement;
    canvasElement.addEventListener("click", handleCanvasClick);

    // Limpa o evento quando o componente desmontar
    return () => {
      canvasElement.removeEventListener("click", handleCanvasClick);
    };
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

export default function CityScene() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{
        position: [-26, 2.3, -47],
        fov: 19,
        near: 0.001,
        far: 500,
      }}
    >
      <SceneSetup />

      {/* Ambiente: HSV #022396 | Intensidade: 34% (0.34) */}
      <ambientLight intensity={0.34} color="#022396" />

      {/* Luz 1 (Principal): HSV #FFF9AD | Intensidade: 97% (0.97) | Rotacionada a 320° */}
      <directionalLight
        position={[38.3, 40, -32.1]}
        intensity={0.97}
        color="#FFF9AD"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Luz 2 (Preenchimento): HSV #342E77 | Intensidade: 74% (0.74) */}
      <directionalLight
        position={[-32.1, 25, -38.3]}
        intensity={0.74}
        color="#342E77"
      />

      {/* Luz 3 (Contra-luz/Destaque): HSV #FFFFFF | Intensidade: 13% (0.13) */}
      <directionalLight
        position={[-38.3, 30, 32.1]}
        intensity={0.13}
        color="#FFFFFF"
      />

      <Suspense fallback={null}>
        <CityModel />

        <MapMarkers onSelectPOI={(nome) => console.log("Clicou em:", nome)} />
      </Suspense>

      <OrbitControls
        target={[-24, 1.3, -44]}
        enablePan
        enableZoom
        enableRotate
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}