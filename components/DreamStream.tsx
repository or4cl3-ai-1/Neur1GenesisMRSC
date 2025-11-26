import React, { useEffect, useRef } from 'react';

const DreamStream: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 100;

    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 0.5,
            color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(192, 132, 252, ' // Sky vs Conscious
        });
    }

    const render = () => {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        ctx.beginPath();
        for(let i=0; i<particles.length; i++) {
            for(let j=i+1; j<particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 - dist/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                }
            }
        }
        ctx.stroke();

        // Update & Draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + (0.5 + Math.random() * 0.5) + ')';
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden glass-panel border border-slate-700">
        <div className="absolute top-4 left-4 z-10">
            <h2 className="text-white font-bold font-mono text-lg drop-shadow-md">DREAM STREAM</h2>
            <div className="text-[10px] text-neur-conscious animate-pulse font-mono">VISUALIZING SUB-PROCESSES</div>
        </div>
        <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default DreamStream;
