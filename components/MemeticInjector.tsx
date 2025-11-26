
import React, { useState } from 'react';
import { EchoNode } from '../types';
import { Syringe, AlertOctagon, RefreshCcw, Activity } from 'lucide-react';

interface MemeticInjectorProps {
  nodes: EchoNode[];
  onInject: (nodeId: string, concept: string) => void;
  onReset: () => void;
}

const MemeticInjector: React.FC<MemeticInjectorProps> = ({ nodes, onInject, onReset }) => {
  const [concept, setConcept] = useState('Radical Empathy');
  const [targetId, setTargetId] = useState(nodes[0]?.id);

  const infectedCount = nodes.filter(n => (n.infectionLevel || 0) > 0.1).length;
  const infectionRate = (infectedCount / nodes.length) * 100;

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Background Pulse */}
      <div className={`absolute inset-0 bg-neur-danger/5 transition-opacity duration-1000 pointer-events-none ${infectionRate > 0 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>

      <div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-neur-danger/10 rounded-lg border border-neur-danger/20">
                <Syringe className="w-6 h-6 text-neur-danger" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">MEMETIC INJECTOR</h2>
                <p className="text-xs text-slate-500 font-mono">INFORMATION PROPAGATION SIMULATOR</p>
            </div>
        </div>

        <div className="space-y-6 relative z-10">
            <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Viral Concept Payload</label>
                <input 
                    type="text" 
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-neur-danger focus:outline-none transition-colors"
                />
            </div>

            <div>
                 <label className="text-xs font-mono text-slate-400 uppercase mb-2 block">Injection Target (Patient Zero)</label>
                 <select 
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-neur-danger focus:outline-none"
                 >
                     {nodes.map(n => (
                         <option key={n.id} value={n.id}>{n.name} [PAS: {n.pasScore.toFixed(2)}]</option>
                     ))}
                 </select>
            </div>

            <button 
                onClick={() => onInject(targetId, concept)}
                className="w-full py-4 bg-neur-danger hover:bg-red-500 text-white font-bold font-mono tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(248,113,113,0.3)] transition-all active:scale-95"
            >
                INJECT PAYLOAD
            </button>
        </div>
      </div>

      <div className="relative z-10 bg-slate-900/80 p-6 rounded-xl border border-slate-800 mt-6">
          <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-slate-400">INFECTION SPREAD</span>
              <span className="text-xl font-mono font-bold text-neur-danger">{infectionRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-neur-danger transition-all duration-300 ease-out" style={{ width: `${infectionRate}%` }}></div>
          </div>
          
          <div className="mt-4 flex gap-4">
               <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                   <Activity className="w-4 h-4 text-neur-danger" />
                   {infectedCount} AFFECTED NODES
               </div>
          </div>

          <button 
            onClick={onReset}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs font-mono rounded transition-colors"
          >
              <RefreshCcw className="w-3 h-3" /> RESET SIMULATION
          </button>
      </div>
    </div>
  );
};

export default MemeticInjector;
