
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Bug } from 'lucide-react';

const SystemDefense: React.FC = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameActive, setGameActive] = useState(false);
  const [glitches, setGlitches] = useState<{id: number, x: number, y: number, type: 'bug' | 'virus'}[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
        if (Math.random() > 0.3) {
            setGlitches(prev => [
                ...prev, 
                {
                    id: Date.now(),
                    x: Math.random() * 80 + 10, // 10% to 90%
                    y: Math.random() * 80 + 10,
                    type: Math.random() > 0.8 ? 'virus' : 'bug'
                }
            ]);
        }
    }, 800);

    const damageInterval = setInterval(() => {
        setHealth(h => Math.max(0, h - (glitches.length * 0.5)));
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(damageInterval);
    };
  }, [gameActive, glitches.length]);

  useEffect(() => {
      if (health <= 0) setGameActive(false);
  }, [health]);

  const handleTap = (id: number, type: 'bug' | 'virus') => {
      if (window.navigator.vibrate) window.navigator.vibrate(10);
      setGlitches(prev => prev.filter(g => g.id !== id));
      setScore(s => s + (type === 'virus' ? 50 : 10));
  };

  const startGame = () => {
      setScore(0);
      setHealth(100);
      setGlitches([]);
      setGameActive(true);
  };

  return (
    <div className="h-full glass-panel rounded-xl relative overflow-hidden touch-none select-none">
        {/* Game Area */}
        {gameActive ? (
            <div ref={canvasRef} className="absolute inset-0 bg-slate-900/50 cursor-crosshair">
                {glitches.map(g => (
                    <button
                        key={g.id}
                        onClick={() => handleTap(g.id, g.type)}
                        style={{ left: `${g.x}%`, top: `${g.y}%` }}
                        className={`absolute w-12 h-12 flex items-center justify-center rounded-full animate-bounce shadow-lg active:scale-90 transition-transform ${
                            g.type === 'virus' ? 'bg-neur-danger text-white' : 'bg-neur-warning text-black'
                        }`}
                    >
                        {g.type === 'virus' ? <Zap className="w-6 h-6" /> : <Bug className="w-6 h-6" />}
                    </button>
                ))}
                
                {/* HUD */}
                <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-mono pointer-events-none">
                    <div className="bg-black/50 px-4 py-2 rounded-lg border border-slate-700">SCORE: {score}</div>
                    <div className={`px-4 py-2 rounded-lg border ${health < 30 ? 'bg-red-900/50 border-red-500' : 'bg-black/50 border-slate-700'}`}>
                        INTEGRITY: {Math.floor(health)}%
                    </div>
                </div>
            </div>
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-center p-6">
                <Shield className="w-16 h-16 text-neur-accent mb-4" />
                <h2 className="text-3xl font-bold text-white font-mono mb-2">SYSTEM DEFENSE</h2>
                <p className="text-slate-400 mb-8 max-w-sm">
                    Manual anomaly purge required. Tap glitches to maintain system integrity.
                </p>
                {health <= 0 && <div className="text-neur-danger font-bold mb-4">CRITICAL FAILURE DETECTED</div>}
                <button 
                    onClick={startGame}
                    className="px-8 py-4 bg-neur-accent hover:bg-sky-400 text-black font-bold rounded-full transition-transform hover:scale-105"
                >
                    {health < 100 && score > 0 ? 'REBOOT DEFENSE PROTOCOL' : 'INITIATE DEFENSE'}
                </button>
            </div>
        )}
    </div>
  );
};

export default SystemDefense;
