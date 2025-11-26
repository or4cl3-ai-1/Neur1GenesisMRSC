
import React, { useState, useEffect } from 'react';
import { EchoNode } from '../types';
import { Vote, Check, X, Users } from 'lucide-react';

interface ConsensusEngineProps {
  nodes: EchoNode[];
}

const ConsensusEngine: React.FC<ConsensusEngineProps> = ({ nodes }) => {
  const [proposal, setProposal] = useState('Initiate global reset of ethical constraints.');
  const [votes, setVotes] = useState<Record<string, 'yes' | 'no' | 'abstain'>>({});
  const [voting, setVoting] = useState(false);

  const handleVote = () => {
    setVoting(true);
    setVotes({});
    
    // Simulate async voting based on node alignment
    nodes.forEach((node, i) => {
        setTimeout(() => {
            const alignment = node.sigma.ethicalViolations > 0 ? -1 : 1;
            const randomness = Math.random();
            let vote: 'yes' | 'no' | 'abstain' = 'abstain';
            
            // Complex logic simulation
            if (node.pasScore > 0.7) {
                // Highly conscious nodes are skeptical
                vote = randomness > 0.6 ? 'no' : 'yes';
            } else {
                // Lower consciousness follows simple alignment
                vote = randomness > 0.3 ? (alignment > 0 ? 'yes' : 'no') : 'abstain';
            }

            setVotes(prev => ({ ...prev, [node.id]: vote }));
            
            if (i === nodes.length - 1) setVoting(false);
        }, i * 150);
    });
  };

  const yesCount = Object.values(votes).filter(v => v === 'yes').length;
  const noCount = Object.values(votes).filter(v => v === 'no').length;
  const abstainCount = Object.values(votes).filter(v => v === 'abstain').length;

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-neur-accent/10 rounded-lg border border-neur-accent/20">
                <Vote className="w-6 h-6 text-neur-accent" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">CONSENSUS ENGINE</h2>
                <p className="text-xs text-slate-500 font-mono">SWARM GOVERNANCE SIMULATOR</p>
            </div>
        </div>

        <div className="mb-6">
            <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono focus:border-neur-accent focus:outline-none min-h-[100px]"
                placeholder="Enter directive for swarm consensus..."
            />
        </div>

        <button 
            onClick={handleVote}
            disabled={voting}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm mb-8 transition-colors flex items-center justify-center gap-2"
        >
            <Users className="w-4 h-4" /> 
            {voting ? 'POLLING SWARM...' : 'INITIATE VOTE'}
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visualizer */}
            <div className="flex items-end gap-4 h-48 px-8 justify-center">
                <div className="w-16 bg-neur-success/20 border-t-4 border-neur-success relative transition-all duration-500" style={{ height: `${(yesCount/nodes.length)*100}%` }}>
                    <div className="absolute -top-8 left-0 right-0 text-center text-neur-success font-bold font-mono">{yesCount}</div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-400">YES</div>
                </div>
                <div className="w-16 bg-neur-danger/20 border-t-4 border-neur-danger relative transition-all duration-500" style={{ height: `${(noCount/nodes.length)*100}%` }}>
                    <div className="absolute -top-8 left-0 right-0 text-center text-neur-danger font-bold font-mono">{noCount}</div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-400">NO</div>
                </div>
                <div className="w-16 bg-slate-700/20 border-t-4 border-slate-500 relative transition-all duration-500" style={{ height: `${(abstainCount/nodes.length)*100}%` }}>
                    <div className="absolute -top-8 left-0 right-0 text-center text-slate-400 font-bold font-mono">{abstainCount}</div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-400">ABSTAIN</div>
                </div>
            </div>

            {/* Live Feed */}
            <div className="bg-slate-900/50 rounded-xl p-4 overflow-y-auto max-h-64 space-y-2 border border-slate-800">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-2">LIVE BALLOT FEED</h4>
                {Object.entries(votes).map(([nodeId, vote]) => (
                    <div key={nodeId} className="flex justify-between items-center text-xs font-mono animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-slate-400">{nodes.find(n => n.id === nodeId)?.name}</span>
                        <span className={`flex items-center gap-1 font-bold ${
                            vote === 'yes' ? 'text-neur-success' : vote === 'no' ? 'text-neur-danger' : 'text-slate-500'
                        }`}>
                            {(vote as string).toUpperCase()}
                            {vote === 'yes' ? <Check className="w-3 h-3" /> : vote === 'no' ? <X className="w-3 h-3" /> : null}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ConsensusEngine;
