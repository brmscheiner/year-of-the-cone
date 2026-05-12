import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STEP = 0.5;
const VOXEL = 0.46;

const PROFILE: [number, number][] = [
  [-6.5, 0.0], // stem
  [-6.0, 0.0],
  [-5.5, 0.7],
  [-5.0, 1.4],
  [-4.5, 2.1],
  [-4.0, 2.6],
  [-3.5, 2.9],
  [-3.0, 3.1],
  [-2.5, 3.1],
  [-2.0, 3.1],
  [-1.5, 3.1],
  [-1.0, 3.1],
  [-0.5, 3.0],
  [0.0, 2.8],
  [0.5, 2.5],
  [1.0, 2.1],
  [1.5, 1.7],
  [2.0, 1.3],
  [2.5, 0.8],
  [3.0, 0.4],
];

interface Voxel {
  x: number;
  y: number;
  z: number;
  isOuter: boolean;
  isStem: boolean;
}

function buildVoxels(): Voxel[] {
  const raw: [number, number, number, boolean][] = [];

  for (const [y, maxR] of PROFILE) {
    if (maxR === 0) {
      raw.push([0, y, 0, true]);
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
    return { x, y, z, isOuter, isStem };
  });
}

const VOXELS = buildVoxels();

function getScaleInfo(x: number, y: number, z: number) {
  const angle = Math.atan2(z, x);

  const pA = ((((5 * angle) / (2 * Math.PI) + y * 0.5 + 100) % 1) + 1) % 1;
  const pB = ((((8 * angle) / (2 * Math.PI) - y * 0.35 + 100) % 1) + 1) % 1;

  const dA = Math.abs(pA - 0.5) * 2;
  const dB = Math.abs(pB - 0.5) * 2;

  return { edgeDist: Math.max(dA, dB), dA, dB };
}

const GOLD = new THREE.Color(0xffd18a);
const BROWN = new THREE.Color(0x97673a);

function voxelColor(v: Voxel): THREE.Color {
  if (v.isStem) return new THREE.Color(0x2a1508);

  // Height: 0 = base, 1 = tip
  const t = (v.y + 6.0) / 9.5;

  if (!v.isOuter) {
    // Interior: warm amber protected from weathering, lighter in the middle
    const midBoost = 1 - Math.abs(t - 0.45) * 1.5;
    return new THREE.Color()
      .lerpColors(BROWN, GOLD, 0.1 + Math.max(0, midBoost) * 0.15)
      .multiplyScalar(0.35);
  }

  const { edgeDist } = getScaleInfo(v.x, v.y, v.z);
  const r = Math.sqrt(v.x * v.x + v.z * v.z);
  const maxR = 3.1;
  const radialPos = Math.min(r / maxR, 1);

  // Vertical gradient: base very dark, majority sits in rich brown, tip slightly lighter
  let baseBlend: number;
  if (t < 0.3) {
    // Base: very dark
    baseBlend = 0.95 + (0.3 - t) * 0.3;
  } else if (t < 0.7) {
    // Majority: rich brown (what the base used to look like)
    baseBlend = 0.7 + (0.7 - t) * 0.4;
  } else {
    // Tip: slightly lighter but still brown-dominant
    baseBlend = 0.7 - (t - 0.7) * 0.6;
  }

  // Outer scales are darker (more weathered) than inner-facing surfaces
  baseBlend += radialPos * 0.15;

  // Spiral-driven shingle pattern: alternating bands of light/shadow along fibonacci spirals
  const angle = Math.atan2(v.z, v.x);
  const spiralPhase = ((((13 * angle) / (2 * Math.PI) + v.y * 0.6 + 100) % 1) + 1) % 1;
  const shingleShadow = spiralPhase < 0.35 ? 0.12 : 0;
  baseBlend += shingleShadow;

  // Scale tips: slightly lighter/more worn from abrasion
  const scaleTipLighten = edgeDist < 0.15 ? (0.15 - edgeDist) * 0.6 : 0;
  baseBlend -= scaleTipLighten;

  baseBlend = Math.max(0, Math.min(1, baseBlend));
  const color = new THREE.Color().lerpColors(GOLD, BROWN, baseBlend);

  // Deep shadow in recessed gaps between scales
  if (edgeDist > 0.78) {
    color.multiplyScalar(0.2);
  } else if (edgeDist > 0.6) {
    const falloff = (edgeDist - 0.6) / 0.18;
    color.multiplyScalar(1 - falloff * 0.7);
  }

  // Tip weathering: desaturate slightly
  if (t > 0.75) {
    const gray = (color.r + color.g + color.b) / 3;
    const desat = (t - 0.75) * 1.5;
    color.r += (gray - color.r) * desat;
    color.g += (gray - color.g) * desat;
    color.b += (gray - color.b) * desat;
  }

  return color;
}

export function PineconeViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = 300;
    const H = 400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(5, -1.25, 18);
    camera.lookAt(0, -1.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x6a3a10, 0x0a0604, 1.2));

    const main = new THREE.DirectionalLight(0xffe0b0, 2.8);
    main.position.set(5, 7, 6);
    scene.add(main);

    const fill = new THREE.DirectionalLight(0x8a6030, 0.5);
    fill.position.set(-4, 2, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x4a3020, 0.4);
    rim.position.set(-5, 0, -8);
    scene.add(rim);

    const geo = new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
    const mesh = new THREE.InstancedMesh(geo, mat, VOXELS.length);

    const dummy = new THREE.Object3D();

    VOXELS.forEach((v, i) => {
      let px = v.x;
      let py = v.y;
      let pz = v.z;

      if (v.isOuter) {
        const r = Math.sqrt(v.x * v.x + v.z * v.z);
        if (r > 0) {
          const { edgeDist } = getScaleInfo(v.x, v.y, v.z);
          const push = 0.22 * (1 - edgeDist);
          px += (v.x / r) * push;
          pz += (v.z / r) * push;
          py += 0.05 * (1 - edgeDist);
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
    group.position.y = 0;
    group.rotation.z = 0.08;
    scene.add(group);

    let animId: number;
    const start = Date.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - start) * 0.001;
      group.rotation.y = t * 0.15;
      group.position.y = Math.sin(t * 0.45) * 0.1;
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
    <div ref={mountRef} className="mx-auto flex h-[400px] w-[300px] items-center justify-center" />
  );
}
