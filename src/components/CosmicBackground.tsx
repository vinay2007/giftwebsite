import React, { useEffect, useRef } from 'react';
import { PaletteType, AnimationIntensity } from '../config/giftConfig';

interface CosmicBackgroundProps {
  activeChapterIndex: number;
  enableParallax?: boolean;
  palette?: PaletteType;
  animationIntensity?: AnimationIntensity;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  layer: number; // 1 (far), 2 (mid), 3 (near)
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  activeChapterIndex,
  enableParallax = true,
  palette = 'obsidian',
  animationIntensity = 'dreamy',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableParallax) return;
      // Normalized between -1 and 1
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enableParallax || e.touches.length === 0) return;
      mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate dreamy particles
    let particles: Particle[] = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : 3;
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: layer === 1 ? Math.random() * 1.2 + 0.6 : layer === 2 ? Math.random() * 1.8 + 1.0 : Math.random() * 2.2 + 1.4,
          speedX: (Math.random() - 0.5) * (0.08 * layer),
          speedY: -(Math.random() * 0.15 + 0.05) * layer, // slow upward drift like stardust
          opacity: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
          layer,
        });
      }
    };

    initParticles();

    let frame = 0;
    const render = () => {
      frame++;
      // Smooth lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Render subtle atmospheric horizon gradient depending on chapter
      const horizonY = height * 0.72;
      const gradient = ctx.createLinearGradient(0, horizonY - 180, 0, height);
      
      if (activeChapterIndex === 0) {
        // Soft twilight ivory/amber warmth on distant horizon
        gradient.addColorStop(0, 'rgba(10, 10, 14, 0)');
        gradient.addColorStop(0.65, 'rgba(40, 32, 28, 0.45)');
        gradient.addColorStop(1, 'rgba(24, 18, 16, 0.75)');
      } else if (activeChapterIndex === 1) {
        // Deep indigo charcoal horizon
        gradient.addColorStop(0, 'rgba(8, 8, 11, 0)');
        gradient.addColorStop(0.7, 'rgba(22, 22, 32, 0.4)');
        gradient.addColorStop(1, 'rgba(14, 14, 20, 0.7)');
      } else if (activeChapterIndex === 2) {
        // Warm parchment-toned quiet ambience
        gradient.addColorStop(0, 'rgba(9, 9, 12, 0)');
        gradient.addColorStop(0.6, 'rgba(32, 28, 24, 0.35)');
        gradient.addColorStop(1, 'rgba(18, 16, 14, 0.65)');
      } else {
        // Final reveal: warm starlight constellation glow
        gradient.addColorStop(0, 'rgba(9, 9, 13, 0)');
        gradient.addColorStop(0.55, 'rgba(38, 30, 24, 0.5)');
        gradient.addColorStop(1, 'rgba(26, 20, 16, 0.85)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY - 180, width, height - (horizonY - 180));

      // Draw distant horizon line
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      // Draw distant horizon line
      let horizonStroke = 'rgba(210, 200, 180, 0.06)';
      if (activeChapterIndex === 0) {
        if (palette === 'indigo') horizonStroke = 'rgba(160, 190, 255, 0.16)';
        else if (palette === 'rosewood') horizonStroke = 'rgba(240, 180, 195, 0.16)';
        else if (palette === 'starlight') horizonStroke = 'rgba(220, 230, 255, 0.18)';
        else horizonStroke = 'rgba(240, 207, 152, 0.14)';
      }
      ctx.strokeStyle = horizonStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      const speedMultiplier = animationIntensity === 'subtle' ? 0.6 : animationIntensity === 'expressive' ? 1.5 : 1.0;

      // Render drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.y += p.speedY * speedMultiplier;
          p.x += p.speedX * speedMultiplier;

          // Wrap around seamlessly
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        // Parallax offset based on layer
        const parallaxFactor = p.layer * 14;
        const currentX = p.x + mouseRef.current.x * parallaxFactor;
        const currentY = p.y + mouseRef.current.y * parallaxFactor;

        // Gentle breathing pulse
        const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase);
        const dynamicOpacity = Math.max(0.08, p.opacity + pulse * 0.18);

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);

        // Palette-aware starlight color
        let pColor = `rgba(246, 230, 200, ${dynamicOpacity * 0.85})`;
        let glowColor = `rgba(240, 207, 152, ${dynamicOpacity * 0.18})`;

        if (palette === 'indigo') {
          pColor = `rgba(190, 215, 255, ${dynamicOpacity * 0.85})`;
          glowColor = `rgba(140, 180, 255, ${dynamicOpacity * 0.2})`;
        } else if (palette === 'rosewood') {
          pColor = `rgba(255, 220, 230, ${dynamicOpacity * 0.85})`;
          glowColor = `rgba(235, 170, 190, ${dynamicOpacity * 0.2})`;
        } else if (palette === 'starlight') {
          pColor = `rgba(240, 245, 255, ${dynamicOpacity * 0.9})`;
          glowColor = `rgba(200, 225, 255, ${dynamicOpacity * 0.15})`;
        }

        ctx.fillStyle = p.layer === 3 ? pColor : `rgba(215, 215, 225, ${dynamicOpacity * 0.55})`;
        ctx.fill();

        // Extra soft glow for near particles
        if (p.layer === 3 && p.size > 1.8) {
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeChapterIndex, enableParallax, palette, animationIntensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />
      {/* Subtle organic noise/vignette overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};
