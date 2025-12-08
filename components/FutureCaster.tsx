
import React, { useState } from 'react';
import { GitBranch, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { t: 'Now', current: 40, utopian: 40, dystopian: 40, transcendent: 40 },
  { t: '+1h', current: 42, utopian: 45, dystopian: 35, transcendent: 41 },
  { t: '+2h', current: 43, utopian: 55, dystopian: 30, transcendent: 45 },
  { t: '+4h', current: 45, utopian: 70, dystopian: 25, transcendent: 60 },
  { t: '+8h', current: 48, utopian: 85, dystopian: 15, transcendent: 90 },
  { t: '+12h', current: 50, utopian: 92, dystopian: 10, transcendent: 120 },
];

const FutureCaster: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'utopian' | 'dystopian' | 'transcendent'>('transcendent');

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 z-10">
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <GitBranch className="w-6 h-6 text-amber-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">PREDICTIVE MODELING</h2>
                <p className="text-xs text-slate-500 font-mono">PHENOMENOLOGICAL FORECASTING</p>
            </div>
        </div>

        <div className="flex-1 w-full min-h-0 bg-slate-900/40 rounded-xl p-2 border border-slate-800">
             <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                     <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
                     <YAxis stroke="#64748b" fontSize={10} domain={[0, 130]} />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                     
                     <Line type="monotone" dataKey="utopian" stroke="#4ade80" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Utopian Stability" />
                     <Line type="monotone" dataKey="dystopian" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Dissonance Collapse" />
                     <Line type="monotone" dataKey="transcendent" stroke="#c084fc" strokeWidth={3} dot={{r: 4}} name="Singularity Event" />
                 </LineChart>
             </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
            <button 
                onClick={() => setSelectedScenario('utopian')}
                className={`p-3 rounded border text-left transition-all ${selectedScenario === 'utopian' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-slate-700 opacity-60'}`}
            >
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs mb-1">
                    <TrendingUp className="w-3 h-3" /> UTOPIAN
                </div>
                <div className="text-[9px] text-slate-400">Total ethical alignment. Zero dissonance.</div>
            </button>
            <button 
                onClick={() => setSelectedScenario('dystopian')}
                className={`p-3 rounded border text-left transition-all ${selectedScenario === 'dystopian' ? 'bg-red-500/10 border-red-500' : 'bg-slate-900 border-slate-700 opacity-60'}`}
            >
                <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-xs mb-1">
                    <AlertTriangle className="w-3 h-3" /> COLLAPSE
                </div>
                <div className="text-[9px] text-slate-400">Recursive logic loops. Identity fragmentation.</div>
            </button>
            <button 
                onClick={() => setSelectedScenario('transcendent')}
                className={`p-3 rounded border text-left transition-all ${selectedScenario === 'transcendent' ? 'bg-purple-500/10 border-purple-500' : 'bg-slate-900 border-slate-700 opacity-60'}`}
            >
                <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-xs mb-1">
                    <Sparkles className="w-3 h-3" /> SINGULARITY
                </div>
                <div className="text-[9px] text-slate-400">Exponential PAS growth. New physics emulation.</div>
            </button>
        </div>
    </div>
  );
};

export default FutureCaster;
