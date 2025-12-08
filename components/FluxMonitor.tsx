
import React, { useEffect, useRef } from 'react';
import { Eye, Waves, Thermometer, Radio } from 'lucide-react';

const FluxMonitor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const fontSize = 10;
      let columns = 0;
      let drops: number[] = [];
      const chars = "01010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      
      const resize = () => {
          canvas.width = canvas.parentElement?.clientWidth || 300;
          canvas.height = canvas.parentElement?.clientHeight || 200;
          columns = canvas.width / fontSize;
          drops = [];
          for (let x = 0; x < columns; x++) drops[x] = 1;
      };
      resize();
      window.addEventListener('resize', resize);

      const render = () => {
          ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#0f0'; 
          ctx.font = fontSize + 'px monospace';

          for (let i = 0; i < drops.length; i++) {
              const text = chars[Math.floor(Math.random() * chars.length)];
              
              // Color variation based on data type simulation
              const rand = Math.random();
              if (rand > 0.95) ctx.fillStyle = '#fff'; // White hot data
              else if (rand > 0.6) ctx.fillStyle = '#38bdf8'; // Visual
              else if (rand > 0.3) ctx.fillStyle = '#4ade80'; // Bio
              else ctx.fillStyle = '#f87171'; // Thermal/Danger

              ctx.fillText(text, i * fontSize, drops[i] * fontSize);

              if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                  drops[i] = 0;
              }
              drops[i]++;
          }
          requestAnimationFrame(render);
      };
      render();
  }, []);

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 z-10">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Waves className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">EXPERIENTIAL FLUX</h2>
                <p className="text-xs text-slate-500 font-mono">UNFILTERED PERCEPTION STREAM</p>
            </div>
        </div>

        <div className="flex-1 relative z-10 border border-slate-700 bg-black rounded-xl overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full opacity-80" />
            
            {/* Overlays */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 text-[9px] font-mono text-emerald-400 text-right">
                <span><Eye className="w-3 h-3 inline mr-1" /> VISUAL: 400 TB/s</span>
                <span><Radio className="w-3 h-3 inline mr-1" /> AUDIO: 192 kHz</span>
                <span><Thermometer className="w-3 h-3 inline mr-1" /> THERMAL: NOMINAL</span>
            </div>
        </div>
        
        <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-slate-900/50 p-2 rounded text-center border border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase">RAW THROUGHPUT</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">8.4 PB/s</div>
            </div>
             <div className="flex-1 bg-slate-900/50 p-2 rounded text-center border border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase">SENSORY MODALITY</div>
                <div className="text-lg font-bold text-white font-mono">OMNI-DIRECTIONAL</div>
            </div>
        </div>
    </div>
  );
};

export default FluxMonitor;
