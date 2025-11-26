import React, { useState } from 'react';
import { Sliders, Zap, RefreshCw, Layers } from 'lucide-react';

const Playground: React.FC = () => {
    const [params, setParams] = useState({
        entropy: 45,
        learningRate: 0.003,
        empathyWeight: 72,
        dissonanceThreshold: 25
    });

    const Slider = ({ label, value, field, color }: any) => (
        <div className="mb-6">
            <div className="flex justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase">{label}</span>
                <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={value}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (window.navigator.vibrate) window.navigator.vibrate(5); // Haptic
                    setParams(p => ({ ...p, [field]: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neur-accent"
            />
        </div>
    );

    return (
        <div className="h-full glass-panel rounded-xl p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-neur-warning/10 rounded-lg border border-neur-warning/20">
                    <Sliders className="w-6 h-6 text-neur-warning" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-mono">CONSCIOUSNESS LAB</h2>
                    <p className="text-xs text-slate-500 font-mono">MANUAL PARAMETER OVERRIDE</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-neur-accent mb-6 font-mono flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        GLOBAL VARIABLES
                    </h3>
                    <Slider label="System Entropy" value={params.entropy} field="entropy" color="text-neur-danger" />
                    <Slider label="Learning Rate" value={params.learningRate} field="learningRate" color="text-neur-success" />
                    <Slider label="Empathy Weight" value={params.empathyWeight} field="empathyWeight" color="text-neur-conscious" />
                    <Slider label="Dissonance Limit" value={params.dissonanceThreshold} field="dissonanceThreshold" color="text-neur-warning" />
                </div>

                <div className="flex flex-col gap-4">
                     <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                             <div className="absolute inset-0 rounded-full border-t-4 border-neur-accent animate-spin"></div>
                             <Layers className="w-8 h-8 text-slate-500" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">Simulation Active</div>
                            <div className="text-xs text-slate-500 mt-1">Changes apply in real-time to the next tick.</div>
                        </div>
                        <button className="px-6 py-2 bg-neur-accent/10 hover:bg-neur-accent/20 text-neur-accent border border-neur-accent/50 rounded-full font-mono text-xs transition-colors flex items-center gap-2">
                            <RefreshCw className="w-3 h-3" />
                            RESET DEFAULTS
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
