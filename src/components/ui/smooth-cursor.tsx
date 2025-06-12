
"use client";

import React, { useEffect, useRef, useState } from "react";

interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
  restDelta: number;
}

interface SmoothCursorProps {
  cursor?: React.JSX.Element;
  springConfig?: Partial<SpringConfig>;
}

const defaultSpringConfig: SpringConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

const DefaultCursorSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none"
  >
    <path
      d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
      fill="white"
      stroke="black"
      strokeWidth="1"
    />
  </svg>
);

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {},
}: SmoothCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Spring animation state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  const config = { ...defaultSpringConfig, ...springConfig };

  // Spring animation function
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = Math.min((time - previousTimeRef.current) / 1000, 0.1); // Cap at 100ms
      
      // Spring physics
      const dx = targetPosition.x - position.x;
      const dy = targetPosition.y - position.y;
      
      const ax = (config.stiffness * dx - config.damping * velocity.x) / config.mass;
      const ay = (config.stiffness * dy - config.damping * velocity.y) / config.mass;
      
      const newVelocity = {
        x: velocity.x + ax * deltaTime,
        y: velocity.y + ay * deltaTime,
      };
      
      const newPosition = {
        x: position.x + newVelocity.x * deltaTime,
        y: position.y + newVelocity.y * deltaTime,
      };
      
      setVelocity(newVelocity);
      setPosition(newPosition);
      
      // Update cursor position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${newPosition.x}px, ${newPosition.y}px, 0)`;
      }
      
      // Continue animation if not at rest
      const isAtRest = 
        Math.abs(dx) < config.restDelta && 
        Math.abs(dy) < config.restDelta &&
        Math.abs(newVelocity.x) < config.restDelta && 
        Math.abs(newVelocity.y) < config.restDelta;
      
      if (!isAtRest) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
    
    previousTimeRef.current = time;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      
      // Start animation if not already running
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    // Hide default cursor
    document.body.style.cursor = "none";
    
    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Restore default cursor
      document.body.style.cursor = "auto";
      
      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      
      // Cancel animation
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [config, position, velocity, targetPosition]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-200"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      {cursor}
    </div>
  );
}
