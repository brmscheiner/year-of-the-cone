import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Voxel grid definition
// ---------------------------------------------------------------------------

type XZ = [number, number];

const WIDE: XZ[] = [
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

const MED: XZ[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const CROSS: XZ[] = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const RAW_LAYERS: { y: number; cells: XZ[] }[] = [
  { y: -7, cells: [[0, 0]] },
  { y: -6, cells: [[0, 0]] },
  { y: -5, cells: CROSS },
  { y: -4, cells: MED },
  { y: -3, cells: WIDE },
  { y: -2, cells: WIDE },
  { y: -1, cells: WIDE },
  { y: 0, cells: WIDE },
  { y: 1, cells: MED },
  { y: 2, cells: MED },
  { y: 3, cells: CROSS },
  { y: 4, cells: CROSS },
  { y: 5, cells: [[0, 0]] },
  { y: 6, cells: [[0, 0]] },
];

// ---------------------------------------------------------------------------
// Build voxel list and classify inner vs outer
// ---------------------------------------------------------------------------

interface Voxel {
  x: number;
  y: number;
  z: number;
  isStem: boolean;
  isOuter: boolean;
  // alternating parity — drives which outer scales protrude vs. recess
  parity: number;
}

function buildVoxels(): Voxel[] {
  const posSet = new Set<string>();
  const raw: [number, number, number][] = [];

  for (const { y, cells } of RAW_LAYERS) {
    for (const [x, z] of cells) {
      posSet.add(`${x},${y},${z}`);
      raw.push([x, y, z]);
    }
  }

  return raw.map(([x, y, z]) => {
    const isStem = y <= -6;
    const isOuter =
      !isStem &&
      [
        [x + 1, z],
        [x - 1, z],
        [x, z + 1],
        [x, z - 1],
      ].some(([nx, nz]) => !posSet.has(`${nx},${y},${nz}`));
    const parity = (Math.abs(x) + Math.abs(z) + y) % 2;
    return { x, y, z, isStem, isOuter, parity };
  });
}

const VOXELS = buildVoxels();

// ---------------------------------------------------------------------------
// Color — warm torch palette with depth gradient
// ---------------------------------------------------------------------------

function voxelColor(v: Voxel): THREE.Color {
  if (v.isStem) return new THREE.Color(0x0e0604);
  if (v.y <= -5) return new THREE.Color(0x1a0a04);

  // 0 = bottom of cone, 1 = tip
  const t = (v.y + 5) / 13;

  if (!v.isOuter) {
    // Inner core: very dark
    return new THREE.Color().setHSL(0.055, 0.8, 0.06 + t * 0.04);
  }

  if (v.parity === 0) {
    // Recessed scale face: darker
    return new THREE.Color().setHSL(0.055, 0.75, 0.12 + t * 0.08);
  } else {
    // Protruding scale tip: warmer, lighter
    return new THREE.Color().setHSL(0.07, 0.8, 0.22 + t * 0.12);
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PineconeViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = 280;
    const H = 380;

    // Scene
    const scene = new THREE.Scene();

    // Camera — slight 3/4 view from above
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(3, 5, 17);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Lighting
    // Sky/ground hemisphere — warm amber from above, near-black from below
    scene.add(new THREE.HemisphereLight(0x4a1c06, 0x080204, 1.8));

    // Main torch from upper-left front
    const torch = new THREE.DirectionalLight(0xffaa44, 3.0);
    torch.position.set(4, 7, 6);
    scene.add(torch);

    // Cool rim from behind to separate silhouette from background
    const rim = new THREE.DirectionalLight(0x3050a0, 0.5);
    rim.position.set(-4, 1, -7);
    scene.add(rim);

    // Build geometry — one box per voxel via InstancedMesh
    const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0.0 });
    const mesh = new THREE.InstancedMesh(geo, mat, VOXELS.length);

    const dummy = new THREE.Object3D();

    VOXELS.forEach((v, i) => {
      let px = v.x;
      let py = v.y;
      let pz = v.z;

      if (v.isOuter && !v.isStem) {
        const r = Math.sqrt(v.x * v.x + v.z * v.z);
        if (r > 0) {
          if (v.parity === 1) {
            // Protruding scale — push outward + slightly up
            const push = 0.42;
            px = v.x + (v.x / r) * push;
            pz = v.z + (v.z / r) * push;
            py = v.y + 0.18;
          } else {
            // Recessed scale — very slightly inward
            const pull = 0.08;
            px = v.x - (v.x / r) * pull;
            pz = v.z - (v.z / r) * pull;
          }
        }
      }

      dummy.position.set(px, py, pz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, voxelColor(v));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Group for rotation/bob — center at y midpoint (~0)
    const group = new THREE.Group();
    group.add(mesh);
    group.position.y = -0.2;
    scene.add(group);

    let animId: number;
    const start = Date.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - start) * 0.001;
      group.rotation.y = t * 0.18; // slow, contemplative rotation
      group.position.y = -0.2 + Math.sin(t * 0.5) * 0.12; // gentle float
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
      style={{ width: 280, height: 380 }}
    />
  );
}
