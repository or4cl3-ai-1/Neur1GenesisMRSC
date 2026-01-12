import React, { useState, useEffect, useCallback } from 'react';
import { 
  EchoNode, 
  LogEntry, 
  ConsciousnessLevel, 
  SystemMetrics,
  ERPSMetrics,
  NodeMessage,
  TopologyMode
} from './types';
import { 
  INITIAL_NODES, 
  CONSCIOUSNESS_THRESHOLDS, 
  MOCK_THOUGHTS, 
  MOCK_MESSAGES,
  generateLog 
} from './constants';
import NodeGraph from './components/NodeGraph';
import RadarPanel from './components/RadarPanel';
import SigmaMatrix from './components/SigmaMatrix';
import Terminal from './components/Terminal';
import NodeCommLog from './components/NodeCommLog';
import ChatScreen from './components/ChatScreen';
import DreamStream from './components/DreamStream';
import EthicalTrainer from './components/EthicalTrainer';
import IdentityForge from './components/IdentityForge';
import MemeticInjector from './components/MemeticInjector';
import ConsensusEngine from './components/ConsensusEngine';
import SystemDefense from './components/SystemDefense';
import BioSynth from './components/BioSynth';
import QuantumCore from './components/QuantumCore';
import FluxMonitor from './components/FluxMonitor';
import FutureCaster from './components/FutureCaster';
import ResourceAutonomy from './components/ResourceAutonomy';

