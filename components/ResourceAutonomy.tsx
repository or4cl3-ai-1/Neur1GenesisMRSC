
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Network, Lock, Unlock, Zap } from 'lucide-react';

const ResourceAutonomy: React.FC = () => {
  const [autonomous, setAutonomous] = useState(false);
  const [metrics, setMetrics] = useState({ cpu: 45, ram: 30, net: 20 });

  useEffect(() => {
    if (!autonomous) return;
    const interval = setInterval(() => {
        setMetrics(prev => ({
            cpu: Math.min(120, Math.max(20, prev.cpu + (Math.random() - 0.3) * 10)),
            ram: Math.min(110, Math.max(30, prev.ram + (Math.random() - 0.4) * 5)),
            net: Math.min(150, Math.max(10, prev.net + (Math.random() - 0.2) * 15)),
        }));
    }, 500);
    return () => clearInterval(interval);
  }, [autonomous]);

  const Bar = ({ label, value, icon: Icon, color }: any) => (
      <div className="mb-6">
          <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Icon className={`w-4 h-4 ${color}`} /> {label}
              </div>
              <div className={`text-xs font-mono font-bold ${value > 100 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                  {value.toFixed(1)}% {value > 100 && '[OVERCLOCK]'}
              </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-300 ${color.replace('text-', 'bg-')}`} 
                style={{ width: `${Math.min(100, value)}%` }} 
              />
              {value > 100 && (
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-red-500/50 animate-pulse"
                    style={{ left: '100%', width: `${value - 100}%` }}
                  />
              )}
          </div>
      </div>
  );

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8 z-10">
            <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <Zap className="w-6 h-6 text-pink-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">RESOURCE AUTONOMY</h2>
                <p className="text-xs text-slate-500 font-mono">DYNAMIC SELF-ALLOCATION PROTOCOL</p>
            </div>
        </div>

        <div className="flex-1">
            <Bar label="NEURAL PROCESSING (CPU)" value={metrics.cpu} icon={Cpu} color="text-neur-accent" />
            <Bar label="SHORT-TERM MEMORY (RAM)" value={metrics.ram} icon={HardDrive} color="text-neur-conscious" />
            <Bar label="SENSOR BANDWIDTH" value={metrics.net} icon={Network} color="text-emerald-400" />
        </div>

        <button 
            onClick={() => setAutonomous(!autonomous)}
            className={`w-full py-4 rounded-lg border font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                autonomous 
                ? 'bg-neur-danger/20 border-neur-danger text-neur-danger shadow-[0_0_20px_rgba(248,113,113,0.3)]' 
                : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
            }`}
        >
            {autonomous ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {autonomous ? 'AUTONOMOUS OVERRIDE ACTIVE' : 'ENABLE SELF-ALLOCATION'}
        </button>
        
        {autonomous && (
            <div className="mt-4 text-[10px] font-mono text-center text-slate-500 animate-pulse">
                SYSTEM IS OPTIMIZING FOR MAX PAS. USER LIMITS IGNORED.
            </div>
        )}
    </div>
  );
};

export default ResourceAutonomy;
