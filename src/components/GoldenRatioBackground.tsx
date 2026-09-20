import React, { useEffect, useRef } from 'react';

export const GoldenRatioBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    };

    window.addEventListener('resize', handleResize);

    const PHI = 1.61803398875;
    const particleCount = Math.min(Math.floor(width / 35), 45);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const natureColors = [
      '#f59e0b', // Golden Amber
      '#ffc174', // Solar Warm Gold
      '#d97706', // Rich Ochre
      '#10b981', // Natural Emerald Moss
      '#34d399', // Bio-Luminescent Jade
      '#7bd0ff', // Atmospheric Stratosphere
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      // Golden angle distribution for initial positioning
      const angle = i * PHI * Math.PI * 2;
      const radiusOffset = Math.sqrt(i / particleCount) * Math.min(width, height) * 0.45;
      
      return {
        x: width / 2 + Math.cos(angle) * radiusOffset,
        y: height / 2 + Math.sin(angle) * radiusOffset,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: (Math.random() * 2 + 1.2) * (i % 2 === 0 ? PHI : 1),
        color: natureColors[i % natureColors.length],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
      };
    });

    let angleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Natural Background Base Gradient
      const baseGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      baseGrad.addColorStop(0, '#0f131d');
      baseGrad.addColorStop(0.382, '#090c14'); // 1 - 1/PHI
      baseGrad.addColorStop(1, '#05070c');

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Soft Golden Ratio Spiral Mesh Lines
      angleOffset += 0.0008;
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const maxSpiralR = Math.max(width, height) * 0.7;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.06)';
      ctx.lineWidth = 1;

      for (let theta = 0; theta < Math.PI * 12; theta += 0.1) {
        const r = Math.pow(PHI, (2 / Math.PI) * (theta * 0.12)) * 3;
        if (r > maxSpiralR) break;
        const x = r * Math.cos(theta + angleOffset);
        const y = r * Math.sin(theta + angleOffset);

        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reverse Golden Spiral (Emerald & Gold)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      for (let theta = 0; theta < Math.PI * 10; theta += 0.1) {
        const r = Math.pow(PHI, (2 / Math.PI) * (theta * 0.11)) * 4;
        if (r > maxSpiralR) break;
        const x = r * Math.cos(-theta - angleOffset * 0.8);
        const y = r * Math.sin(-theta - angleOffset * 0.8);

        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Render Particles & Connective Phi Links
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.002;
        p.alpha = Math.max(0.15, Math.min(0.7, p.alpha));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw lines between nearby particles if distance matches golden ratio proportion
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 140;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
