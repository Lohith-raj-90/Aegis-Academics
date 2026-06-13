import React, { useRef, useState } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  id?: string;
}

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.015,
  id
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = containerRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const normX = (localX / rect.width) * 2 - 1;
    const normY = (localY / rect.height) * 2 - 1;

    const rotateX = -(normY * maxTilt).toFixed(2);
    const rotateY = (normX * maxTilt).toFixed(2);

    setTransformStyle(`
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(${scale}, ${scale}, ${scale})
    `);

    setGlowPos({
      x: (localX / rect.width) * 100,
      y: (localY / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      id={id}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out preserve-3d ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered ? "transform 0.05s ease-out, shadow 0.2s" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        boxShadow: isHovered 
          ? "0 10px 30px rgba(0,0,0,0.4), inset 0 0 1px rgba(224,172,67,0.15)" 
          : "0 4px 15px rgba(0,0,0,0.15), inset 0 0 1px rgba(255,255,255,0.03)"
      }}
    >
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
          style={{
            zIndex: 0,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(224,172,67,0.04) 0%, transparent 60%)`
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
