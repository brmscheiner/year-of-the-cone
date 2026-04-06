import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Geometry: fine 0.5-unit grid gives 4× the cross-section resolution
// ---------------------------------------------------------------------------

const STEP = 0.5;
const VOXEL = 0.46; // slightly smaller than step → small gap between cubes

// Profile: [world_y, max_radius] — defines the pinecone silhouette
const PROFILE: [number, number][] = [
  [-5.0, 0.0], // stem base
  [-4.5, 0.0], // stem
  [-4.0, 0.0], // stem
  [-3.5, 0.5], // skirt starts
  [-3.0, 1.1],
  [-2.5, 1.7],
  [-2.0, 2.2],
  [-1.5, 2.5], // widest
  [-1.0, 2.5], // widest
  [-0.5, 2.4],
  [0.0, 2.2],
  [0.5, 2.0],
  [1.0, 1.7],
  [1.5, 1.4],
  [2.0, 1.1],
  [2.5, 0.8],
  [3.0, 0.5],
  [3.5, 0.25],
  [4.0, 0.0], // tip
];

// ---------------------------------------------------------------------------
// Build voxel list
// ---------------------------------------------------------------------------

interface Voxel {
  x: number;
  y: number;
  z: number;
  isStem: boolean;
  isOuter: boolean;
}

function buildVoxels(): Voxel[] {
  const raw: [number, number, number, boolean][] = []; // x,y,z,isStem

  for (const [y, maxR] of PROFILE) {
    if (maxR === 0) {
      if (y >= -5) raw.push([0, y, 0, true]); // stem voxel
      continue;
    }
    const extent = Math.ceil(maxR / STEP);
    for (let xi = -extent; xi <= extent; xi++) {
      for (let zi = -extent; zi <= extent; zi++) {
        const x = xi * STEP;
        const z = zi * STEP;
        if (x * x + z * z <= maxR * maxR) {
          raw.push([x, y, z, false]);
        }
      }
    }
  }

  // Build a position set to identify outer voxels
  const posSet = new Set(raw.map(([x, y, z]) => `${x},${y},${z}`));

  return raw.map(([x, y, z, isStem]) => {
    const isOuter =
      !isStem &&
      [
        [x + STEP, z],
        [x - STEP, z],
        [x, z + STEP],
        [x, z - STEP],
      ].some(([nx, nz]) => !posSet.has(`${nx},${y},${nz}`));
    return { x, y, z, isStem, isOuter };
  });
}

const VOXELS = buildVoxels();

// ---------------------------------------------------------------------------
// Color — height gradient + spiral stripe to fake the scale pattern
// ---------------------------------------------------------------------------

// Spiral stripe: colors voxels based on angular position offset by height,
// creating a helical band that looks like overlapping pinecone scales.
const SPIRAL_FREQ = 1.8; // how tightly the spiral winds up the cone
const SPIRAL_BANDS = 7; // how many scale rows visible around the cone

function voxelColor(v: Voxel): THREE.Color {
  if (v.isStem) return new THREE.Color(0x0a0603);
  if (v.y <= -3.5) return new THREE.Color(0x150b03);

  // 0 = bottom of cone, 1 = tip
  const t = (v.y + 4) / 9.0;

  if (!v.isOuter) {
    // Inner core: very dark brown, almost black
    return new THREE.Color().setHSL(0.057, 0.82, 0.04 + t * 0.02);
  }

  // Spiral phase: angle around Y axis offset by height → helical stripes
  const angle = Math.atan2(v.z, v.x); // -π to π
  const phase = ((angle + v.y * SPIRAL_FREQ) * (SPIRAL_BANDS / (2 * Math.PI)) + 100) % 1;
  const isScaleTip = phase < 0.55;

  if (isScaleTip) {
    // Scale face (lit): tan — yellow-brown, lower saturation, higher lightness
    return new THREE.Color().setHSL(0.095, 0.45, 0.3 + t * 0.18);
  } else {
    // Shadow under overlapping scale: dark brown, high contrast against tan
    return new THREE.Color().setHSL(0.057, 0.85, 0.06 + t * 0.04);
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

    const W = 300;
    const H = 400;

    const scene = new THREE.Scene();

    // Camera — 3/4 view, slightly elevated so you see the profile clearly
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(5, 2, 18);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.HemisphereLight(0x4a2008, 0x060204, 1.5));

    const torch = new THREE.DirectionalLight(0xffaa40, 3.2);
    torch.position.set(5, 7, 6);
    scene.add(torch);

    // Cool rim from behind — separates silhouette from dark background
    const rim = new THREE.DirectionalLight(0x2040a0, 0.6);
    rim.position.set(-5, 0, -8);
    scene.add(rim);

    // InstancedMesh
    const geo = new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.87, metalness: 0 });
    const mesh = new THREE.InstancedMesh(geo, mat, VOXELS.length);

    const dummy = new THREE.Object3D();

    VOXELS.forEach((v, i) => {
      let px = v.x;
      let py = v.y;
      let pz = v.z;

      if (v.isOuter) {
        const r = Math.sqrt(v.x * v.x + v.z * v.z);
        if (r > 0) {
          // Push outer voxels outward to create scale relief
          const push = 0.18;
          px = v.x + (v.x / r) * push;
          pz = v.z + (v.z / r) * push;
          py = v.y + 0.06; // slight upward lean, like scales opening
        }
      }

      dummy.position.set(px, py, pz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, voxelColor(v));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const group = new THREE.Group();
    group.add(mesh);
    // Vertical center: profile spans y=-5 to y=4, midpoint ≈ -0.5
    group.position.y = 0.5;
    // Very slight static tilt so you see the 3D profile even when facing front
    group.rotation.z = 0.12;
    scene.add(group);

    let animId: number;
    const start = Date.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - start) * 0.001;
      group.rotation.y = t * 0.15; // slow and contemplative
      group.position.y = 0.5 + Math.sin(t * 0.45) * 0.1;
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
      style={{ width: 300, height: 400 }}
    />
  );
}
