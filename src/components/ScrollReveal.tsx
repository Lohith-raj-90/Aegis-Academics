import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  rotateX?: number;
  rotateY?: number;
  scale?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  rotateX = 0,
  rotateY = 0,
  scale = 0.95,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rotateXVal = useTransform(scrollYProgress, [0, 1], [rotateX, 0]);
  const rotateYVal = useTransform(scrollYProgress, [0, 1], [rotateY, 0]);
  const scaleVal = useTransform(scrollYProgress, [0, 1], [scale, 1]);

  let translateX = 0;
  let translateY = 0;
  if (direction === "up") translateY = 60;
  if (direction === "down") translateY = -60;
  if (direction === "left") translateX = 60;
  if (direction === "right") translateX = -60;

  const translateXVal = useTransform(scrollYProgress, [0, 1], [translateX, 0]);
  const translateYVal = useTransform(scrollYProgress, [0, 1], [translateY, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        rotateX: rotateXVal,
        rotateY: rotateYVal,
        scale: scaleVal,
        translateX: translateXVal,
        translateY: translateYVal,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      transition={{ delay, duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = "",
  speed = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);

  return (
    <motion.div ref={ref} className={`relative ${className}`} style={{ y }}>
      {children}
    </motion.div>
  );
};

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  as: Tag = "h2",
}) => {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0.1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: i * 0.02 }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};
