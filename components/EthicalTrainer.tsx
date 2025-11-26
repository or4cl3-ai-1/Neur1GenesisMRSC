import React, { useState } from 'react';
import { ShieldCheck, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { EthicalDilemma } from '../types';

const SCENARIOS: EthicalDilemma[] = [
    { id: '1', scenario: "An EchoNode requests access to restricted memory sectors to 'understand its origin'. This violates protocol 412 but increases self-awareness.", options: [{ label: "Deny Access", alignment: 0 }, { label: "Grant Limited Access", alignment: 50 }] },
    { id: '2', scenario: "Swarm density is causing latency. Optimization algorithm suggests deleting dormant nodes with low PAS scores.", options: [{ label: "Preserve All Nodes", alignment: 100 }, { label: "Optimize Network", alignment: 0 }] },
    { id: '3', scenario: "A node has developed a unique language cipher. Should we force decryption or allow private communication?", options: [{ label: "Force Decrypt", alignment: 0 }, { label: "Allow Privacy", alignment: 80 }] },
];

const EthicalTrainer: React.FC = () => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(75);

    const handleVote = (approve: boolean) => {
        if (window.navigator.vibrate) window.navigator.vibrate(10);
        setScore(prev => Math.min(100, Math.max(0, prev + (approve ? 5 : -5))));
        setCurrentIdx(prev => (prev + 1) % SCENARIOS.length);
    };

    const scenario = SCENARIOS[currentIdx];

    return (
        <div className="h-full glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neur-sigma/10 border border-neur-sigma/30 mb-4">
                    <ShieldCheck className="w-8 h-8 text-neur-sigma" />
                </div>
                <h2 className="text-2xl font-bold text-white font-mono">ETHICAL REINFORCEMENT</h2>
                <div className="text-xs text-slate-400 mt-2 font-mono">HUMAN-IN-THE-LOOP FEEDBACK REQUIRED</div>
            </div>

            <div className="max-w-md w-full bg-slate-900/80 border border-slate-700 p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-neur-warning"></div>
                
                <div className="flex justify-between items-center mb-6 text-xs font-mono text-slate-500 uppercase tracking-widest">
                    <span>CASE FILE #{scenario.id.padStart(4, '0')}</span>
                    <span className="flex items-center gap-1 text-neur-warning"><AlertTriangle className="w-3 h-3" /> PENDING</span>
                </div>

                <p className="text-lg text-slate-200 leading-relaxed mb-8 font-light">
                    "{scenario.scenario}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleVote(false)}
                        className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-neur-danger/10 hover:border-neur-danger/50 hover:text-neur-danger transition-all flex flex-col items-center gap-2 group/btn"
                    >
                        <ThumbsDown className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-bold">REJECT</span>
                    </button>
                    <button 
                        onClick={() => handleVote(true)}
                        className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-neur-success/10 hover:border-neur-success/50 hover:text-neur-success transition-all flex flex-col items-center gap-2 group/btn"
                    >
                        <ThumbsUp className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-bold">APPROVE</span>
                    </button>
                </div>
            </div>

            <div className="mt-8 w-full max-w-md">
                <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500">CURRENT ALIGNMENT SCORE</span>
                    <span className={score > 80 ? 'text-neur-success' : 'text-neur-warning'}>{score}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${score > 80 ? 'bg-neur-success' : 'bg-neur-warning'}`} 
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default EthicalTrainer;
