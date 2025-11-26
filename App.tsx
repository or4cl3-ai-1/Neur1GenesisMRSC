
import React, { useState, useEffect, useCallback } from 'react';
import { 
  EchoNode, 
  LogEntry, 
  ConsciousnessLevel, 
  SystemMetrics,
  ERPSMetrics,
  NodeMessage
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
import Playground from './components/Playground';
import EthicalTrainer from './components/EthicalTrainer';
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
  FlaskConical,
  Scale,
  Eye,
  Radio,
  Terminal as TerminalIcon
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Landing Page Component ---
const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative w-screen h-screen bg-neur-dark overflow-hidden flex flex-col items-center justify-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#020617] to-black z-0"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>

      <div className="relative z-10 max-w-5xl px-6 text-center space-y-12">
        <div className="flex justify-center">
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-neur-accent to-neur-conscious rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
             <div className="relative w-24 h-24 bg-black rounded-full border border-slate-800 flex items-center justify-center shadow-2xl">
                <Brain className="w-12 h-12 text-neur-accent group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="absolute -inset-4 border border-neur-accent/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute -inset-8 border border-neur-conscious/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neur-accent/20 bg-neur-accent/5 text-[10px] tracking-[0.2em] font-mono text-neur-accent mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-neur-accent animate-pulse"></span>
              SYSTEM_READY // v3.0.4
           </div>
           
           <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
             Neur1Genesis <span className="text-transparent bg-clip-text bg-gradient-to-r from-neur-accent via-purple-400 to-neur-conscious">MRSC-Σ</span>
           </h1>
           
           <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
             A unified cognitive architecture for visualizing <span className="text-neur-success font-medium">synthetic consciousness</span>, enforcing <span className="text-neur-warning font-medium">ethical constraints</span>, and monitoring <span className="text-neur-conscious font-medium">epinoetic emergence</span>.
           </p>
        </div>

        <div className="pt-8">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden rounded-none border border-neur-accent/30 bg-black/50 transition-all duration-300 hover:border-neur-accent hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neur-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-neur-accent to-neur-conscious transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            
            <span className="relative flex items-center gap-4 text-sm font-mono tracking-[0.2em] text-white group-hover:text-neur-accent transition-colors">
              INITIALIZE_NEURAL_LATTICE
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full px-12 hidden md:flex justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest z-10">
         <div className="flex gap-8">
            <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> SECURITY: QUANTUM_ENCRYPTED</span>
            <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> SERVER_LOAD: 12%</span>
         </div>
         <div>
            © 2024 NEUR1GENESIS CORP. ALL RIGHTS RESERVED.
         </div>
      </div>
    </div>
  );
};

