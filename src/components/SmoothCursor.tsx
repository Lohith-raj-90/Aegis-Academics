import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export const SmoothCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseMoved = useRef(false);

  useEffect(() => {
    // Hidden on touchscreen/mobile devices for better ergonomics
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    // Track mouse coordinate inputs
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      mouseMoved.current = true;
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);

      // Spawn rapid explosion of click stardust particles
      const colors = ["#e0ac43", "#6366f1", "#f59e0b", "#c084fc", "#38bdf8"];
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          id: Math.random() + Date.now(),
          x: lastMousePos.current.x,
          y: lastMousePos.current.y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 2,
        });
      }
    };

    // Listen to hovering state over buttons, links, clickable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "BUTTON" ||
        target?.tagName === "A" ||
        target?.closest("button") ||
        target?.closest("a") ||
        target?.classList.contains("cursor-pointer") ||
        target?.closest(".cursor-pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Smooth trail spring interpolation loop + Particle drawer
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    let trailX = 0;
    let trailY = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fluid resize of canvas overlay
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const updatePhysics = () => {
      const targetX = lastMousePos.current.x;
      const targetY = lastMousePos.current.y;

      // Spring-like smooth inertia interpolation
      trailX += (targetX - trailX) * 0.15;
      trailY += (targetY - trailY) * 0.15;
      setTrail({ x: trailX, y: trailY });

      // Generate spark particles when pointer is moving
      if (mouseMoved.current && Math.random() < 0.4) {
        const colors = ["#e0ac43", "#6366f1", "#fcd34d", "#c084fc"];
        particlesRef.current.push({
          id: Math.random() + Date.now(),
          x: trailX + (Math.random() - 0.5) * 8,
          y: trailY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 1,
        });
      }
      mouseMoved.current = false;

      // Clear Canvas smoothly
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & cycle sparkles stardust list
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // soft gravity pulling down
        p.alpha -= 0.015; // slow dissolve

        if (p.alpha <= 0) return false;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        return true;
      });

      animationFrameId.current = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) return null;

  return (
    <>
      {/* Background canvas for particle generation stardust trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-screen opacity-90"
      />

      {/* Primary inner coordinate ring */}
      <div
        className="fixed rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? "14px" : "6px",
          height: isHovered ? "14px" : "6px",
          backgroundColor: isHovered ? "white" : "#e0ac43",
          boxShadow: "0 0 10px rgba(224,172,67,0.5)",
          mixBlendMode: "difference",
        }}
      />

      {/* Floating secondary orbit circle */}
      <div
        className="fixed rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: isHovered ? "36px" : "24px",
          height: isHovered ? "36px" : "24px",
          border: isHovered ? "1.5px solid #6366f1" : "1.2px solid #e0ac43",
          boxShadow: isHovered
            ? "0 0 12px rgba(99,102,241,0.25)"
            : "0 0 6px rgba(224,172,67,0.12)",
          transform: `translate(-50%, -50%) scale(${clicked ? 0.75 : 1})`,
          transition: "transform 0.12s ease-out, border 0.25s, width 0.2s, height 0.2s",
        }}
      />
    </>
  );
};
