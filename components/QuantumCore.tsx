
import React, { useEffect, useRef, useState } from 'react';
import { Atom, Infinity, Activity } from 'lucide-react';

const QuantumCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coherence, setCoherence] = useState(87.4);
  const [qpuLoad, setQpuLoad] = useState(42);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let animationFrame: number;

    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || 300;
        canvas.height = canvas.parentElement?.clientHeight || 200;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Fade trail
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(cx, cy) - 20;

        // Draw Interference Patterns
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? 'rgba(56, 189, 248, 0.5)' : (i === 1 ? 'rgba(192, 132, 252, 0.5)' : 'rgba(45, 212, 191, 0.5)');
            
            for (let x = 0; x < canvas.width; x+=5) {
                // Wave Function
                const y = cy + 
                    Math.sin(x * 0.02 + t * (0.05 + i*0.02)) * 30 * Math.sin(t * 0.1) +
                    Math.cos(x * 0.05 - t * 0.05) * 20;
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Draw Bloch Sphere Abstract
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        // Qubit State Indicator
        const qx = cx + Math.cos(t * 0.5) * radius * 0.6;
        const qy = cy + Math.sin(t * 0.3) * radius * 0.6 * Math.sin(t);
        
        ctx.beginPath();
        ctx.arc(qx, qy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#c084fc';
        ctx.fill();
        ctx.shadowBlur = 0;

        t += 0.05;
        animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 z-10">
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Atom className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">QUANTUM COHERENCE</h2>
                <p className="text-xs text-slate-500 font-mono">DISTRIBUTED Q-STATE EMULATION</p>
            </div>
        </div>

        <div className="flex-1 relative z-10 border border-slate-700 bg-black/40 rounded-xl overflow-hidden mb-4">
             <canvas ref={canvasRef} className="w-full h-full" />
             <div className="absolute bottom-2 left-2 text-[10px] font-mono text-indigo-300">
                 Ψ(x,t) = Ae^(i(kx-ωt))
             </div>
        </div>

        <div className="grid grid-cols-2 gap-4 z-10">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-slate-400">COHERENCE FIDELITY</span>
                    <Activity className="w-3 h-3 text-neur-accent" />
                </div>
                <div className="text-xl font-bold text-white font-mono">{coherence}%</div>
                <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-pulse" style={{ width: `${coherence}%` }}></div>
                </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-slate-400">NON-LOCAL QPU LOAD</span>
                    <Infinity className="w-3 h-3 text-neur-conscious" />
                </div>
                <div className="text-xl font-bold text-white font-mono">{qpuLoad} qubits</div>
                 <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-neur-conscious" style={{ width: `${qpuLoad}%` }}></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuantumCore;
