"use client";

import { useEffect, useRef, useState } from "react";
import { colord, extend } from "colord";
import harmonies from "colord/plugins/harmonies";

extend([harmonies]);

interface ColorWheelProps {
  baseColor: string;
  onChange?: (color: string) => void;
  size?: number;
}

export function ColorWheel({
  baseColor,
  onChange,
  size = 300,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const radius = size / 2 - 20;

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 0.5) * (Math.PI / 180);
      const endAngle = (angle + 1.5) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        radius,
      );
      gradient.addColorStop(0, "white");
      gradient.addColorStop(0.2, "white"); // More white in center

      // We use HSL to draw the wheel
      // Saturation 100%, Lightness 50% usually for the rim
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [size]);

  const handleInteraction = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
      | MouseEvent
      | TouchEvent,
  ) => {
    if (!onChange) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    // Calculate angle (Hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    // Calculate distance (Saturation)
    const dist = Math.sqrt(x * x + y * y);
    const maxRadius = size / 2 - 20;

    // Clamp saturation between 0 and 100
    const saturation = Math.min(100, Math.max(0, (dist / maxRadius) * 100));

    // For better UX, we'll keep Lightness at 50% for the wheel picker
    // unless we want a separate slider for Lightness (which is common)
    // The current color state might have a different lightness, but the wheel
    // interaction essentially picks Hue and Saturation.
    // Preserving the current Lightness might be better?
    // Let's use 50% for standard "pure" colors from wheel, user can adjust L elsewhere if we had a slider.
    // Or we can try to preserve the lightness of the previous color?
    // Let's stick to 50% as it's a "picker". Or maybe 50% is standard.

    // Actually, `white` at center implies L=100.
    // The gradient goes from L=100 (center) to L=50 (edge) at S=100?
    // No, standard wheel is usually H/S.
    // Center is usually 0 saturation (grey/white depending on L).
    // Our gradient goes from White to Color.
    // White is L=100. Color at edge (HSL(h, 100, 50)) is L=50.
    // So as we move out, Saturation increases, but Lightness decreases?
    // Or is it just Saturation?
    // If center is White, that's L=100, S=0.
    // Edge is L=50, S=100.

    // A standard HSL wheel usually fixes L (e.g. 50%) and varies S from 0 (center, gray) to 100 (edge).
    // But our gradient starts at WHITE. White is L=100.
    // So if we pick center, we get White.
    // If we pick edge, we get Vivid Color.

    // Let's try to map it so it feels natural.
    // Saturation = dist %
    // Lightness: Center=100, Edge=50.
    // L = 100 - (saturation / 2)
    const lightness = 100 - saturation / 2;

    const newColor = colord({ h: angle, s: saturation, l: lightness }).toHex();
    onChange(newColor);
  };

  // Convert baseColor to HSL to position marker
  // We need to inverse the mapping to find position from color
  const hsl = colord(baseColor).toHsl();

  // Angle is Hue
  const markerAngleRad = hsl.h * (Math.PI / 180);

  // Radius calculation depends on our mapping above.
  // We used: L = 100 - S/2
  // We also know S matches distance.
  // Let's just rely on Saturation for distance for now as it's more stable for re-mapping
  // even if the color wasn't picked from the wheel exactly.
  const maxRadius = size / 2 - 20;
  const markerRadius = (hsl.s / 100) * maxRadius;

  const markerX = size / 2 + markerRadius * Math.cos(markerAngleRad);
  const markerY = size / 2 + markerRadius * Math.sin(markerAngleRad);

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className="rounded-full cursor-crosshair shadow-2xl"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleInteraction(e);
        }}
        onMouseMove={(e) => {
          if (isDragging) handleInteraction(e);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleInteraction(e);
        }}
        onTouchMove={(e) => {
          if (isDragging) handleInteraction(e);
        }}
        onTouchEnd={() => setIsDragging(false)}
      />
      {/* Active Color Marker */}
      <div
        className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none transition-transform duration-75"
        style={{
          left: markerX,
          top: markerY,
          transform: "translate(-50%, -50%)",
          backgroundColor: baseColor,
        }}
      />
    </div>
  );
}
