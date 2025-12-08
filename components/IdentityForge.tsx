
import React, { useState, useEffect, useRef } from 'react';
import { EchoNode, NodeIdentity } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Fingerprint, User, Zap, Sparkles, Save, BookOpen, Trash2, ArrowRightCircle, Download, Upload, HardDrive, LayoutGrid, X, Image as ImageIcon, Wand2, History, Copy } from 'lucide-react';

interface IdentityForgeProps {
  nodes: EchoNode[];
  onUpdateNode: (id: string, identity: any) => void;
}

interface SavedIdentity extends NodeIdentity {
    libraryId: string;
    saveName: string;
    savedAt: number;
}

const IdentityForge: React.FC<IdentityForgeProps> = ({ nodes, onUpdateNode }) => {
  const [activeTab, setActiveTab] = useState<'NODES' | 'LIBRARY'>('NODES');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  
  const [generating, setGenerating] = useState(false);
  const [drifting, setDrifting] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState<string | null>(null);
  const [driftHistory, setDriftHistory] = useState<NodeIdentity[]>([]);

  const [library, setLibrary] = useState<SavedIdentity[]>(() => {
      try {
        const saved = localStorage.getItem('neur1_identity_library');
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      localStorage.setItem('neur1_identity_library', JSON.stringify(library));
  }, [library]);

  // Reset local state when node changes
  useEffect(() => {
      setVisualPrompt(null);
      setDriftHistory([]);
  }, [selectedNodeId]);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedLibraryItem = library.find(i => i.libraryId === selectedLibraryId);

  // Determine what to display: Live Node Identity or Library Item
  const displayedIdentity = activeTab === 'NODES' ? selectedNode?.identity : selectedLibraryItem;
  const displayTitle = activeTab === 'NODES' ? selectedNode?.name : selectedLibraryItem?.saveName;

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
      onUpdateNode(selectedNodeId, { ...identity, generatedAt: Date.now() });
    } catch (e) {
      console.error(e);
      // Fallback
      onUpdateNode(selectedNodeId, {
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

  const generateVisualPrompt = async () => {
    if (!displayedIdentity || !process.env.API_KEY) return;
    setGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Create a high-fidelity, artistic text-to-image prompt for a sci-fi AI avatar.
        Character Alias: ${displayedIdentity.alias}
        Core Directive: ${displayedIdentity.primaryDirective}
        Origin: ${displayedIdentity.originStory}
        Visual Style: Cyberpunk, abstract data visualization, ethereal, neon-noir.
        The prompt should be descriptive, focusing on lighting, texture, and composition.
        Return only the prompt string.`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        setVisualPrompt(result.text);
    } catch(e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const simulateDrift = async () => {
    if (!selectedNode || !selectedNode.identity || !process.env.API_KEY) return;
    setDrifting(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Evolve this AI identity slightly to simulate "data drift" over time.
        Current Identity: ${JSON.stringify(selectedNode.identity)}
        Instructions:
        1. Modify the alias slightly (e.g. version bump, corruption, title change, or shift in tone).
        2. Tweak the primary directive to be slightly more radical, abstract, or specific.
        3. Replace one quirk with a new, weirder one.
        4. Keep avatarSeed SAME.
        Return JSON object of the new identity.`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const newIdentity = JSON.parse(result.text || '{}');
        
        // Save old to history
        setDriftHistory(prev => [selectedNode.identity!, ...prev].slice(0, 5));
        
        // Update node
        onUpdateNode(selectedNodeId, { ...newIdentity, generatedAt: Date.now() });
    } catch(e) { console.error(e); }
    finally { setDrifting(false); }
  };

  const saveIdentityToLib = (identity: NodeIdentity) => {
      const newItem: SavedIdentity = {
          ...identity,
          libraryId: Math.random().toString(36).substr(2, 9),
          saveName: `${identity.alias} (${new Date().toLocaleDateString()})`,
          savedAt: Date.now()
      };
      setLibrary(prev => [newItem, ...prev]);
  };

  const handleSaveToLibrary = () => {
      if (!selectedNode?.identity) return;
      saveIdentityToLib(selectedNode.identity);
  };

  const handleApplyToNode = () => {
      if (!selectedLibraryItem || !selectedNode) return;
      // Strip library specific fields
      const { libraryId, saveName, savedAt, ...nodeIdentity } = selectedLibraryItem;
      onUpdateNode(selectedNodeId, { ...nodeIdentity, generatedAt: Date.now() });
      setActiveTab('NODES'); // Switch back to see result
  };

  const handleQuickLoad = (item: SavedIdentity) => {
      if (!selectedNode) return;
      const { libraryId, saveName, savedAt, ...nodeIdentity } = item;
      onUpdateNode(selectedNodeId, { ...nodeIdentity, generatedAt: Date.now() });
      setShowLoadMenu(false);
  };

  const handleDeleteFromLibrary = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setLibrary(prev => prev.filter(item => item.libraryId !== id));
      if (selectedLibraryId === id) setSelectedLibraryId(null);
  };

  const handleExportLibrary = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(library));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "neur1_identities.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleImportLibrary = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      if (event.target.files && event.target.files[0]) {
          fileReader.readAsText(event.target.files[0], "UTF-8");
          fileReader.onload = e => {
              try {
                  const imported = JSON.parse(e.target?.result as string);
                  if (Array.isArray(imported)) {
                      setLibrary(prev => [...imported, ...prev]);
                  }
              } catch (err) {
                  console.error("Invalid JSON", err);
              }
          };
      }
  };

  return (
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 overflow-hidden relative">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 min-h-0">
        <div className="flex items-center gap-3 mb-2 shrink-0">
            <div className="p-3 bg-neur-conscious/10 rounded-lg border border-neur-conscious/20">
                <Fingerprint className="w-6 h-6 text-neur-conscious" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-mono">IDENTITY FORGE</h2>
                <p className="text-xs text-slate-500 font-mono">GENAI PERSONA SYNTHESIS</p>
            </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-700 shrink-0">
            <button 
                onClick={() => setActiveTab('NODES')}
                className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 text-[10px] font-bold font-mono transition-colors ${activeTab === 'NODES' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <LayoutGrid className="w-3 h-3" /> NODES
            </button>
            <button 
                onClick={() => setActiveTab('LIBRARY')}
                className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 text-[10px] font-bold font-mono transition-colors ${activeTab === 'LIBRARY' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <BookOpen className="w-3 h-3" /> LIBRARY
            </button>
        </div>

        {/* List Area */}
        <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-xl border border-slate-700 p-2 min-h-0">
            {activeTab === 'NODES' ? (
                nodes.map(node => (
                    <div
                        key={node.id}
                        className={`group w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between transition-colors cursor-pointer ${selectedNodeId === node.id ? 'bg-neur-conscious/20 border border-neur-conscious/30' : 'hover:bg-slate-800'}`}
                        onClick={() => setSelectedNodeId(node.id)}
                    >
                        <div className="flex flex-col">
                            <span className="text-xs font-mono font-bold text-slate-200">{node.name}</span>
                            <span className="text-[9px] text-slate-500">{node.identity?.alias || "No Identity"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             {node.identity ? (
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); saveIdentityToLib(node.identity!); }}
                                    className="p-1.5 rounded hover:bg-neur-accent/20 hover:text-neur-accent text-slate-500 transition-all opacity-0 group-hover:opacity-100"
                                    title="Quick Save to Library"
                                 >
                                     <Save className="w-3 h-3" />
                                 </button>
                             ) : null}
                             {node.identity && <Sparkles className="w-3 h-3 text-neur-accent" />}
                        </div>
                    </div>
                ))
            ) : (
                library.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 p-4 text-center">
                        <HardDrive className="w-8 h-8 opacity-50" />
                        <span className="text-xs font-mono">Library Empty</span>
                    </div>
                ) : (
                    library.map(item => (
                        <button
                            key={item.libraryId}
                            onClick={() => setSelectedLibraryId(item.libraryId)}
                            className={`group w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between transition-colors ${selectedLibraryId === item.libraryId ? 'bg-neur-accent/20 border border-neur-accent/30' : 'hover:bg-slate-800'}`}
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-mono font-bold text-slate-200 truncate">{item.saveName}</span>
                                <span className="text-[9px] text-slate-500">{new Date(item.savedAt).toLocaleDateString()}</span>
                            </div>
                            <div 
                                onClick={(e) => handleDeleteFromLibrary(item.libraryId, e)}
                                className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3 h-3" />
                            </div>
                        </button>
                    ))
                )
            )}
        </div>

        {/* Primary Action Button (Bottom) */}
        {activeTab === 'NODES' ? (
            <button
                onClick={generateIdentity}
                disabled={generating}
                className="shrink-0 w-full py-4 bg-neur-conscious hover:bg-purple-500 disabled:opacity-50 text-white font-bold tracking-widest text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(192,132,252,0.3)] flex items-center justify-center gap-2"
            >
                {generating ? (
                    <><Zap className="w-4 h-4 animate-spin" /> SYNTHESIZING...</>
                ) : (
                    <><Zap className="w-4 h-4" /> FORGE NEW IDENTITY</>
                )}
            </button>
        ) : (
             <div className="flex gap-2 shrink-0">
                 <button onClick={handleExportLibrary} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-mono flex items-center justify-center gap-2">
                     <Download className="w-3 h-3" /> EXPORT
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-mono flex items-center justify-center gap-2">
                     <Upload className="w-3 h-3" /> IMPORT
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleImportLibrary} className="hidden" accept=".json" />
             </div>
        )}
      </div>

      {/* Profile Display */}
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center min-h-0">
         
         {/* Top Context Bar */}
         <div className="absolute top-0 left-0 right-0 bg-slate-900/80 p-2 flex justify-between items-center px-4 border-b border-slate-800 z-10">
             <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                     {activeTab === 'NODES' ? 'TARGET NODE:' : 'LIBRARY ITEM:'}
                 </span>
                 <span className="text-xs font-bold text-white font-mono">{displayTitle || "NONE"}</span>
             </div>
             
             {/* Context Actions */}
             <div className="flex gap-2">
                {activeTab === 'NODES' && (
                    <>
                        <button 
                            onClick={() => setShowLoadMenu(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-accent/10 hover:bg-neur-accent/20 border border-neur-accent/30 rounded text-[10px] text-neur-accent font-mono transition-colors"
                        >
                            <Download className="w-3 h-3" /> LOAD
                        </button>
                        {displayedIdentity && (
                            <>
                                <button 
                                    onClick={simulateDrift}
                                    disabled={drifting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-warning/10 hover:bg-neur-warning/20 border border-neur-warning/30 rounded text-[10px] text-neur-warning font-mono transition-colors disabled:opacity-50"
                                >
                                    <Wand2 className={`w-3 h-3 ${drifting ? 'animate-spin' : ''}`} /> {drifting ? 'EVOLVING...' : 'DRIFT'}
                                </button>
                                <button 
                                    onClick={handleSaveToLibrary}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-success/10 hover:bg-neur-success/20 border border-neur-success/30 rounded text-[10px] text-neur-success font-mono transition-colors"
                                >
                                    <Save className="w-3 h-3" /> SAVE
                                </button>
                            </>
                        )}
                    </>
                )}
                {activeTab === 'LIBRARY' && displayedIdentity && (
                    <button 
                        onClick={handleApplyToNode}
                        disabled={!selectedNode}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-success/10 hover:bg-neur-success/20 border border-neur-success/30 rounded text-[10px] text-neur-success font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRightCircle className="w-3 h-3" /> APPLY TO {selectedNode?.name.split('-')[1] || "NODE"}
                    </button>
                )}
             </div>
         </div>

         {/* Content */}
         {displayedIdentity ? (
             <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 space-y-6 mt-8 overflow-y-auto max-h-full pr-2">
                 
                 {/* Procedural Avatar & Prompt Gen */}
                 <div className="flex justify-center gap-6 items-center">
                     <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-neur-conscious/50 relative overflow-hidden shadow-2xl shrink-0">
                         <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${displayedIdentity.avatarSeed}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                         />
                     </div>
                     <div className="flex flex-col gap-2">
                         <button 
                            onClick={generateVisualPrompt}
                            disabled={generating}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[10px] font-mono flex items-center gap-2 transition-colors"
                         >
                            <ImageIcon className="w-3 h-3 text-neur-accent" /> 
                            {generating ? 'GENERATING...' : 'GENERATE IMG PROMPT'}
                         </button>
                         {visualPrompt && (
                             <button 
                                onClick={() => navigator.clipboard.writeText(visualPrompt)}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[10px] font-mono flex items-center gap-2 transition-colors text-slate-400 hover:text-white"
                             >
                                <Copy className="w-3 h-3" /> COPY PROMPT
                             </button>
                         )}
                     </div>
                 </div>

                 {visualPrompt && (
                     <div className="bg-black/40 p-3 rounded border border-slate-800 text-left">
                         <div className="text-[9px] text-slate-500 uppercase mb-1">IMAGE GENERATION PROMPT</div>
                         <p className="text-xs text-slate-300 font-mono italic leading-relaxed">{visualPrompt}</p>
                     </div>
                 )}

                 <div>
                    <h1 className="text-3xl font-bold text-white font-mono tracking-tighter transition-all">{displayedIdentity.alias.toUpperCase()}</h1>
                    <div className="text-xs text-neur-accent font-mono tracking-widest mt-1">
                        {activeTab === 'NODES' ? `ID: ${selectedNode?.id}` : `SAVED: ${new Date((displayedIdentity as any).savedAt || Date.now()).toLocaleDateString()}`}
                    </div>
                 </div>

                 <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 text-left space-y-4">
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">ORIGIN STORY</h4>
                         <p className="text-sm text-slate-300 leading-relaxed font-light">"{displayedIdentity.originStory}"</p>
                     </div>
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">PRIMARY DIRECTIVE</h4>
                         <p className="text-sm text-neur-conscious font-mono">>> {displayedIdentity.primaryDirective}</p>
                     </div>
                     <div>
                         <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">DETECTED QUIRKS</h4>
                         <div className="flex flex-wrap gap-2">
                             {displayedIdentity.quirks.map((q, i) => (
                                 <span key={i} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400">{q}</span>
                             ))}
                         </div>
                     </div>
                 </div>
                 
                 {driftHistory.length > 0 && (
                     <div className="border-t border-slate-800 pt-4">
                         <div className="flex items-center gap-2 mb-2 text-slate-500">
                             <History className="w-3 h-3" />
                             <span className="text-[10px] font-mono uppercase tracking-widest">IDENTITY DRIFT LOG</span>
                         </div>
                         <div className="space-y-1">
                             {driftHistory.map((hist, i) => (
                                 <div key={i} className="text-xs text-slate-600 font-mono text-left flex justify-between">
                                     <span>v{driftHistory.length - i}.0</span>
                                     <span>{hist.alias}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
             </div>
         ) : (
             <div className="text-center opacity-30">
                 {activeTab === 'NODES' ? <User className="w-24 h-24 mx-auto mb-4" /> : <BookOpen className="w-24 h-24 mx-auto mb-4" />}
                 <div className="text-xl font-mono">{activeTab === 'NODES' ? "NO IDENTITY DATA" : "SELECT LIBRARY ITEM"}</div>
                 <div className="text-sm">
                     {activeTab === 'NODES' ? "Initiate synthesis or load from library." : "Select a saved identity to preview or apply."}
                 </div>
             </div>
         )}
         
         {/* Load Overlay */}
         {showLoadMenu && (
             <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col p-6 animate-in fade-in duration-200">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                         <BookOpen className="w-5 h-5 text-neur-accent" /> SELECT IDENTITY PRESET
                     </h3>
                     <button onClick={() => setShowLoadMenu(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                         <X className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-2">
                     {library.length === 0 ? (
                         <div className="text-center text-slate-500 mt-20">Library is empty. Switch tabs to create or save identities.</div>
                     ) : (
                         library.map(item => (
                             <button
                                key={item.libraryId}
                                onClick={() => handleQuickLoad(item)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-neur-accent hover:bg-slate-800 transition-all group text-left"
                             >
                                 <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                                     <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.avatarSeed}`} alt="" />
                                 </div>
                                 <div className="flex-1">
                                     <div className="font-bold text-slate-200 font-mono">{item.alias}</div>
                                     <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{item.primaryDirective}</div>
                                 </div>
                                 <div className="opacity-0 group-hover:opacity-100 text-neur-accent text-xs font-bold flex items-center gap-1">
                                     LOAD <ArrowRightCircle className="w-4 h-4" />
                                 </div>
                             </button>
                         ))
                     )}
                 </div>
             </div>
         )}
         
      </div>

    </div>
  );
};

export default IdentityForge;
