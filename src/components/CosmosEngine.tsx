/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { CelestialBody } from "../types";

interface CosmosEngineProps {
  celestialBodies: CelestialBody[];
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody) => void;
  warpActive: boolean;
  onWarpComplete: () => void;
  graphicsSettings: {
    bloom: boolean;
    orbits: boolean;
    spaceDust: boolean;
    highRes: boolean;
  };
  navigationMode: 'orbit' | 'fly';
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  pulse: number;
}

export default function CosmosEngine({
  celestialBodies,
  selectedBody,
  onSelectBody,
  warpActive,
  onWarpComplete,
  graphicsSettings,
  navigationMode
}: CosmosEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Camera Angles and States
  const [yaw, setYaw] = useState<number>(0.5);   // Horizontal rotation
  const [pitch, setPitch] = useState<number>(0.6); // Vertical rotation
  const [zoom, setZoom] = useState<number>(1.2);   // Camera zoom factor

  // Target values for smooth interpolation
  const yawTarget = useRef<number>(0.5);
  const pitchTarget = useRef<number>(0.6);
  const zoomTarget = useRef<number>(1.2);

  // Drag states
  const isDragging = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  // Time simulation
  const time = useRef<number>(0);

  // Procedural universe arrays (generated once)
  const galaxyStars = useRef<StarParticle[]>([]);
  const nebulaClouds = useRef<NebulaCloud[]>([]);
  const shootingStars = useRef<{x: number, y: number, length: number, speed: number, alpha: number}[]>([]);

  // Sound effects fallback using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'warp' | 'click' | 'scan') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'scan') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.25);
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'warp') {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc2.type = 'square';
        
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 2.0);
        
        osc2.frequency.setValueAtTime(120, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 2.0);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 2.2);
        osc2.stop(ctx.currentTime + 2.2);
      }
    } catch (e) {
      // Ignore audio errors if blocked by browser
    }
  };

  // Warp transition effect trigger
  useEffect(() => {
    if (warpActive) {
      playSound('warp');
      // Set camera zoom and angles to accelerate forward
      zoomTarget.current = 4.5;
      pitchTarget.current = 0.2;
      yawTarget.current += Math.PI * 1.5;
      
      const timer = setTimeout(() => {
        zoomTarget.current = 1.6;
        if (selectedBody) {
          // Adjust target camera to focus directly on selected body
          if (selectedBody.id === "sun") {
            zoomTarget.current = 2.0;
          } else {
            zoomTarget.current = 2.2;
          }
        }
        onWarpComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [warpActive]);

  // Handle selected body changing
  useEffect(() => {
    if (selectedBody && !warpActive) {
      // Calculate coordinate direction to focus on planet
      if (selectedBody.orbitRadius === 0) {
        zoomTarget.current = 1.8;
      } else {
        zoomTarget.current = 2.2;
      }
      playSound('scan');
    }
  }, [selectedBody]);

  // Generate Universe particles on mount
  useEffect(() => {
    // Generate star system background and galaxies
    const stars: StarParticle[] = [];
    const galaxyArms = 2;
    const starsPerArm = 2000;
    const galaxyMaxRadius = 600;

    // 1. Double Spiral Galaxy stars centered at Sag A* Black Hole
    for (let arm = 0; arm < galaxyArms; arm++) {
      for (let i = 0; i < starsPerArm; i++) {
        const ratio = i / starsPerArm;
        const dist = 50 + ratio * galaxyMaxRadius + (Math.random() - 0.5) * 40;
        const armAngle = arm * Math.PI;
        const angle = armAngle + ratio * Math.PI * 2.8 + (Math.random() - 0.5) * 0.45;
        
        const x = dist * Math.cos(angle);
        const z = dist * Math.sin(angle);
        const y = (Math.random() - 0.5) * 35 * (1.0 - ratio); // Flattened disc

        const colorVal = Math.random();
        let color = "#ffffff";
        if (colorVal < 0.2) color = "#ffcccc"; // Warm stars
        else if (colorVal < 0.55) color = "#ccccff"; // Hot blue stars
        else if (colorVal < 0.7) color = "#ff99ff"; // Nebulous pink
        else if (colorVal < 0.8) color = "#ccffff"; // Soft cyan

        stars.push({
          x, y, z,
          color,
          size: 0.4 + Math.random() * 0.9,
          twinkle: Math.random(),
          twinkleSpeed: 0.01 + Math.random() * 0.03
        });
      }
    }

    // 2. Add extra deep field halo stars
    for (let i = 0; i < 800; i++) {
      const radius = 600 + Math.random() * 800;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      stars.push({
        x, y, z,
        color: Math.random() > 0.5 ? "#ffffff" : "#a5f3fc",
        size: 0.5 + Math.random() * 1.2,
        twinkle: Math.random(),
        twinkleSpeed: 0.005 + Math.random() * 0.01
      });
    }

    galaxyStars.current = stars;

    // 3. Generate Nebular volumetric clouds
    const nebulas: NebulaCloud[] = [];
    const colors = ["rgba(255, 51, 102, 0.08)", "rgba(170, 0, 255, 0.07)", "rgba(0, 255, 255, 0.06)", "rgba(245, 159, 0, 0.05)"];
    for (let i = 0; i < 24; i++) {
      const dist = 100 + Math.random() * 400;
      const angle = Math.random() * Math.PI * 2;
      nebulas.push({
        x: dist * Math.cos(angle),
        y: (Math.random() - 0.5) * 60,
        z: dist * Math.sin(angle),
        color: colors[i % colors.length],
        size: 150 + Math.random() * 200,
        pulse: Math.random() * Math.PI
      });
    }
    nebulaClouds.current = nebulas;

    // Trigger initial rotation
    yawTarget.current = 0.5;
    pitchTarget.current = 0.6;
  }, []);

  // Frame Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * (graphicsSettings.highRes ? 1.5 : 1.0);
        canvas.height = parent.clientHeight * (graphicsSettings.highRes ? 1.5 : 1.0);
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Incremental animations
      time.current += warpActive ? 0.08 : 0.005;

      // Smooth camera interpolation
      setYaw(prev => prev + (yawTarget.current - prev) * 0.08);
      setPitch(prev => prev + (pitchTarget.current - prev) * 0.08);
      setZoom(prev => prev + (zoomTarget.current - prev) * 0.06);

      // Clear with soft space gradient background
      ctx.fillStyle = "#020205";
      ctx.fillRect(0, 0, w, h);

      // Draw subtle space grid background for Sci-Fi OS feeling
      if (graphicsSettings.orbits && !warpActive) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.015)";
        ctx.lineWidth = 1;
        const gridSize = 100 * zoom;
        for (let x = (time.current * 10) % gridSize; x < w; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = (time.current * 10) % gridSize; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Generate random shooting stars
      if (Math.random() < 0.015 && shootingStars.current.length < 5 && !warpActive) {
        shootingStars.current.push({
          x: Math.random() * w,
          y: Math.random() * (h / 2),
          length: 40 + Math.random() * 80,
          speed: 12 + Math.random() * 15,
          alpha: 1.0
        });
      }

      // Draw shooting stars
      ctx.lineWidth = 1.5;
      shootingStars.current.forEach((st, idx) => {
        st.x += st.speed;
        st.y += st.speed * 0.5;
        st.alpha -= 0.03;
        
        ctx.strokeStyle = `rgba(0, 255, 255, ${st.alpha})`;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.length, st.y - st.length * 0.5);
        ctx.stroke();

        if (st.alpha <= 0 || st.x > w || st.y > h) {
          shootingStars.current.splice(idx, 1);
        }
      });

      // Projection equations
      // Rotations around Pitch (x-axis) and Yaw (y-axis)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const project3D = (x: number, y: number, z: number) => {
        // Orbit rotation
        let rx = x * cosY - z * sinY;
        let rz = x * sinY + z * cosY;
        let ry = y;

        // Pitch rotation
        const finalY = ry * cosP - rz * sinP;
        const finalZ = ry * sinP + rz * cosP;

        // Scale by Zoom and Perspective depth
        const perspective = 700 / (700 + finalZ);
        const scale = zoom * perspective;

        return {
          px: cx + rx * scale,
          py: cy + finalY * scale,
          depth: finalZ,
          visible: finalZ > -650,
          scale
        };
      };

      // Draw Volumetric Nebula Clouds behind star fields
      if (graphicsSettings.spaceDust) {
        ctx.globalCompositeOperation = "screen";
        nebulaClouds.current.forEach(cloud => {
          cloud.pulse += 0.002;
          const proj = project3D(cloud.x, cloud.y, cloud.z);
          if (proj.visible) {
            const size = cloud.size * proj.scale * (1.0 + Math.sin(cloud.pulse) * 0.05);
            if (size > 10) {
              const grad = ctx.createRadialGradient(proj.px, proj.py, 0, proj.px, proj.py, size);
              grad.addColorStop(0, cloud.color);
              grad.addColorStop(0.5, cloud.color.replace("0.0", "0.02"));
              grad.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(proj.px, proj.py, size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
        ctx.globalCompositeOperation = "source-over";
      }

      // Draw Orbit Pathways
      if (graphicsSettings.orbits && !warpActive) {
        ctx.lineWidth = 1.2;
        celestialBodies.forEach(body => {
          if (body.orbitRadius > 0) {
            ctx.beginPath();
            ctx.strokeStyle = selectedBody?.id === body.id 
              ? "rgba(0, 255, 255, 0.25)" 
              : "rgba(255, 255, 255, 0.04)";
            
            // Draw circle in 3D projection plane
            const segments = 120;
            for (let i = 0; i <= segments; i++) {
              const theta = (i / segments) * Math.PI * 2;
              const ox = body.orbitRadius * Math.cos(theta);
              const oz = body.orbitRadius * Math.sin(theta);
              const proj = project3D(ox, 0, oz);
              if (i === 0) ctx.moveTo(proj.px, proj.py);
              else ctx.lineTo(proj.px, proj.py);
            }
            ctx.stroke();
          }
        });
      }

      // Draw Stellar Bodies (layered by depth)
      const renderList: { depth: number; draw: () => void }[] = [];

      // 1. Queue Galaxy Stars
      galaxyStars.current.forEach(star => {
        // Twinkle effect
        star.twinkle += star.twinkleSpeed;
        const currentTwinkle = 0.4 + Math.abs(Math.sin(star.twinkle)) * 0.6;
        
        let sx = star.x;
        let sz = star.z;
        let sy = star.y;

        // Slow galaxy spinning orbit
        if (!warpActive) {
          const orbitAngle = time.current * 0.015 * (150 / (Math.sqrt(sx*sx + sz*sz) + 50));
          const cosO = Math.cos(orbitAngle);
          const sinO = Math.sin(orbitAngle);
          const nx = sx * cosO - sz * sinO;
          const nz = sx * sinO + sz * cosO;
          sx = nx;
          sz = nz;
        }

        const proj = project3D(sx, sy, sz);

        if (proj.visible) {
          let size = star.size * proj.scale;
          // Stretch stars radically if warp is active
          if (warpActive) {
            size *= 4.5;
          }

          renderList.push({
            depth: proj.depth,
            draw: () => {
              ctx.fillStyle = star.color;
              ctx.globalAlpha = currentTwinkle;
              if (warpActive) {
                // Warp velocity star vectors (streaking outwards from center)
                const dx = proj.px - cx;
                const dy = proj.py - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ndx = dx / (dist || 1);
                const ndy = dy / (dist || 1);
                ctx.lineWidth = size * 0.8;
                ctx.strokeStyle = star.color;
                ctx.beginPath();
                ctx.moveTo(proj.px, proj.py);
                ctx.lineTo(proj.px + ndx * size * 18, proj.py + ndy * size * 18);
                ctx.stroke();
              } else {
                ctx.beginPath();
                ctx.arc(proj.px, proj.py, Math.max(0.3, size), 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.globalAlpha = 1.0;
            }
          });
        }
      });

      // 2. Queue Celestial Bodies (Planets, Stars, Black holes)
      celestialBodies.forEach(body => {
        let bx = 0;
        let bz = 0;

        // If planet, compute active orbit
        if (body.orbitRadius > 0) {
          const currentOrbitSpeed = body.orbitSpeed;
          const angle = time.current * currentOrbitSpeed * 22;
          bx = body.orbitRadius * Math.cos(angle);
          bz = body.orbitRadius * Math.sin(angle);
        }

        const proj = project3D(bx, 0, bz);

        if (proj.visible) {
          const bodySize = body.radius * proj.scale;

          renderList.push({
            depth: proj.depth,
            draw: () => {
              // A. Draw black hole gravitational lensing refraction (Einstein Ring)
              if (body.type === "blackhole") {
                const ringSize = bodySize * 2.2;
                const gradRing = ctx.createRadialGradient(proj.px, proj.py, bodySize * 0.8, proj.px, proj.py, ringSize);
                gradRing.addColorStop(0, "rgba(0, 0, 0, 1.0)");
                gradRing.addColorStop(0.35, "rgba(255, 92, 0, 0.45)");
                gradRing.addColorStop(0.65, "rgba(0, 240, 255, 0.25)");
                gradRing.addColorStop(1, "rgba(0,0,0,0)");
                
                ctx.fillStyle = gradRing;
                ctx.beginPath();
                ctx.arc(proj.px, proj.py, ringSize, 0, Math.PI * 2);
                ctx.fill();

                // Swirling Event Horizon
                const rotDiskAngle = time.current * 0.8;
                ctx.save();
                ctx.translate(proj.px, proj.py);
                ctx.rotate(rotDiskAngle);
                
                // Draw lensing shear
                ctx.strokeStyle = "rgba(255, 140, 0, 0.65)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(0, 0, bodySize * 1.5, bodySize * 0.45, 0.2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
              }

              // B. Base sphere planet colors
              const grad = ctx.createRadialGradient(
                proj.px - bodySize * 0.2,
                proj.py - bodySize * 0.2,
                bodySize * 0.05,
                proj.px,
                proj.py,
                bodySize
              );
              grad.addColorStop(0, body.colors[0]);
              if (body.colors[1]) grad.addColorStop(0.4, body.colors[1]);
              grad.addColorStop(1, body.colors[2] || "#000000");

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(proj.px, proj.py, Math.max(1, bodySize), 0, Math.PI * 2);
              ctx.fill();

              // C. Atmospheric Glow (Bloom)
              if (graphicsSettings.bloom && body.type !== "blackhole") {
                const atmosphereGrad = ctx.createRadialGradient(
                  proj.px, proj.py, bodySize * 0.85,
                  proj.px, proj.py, bodySize * 1.25
                );
                atmosphereGrad.addColorStop(0, body.colors[0] + "bb");
                atmosphereGrad.addColorStop(0.3, body.colors[1] ? body.colors[1] + "55" : "rgba(255,255,255,0.15)");
                atmosphereGrad.addColorStop(1, "rgba(0,0,0,0)");

                ctx.fillStyle = atmosphereGrad;
                ctx.beginPath();
                ctx.arc(proj.px, proj.py, bodySize * 1.25, 0, Math.PI * 2);
                ctx.fill();
              }

              // D. Draw specific planetary details (e.g. Saturn's rings)
              if (body.id === "saturn") {
                ctx.save();
                ctx.translate(proj.px, proj.py);
                ctx.rotate(-0.15); // Saturn tilt
                ctx.lineWidth = bodySize * 0.28;
                
                // Outer ring
                ctx.strokeStyle = "rgba(224, 192, 136, 0.45)";
                ctx.beginPath();
                ctx.ellipse(0, 0, bodySize * 1.8, bodySize * 0.35, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Inner bright ring
                ctx.lineWidth = bodySize * 0.15;
                ctx.strokeStyle = "rgba(240, 224, 180, 0.75)";
                ctx.beginPath();
                ctx.ellipse(0, 0, bodySize * 1.4, bodySize * 0.28, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
              }

              // E. Floating lock-on bracket if selected
              if (selectedBody && selectedBody.id === body.id) {
                const bracketSize = bodySize * 1.5 + 8;
                ctx.strokeStyle = "#00f0ff";
                ctx.lineWidth = 1.5;

                // 4 glowing corners representing HUD brackets
                const corners = [
                  // Top-left
                  [[proj.px - bracketSize, proj.py - bracketSize + 8], [proj.px - bracketSize, proj.py - bracketSize], [proj.px - bracketSize + 8, proj.py - bracketSize]],
                  // Top-right
                  [[proj.px + bracketSize - 8, proj.py - bracketSize], [proj.px + bracketSize, proj.py - bracketSize], [proj.px + bracketSize, proj.py - bracketSize + 8]],
                  // Bottom-left
                  [[proj.px - bracketSize, proj.py + bracketSize - 8], [proj.px - bracketSize, proj.py + bracketSize], [proj.px - bracketSize + 8, proj.py + bracketSize]],
                  // Bottom-right
                  [[proj.px + bracketSize - 8, proj.py + bracketSize], [proj.px + bracketSize, proj.py + bracketSize], [proj.px + bracketSize, proj.py + bracketSize - 8]]
                ];

                corners.forEach(line => {
                  ctx.beginPath();
                  ctx.moveTo(line[0][0], line[0][1]);
                  ctx.lineTo(line[1][0], line[1][1]);
                  ctx.lineTo(line[2][0], line[2][1]);
                  ctx.stroke();
                });

                // Horizontal sweep diagnostic scanner laser line
                const scanY = proj.py + Math.sin(time.current * 4) * bracketSize;
                ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.moveTo(proj.px - bracketSize, scanY);
                ctx.lineTo(proj.px + bracketSize, scanY);
                ctx.stroke();

                // Add scan color fill
                ctx.fillStyle = "rgba(0, 240, 255, 0.05)";
                ctx.fillRect(proj.px - bracketSize, Math.min(proj.py, scanY), bracketSize * 2, Math.abs(proj.py - scanY));

                // Selected target telemetry labels
                ctx.fillStyle = "#00f0ff";
                ctx.font = "500 10px JetBrains Mono, monospace";
                ctx.fillText(`ID: ${body.id.toUpperCase()}`, proj.px + bracketSize + 6, proj.py - 12);
                ctx.fillText(`DIST: ${body.distance}`, proj.px + bracketSize + 6, proj.py);
                ctx.fillText(`SCAN: LOCKED`, proj.px + bracketSize + 6, proj.py + 12);
              }

              // F. Draw neat labels near planets if zoom is close enough
              if (zoom > 0.8 && !warpActive && body.id !== "sun" && body.type !== "nebula") {
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.font = "400 9px Inter, sans-serif";
                ctx.fillText(body.name, proj.px + bodySize + 4, proj.py + 3);
              }
            }
          });
        }
      });

      // Render items sorted from back-to-front (depth-buffered)
      renderList.sort((a, b) => b.depth - a.depth);
      renderList.forEach(item => item.draw());

      // Draw OS telemetry radar overlay corner (bottom left)
      if (!warpActive) {
        ctx.save();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
        ctx.fillStyle = "rgba(0, 5, 20, 0.35)";
        ctx.beginPath();
        ctx.arc(70, h - 70, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(70, h - 120);
        ctx.lineTo(70, h - 20);
        ctx.moveTo(20, h - 70);
        ctx.lineTo(120, h - 70);
        ctx.stroke();

        // Ring increments
        ctx.beginPath();
        ctx.arc(70, h - 70, 25, 0, Math.PI * 2);
        ctx.stroke();

        // Active sweeper
        const sweepAngle = time.current * 2;
        ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(70, h - 70);
        ctx.lineTo(70 + Math.cos(sweepAngle) * 50, h - 70 + Math.sin(sweepAngle) * 50);
        ctx.stroke();

        // Map stellar targets on the radar
        celestialBodies.forEach(body => {
          let r = (body.orbitRadius / 520) * 50;
          let angle = body.orbitRadius > 0 ? (time.current * body.orbitSpeed * 22) : 0;
          let rx = 70 + Math.cos(angle - yaw) * r;
          let ry = h - 70 + Math.sin(angle - yaw) * r * cosP;
          
          ctx.fillStyle = selectedBody?.id === body.id ? "#00f0ff" : body.colors[0];
          ctx.beginPath();
          ctx.arc(rx, ry, selectedBody?.id === body.id ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.fillText("RADAR LINK ACTIVE", 25, h - 10);
        ctx.restore();
      }

      // Render Cinematic grid Scanlines for immersive retro sci-fi OS vibe
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [celestialBodies, selectedBody, yaw, pitch, zoom, warpActive, graphicsSettings]);

  // Click handler to select celestial bodies on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    playSound('click');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    let closestBody: CelestialBody | null = null;
    let minDistance = 35; // Hover selection threshold

    celestialBodies.forEach(body => {
      let bx = 0;
      let bz = 0;

      if (body.orbitRadius > 0) {
        const angle = time.current * body.orbitSpeed * 22;
        bx = body.orbitRadius * Math.cos(angle);
        bz = body.orbitRadius * Math.sin(angle);
      }

      let rx = bx * cosY - bz * sinY;
      let rz = bx * sinY + bz * cosY;
      let ry = 0;

      const finalY = ry * cosP - rz * sinP;
      const finalZ = ry * sinP + rz * cosP;

      const perspective = 700 / (700 + finalZ);
      const scale = zoom * perspective;

      const px = cx + rx * scale;
      const py = cy + finalY * scale;

      const dist = Math.sqrt((px - mx * (graphicsSettings.highRes ? 1.5 : 1.0)) ** 2 + (py - my * (graphicsSettings.highRes ? 1.5 : 1.0)) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestBody = body;
      }
    });

    if (closestBody) {
      onSelectBody(closestBody);
    }
  };

  // Mouse drag camera controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    const deltaY = e.clientY - lastMouseY.current;

    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;

    yawTarget.current += deltaX * 0.007;
    pitchTarget.current = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, pitchTarget.current + deltaY * 0.007));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Wheel zoom control
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    zoomTarget.current = Math.max(0.3, Math.min(6.0, zoomTarget.current * factor));
  };

  return (
    <div className="absolute inset-0 select-none cursor-grab active:cursor-grabbing w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        className="block w-full h-full"
      />
    </div>
  );
}
