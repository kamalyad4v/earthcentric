"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Function to render a high-fidelity flat world map to a hidden canvas
const drawWorldMap = () => {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Clear to white (representing water)
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 360, 180);

  // Draw land in black
  ctx.fillStyle = "black";

  const mapLonLat = (lon: number, lat: number) => {
    return [lon + 180, 90 - lat];
  };

  const drawPolygon = (coords: number[][]) => {
    ctx.beginPath();
    coords.forEach((c, idx) => {
      const [x, y] = mapLonLat(c[0], c[1]);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  // High-fidelity polygon coordinates for Earth's continents
  const landmasses = [
    // North America
    [[-168, 65], [-150, 70], [-120, 75], [-80, 75], [-60, 60], [-55, 48], [-80, 25], [-99, 15], [-105, 20], [-110, 30], [-125, 48], [-125, 60]],
    // South America
    [[-80, 12], [-72, 10], [-50, -5], [-35, -6], [-40, -20], [-60, -45], [-72, -55], [-75, -45], [-80, -10], [-82, 0]],
    // Africa
    [[-17, 15], [-5, 35], [10, 35], [30, 31], [32, 25], [50, 12], [45, 0], [40, -15], [30, -34], [18, -34], [10, -10], [8, 5]],
    // Europe & Asia (Eurasia)
    [[-10, 36], [0, 45], [10, 40], [15, 60], [30, 70], [60, 75], [100, 75], [130, 75], [170, 70], [180, 60], [140, 50], [142, 35], [130, 30], [120, 25], [110, 15], [98, 10], [90, 22], [73, 8], [60, 25], [48, 15], [44, 25], [35, 30], [27, 40]],
    // India & SE Asia
    [[68, 24], [72, 10], [80, 6], [90, 22], [97, 8], [105, 10], [108, 1], [100, 6], [85, 20]],
    // Australia
    [[113, -22], [130, -12], [136, -12], [143, -20], [153, -28], [150, -35], [140, -38], [115, -35]],
    // Greenland
    [[-70, 60], [-60, 75], [-40, 83], [-20, 75], [-30, 60]],
    // Antarctica
    [[-180, -75], [180, -75], [180, -90], [-180, -90]],
    // Madagascar
    [[43, -12], [50, -15], [47, -25], [43, -25]],
    // Japan
    [[130, 30], [135, 35], [142, 40], [140, 45], [135, 38]],
    // New Zealand
    [[166, -45], [178, -37], [172, -47]],
    // Iceland
    [[-24, 63], [-18, 66], [-13, 65], [-22, 63]],
    // United Kingdom & Ireland
    [[-8, 50], [-2, 50], [-2, 58], [-6, 58]]
  ];

  landmasses.forEach(drawPolygon);

  return ctx.getImageData(0, 0, 360, 180);
};

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Rotation states
  const rotationX = useRef(0.2);
  const rotationY = useRef(0);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Generate 3D points representing the landmasses
  const points = useMemo(() => {
    const radius = 175;
    const generated: Point3D[] = [];
    
    const imgData = drawWorldMap();
    if (!imgData) return [];

    const { data } = imgData;

    const latSteps = 100;
    const lonSteps = 200;

    for (let lat = 0; lat < latSteps; lat++) {
      const theta = (lat / latSteps) * Math.PI;
      const y = -radius * Math.cos(theta);
      const rSphere = radius * Math.sin(theta);

      // Scale longitude steps by circumference to maintain uniform point density
      const lonCount = Math.round(lonSteps * Math.sin(theta));
      if (lonCount === 0) continue;

      for (let lon = 0; lon < lonCount; lon++) {
        const phi = (lon / lonCount) * 2 * Math.PI;

        // Map angles back to flat map indices
        const xImg = Math.floor((phi / (2 * Math.PI)) * 360) % 360;
        const yImg = Math.floor((theta / Math.PI) * 180) % 180;

        const pixelIdx = (yImg * 360 + xImg) * 4;
        const isLand = data[pixelIdx] < 128; // Black pixels are land

        if (isLand) {
          // Add minor jitter for natural, non-aliased looking shorelines
          const jitterRadius = radius + (Math.random() - 0.5) * 1.5;
          const x = jitterRadius * Math.sin(theta) * Math.cos(phi);
          const z = jitterRadius * Math.sin(theta) * Math.sin(phi);
          
          generated.push({ x, y, z });
        }
      }
    }
    return generated;
  }, []);

  // Drag interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    
    rotationY.current += deltaX * 0.004;
    rotationX.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationX.current + deltaY * 0.004));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      if (!isDragging.current) {
        rotationY.current += 0.0018; // Auto-rotate
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = 175;

      ctx.clearRect(0, 0, width, height);

      // Check if light or dark theme is active
      const isDark = document.documentElement.classList.contains("dark");

      // 1. Draw Outer Atmospheric Aura Glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
      glow.addColorStop(0, isDark ? "rgba(163, 177, 138, 0.2)" : "rgba(163, 177, 138, 0.25)");
      glow.addColorStop(0.6, isDark ? "rgba(79, 110, 138, 0.08)" : "rgba(110, 160, 180, 0.12)");
      glow.addColorStop(1, "rgba(163, 177, 138, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, 2 * Math.PI);
      ctx.fill();

      // Cosine/Sine values
      const cosX = Math.cos(rotationX.current);
      const sinX = Math.sin(rotationX.current);
      const cosY = Math.cos(rotationY.current);
      const sinY = Math.sin(rotationY.current);

      // Project all points and split into back vs front lists based on Z coordinate
      const projected = points.map((p) => {
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const distance = 450;
        const scale = distance / (distance + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { x: px, y: py, z: z2, scale };
      });

      const backPoints = projected.filter((p) => p.z > 0).sort((a, b) => b.z - a.z);
      const frontPoints = projected.filter((p) => p.z <= 0).sort((a, b) => b.z - a.z);

      // 2. Draw Back-Side Landmass Dots (faint/blended)
      backPoints.forEach((p) => {
        const depth = (p.z + radius) / (2 * radius); // 0.5 to 1
        const opacity = Math.max(0.05, 0.35 - depth * 0.3);
        ctx.fillStyle = isDark
          ? `rgba(163, 177, 138, ${opacity})`
          : `rgba(90, 110, 95, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.scale * 1.2, 0, 2 * Math.PI);
        ctx.fill();
      });

      // 3. Draw 3D Ocean Sphere (covers back dots, sits beneath front dots)
      const ocean = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
      if (isDark) {
        ocean.addColorStop(0, "rgba(22, 34, 46, 0.95)"); // Deep ocean blue
        ocean.addColorStop(0.85, "rgba(18, 28, 38, 0.9)");
        ocean.addColorStop(1, "rgba(163, 177, 138, 0.15)"); // Blends into atmosphere
      } else {
        ocean.addColorStop(0, "rgba(215, 230, 240, 0.92)"); // Premium ice blue ocean
        ocean.addColorStop(0.85, "rgba(195, 218, 230, 0.9)");
        ocean.addColorStop(1, "rgba(163, 177, 138, 0.2)");
      }
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fill();

      // 4. Draw Rotating Coordinate Grid Lines (Front Side)
      ctx.strokeStyle = isDark
        ? "rgba(163, 177, 138, 0.08)"
        : "rgba(31, 58, 46, 0.05)";
      ctx.lineWidth = 1;

      // Latitude lines
      for (let lat = -4; lat <= 4; lat++) {
        const h = radius * (lat / 5);
        const r = Math.sqrt(radius * radius - h * h);
        
        ctx.beginPath();
        let activePath = false;
        for (let i = 0; i <= 60; i++) {
          const phi = (i / 60) * 2 * Math.PI;
          const x = r * Math.cos(phi);
          const z = r * Math.sin(phi);

          const x1 = x * cosY - z * sinY;
          const z1 = z * cosY + x * sinY;
          const y2 = h * cosX - z1 * sinX;
          const z2 = z1 * cosX + h * sinX;

          if (z2 <= 0) { // Only front coordinates
            const scale = 450 / (450 + z2);
            const px = cx + x1 * scale;
            const py = cy + y2 * scale;
            if (!activePath) {
              ctx.moveTo(px, py);
              activePath = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            activePath = false;
          }
        }
        ctx.stroke();
      }

      // 5. Draw Front-Side Landmass Dots (crisp, layered, glowing)
      frontPoints.forEach((p) => {
        // depth ranges from 0 (closest to viewer) to 0.5 (equator edges)
        const depth = (p.z + radius) / (2 * radius);
        const intensity = 1 - (depth * 2); // 1 to 0
        const opacity = 0.4 + intensity * 0.6;
        const size = Math.max(1.2, p.scale * (2.0 + intensity * 0.8));

        // Use standard earth green tones
        ctx.fillStyle = `rgba(163, 177, 138, ${opacity})`; // Sage Green
        if (intensity > 0.45) {
          ctx.fillStyle = `rgba(31, 58, 46, ${opacity})`; // Deep Forest Green highlight
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, 2 * Math.PI);
        ctx.fill();
      });

      // 6. Atmosphere Rim Highlight
      ctx.strokeStyle = isDark
        ? "rgba(163, 177, 138, 0.2)"
        : "rgba(163, 177, 138, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [points]);

  return (
    <div className="relative cursor-grab active:cursor-grabbing select-none w-[500px] h-[500px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full max-w-[500px] max-h-[500px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      />
    </div>
  );
}