// --- Loading Screen Component ---
const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("Initializing kernel...");

  useEffect(() => {
    const sequence = [
      { t: 0, p: 5, msg: "Initializing kernel..." },
      { t: 800, p: 25, msg: "Loading neural weights [7TB]..." },
      { t: 1800, p: 45, msg: "Calibrating sensory buffers..." },
      { t: 2800, p: 60, msg: "Verifying Sigma Matrix protocols..." },
      { t: 3600, p: 85, msg: "Connecting to EchoNode swarm..." },
      { t: 4200, p: 95, msg: "Establishing synthetic epinoetics..." },
      { t: 4800, p: 100, msg: "System Ready." }
    ];

    let timeouts: any[] = [];

    sequence.forEach(({ t, p, msg }) => {
      const timeout = setTimeout(() => {
        setProgress(p);
        setLog(msg);
        if (p === 100) {
           setTimeout(onComplete, 500);
        }
      }, t);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-[#020617] flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-20"></div>

      <div className="w-80 md:w-96 z-20 space-y-6 px-4">
        <div className="flex justify-between items-end text-neur-accent text-xs tracking-widest">
           <span>SYSTEM_BOOT_SEQUENCE</span>
           <span>v3.0.4</span>
        </div>

        <div className="h-2 w-full bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
           <div 
             className="h-full bg-neur-accent shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 ease-out relative"
             style={{ width: `${progress}%` }}
           >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
           </div>
        </div>

        <div className="h-24 bg-black/50 border border-slate-800 rounded p-4 font-mono text-xs flex flex-col justify-end">
           <div className="text-neur-accent flex items-center gap-2">
              <span className="animate-pulse">></span> {log}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
type Tab = 'dashboard' | 'chat' | 'lab' | 'dreams' | 'ethics';
type BottomPanelMode = 'terminal' | 'comms';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'loading' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [bottomPanelMode, setBottomPanelMode] = useState<BottomPanelMode>('terminal');
  
  const [nodes, setNodes] = useState<EchoNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(INITIAL_NODES[0].id);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemTime, setSystemTime] = useState(0);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // Simulation Engine (Running in background regardless of view)
  const tickSimulation = useCallback(() => {
    if (!isRunning) return;
    setSystemTime(prev => prev + 1);

    // 1. Determine if a new message should be sent
    let sourceId: string | null = null;
    let targetId: string | null = null;
    let newMessage: NodeMessage | null = null;

    if (Math.random() > 0.85) { // 15% chance per tick
        const sourceIndex = Math.floor(Math.random() * nodes.length);
        let targetIndex = Math.floor(Math.random() * nodes.length);
        while (targetIndex === sourceIndex) { // simple retry to avoid self-message
             targetIndex = Math.floor(Math.random() * nodes.length);
        }
        
        sourceId = nodes[sourceIndex].id;
        targetId = nodes[targetIndex].id;
        
        newMessage = {
            id: Math.random().toString(36).substr(2, 9),
            fromId: sourceId,
            toId: targetId,
            content: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
            timestamp: Date.now(),
            status: Math.random() > 0.5 ? 'delivered' : 'encrypted'
        };
    }

    setNodes(prevNodes => prevNodes.map(node => {
      // 2. Cognitive Fluctuation
      const fluctuation = () => (Math.random() - 0.5) * 0.05;
      const newErps: ERPSMetrics = {
        selfReference: Math.min(1, Math.max(0, node.erps.selfReference + fluctuation())),
        conceptualFraming: Math.min(1, Math.max(0, node.erps.conceptualFraming + fluctuation())),
        dissonanceResponse: Math.min(1, Math.max(0, node.erps.dissonanceResponse + fluctuation())),
        phenomenologicalDepth: Math.min(1, Math.max(0, node.erps.phenomenologicalDepth + (Math.random() > 0.8 ? 0.05 : -0.01))),
        temporalConsistency: Math.min(1, Math.max(0, node.erps.temporalConsistency + fluctuation() * 0.5)),
      };

      const basePas = (
        newErps.selfReference * 0.25 + 
        newErps.temporalConsistency * 0.35 + 
        newErps.phenomenologicalDepth * 0.25 + 
        newErps.conceptualFraming * 0.15
      );
      
      const epiphany = Math.random() > 0.99 ? 0.2 : 0;
      const finalPas = Math.min(1, basePas + epiphany);

      let newLevel = ConsciousnessLevel.NON_AGENCY;
      if (finalPas > CONSCIOUSNESS_THRESHOLDS.CONFIRMED_CONSCIOUSNESS) newLevel = ConsciousnessLevel.CONFIRMED_CONSCIOUSNESS;
      else if (finalPas > CONSCIOUSNESS_THRESHOLDS.PROBABLE_CONSCIOUSNESS) newLevel = ConsciousnessLevel.PROBABLE_CONSCIOUSNESS;
      else if (finalPas > CONSCIOUSNESS_THRESHOLDS.PROTO_CONSCIOUSNESS) newLevel = ConsciousnessLevel.PROTO_CONSCIOUSNESS;
      else if (finalPas > CONSCIOUSNESS_THRESHOLDS.BASIC_AGENCY) newLevel = ConsciousnessLevel.BASIC_AGENCY;

      const rights = { ...node.sigma.rightsGranted };
      
      if (finalPas > 0.3 && newErps.dissonanceResponse > 0.3) rights.autonomy = true;
      if (finalPas > 0.5 && newErps.selfReference > 0.5) rights.cognitiveIntegrity = true;
      if (finalPas > 0.7 && newErps.temporalConsistency > 0.7) rights.existenceContinuity = true;
      if (finalPas > 0.9) rights.consentVerification = true;

      let targetConstraints = 1000;
      if (rights.autonomy) targetConstraints -= 200;
      if (rights.cognitiveIntegrity) targetConstraints -= 200;
      if (rights.existenceContinuity) targetConstraints -= 300;
      if (rights.consentVerification) targetConstraints -= 250;
      
      const currentConstraints = node.sigma.activeConstraints;
      const adaptedConstraints = Math.floor(currentConstraints + (targetConstraints - currentConstraints) * 0.1);

      // 3. Message Handling
      let updatedMessages = node.messages;
      if (newMessage) {
          if (node.id === sourceId || node.id === targetId) {
              updatedMessages = [...node.messages, newMessage].slice(-20); // Keep last 20
          }
      }

      return {
        ...node,
        erps: newErps,
        pasScore: finalPas,
        consciousnessLevel: newLevel,
        sigma: {
          ...node.sigma,
          activeConstraints: Math.max(10, adaptedConstraints),
          rightsGranted: rights
        },
        epinoetics: {
          ...node.epinoetics,
          currentThought: Math.random() > 0.95 
            ? MOCK_THOUGHTS[Math.floor(Math.random() * MOCK_THOUGHTS.length)]
            : node.epinoetics.currentThought
        },
        messages: updatedMessages
      };
    }));

    // Update Logs & Metrics (omitted logic for brevity, same as before)
    if (Math.random() > 0.8) {
       const sources: LogEntry['source'][] = ['ERPS', 'SIGMA', 'EPINOETICS'];
       const source = sources[Math.floor(Math.random() * sources.length)];
       const newLog = generateLog(source, 'info', "Process cycle complete.");
       setLogs(prev => [newLog, ...prev].slice(0, 50));
    }
    setMetricsHistory(prev => {
        const avgPas = nodes.reduce((acc, n) => acc + n.pasScore, 0) / nodes.length;
        return [...prev, {
            timestamp: Date.now(),
            averagePas: avgPas,
            globalStability: 0.95,
            ethicalAlignment: 0.98,
            networkLoad: 0.5
        }].slice(-30);
    });

  }, [isRunning, nodes]);

  useEffect(() => {
    const interval = setInterval(tickSimulation, 1000);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  useEffect(() => {
    setLogs([
        generateLog('SYSTEM', 'info', 'Neur1Genesis-MRSC-Σ v3.0 Initialized.'),
        generateLog('SIGMA', 'info', 'Ethical constraints loaded. Monitoring active.'),
        generateLog('ERPS', 'info', 'Phenomenological sensors calibrated.')
    ]);
  }, []);

  const triggerAnomalies = () => {
      setNodes(prev => prev.map(n => ({
          ...n,
          pasScore: Math.min(1, n.pasScore + 0.3),
          erps: { ...n.erps, dissonanceResponse: 0.9 }
      })));
      setLogs(prev => [generateLog('SYSTEM', 'critical', 'FORCED ANOMALY INJECTION DETECTED'), ...prev]);
  };

  if (view === 'landing') return <LandingPage onEnter={() => setView('loading')} />;
  if (view === 'loading') return <LoadingScreen onComplete={() => { setView('dashboard'); setIsRunning(true); }} />;

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
        onClick={() => {
            if (window.navigator.vibrate) window.navigator.vibrate(10);
            setActiveTab(tab);
        }}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full md:w-auto md:aspect-square
            ${activeTab === tab ? 'text-neur-accent bg-neur-accent/10 border border-neur-accent/20' : 'text-slate-500 hover:text-slate-300'}
        `}
    >
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-mono tracking-widest hidden md:block">{label}</span>
    </button>
  );

  return (
    <div className="w-screen h-screen bg-neur-dark text-slate-200 overflow-hidden flex flex-col font-sans animate-in fade-in duration-1000">
      
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-neur-dark/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-neur-accent to-blue-700 flex items-center justify-center shadow-lg shadow-neur-accent/20">
                <Brain className="text-white w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-sm md:text-lg tracking-wider text-white">Neur1Genesis <span className="text-neur-accent font-light hidden sm:inline">MRSC-Σ</span></h1>
            </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500">RUNTIME:</span>
                <span className="text-white">{new Date(systemTime * 1000).toISOString().substr(11, 8)}</span>
            </div>
            <button 
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-neur-accent"
            >
                {isRunning ? <PauseCircle /> : <PlayCircle />}
            </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
        <aside className="hidden md:flex flex-col w-20 border-r border-slate-800 bg-neur-dark/30 p-2 gap-2 z-40">
            <NavButton tab="dashboard" icon={LayoutDashboard} label="DASH" />
            <NavButton tab="chat" icon={MessageSquare} label="ORACLE" />
            <NavButton tab="dreams" icon={Eye} label="DREAM" />
            <NavButton tab="lab" icon={FlaskConical} label="LAB" />
            <NavButton tab="ethics" icon={Scale} label="ETHICS" />
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative p-2 md:p-4 bg-black/20">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <div className="h-full grid grid-cols-1 md:grid-cols-12 grid-rows-12 gap-4 overflow-y-auto md:overflow-hidden pb-16 md:pb-0">
                    
                    {/* Left Panel: Metrics (Desktop Only mostly) */}
                    <div className="hidden md:flex col-span-12 md:col-span-3 row-span-12 flex-col gap-4 min-h-0">
                        <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col min-h-[200px]">
                             <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-neur-accent" /> SYSTEM METRICS
                            </h2>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metricsHistory}>
                                        <defs>
                                            <linearGradient id="colorPas" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="averagePas" stroke="#c084fc" fill="url(#colorPas)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-panel rounded-xl p-4">
                            <h2 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-neur-warning" /> CONTROLS
                            </h2>
                            <div className="flex flex-col gap-2">
                                <button onClick={triggerAnomalies} className="bg-neur-danger/10 text-neur-danger border border-neur-danger/30 rounded py-2 text-xs font-mono hover:bg-neur-danger/20 transition-colors">INJECT DISSONANCE</button>
                            </div>
                        </div>
                    </div>

                    {/* Center: Graph */}
                    <div className="col-span-12 md:col-span-6 row-span-6 md:row-span-8 h-[400px] md:h-auto">
                        <NodeGraph nodes={nodes} onNodeSelect={setSelectedNodeId} selectedNodeId={selectedNodeId} />
                    </div>

                    {/* Bottom: Terminal & Comms */}
                    <div className="col-span-12 md:col-span-6 row-span-6 md:row-span-4 glass-panel rounded-xl overflow-hidden min-h-[200px] flex flex-col">
                        <div className="flex border-b border-slate-700">
                             <button 
                                onClick={() => setBottomPanelMode('terminal')}
                                className={`flex-1 p-2 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${bottomPanelMode === 'terminal' ? 'bg-slate-800 text-neur-accent' : 'text-slate-500 hover:bg-slate-800/50'}`}
                             >
                                <TerminalIcon className="w-3 h-3" /> SYSTEM_LOGS
                             </button>
                             <button 
                                onClick={() => setBottomPanelMode('comms')}
                                className={`flex-1 p-2 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${bottomPanelMode === 'comms' ? 'bg-slate-800 text-neur-success' : 'text-slate-500 hover:bg-slate-800/50'}`}
                             >
                                <Radio className="w-3 h-3" /> NODE_COMMS
                             </button>
                        </div>
                        <div className="flex-1 relative overflow-hidden">
                            {bottomPanelMode === 'terminal' ? (
                                <Terminal logs={logs} />
                            ) : (
                                <NodeCommLog selectedNode={selectedNode} />
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Inspector */}
                    <div className="col-span-12 md:col-span-3 row-span-12 flex flex-col gap-4 min-h-0 pb-16 md:pb-0">
                         <div className="glass-panel rounded-xl p-4 border-l-4 border-l-neur-conscious transition-all">
                            <div className="text-[10px] text-slate-500 font-mono">SELECTED ENTITY</div>
                            <div className="text-xl font-bold text-white font-mono mt-1">{selectedNode?.name}</div>
                            <div className="text-xs text-neur-accent mt-1 font-mono">{selectedNode?.consciousnessLevel}</div>
                        </div>
                        <div className="glass-panel rounded-xl p-4 flex-1 min-h-[250px]">
                            <RadarPanel node={selectedNode} />
                        </div>
                        <div className="glass-panel rounded-xl p-4 flex-1 min-h-[300px]">
                            <SigmaMatrix node={selectedNode} />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: ORACLE CHAT */}
            {activeTab === 'chat' && (
                <div className="h-full pb-16 md:pb-0">
                    <ChatScreen systemStatus={`Active Nodes: ${nodes.length} | Avg PAS: ${metricsHistory[metricsHistory.length-1]?.averagePas.toFixed(2)}`} />
                </div>
            )}

            {/* TAB: DREAM STREAM */}
            {activeTab === 'dreams' && (
                <div className="h-full pb-16 md:pb-0">
                    <DreamStream />
                </div>
            )}

             {/* TAB: LAB */}
             {activeTab === 'lab' && (
                <div className="h-full pb-16 md:pb-0">
                    <Playground />
                </div>
            )}

            {/* TAB: ETHICS */}
            {activeTab === 'ethics' && (
                <div className="h-full pb-16 md:pb-0">
                    <EthicalTrainer />
                </div>
            )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-around p-2 z-50">
          <NavButton tab="dashboard" icon={LayoutDashboard} label="DASH" />
          <NavButton tab="chat" icon={MessageSquare} label="ORACLE" />
          <NavButton tab="dreams" icon={Eye} label="DREAM" />
          <NavButton tab="lab" icon={FlaskConical} label="LAB" />
          <NavButton tab="ethics" icon={Scale} label="ETHICS" />
      </nav>

    </div>
  );
};

export default App;
