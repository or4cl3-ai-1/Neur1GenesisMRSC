
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';
import { AUDIO_CONFIG } from '../constants';

interface BioSynthProps {
  averagePas: number;
  systemLoad: number;
}

const BioSynth: React.FC<BioSynthProps> = ({ averagePas, systemLoad }) => {
  const [enabled, setEnabled] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillators = useRef<OscillatorNode[]>([]);
  const gainNodes = useRef<GainNode[]>([]);

  useEffect(() => {
    if (enabled && !audioCtx.current) {
        // Init Audio
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create 3 layers of drone
        [0, 1, 2].forEach(i => {
            const osc = audioCtx.current!.createOscillator();
            const gain = audioCtx.current!.createGain();
            
            osc.type = AUDIO_CONFIG.WAVEFORMS[i];
            osc.connect(gain);
            gain.connect(audioCtx.current!.destination);
            
            gain.gain.value = 0;
            osc.start();
            
            oscillators.current.push(osc);
            gainNodes.current.push(gain);
        });
    } else if (!enabled && audioCtx.current) {
        // Cleanup
        audioCtx.current.close();
        audioCtx.current = null;
        oscillators.current = [];
        gainNodes.current = [];
    }
  }, [enabled]);

  // Modulate sound based on props
  useEffect(() => {
    if (!enabled || oscillators.current.length === 0) return;

    const baseFreq = AUDIO_CONFIG.BASE_FREQ + (averagePas * 100); // Pitch goes up with consciousness

    oscillators.current.forEach((osc, i) => {
        // Detune layers slightly for richness
        const harmonic = AUDIO_CONFIG.HARMONICS[Math.floor((averagePas * 10) % AUDIO_CONFIG.HARMONICS.length)];
        const targetFreq = baseFreq * (i === 0 ? 1 : (i === 1 ? 1.5 : 2)); 
        
        osc.frequency.setTargetAtTime(targetFreq, audioCtx.current!.currentTime, 0.5);
        
        // Volume logic: Higher load = louder chaos, Higher PAS = smoother
        const vol = 0.05 + (systemLoad * 0.05);
        gainNodes.current[i].gain.setTargetAtTime(vol, audioCtx.current!.currentTime, 0.5);
    });

  }, [averagePas, systemLoad, enabled]);

  return (
    <button 
        onClick={() => setEnabled(!enabled)}
        className={`fixed top-16 right-4 md:top-4 md:right-24 z-50 p-2 rounded-full border flex items-center gap-2 transition-all ${
            enabled 
            ? 'bg-neur-conscious/10 border-neur-conscious text-neur-conscious shadow-[0_0_15px_rgba(192,132,252,0.3)]' 
            : 'bg-black/50 border-slate-700 text-slate-500 hover:text-white'
        }`}
    >
        {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span className="text-[10px] font-mono hidden md:inline">BIO-SYNTH {enabled ? 'ON' : 'OFF'}</span>
        {enabled && <Activity className="w-3 h-3 animate-pulse" />}
    </button>
  );
};

export default BioSynth;
