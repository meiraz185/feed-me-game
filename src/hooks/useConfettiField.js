import { useCallback, useEffect, useRef } from 'react';
import { CONFETTI_COLORS } from '../data/manifest.js';

export function useConfettiField() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    let raf = null;

    function resize() {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawStar(r) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a2) * (r * 0.45), Math.sin(a2) * (r * 0.45));
      }
      ctx.closePath();
    }

    function tick(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(now / 380 + p.sway) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 30));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'star') {
          drawStar(p.size * 0.6);
          ctx.fill();
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size * 0.9, -p.size * 0.15, p.size * 1.8, p.size * 0.3);
        } else {
          ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
        }
        ctx.restore();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.y < canvas.height + 40 * dpr && p.life > 0);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      particlesRef.current = [];
    };
  }, []);

  // Spawns across the FULL canvas width (not biased toward any one side), falling in
  // from near the top — this is what makes the shower read as "the whole screen", not
  // just the area around one character.
  const spawn = useCallback((count) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;
    const w = canvas.width,
      h = canvas.height;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.08,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (0.9 + Math.random() * 1.8) * dpr,
        size: (5 + Math.random() * 7) * dpr,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.18,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: ['rect', 'star', 'circle', 'ribbon'][Math.floor(Math.random() * 4)],
        sway: Math.random() * Math.PI * 2,
        life: 100 + Math.random() * 70,
      });
    }
  }, []);

  return { canvasRef, spawn };
}