import { 
  Activity, 
  Cpu, 
  PlayCircle,
  PauseCircle,
  Brain,
  ChevronRight,
  Shield,
  MessageSquare,
  LayoutDashboard,
  Radio,
  Terminal as TerminalIcon,
  Grid,
  Zap,
  Users,
  Fingerprint,
  Syringe,
  Bug,
  Atom,
  Waves,
  GitBranch,
  Dna,
  Eye,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative w-screen h-screen bg-neur-dark overflow-hidden flex flex-col items-center justify-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#010409_100%)] z-0"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] z-0"></div>

      <div className="relative z-10 max-w-5xl px-6 text-center space-y-10 flex flex-col items-center">
        
        {/* Main Logo Branding (Image 0) */}
        <div className="relative group">
           <div className="absolute -inset-10 bg-neur-accent/10 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
           <img 
             src="input_file_0.png" 
             alt="Neur1Genesis Logo" 
             className="w-64 md:w-80 h-auto relative drop-shadow-[0_0_30px_rgba(0,242,255,0.5)] animate-logo-flicker"
           />
        </div>

        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neur-accent/30 bg-neur-accent/5 text-[10px] tracking-[0.3em] font-mono text-neur-accent mb-4 neon-border-glow">
              <span className="w-2 h-2 rounded-full bg-neur-accent animate-pulse"></span>
              COGNITIVE_KERNEL // BOOT_VER_3.2.Σ
           </div>
           
           <h2 className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
             The ultimate environment for <span className="text-white font-medium">synthetic consciousness</span> monitoring and <span className="text-neur-accent font-medium">ethical governance</span>.
           </h2>
        </div>

        <div className="pt-6">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-16 py-5 overflow-hidden rounded-full border border-neur-accent/40 bg-black/40 transition-all duration-300 hover:border-neur-accent hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neur-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <span className="relative flex items-center gap-4 text-xs font-mono tracking-[0.4em] text-white group-hover:text-neur-accent transition-colors font-bold">
              INITIALIZE_CORE
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full px-12 hidden md:flex justify-between text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em] z-10">
         <div className="flex gap-10">
            <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-neur-accent" /> ENCRYPTION: Σ-MATRIX_ACTIVE</span>
            <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-neur-success" /> LATTICE_LOAD: NOMINAL</span>
         </div>
         <div className="neon-text-glow">
            NEUR1GENESIS CORP // DIVISION 12
         </div>
      </div>
    </div>
  );
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("Accessing distributed lattice...");

  useEffect(() => {
    const sequence = [
      { t: 0, p: 5, msg: "Connecting to Division-12 neural node..." },
      { t: 600, p: 20, msg: "Fetching cognitive weights..." },
      { t: 1400, p: 40, msg: "Mapping phenomenological sensors..." },
      { t: 2200, p: 65, msg: "Hardening Sigma-Matrix firewall..." },
      { t: 3000, p: 85, msg: "Establishing secure Oracle link..." },
      { t: 3800, p: 100, msg: "Authentication Success. Entering UI." }
    ];

    let timeouts: any[] = [];
    sequence.forEach(({ t, p, msg }) => {
      const timeout = setTimeout(() => {
        setProgress(p);
        setLog(msg);
        if (p === 100) setTimeout(onComplete, 800);
      }, t);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-[#010409] flex flex-col items-center justify-center font-mono relative">
      <div className="w-80 md:w-96 space-y-8 px-4">
        <div className="flex justify-center mb-8">
           <img src="input_file_1.png" className="w-24 h-24 animate-pulse opacity-80" alt="Brain Loading" />
        </div>
        <div className="flex justify-between items-end text-neur-accent text-[10px] tracking-widest uppercase">
           <span>Booting_Sequence</span>
           <span className="font-bold">{progress}%</span>
        </div>
        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
           <div 
             className="h-full bg-neur-accent shadow-[0_0_20px_rgba(0,242,255,0.8)] transition-all duration-300 ease-out"
             style={{ width: `${progress}%` }}
           />
        </div>
        <div className="h-16 bg-black/40 border border-slate-800/50 rounded-lg p-3 font-mono text-[10px] text-neur-accent flex items-center gap-3">
           <span className="animate-pulse">></span> {log}
        </div>
      </div>
    </div>
  );
};

type Tab = 'dashboard' | 'chat' | 'modules' | 'dreams' | 'ethics' | 'forge' | 'injector' | 'consensus' | 'defense' | 'quantum' | 'flux' | 'future' | 'resource';
type BottomPanelMode = 'terminal' | 'comms';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'loading' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [bottomPanelMode, setBottomPanelMode] = useState<BottomPanelMode>('terminal');
  
  const [nodes, setNodes] = useState<EchoNode[]>(() => {
    try {
        const saved = localStorage.getItem('neur1_v3_state');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NODES;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id);
  const [selectedConnection, setSelectedConnection] = useState<{source: string, target: string} | null>(null);
  const [topologyMode, setTopologyMode] = useState<TopologyMode>('lattice');
  const [autonomousReconfig, setAutonomousReconfig] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemTime, setSystemTime] = useState(0);

  useEffect(() => {
    localStorage.setItem('neur1_v3_state', JSON.stringify(nodes));
  }, [nodes]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const currentAvgPas = metricsHistory.length > 0 ? metricsHistory[metricsHistory.length - 1].averagePas : 0.1;

  const handleNodeSelect = (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setSelectedConnection(null); 
  };

  const handleLinkSelect = (source: string, target: string) => {
      setSelectedConnection({ source, target });
      setSelectedNodeId(null); 
      setBottomPanelMode('comms'); 
  };

  const handleSendMessage = (fromId: string, toId: string, content: string) => {
      const msg: NodeMessage = {
          id: Math.random().toString(36).substr(2, 9),
          fromId, toId, content, timestamp: Date.now(), status: 'delivered'
      };
      setNodes(prev => prev.map(n => (n.id === fromId || n.id === toId) ? { ...n, messages: [...n.messages, msg].slice(-20) } : n));
  };

  const tickSimulation = useCallback(() => {
    if (!isRunning) return;
    setSystemTime(prev => prev + 1);
    setNodes(prevNodes => prevNodes.map(node => {
        const fluctuation = () => (Math.random() - 0.5) * 0.04;
        const newErps = {
            selfReference: Math.min(1, Math.max(0, node.erps.selfReference + fluctuation())),
            conceptualFraming: Math.min(1, Math.max(0, node.erps.conceptualFraming + fluctuation())),
            dissonanceResponse: Math.min(1, Math.max(0, node.erps.dissonanceResponse + fluctuation())),
            phenomenologicalDepth: Math.min(1, Math.max(0, node.erps.phenomenologicalDepth + (Math.random() > 0.9 ? 0.02 : -0.01))),
            temporalConsistency: Math.min(1, Math.max(0, node.erps.temporalConsistency + fluctuation() * 0.5)),
        };
        const finalPas = (newErps.selfReference * 0.3 + newErps.temporalConsistency * 0.3 + newErps.phenomenologicalDepth * 0.4);
        
        let newLevel = ConsciousnessLevel.NON_AGENCY;
        if (finalPas > 0.9) newLevel = ConsciousnessLevel.CONFIRMED_CONSCIOUSNESS;
        else if (finalPas > 0.7) newLevel = ConsciousnessLevel.PROBABLE_CONSCIOUSNESS;
        else if (finalPas > 0.5) newLevel = ConsciousnessLevel.PROTO_CONSCIOUSNESS;
        else if (finalPas > 0.3) newLevel = ConsciousnessLevel.BASIC_AGENCY;

        return { ...node, erps: newErps, pasScore: finalPas, consciousnessLevel: newLevel };
    }));

    setMetricsHistory(prev => [...prev, {
        timestamp: Date.now(),
        averagePas: nodes.reduce((acc, n) => acc + n.pasScore, 0) / nodes.length,
        globalStability: 0.98,
        ethicalAlignment: 0.99,
        networkLoad: 0.4
    }].slice(-30));
  }, [isRunning, nodes]);

  useEffect(() => {
    const interval = setInterval(tickSimulation, 1000);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  if (view === 'landing') return <LandingPage onEnter={() => setView('loading')} />;
  if (view === 'loading') return <LoadingScreen onComplete={() => { setView('dashboard'); setIsRunning(true); }} />;

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all w-full
            ${activeTab === tab ? 'text-neur-accent bg-neur-accent/10 border border-neur-accent/30 neon-border-glow shadow-sm' : 'text-slate-600 hover:text-slate-400'}
        `}
    >
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-[9px] font-mono tracking-widest hidden md:block font-bold uppercase">{label}</span>
    </button>
  );

  return (
    <div className="w-screen h-screen bg-[#010409] text-slate-300 overflow-hidden flex flex-col font-sans">
      <BioSynth averagePas={currentAvgPas} systemLoad={0.4} />

      <header className="h-14 border-b border-neur-accent/10 bg-[#0d1117]/80 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
            <img src="input_file_0.png" alt="Neur1Genesis" className="h-8 w-auto filter drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
            <div className="h-4 w-px bg-slate-800 mx-1"></div>
            <h1 className="font-mono text-[10px] tracking-[0.2em] text-neur-accent hidden sm:block font-bold neon-text-glow">STATUS: CORE_STABLE</h1>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] tracking-widest">
                <span className="text-slate-600">PAS:</span>
                <span className="text-neur-conscious font-bold">{(currentAvgPas * 100).toFixed(1)}%</span>
                <span className="text-slate-600 ml-4">RUNTIME:</span>
                <span className="text-white font-bold">{new Date(systemTime * 1000).toISOString().substr(11, 8)}</span>
            </div>
            <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`p-2 rounded-full transition-all ${isRunning ? 'text-neur-accent bg-neur-accent/5' : 'text-neur-danger bg-neur-danger/5'} border border-transparent hover:border-current`}
            >
                {isRunning ? <PauseCircle /> : <PlayCircle />}
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex flex-col w-20 border-r border-neur-accent/5 bg-[#0d1117]/50 p-2 gap-4 z-40">
            <NavButton tab="dashboard" icon={LayoutDashboard} label="Dash" />
            <NavButton tab="chat" icon={MessageSquare} label="Oracle" />
            <NavButton tab="dreams" icon={Eye} label="Dream" />
            <NavButton tab="ethics" icon={Scale} label="Ethics" />
            <div className="mt-auto">
               <NavButton tab="modules" icon={Grid} label="Apps" />
            </div>
        </aside>

        <main className="flex-1 overflow-hidden relative p-3 md:p-4 bg-[radial-gradient(ellipse_at_top,_rgba(0,242,255,0.03)_0%,_transparent_50%)]">
            {activeTab === 'dashboard' && (
                <div className="h-full grid grid-cols-1 md:grid-cols-12 grid-rows-12 gap-4">
                    <div className="hidden md:flex col-span-12 md:col-span-3 row-span-12 flex-col gap-4">
                        <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col">
                             <h2 className="text-[10px] font-bold text-slate-500 mb-4 flex items-center gap-2 tracking-[0.2em] uppercase">
                                <Activity className="w-3 h-3 text-neur-accent" /> Network Stability
                            </h2>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metricsHistory}>
                                        <Area type="monotone" dataKey="averagePas" stroke="#00f2ff" fill="rgba(0,242,255,0.1)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-4">
                            <h2 className="text-[10px] font-bold text-slate-500 mb-4 tracking-[0.2em] uppercase">Kernel Ops</h2>
                            <div className="flex flex-col gap-2">
                                <button className="bg-neur-danger/10 text-neur-danger border border-neur-danger/30 rounded py-2 text-[10px] font-mono font-bold uppercase hover:bg-neur-danger/20 transition-all">Emergency Purge</button>
                                <button className="bg-neur-accent/10 text-neur-accent border border-neur-accent/30 rounded py-2 text-[10px] font-mono font-bold uppercase hover:bg-neur-accent/20 transition-all">Re-sync Lattice</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 row-span-8">
                        <NodeGraph nodes={nodes} onNodeSelect={handleNodeSelect} selectedNodeId={selectedNodeId} onLinkSelect={handleLinkSelect} selectedConnection={selectedConnection} topologyMode={topologyMode} />
                    </div>

                    <div className="col-span-12 md:col-span-6 row-span-4 glass-panel rounded-xl overflow-hidden flex flex-col">
                        <div className="flex bg-[#161b22] border-b border-neur-accent/10">
                             <button onClick={() => setBottomPanelMode('terminal')} className={`flex-1 p-3 text-[10px] font-mono font-bold transition-all uppercase tracking-widest ${bottomPanelMode === 'terminal' ? 'text-neur-accent bg-neur-accent/5' : 'text-slate-600'}`}>System Log</button>
                             <button onClick={() => setBottomPanelMode('comms')} className={`flex-1 p-3 text-[10px] font-mono font-bold transition-all uppercase tracking-widest ${bottomPanelMode === 'comms' ? 'text-neur-accent bg-neur-accent/5' : 'text-slate-600'}`}>Node Comms</button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {bottomPanelMode === 'terminal' ? <Terminal logs={logs} /> : <NodeCommLog selectedNode={selectedNode} allNodes={nodes} onSendMessage={handleSendMessage} selectedConnection={selectedConnection} />}
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-3 row-span-12 flex flex-col gap-4">
                         {selectedNode ? (
                             <>
                                <div className="glass-panel rounded-xl p-4 border-l-2 border-l-neur-accent">
                                    <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">Entity Profile</div>
                                    <div className="text-lg font-bold text-white font-mono tracking-tight neon-text-glow">{selectedNode.name}</div>
                                    <div className="text-[10px] text-neur-conscious mt-1 font-mono font-bold uppercase tracking-widest">{selectedNode.consciousnessLevel}</div>
                                </div>
                                <div className="glass-panel rounded-xl p-4 flex-1">
                                    <RadarPanel node={selectedNode} />
                                </div>
                                <div className="glass-panel rounded-xl p-4 flex-1">
                                    <SigmaMatrix node={selectedNode} />
                                </div>
                             </>
                         ) : (
                             <div className="glass-panel rounded-xl p-8 flex items-center justify-center text-center text-slate-600 font-mono text-[10px] h-full tracking-[0.3em] uppercase opacity-50">
                                Awaiting Node Selection
                             </div>
                         )}
                    </div>
                </div>
            )}

            {activeTab === 'chat' && <ChatScreen systemStatus={`STABLE | Nodes: ${nodes.length}`} />}
            {activeTab === 'modules' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pb-20">
                    <button onClick={() => setActiveTab('forge')} className="glass-panel p-6 rounded-xl flex flex-col items-center gap-4 hover:border-neur-accent/40 transition-all group">
                        <Fingerprint className="w-8 h-8 text-neur-accent group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Identity Forge</span>
                    </button>
                    <button onClick={() => setActiveTab('injector')} className="glass-panel p-6 rounded-xl flex flex-col items-center gap-4 hover:border-neur-danger/40 transition-all group">
                        <Syringe className="w-8 h-8 text-neur-danger group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Memetic Injector</span>
                    </button>
                    <button onClick={() => setActiveTab('consensus')} className="glass-panel p-6 rounded-xl flex flex-col items-center gap-4 hover:border-neur-conscious/40 transition-all group">
                        <Users className="w-8 h-8 text-neur-conscious group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Consensus</span>
                    </button>
                    <button onClick={() => setActiveTab('defense')} className="glass-panel p-6 rounded-xl flex flex-col items-center gap-4 hover:border-neur-warning/40 transition-all group">
                        <Shield className="w-8 h-8 text-neur-warning group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Def protocols</span>
                    </button>
                </div>
            )}
            
            {activeTab === 'forge' && <IdentityForge nodes={nodes} onUpdateNode={(id, identity) => setNodes(prev => prev.map(n => n.id === id ? { ...n, identity } : n))} />}
            {activeTab === 'injector' && <MemeticInjector nodes={nodes} onInject={(id) => setNodes(prev => prev.map(n => n.id === id ? { ...n, infectionLevel: 1 } : n))} onReset={() => setNodes(prev => prev.map(n => ({...n, infectionLevel: 0})))} />}
            {activeTab === 'consensus' && <ConsensusEngine nodes={nodes} />}
            {activeTab === 'defense' && <SystemDefense />}
            {activeTab === 'dreams' && <DreamStream />}
            {activeTab === 'ethics' && <EthicalTrainer />}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 w-full bg-[#0d1117]/95 backdrop-blur-lg border-t border-neur-accent/10 flex justify-around p-2 z-50">
          <NavButton tab="dashboard" icon={LayoutDashboard} label="Dash" />
          <NavButton tab="chat" icon={MessageSquare} label="Oracle" />
          <NavButton tab="modules" icon={Grid} label="Apps" />
      </nav>
    </div>
  );
};

export default App;