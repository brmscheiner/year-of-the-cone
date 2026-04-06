import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Build voxel [x, y, z] positions for the pinecone
function buildVoxels(): [number, number, number][] {
  const v: [number, number, number][] = [];
  const L = (y: number, cells: [number, number][]) => cells.forEach(([x, z]) => v.push([x, y, z]));

  // Stem
  L(-5, [[0, 0]]);
  L(-4, [[0, 0]]);

  // Narrow base
  L(-3, [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);

  // Widening
  L(-2, [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]);
  L(-1, [
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-1, -2],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, -2],
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2],
    [1, -2],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, -1],
    [2, 0],
    [2, 1],
  ]);

  // Widest (double layer)
  const wide: [number, number][] = [
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-1, -2],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, -2],
    [0, -1],
    [0, 0],
    [0, 1],
    [0, 2],
    [1, -2],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, -1],
    [2, 0],
    [2, 1],
  ];
  L(0, wide);
  L(1, wide);

  // Narrowing
  L(2, [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]);
  L(3, [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);
  L(4, [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);

  // Tip
  L(5, [[0, 0]]);
  L(6, [[0, 0]]);

  return v;
}

const VOXELS = buildVoxels();

// Per-voxel color based on position — creates the layered scale look
function voxelColor(x: number, y: number, z: number): THREE.Color {
  if (y <= -4) return new THREE.Color(0x1a0a04); // stem: near black
  if (y === -3) return new THREE.Color(0x2a1208); // stem top

  // Alternating dark/medium scales by position parity
  const parity = (Math.abs(x) + Math.abs(z) + Math.abs(y)) % 2;
  if (y >= 5) return new THREE.Color(0x3d1e0a); // tip
  if (parity === 0) return new THREE.Color(0x5c2e0e); // dark scale
  return new THREE.Color(0x9b5a20); // medium scale
}

export function PineconeViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = 280;
    const H = 360;

    const scene = new THREE.Scene();

    // Perspective camera with a slight angled view
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(5, 2, 18);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1); // keep crisp/pixelated, no subpixel AA
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Warm torch ambient
    scene.add(new THREE.AmbientLight(0x3a1c08, 2.0));

    // Main torch light — upper left
    const mainLight = new THREE.DirectionalLight(0xffaa44, 2.5);
    mainLight.position.set(4, 6, 5);
    scene.add(mainLight);

    // Dim cool fill from below-right
    const fillLight = new THREE.DirectionalLight(0x204060, 0.6);
    fillLight.position.set(-4, -3, -6);
    scene.add(fillLight);

    // Build InstancedMesh
    const geo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const mat = new THREE.MeshLambertMaterial();
    const mesh = new THREE.InstancedMesh(geo, mat, VOXELS.length);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    VOXELS.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, voxelColor(x, y, z).getHex ? voxelColor(x, y, z) : color);
    });

    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;

    // Group for rotation — center vertically (y spans -5 to 6, midpoint ≈ 0.5)
    const group = new THREE.Group();
    group.add(mesh);
    group.position.y = -0.5;
    scene.add(group);

    let animId: number;
    const startTime = Date.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startTime) * 0.001;
      group.rotation.y = t * 0.6;
      // Subtle float bob
      group.position.y = -0.5 + Math.sin(t * 0.8) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="mx-auto flex items-center justify-center"
      style={{ width: 280, height: 360 }}
    />
  );
}
