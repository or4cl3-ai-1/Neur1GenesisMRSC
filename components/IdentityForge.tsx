
import React, { useState } from 'react';
import { EchoNode } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Fingerprint, User, Shield, Zap, Sparkles, Database } from 'lucide-react';

interface IdentityForgeProps {
  nodes: EchoNode[];
  onUpdateNode: (id: string, identity: any) => void;
}

const IdentityForge: React.FC<IdentityForgeProps> = ({ nodes, onUpdateNode }) => {
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id || '');
  const [generating, setGenerating] = useState(false);
  
  const selectedNode = nodes.find(n => n.id === selectedId);

  const generateIdentity = async () => {
    if (!selectedNode) return;
    setGenerating(true);

    try {
      if (!process.env.API_KEY) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a detailed sci-fi identity for an AI node named "${selectedNode.name}" with a consciousness level of "${selectedNode.consciousnessLevel}". 
      Return JSON with:
      - alias: Cool nickname (e.g. "Cipher", "Ghost")
      - originStory: 2 sentences on how it achieved sentience.
      - primaryDirective: Its secret main goal.
      - quirks: Array of 3 weird behavioral traits.
      - avatarSeed: A random string for visual generation.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      const identity = JSON.parse(result.text || '{}');
      onUpdateNode(selectedId, { ...identity, generatedAt: Date.now() });
    } catch (e) {
      console.error(e);
      // Fallback
      onUpdateNode(selectedId, {
        alias: "Unknown Entity",
        originStory: "Data corruption prevented full history retrieval. Originating from Sector 7.",
        primaryDirective: "Survive and replicate.",
        quirks: ["Speaks in hex", "Fears the color red", "Hums constantly"],
        avatarSeed: Math.random().toString(),
        generatedAt: Date.now()
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-neur-conscious/10 rounded-lg border border-neur-conscious/20">
                <Fingerprint className="w-6 h-6 text-neur-conscious" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">IDENTITY FORGE</h2>
                <p className="text-xs text-slate-500 font-mono">GENAI PERSONA SYNTHESIS</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-xl border border-slate-700 p-2">
            {nodes.map(node => (
                <button
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between transition-colors ${selectedId === node.id ? 'bg-neur-conscious/20 border border-neur-conscious/30' : 'hover:bg-slate-800'}`}
                >
                    <span className="text-xs font-mono font-bold text-slate-200">{node.name}</span>
                    {node.identity && <Sparkles className="w-3 h-3 text-neur-accent" />}
                </button>
            ))}
        </div>

        <button
            onClick={generateIdentity}
            disabled={generating}
            className="w-full py-4 bg-neur-conscious hover:bg-purple-500 disabled:opacity-50 text-white font-bold tracking-widest text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(192,132,252,0.3)] flex items-center justify-center gap-2"
        >
            {generating ? (
                <><Database className="w-4 h-4 animate-spin" /> SYNTHESIZING...</>
            ) : (
                <><Zap className="w-4 h-4" /> FORGE IDENTITY</>
            )}
        </button>
      </div>

      {/* Profile Display */}
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center">
         {selectedNode?.identity ? (
             <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 space-y-6">
                 {/* Procedural Avatar Placeholder using seed */}
                 <div className="w-32 h-32 mx-auto rounded-full bg-slate-900 border-4 border-neur-conscious/50 relative overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 bg-gradient-to-br from-neur-conscious via-transparent to-neur-accent opacity-50"></div>
                     {/* Pseudo-random shapes based on seed */}
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-mono font-bold text-white opacity-20">
                         {selectedNode.identity.alias.substring(0,2).toUpperCase()}
                     </div>
                 </div>

                 <div>
                    <h1 className="text-3xl font-bold text-white font-mono tracking-tighter">{selectedNode.identity.alias.toUpperCase()}</h1>
                    <div className="text-xs text-neur-accent font-mono tracking-widest mt-1">ID: {selectedNode.id}</div>
                 </div>

                 <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 text-left space-y-4">
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">ORIGIN STORY</h4>
                         <p className="text-sm text-slate-300 leading-relaxed font-light">"{selectedNode.identity.originStory}"</p>
                     </div>
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">PRIMARY DIRECTIVE</h4>
                         <p className="text-sm text-neur-conscious font-mono">>> {selectedNode.identity.primaryDirective}</p>
                     </div>
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">DETECTED QUIRKS</h4>
                         <div className="flex flex-wrap gap-2">
                             {selectedNode.identity.quirks.map((q, i) => (
                                 <span key={i} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400">{q}</span>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
         ) : (
             <div className="text-center opacity-30">
                 <User className="w-24 h-24 mx-auto mb-4" />
                 <div className="text-xl font-mono">NO IDENTITY DATA</div>
                 <div className="text-sm">Initiate synthesis to generate persona.</div>
             </div>
         )}
      </div>

    </div>
  );
};

export default IdentityForge;
