import React, { useRef, useState, useEffect, useCallback } from "react";

// Performance energy saver sleep throttler hook
export function useKineticThrottler(
  lastInteractionRef: React.MutableRefObject<number>,
  isDraggingRef: React.MutableRefObject<boolean>,
  velocitiesRef: React.MutableRefObject<{ x: number; y: number }>,
  options: { minVelocity: number; idleTimeoutMs: number }
) {
  const [isAsleep, setIsAsleep] = useState(false);

  const checkEnergyState = useCallback(() => {
    const timeSinceActive = Date.now() - lastInteractionRef.current;
    const omega = Math.sqrt(
      velocitiesRef.current.x * velocitiesRef.current.x +
      velocitiesRef.current.y * velocitiesRef.current.y
    );

    if (isDraggingRef.current) {
      if (isAsleep) setIsAsleep(false);
      return { asleep: false, omega };
    }

    if (timeSinceActive > options.idleTimeoutMs && omega < options.minVelocity) {
      if (!isAsleep) {
        setIsAsleep(true);
      }
      return { asleep: true, omega };
    }

    if (isAsleep) {
      setIsAsleep(false);
    }
    return { asleep: false, omega };
  }, [isAsleep, options.idleTimeoutMs, options.minVelocity]);

  const wakeUp = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (isAsleep) {
      setIsAsleep(false);
    }
  }, [isAsleep]);

  return { isAsleep, checkEnergyState, wakeUp };
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  label?: string;
  color?: string;
}

interface Face3D {
  indices: number[];
  type: "sphere_face" | "poly_face";
  color?: string;
}

interface OrbitRing3D {
  points: { x: number; y: number; z: number }[];
  color: string;
  lineWidth: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
}

interface QuantumCore3DProps {
  size?: number;
  colorTheme?: "amber" | "indigo" | "mixed";
  readinessScore?: number;
  studyVelocity?: number;
}

type ModeType = "helios" | "onyx" | "manifold";

