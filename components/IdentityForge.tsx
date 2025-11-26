
import React, { useState, useEffect, useRef } from 'react';
import { EchoNode, NodeIdentity } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Fingerprint, User, Shield, Zap, Sparkles, Database, Save, BookOpen, Trash2, ArrowRightCircle, Download, Upload, HardDrive, LayoutGrid } from 'lucide-react';

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
  
  const [generating, setGenerating] = useState(false);
  const [library, setLibrary] = useState<SavedIdentity[]>(() => {
      const saved = localStorage.getItem('neur1_identity_library');
      return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      localStorage.setItem('neur1_identity_library', JSON.stringify(library));
  }, [library]);
  
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
    <div className="h-full glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
      
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
                    <><Database className="w-4 h-4 animate-spin" /> SYNTHESIZING...</>
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
         <div className="absolute top-0 left-0 right-0 bg-slate-900/80 p-2 flex justify-between items-center px-4 border-b border-slate-800">
             <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                     {activeTab === 'NODES' ? 'TARGET NODE:' : 'LIBRARY ITEM:'}
                 </span>
                 <span className="text-xs font-bold text-white font-mono">{displayTitle || "NONE"}</span>
             </div>
             
             {/* Context Actions */}
             {displayedIdentity && (
                <div className="flex gap-2">
                    {activeTab === 'NODES' && (
                        <button 
                            onClick={handleSaveToLibrary}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-accent/10 hover:bg-neur-accent/20 border border-neur-accent/30 rounded text-[10px] text-neur-accent font-mono transition-colors"
                        >
                            <Save className="w-3 h-3" /> SAVE TO LIB
                        </button>
                    )}
                    {activeTab === 'LIBRARY' && (
                        <button 
                            onClick={handleApplyToNode}
                            disabled={!selectedNode}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-neur-success/10 hover:bg-neur-success/20 border border-neur-success/30 rounded text-[10px] text-neur-success font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRightCircle className="w-3 h-3" /> APPLY TO {selectedNode?.name.split('-')[1] || "NODE"}
                        </button>
                    )}
                </div>
             )}
         </div>

         {/* Content */}
         {displayedIdentity ? (
             <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 space-y-6 mt-8 overflow-y-auto max-h-full pr-2">
                 {/* Procedural Avatar Placeholder using seed */}
                 <div className="w-32 h-32 mx-auto rounded-full bg-slate-900 border-4 border-neur-conscious/50 relative overflow-hidden shadow-2xl shrink-0">
                     <div className="absolute inset-0 bg-gradient-to-br from-neur-conscious via-transparent to-neur-accent opacity-50"></div>
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-mono font-bold text-white opacity-20">
                         {displayedIdentity.alias.substring(0,2).toUpperCase()}
                     </div>
                 </div>

                 <div>
                    <h1 className="text-3xl font-bold text-white font-mono tracking-tighter">{displayedIdentity.alias.toUpperCase()}</h1>
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
             </div>
         ) : (
             <div className="text-center opacity-30">
                 {activeTab === 'NODES' ? <User className="w-24 h-24 mx-auto mb-4" /> : <BookOpen className="w-24 h-24 mx-auto mb-4" />}
                 <div className="text-xl font-mono">{activeTab === 'NODES' ? "NO IDENTITY DATA" : "SELECT LIBRARY ITEM"}</div>
                 <div className="text-sm">
                     {activeTab === 'NODES' ? "Initiate synthesis to generate persona." : "Select a saved identity to preview or apply."}
                 </div>
             </div>
         )}
      </div>

    </div>
  );
};

export default IdentityForge;