export const QuantumCore3D: React.FC<QuantumCore3DProps> = ({
  size = 210,
  colorTheme = "amber",
  readinessScore = 80,
  studyVelocity = 35,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<ModeType>("helios");

  // WebGL rotators & drag handles
  const angles = useRef({ x: 0.3, y: 0.8, z: 0.2 });
  const velocities = useRef({ x: 0.003, y: 0.005 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: -1000, y: -1000 });
  const lastInteraction = useRef<number>(Date.now());

  const { isAsleep, checkEnergyState, wakeUp } = useKineticThrottler(
    lastInteraction,
    isDragging,
    velocities,
    { minVelocity: 0.005, idleTimeoutMs: 8000 }
  );

  const [isElementVisible, setIsElementVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Viewport Exit Interceptor: Track when canvas element enters or leaves the user's focus
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsElementVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          wakeUp();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [wakeUp]);

  // Tab Minimize Interceptor: Track document.visibilityState to pause background requests
  useEffect(() => {
    const handleVisibilityChange = () => {
      const active = document.visibilityState !== "hidden";
      setIsTabVisible(active);
      if (active) {
        wakeUp();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [wakeUp]);

  // Mode Specific Geometry Data Refs
  const pointsManifold = useRef<Point3D[]>([]);
  const edgesManifold = useRef<[number, number][]>([]);

  const pointsHelios = useRef<Point3D[]>([]);
  const facesHelios = useRef<Face3D[]>([]);
  const orbitCyanLines = useRef<OrbitRing3D>({ points: [], color: "#06b6d4", lineWidth: 2 });
  const orbitYellowLines = useRef<OrbitRing3D>({ points: [], color: "#f59e0b", lineWidth: 1.8 });

  const pointsOnyx = useRef<Point3D[]>([]);
  const facesOnyx = useRef<Face3D[]>([]);

  // Space Dust Star field simulation
  const stars = useRef<StarParticle[]>([]);

  // Intransitive hover feedback readout state
  const [telemetryTag, setTelemetryTag] = useState<string>("STABLE");

  // Math symbols loaded on nodes
  const quantumSymbols = ["Ψ", "∇²", "ℏ", "E=hν", "λ", "Hψ", "∂t", "δ", "μ", "σ"];

  // Initialize geometries once
  useEffect(() => {
    // ---- 1. MANIFOLD NODE NETWORK ----
    const mPoints: Point3D[] = [];
    const nodeCount = 24;
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 58;
      const x = Math.cos(theta) * Math.sin(phi) * r;
      const y = Math.sin(theta) * Math.sin(phi) * r;
      const z = Math.cos(phi) * r;
      mPoints.push({
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
        label: i < quantumSymbols.length ? quantumSymbols[i] : undefined,
      });
    }
    pointsManifold.current = mPoints;

    const mEdges: [number, number][] = [];
    for (let i = 0; i < mPoints.length; i++) {
      for (let j = i + 1; j < mPoints.length; j++) {
        const dx = mPoints[i].x - mPoints[j].x;
        const dy = mPoints[i].y - mPoints[j].y;
        const dz = mPoints[i].z - mPoints[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 45 && dist < 65) {
          mEdges.push([i, j]);
        }
      }
    }
    edgesManifold.current = mEdges;

    // ---- 2. HELIOS PLANET SPHERE & ORBITS ----
    const hPoints: Point3D[] = [];
    const stacks = 10;
    const slices = 12;
    const sphereRadius = 32;

    // Generate sphere mesh vertices
    for (let i = 0; i <= stacks; i++) {
      const lat = (i / stacks) * Math.PI - Math.PI / 2;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);
      for (let j = 0; j < slices; j++) {
        const lon = (j / slices) * Math.PI * 2;
        const sinLon = Math.sin(lon);
        const cosLon = Math.cos(lon);
        const x = cosLat * cosLon * sphereRadius;
        const y = sinLat * sphereRadius;
        const z = cosLat * sinLon * sphereRadius;
        hPoints.push({
          x,
          y,
          z,
          originalX: x,
          originalY: y,
          originalZ: z,
        });
      }
    }
    pointsHelios.current = hPoints;

    // Generate face indices for depth shading
    const hFaces: Face3D[] = [];
    for (let i = 0; i < stacks; i++) {
      for (let j = 0; j < slices; j++) {
        const p0 = i * slices + j;
        const p1 = i * slices + ((j + 1) % slices);
        const p2 = (i + 1) * slices + j;
        const p3 = (i + 1) * slices + ((j + 1) % slices);
        hFaces.push({ indices: [p0, p1, p2], type: "sphere_face" });
        hFaces.push({ indices: [p1, p3, p2], type: "sphere_face" });
      }
    }
    facesHelios.current = hFaces;

    // Cyan Orbit Rings tilted on Z/Y axes
    const cyanPoints: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const radiusOuter = 65;
      // standard ring in XZ plane
      let rx = Math.cos(theta) * radiusOuter;
      let ry = Math.sin(theta) * 0.15 * radiusOuter; // slight squash
      let rz = Math.sin(theta) * radiusOuter;

      // tilt rotation
      const tiltX = 0.45;
      const tiltZ = -0.35;
      // rotate around X
      let y1 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
      let z1 = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
      // rotate around Z
      let x2 = rx * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
      let y2 = rx * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);

      cyanPoints.push({ x: x2, y: y2, z: z1 });
    }
    orbitCyanLines.current.points = cyanPoints;

    // Yellow Orbit Rings tilted differently
    const yellowPoints: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const radiusOuter = 55;
      let rx = Math.cos(theta) * radiusOuter;
      let ry = Math.sin(theta) * 0.1 * radiusOuter;
      let rz = Math.sin(theta) * radiusOuter;

      const tiltX = -0.3;
      const tiltZ = 0.5;
      let y1 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
      let z1 = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
      let x2 = rx * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
      let y2 = rx * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);

      yellowPoints.push({ x: x2, y: y2, z: z1 });
    }
    orbitYellowLines.current.points = yellowPoints;

    // ---- 3. FACETED SLATE POLYHEDRON (ONYX ICOSAHEDRON) ----
    const pValue = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, pValue, 0],
      [1, pValue, 0],
      [-1, -pValue, 0],
      [1, -pValue, 0],
      [0, -1, pValue],
      [0, 1, pValue],
      [0, -1, -pValue],
      [0, 1, -pValue],
      [pValue, 0, -1],
      [pValue, 0, 1],
      [-pValue, 0, -1],
      [-pValue, 0, 1],
    ];

    const scaledVertices = rawVertices.map((v) => {
      const dist = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      const radius = 48;
      const x = (v[0] / dist) * radius;
      const y = (v[1] / dist) * radius;
      const z = (v[2] / dist) * radius;
      return {
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
      };
    });
    pointsOnyx.current = scaledVertices;

    const rawFaces = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1],
    ];
    facesOnyx.current = rawFaces.map((indices) => ({
      indices,
      type: "poly_face",
    }));

    // Generate space stardust background drift system
    const starList: StarParticle[] = [];
    for (let i = 0; i < 45; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 80 + Math.random() * 40;
      starList.push({
        x: Math.cos(theta) * Math.sin(phi) * r,
        y: Math.sin(theta) * Math.sin(phi) * r,
        z: Math.cos(phi) * r,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        vz: (Math.random() - 0.5) * 0.1,
        color: Math.random() > 0.4 ? "#f59e0b" : "#6366f1",
        size: Math.random() * 1.5 + 0.5,
      });
    }
    stars.current = starList;
  }, []);

  // Frame Loop logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Viewport Exit Interceptor: Term some frame repaint threads when hidden or off-screen
      if (!isElementVisible || !isTabVisible) {
        return; // Terminate frame loop entirely to reclaim 100% idle background browser execution threads
      }

      const cx = size / 2;
      const cy = size / 2;

      // Check passive energy sleep thresholds
      const { asleep } = checkEnergyState();

      if (asleep) {
        if (telemetryTag !== "PASSIVE_SLEEP") {
          setTelemetryTag("PASSIVE_SLEEP");
        }
        
        ctx.fillStyle = "rgba(5, 5, 5, 0.45)";
        ctx.fillRect(0, 0, size, size);
        
        // Render still text overlay indicating sleep standby state
        ctx.fillStyle = "rgba(10, 10, 10, 0.75)";
        ctx.fillRect(10, size - 35, size - 20, 25);
        ctx.font = "8px monospace";
        ctx.fillStyle = "#a1a1aa";
        ctx.textAlign = "center";
        ctx.fillText("● MODULE_STANDBY // ω < 0.005", cx, size - 19);
        return; // Halt render loop cycles entirely! Conserves CPU/battery.
      }

      // Clear with elegant translucent fade for visual tail blur matching Image designs
      ctx.fillStyle = "rgba(5, 5, 5, 0.2)";
      ctx.fillRect(0, 0, size, size);

      // Dynamic Gamification multipliers
      // Higher readiness score -> faster rotation speed
      const speedMultiplier = 0.3 + (readinessScore / 100) * 1.5;
      
      // Higher study velocity -> more active stars particle density (Max 45)
      const starsToRenderCount = Math.min(stars.current.length, Math.floor(12 + (studyVelocity / 60) * 33));

      // Drag inertia drift updates
      const timeSinceActive = Date.now() - lastInteraction.current;
      if (!isDragging.current) {
        if (timeSinceActive > 8000) {
          // decay velocities towards sleep state
          velocities.current.x *= 0.95;
          velocities.current.y *= 0.95;
        } else {
          velocities.current.x += (0.002 * speedMultiplier - velocities.current.x) * 0.05;
          velocities.current.y += (0.003 * speedMultiplier - velocities.current.y) * 0.05;
        }
        angles.current.x += velocities.current.x;
        angles.current.y += velocities.current.y;
      } else {
        angles.current.x += velocities.current.x;
        angles.current.y += velocities.current.y;
        velocities.current.x *= 0.94;
        velocities.current.y *= 0.94;
      }

      const cosX = Math.cos(angles.current.x);
      const sinX = Math.sin(angles.current.x);
      const cosY = Math.cos(angles.current.y);
      const sinY = Math.sin(angles.current.y);

      // Rotate & Project coordinate pipeline (Orthographic visual projection for classic wireframes)
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Rotate around Y
        const x1 = x3d * cosY - z3d * sinY;
        const z1 = x3d * sinY + z3d * cosY;

        // Rotate around X
        const y2 = y3d * cosX - z1 * sinX;
        const z2 = y3d * sinX + z1 * cosX;

        // Focal factor scale of 3D depth
        const focalLocal = 180;
        const coeff = focalLocal / (focalLocal + z2);

        return {
          x: cx + x1 * coeff,
          y: cy + y2 * coeff,
          z: z2,
          scale: coeff,
        };
      };

      // Simulated shading light coordinate vector (Light source shining from top-left)
      const lightVector = { x: 0.57, y: 0.57, z: -0.57 };

      // Telemetry hover proximity variables
      let hoveredObjectName = "";
      let minHoverDist = 18;

      // Update and drift stars stardust background
      stars.current.slice(0, starsToRenderCount).forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.z += star.vz;
        // Keep inside boundaries
        const rCurrent = Math.sqrt(star.x * star.x + star.y * star.y + star.z * star.z);
        if (rCurrent > 130) {
          star.x *= -0.9;
          star.y *= -0.9;
          star.z *= -0.9;
        }

        const projStar = project(star.x, star.y, star.z);
        const opacity = Math.max(0.1, 0.7 - projStar.z / 120);

        // Render stars as tiny soft sparkles matching references
        ctx.fillStyle = activeMode === "helios" ? `rgba(245, 158, 11, ${opacity * 0.7})` : activeMode === "onyx" ? `rgba(168, 85, 247, ${opacity * 0.7})` : `rgba(224, 172, 67, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(projStar.x, projStar.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ---------------- RENDER 1: COHERENT PLANETARY SPHERE (HELIOS) ----------------
      if (activeMode === "helios") {
        const pts = pointsHelios.current;
        const faces = facesHelios.current;

        // Project sphere vertices
        const projectedPts = pts.map((pt) => project(pt.originalX, pt.originalY, pt.originalZ));

        // Group elements for Painters Depth-Sorting to avoid overlap clipping issues
        interface RenderElement {
          avgZ: number;
          draw: () => void;
        }

        const renderQueue: RenderElement[] = [];

        // Add planar faceted polygon face renderings to Painter queue
        faces.forEach((face) => {
          const p1 = projectedPts[face.indices[0]];
          const p2 = projectedPts[face.indices[1]];
          const p3 = projectedPts[face.indices[2]];

          if (!p1 || !p2 || !p3) return;

          const avgDepth = (p1.z + p2.z + p3.z) / 3;

          // Backface culling: calculate polygon face normal to filter out away-facing surfaces
          const ux = pts[face.indices[1]].originalX - pts[face.indices[0]].originalX;
          const uy = pts[face.indices[1]].originalY - pts[face.indices[0]].originalY;
          const uz = pts[face.indices[1]].originalZ - pts[face.indices[0]].originalZ;

          const vx = pts[face.indices[2]].originalX - pts[face.indices[0]].originalX;
          const vy = pts[face.indices[2]].originalY - pts[face.indices[0]].originalY;
          const vz = pts[face.indices[2]].originalZ - pts[face.indices[0]].originalZ;

          // normal vector cross derivative
          const nx = uy * vz - uz * vy;
          const ny = uz * vx - ux * vz;
          const nz = ux * vy - uy * vx;

          // Normal distance denominator
          const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          const normalRotated = {
            x: nx / len,
            y: ny / len,
            z: nz / len,
          };

          // Light scalar product calculation
          const dot = normalRotated.x * lightVector.x + normalRotated.y * lightVector.y + normalRotated.z * lightVector.z;
          const intensity = Math.max(0.12, (dot + 1) / 2); // map from [0...1] to avoid full shadows

          renderQueue.push({
            avgZ: avgDepth,
            draw: () => {
              // Calculate custom gradient color matching Image 0 (yellow planetary core)
              const hueGlow = Math.floor(224 * intensity);
              const satGlow = Math.floor(172 * intensity);

              ctx.fillStyle = `rgb(${245 * intensity}, ${210 * intensity}, ${50 * intensity})`;
              ctx.strokeStyle = `rgba(253, 224, 71, ${Math.max(0.05, 0.25 - avgDepth / 80)})`;
              ctx.lineWidth = 0.5;

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            },
          });
        });

        // Add split-segment drawing loops for orbit paths to perfectly wrap the spherical core!
        const addOrbitToQueue = (orbit: OrbitRing3D) => {
          for (let i = 0; i < orbit.points.length - 1; i++) {
            const pt1 = orbit.points[i];
            const pt2 = orbit.points[i + 1];

            const proj1 = project(pt1.x, pt1.y, pt1.z);
            const proj2 = project(pt2.x, pt2.y, pt2.z);

            const segZ = (proj1.z + proj2.z) / 2;

            renderQueue.push({
              avgZ: segZ,
              draw: () => {
                ctx.strokeStyle = orbit.color;
                ctx.lineWidth = orbit.lineWidth;
                ctx.beginPath();
                ctx.moveTo(proj1.x, proj1.y);
                ctx.lineTo(proj2.x, proj2.y);
                ctx.stroke();
              },
            });
          }
        };

        addOrbitToQueue(orbitCyanLines.current);
        addOrbitToQueue(orbitYellowLines.current);

        // Add Equator band line passing horizontally straight through the center
        for (let i = -40; i <= 40; i += 4) {
          const pt1 = { x: i, y: 0, z: 0 };
          const pt2 = { x: i + 4, y: 0, z: 0 };
          const proj1 = project(pt1.x, pt1.y, pt1.z);
          const proj2 = project(pt2.x, pt2.y, pt2.z);
          const segZ = (proj1.z + proj2.z) / 2;

          renderQueue.push({
            avgZ: segZ,
            draw: () => {
              // Glowing purple line matching Equator of Planetary image
              ctx.strokeStyle = "rgba(168, 85, 247, 0.85)";
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(proj1.x, proj1.y);
              ctx.lineTo(proj2.x, proj2.y);
              ctx.stroke();
            },
          });
        }

        // Project and sort depth list
        renderQueue.sort((a, b) => b.avgZ - a.avgZ);
        renderQueue.forEach((el) => el.draw());

        // Hover proximity detection on planets
        const distToCenter = Math.sqrt((mousePos.current.x - cx) ** 2 + (mousePos.current.y - cy) ** 2);
        if (distToCenter < 32 + 10) {
          hoveredObjectName = "HELIOS_CORE_STAR";
        }
      }

      // ---------------- RENDER 2: FACETED SLATE POLYHEDRON (ONYX) ----------------
      else if (activeMode === "onyx") {
        const pts = pointsOnyx.current;
        const faces = facesOnyx.current;

        const projectedPts = pts.map((pt) => project(pt.originalX, pt.originalY, pt.originalZ));

        interface RenderElement {
          avgZ: number;
          draw: () => void;
        }

        const renderQueue: RenderElement[] = [];

        // Project facet shapes onto Painter pipeline
        faces.forEach((face) => {
          const p1 = projectedPts[face.indices[0]];
          const p2 = projectedPts[face.indices[1]];
          const p3 = projectedPts[face.indices[2]];

          if (!p1 || !p2 || !p3) return;

          const avgDepth = (p1.z + p2.z + p3.z) / 3;

          // Shading index calculations using regular normal geometry indices
          const ux = pts[face.indices[1]].originalX - pts[face.indices[0]].originalX;
          const uy = pts[face.indices[1]].originalY - pts[face.indices[0]].originalY;
          const uz = pts[face.indices[1]].originalZ - pts[face.indices[0]].originalZ;

          const vx = pts[face.indices[2]].originalX - pts[face.indices[0]].originalX;
          const vy = pts[face.indices[2]].originalY - pts[face.indices[0]].originalY;
          const vz = pts[face.indices[2]].originalZ - pts[face.indices[0]].originalZ;

          const nx = uy * vz - uz * vy;
          const ny = uz * vx - ux * vz;
          const nz = ux * vy - uy * vx;

          const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          const normalRotated = { x: nx / len, y: ny / len, z: nz / len };

          const dot = normalRotated.x * lightVector.x + normalRotated.y * lightVector.y + normalRotated.z * lightVector.z;
          const illuminationIntensity = Math.max(0.08, (dot + 1) / 2);

          renderQueue.push({
            avgZ: avgDepth,
            draw: () => {
              // Deep Onyx Charcoal flat faces matching Image 1
              const baseGlow = Math.floor(25 * illuminationIntensity);
              ctx.fillStyle = `rgba(${18 + baseGlow}, ${20 + baseGlow}, ${28 + baseGlow}, 0.88)`;

              // Golden borders matching edges of Onyx polyhedron Image 1
              ctx.strokeStyle = `rgba(224, 172, 67, ${Math.max(0.2, 0.8 - avgDepth / 100)})`;
              ctx.lineWidth = avgDepth > 0 ? 0.8 : 1.5;

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            },
          });
        });

        // Add 3D vertex points as floating bright violet orbs (Image 1 style)
        pts.forEach((pt, idx) => {
          const proj = projectedPts[idx];
          const radiusVal = Math.max(2.5, 5 * proj.scale);

          renderQueue.push({
            avgZ: proj.z - 2, // slightly bias forwards to float overlay
            draw: () => {
              // Check proximity interaction of coordinate selector pointer
              const dx = mousePos.current.x - proj.x;
              const dy = mousePos.current.y - proj.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              const glowState = dist < minHoverDist;
              if (glowState && dist < minHoverDist) {
                minHoverDist = dist;
                hoveredObjectName = `ONYX_NODE_0${idx}`;
              }

              // Bright violet glow matching Image indicator vertices
              const fillNodeColor = glowState ? "#ffffff" : "#a855f7";
              ctx.fillStyle = fillNodeColor;

              ctx.shadowColor = "#a855f7";
              ctx.shadowBlur = glowState ? 12 : 5;

              ctx.beginPath();
              ctx.arc(proj.x, proj.y, glowState ? radiusVal * 1.5 : radiusVal, 0, Math.PI * 2);
              ctx.fill();

              ctx.shadowBlur = 0; // reset
            },
          });
        });

        // Sort Painter coordinates queue
        renderQueue.sort((a, b) => b.avgZ - a.avgZ);
        renderQueue.forEach((el) => el.draw());
      }

      // ---------------- RENDER 3: ORIGINAL GEODESIC NODE COMPLEX (MANIFOLD) ----------------
      else {
        const pts = pointsManifold.current;
        const edges = edgesManifold.current;

        const projectedPts = pts.map((pt, idx) => {
          const proj = project(pt.originalX, pt.originalY, pt.originalZ);

          const dx = mousePos.current.x - proj.x;
          const dy = mousePos.current.y - proj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const isGlowing = dist < minHoverDist;
          if (isGlowing && dist < minHoverDist) {
            minHoverDist = dist;
            hoveredObjectName = pt.label || `VAL_NODE_0${idx}`;
          }

          return { ...proj, ptLabel: pt.label, isGlowing };
        });

        // Draw classic wireframe connect lines
        edges.forEach(([i, j]) => {
          const p1 = projectedPts[i];
          const p2 = projectedPts[j];
          if (!p1 || !p2) return;

          const avgDepth = (p1.z + p2.z) / 2;
          const opacity = Math.max(0.08, 0.45 - avgDepth / 120);

          ctx.strokeStyle =
            p1.isGlowing || p2.isGlowing
              ? "rgba(224, 172, 67, 0.6)"
              : `rgba(99, 102, 241, ${opacity})`;

          ctx.lineWidth = avgDepth > 0 ? 0.7 : 1.3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw math coordinates points
        projectedPts.forEach((pt) => {
          const r = pt.isGlowing ? 6.5 : Math.max(1.5, 3.5 * pt.scale);

          // Radial visual shading
          const radGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
          radGrad.addColorStop(0, pt.isGlowing ? "#ffffff" : pt.z > 0 ? "#6366f1" : "#e0ac43");
          radGrad.addColorStop(1, pt.isGlowing ? "#e0ac43" : "rgba(15, 15, 20, 0.25)");

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fill();

          // Render alphanumeric math formulas floating coordinates
          if (pt.ptLabel && pt.z < 25) {
            ctx.fillStyle = pt.isGlowing ? "#ffffff" : "rgba(163, 163, 163, 0.8)";
            ctx.font = pt.isGlowing ? "bold 10px monospace" : "9px monospace";
            ctx.fillText(pt.ptLabel, pt.x + 8, pt.y - 3);
          }
        });
      }

      // Outer safety boundary rings
      ctx.strokeStyle = "rgba(224, 172, 67, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 8, 0, Math.PI * 2);
      ctx.stroke();

      // Reflect hovered text trigger feedback
      if (hoveredObjectName && hoveredObjectName !== telemetryTag) {
        setTelemetryTag(hoveredObjectName);
      } else if (!hoveredObjectName && telemetryTag !== "STABLE_IDLE") {
        setTelemetryTag("STABLE_IDLE");
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [size, activeMode, telemetryTag, isAsleep, isElementVisible, isTabVisible]);

  // Wake on mode change or dynamic inputs
  useEffect(() => {
    wakeUp();
  }, [activeMode, size, readinessScore, studyVelocity]);

  // Drag interaction handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    wakeUp();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragOffset.current = { x: angles.current.y, y: angles.current.x };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    wakeUp();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (!isDragging.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const damping = 0.007;
    angles.current.y = dragOffset.current.x + dx * damping;
    angles.current.x = dragOffset.current.y + dy * damping;

    velocities.current.y = dx * 0.001;
    velocities.current.x = dy * 0.001;
  };

  const handleMouseLeaveOrUp = () => {
    wakeUp();
    isDragging.current = false;
    mousePos.current = { x: -1000, y: -1000 };
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none">
      
      {/* 3D Console Segment Selector (Mode swappers toggling the images seamlessly) */}
      <div className="flex gap-1.5 p-1 bg-neutral-950/80 border border-neutral-800 rounded-lg text-[9px] font-mono mb-4 w-full justify-between shadow-lg relative z-25">
        <button
          onClick={() => setActiveMode("helios")}
          className={`flex-1 py-1 px-1.5 rounded transition-all cursor-pointer ${
            activeMode === "helios"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Faceted Star sphere with cyan/yellow trails"
        >
          ● HELIOS ORB
        </button>
        <button
          onClick={() => setActiveMode("onyx")}
          className={`flex-1 py-1 px-1.5 rounded transition-all cursor-pointer ${
            activeMode === "onyx"
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Charcoal faceted polyhedron with gold borders and purple vertices"
        >
          ◆ ONYX PRISM
        </button>
        <button
          onClick={() => setActiveMode("manifold")}
          className={`flex-1 py-1 px-1.5 rounded transition-all cursor-pointer ${
            activeMode === "manifold"
              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Geodesic node vectors math matrix"
        >
          ▲ MANIFOLD
        </button>
      </div>

      {/* Main 3D Interactive Canvas */}
      <div className="relative cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseLeave={handleMouseLeaveOrUp}
          style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
          className="rounded-full shadow-2xl transition-all duration-300 hover:scale-[1.01]"
        />

        {/* Floating Telemetry Coordinates Indicator readout underneath */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-neutral-950/95 border border-neutral-900 px-3 py-0.5 rounded text-[8px] font-mono tracking-widest text-neutral-400 shadow-md flex items-center gap-1 whitespace-nowrap">
          <span className={`w-1 h-1 rounded-full animate-ping ${activeMode === "helios" ? "bg-amber-400" : activeMode === "onyx" ? "bg-purple-400" : "bg-indigo-400"}`} />
          <span>CORD:</span>
          <span className={activeMode === "helios" ? "text-amber-400" : activeMode === "onyx" ? "text-purple-400" : "text-indigo-400"}>
            {telemetryTag}
          </span>
        </div>
      </div>
    </div>
  );
};
