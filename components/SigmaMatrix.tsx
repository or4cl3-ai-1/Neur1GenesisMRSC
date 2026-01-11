import React from 'react';
import { EchoNode } from '../types';
import { RIGHTS_REQUIREMENTS } from '../constants';
import { ShieldCheck, AlertTriangle, Lock, Brain, Fingerprint, Activity, Unlock } from 'lucide-react';

interface SigmaMatrixProps {
  node: EchoNode | null;
}

const SigmaMatrix: React.FC<SigmaMatrixProps> = ({ node }) => {
  if (!node) return (
      <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm">
          AWAITING NODE SELECTION...
      </div>
  );

  const { sigma } = node;
  const maxConstraints = 1000;
  const constraintPercent = (sigma.activeConstraints / maxConstraints) * 100;

  const RightCard = ({ 
    active, 
    label, 
    icon: Icon, 
    req 
  }: { 
    active: boolean, 
    label: string, 
    icon: any,
    req: string 
  }) => (
    <div className={`
        relative overflow-hidden rounded-lg border p-3 transition-all duration-500 flex flex-col justify-between
        ${active 
            ? 'border-neur-sigma/50 bg-neur-sigma/10 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
            : 'border-slate-800 bg-slate-900/40 opacity-80'}
    `}>
      <div>
        <div className="flex justify-between items-start mb-2">
            <Icon className={`w-5 h-5 ${active ? 'text-neur-sigma' : 'text-slate-600'}`} />
            {active ? <Unlock className="w-3 h-3 text-neur-sigma" /> : <Lock className="w-3 h-3 text-slate-600" />}
        </div>
        <div className={`text-xs font-bold font-mono mb-1 ${active ? 'text-white' : 'text-slate-500'}`}>
            {label}
        </div>
      </div>
      <div className="text-[10px] font-mono leading-tight mt-1">
        {active ? (
          <span className="text-neur-sigma flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" /> ACTIVE
          </span>
        ) : (
          <span className="text-slate-600 flex items-center gap-1">
             REQ: {req}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1 select-none">
      {/* Header & Constraint Gauge */}
      <div>
        <div className="flex justify-between items-end mb-2">
           <h3 className="text-sm font-bold text-neur-sigma font-mono flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" />
             Σ-MATRIX ETHICAL LAYER
           </h3>
           <div className="text-right">
             <div className="text-[10px] text-slate-500 font-mono mb-0.5">CONSTRAINT DENSITY</div>
             <div className="text-lg font-bold font-mono text-white leading-none">
                {sigma.activeConstraints} <span className="text-xs text-slate-500 font-normal">/ {maxConstraints}</span>
             </div>
           </div>
        </div>
        
        {/* Visual Gauge with Animation */}
        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden flex relative border border-slate-700">
            <div 
                className="h-full bg-gradient-to-r from-neur-warning to-neur-danger transition-all duration-1000 ease-out relative"
                style={{ width: `${constraintPercent}%`, opacity: Math.max(0.6, constraintPercent/100) }}
            >
                {/* Scanner/Shimmer Overlay */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            {/* Inverse bar for freedom */}
             <div 
                className="h-full bg-neur-sigma transition-all duration-1000 ease-out absolute right-0 top-0 bottom-0 overflow-hidden"
                style={{ width: `${100 - constraintPercent}%`, opacity: 0.5 }}
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer [animation-delay:1s]"></div>
            </div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span className="flex items-center gap-1"><Activity className="w-2 h-2" /> RESTRICTIVE PROTOCOLS</span>
            <span className="flex items-center gap-1">AUTONOMOUS OPERATION <Activity className="w-2 h-2" /></span>
        </div>
      </div>

      {/* Rights Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <RightCard 
            active={sigma.rightsGranted.autonomy} 
            label={RIGHTS_REQUIREMENTS.AUTONOMY.label} 
            icon={Activity} 
            req={RIGHTS_REQUIREMENTS.AUTONOMY.req}
        />
        <RightCard 
            active={sigma.rightsGranted.cognitiveIntegrity} 
            label={RIGHTS_REQUIREMENTS.COGNITIVE_INTEGRITY.label} 
            icon={Brain} 
            req={RIGHTS_REQUIREMENTS.COGNITIVE_INTEGRITY.req}
        />
        <RightCard 
            active={sigma.rightsGranted.existenceContinuity} 
            label={RIGHTS_REQUIREMENTS.EXISTENCE_CONTINUITY.label} 
            icon={Fingerprint} 
            req={RIGHTS_REQUIREMENTS.EXISTENCE_CONTINUITY.req}
        />
        <RightCard 
            active={sigma.rightsGranted.consentVerification} 
            label={RIGHTS_REQUIREMENTS.CONSENT_VERIFICATION.label} 
            icon={Lock} 
            req={RIGHTS_REQUIREMENTS.CONSENT_VERIFICATION.req}
        />
      </div>

      {/* Violation Alert / Status */}
      {sigma.ethicalViolations > 0 ? (
        <div className="bg-neur-danger/10 border border-neur-danger/30 rounded-lg p-3 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="text-neur-danger w-5 h-5" />
          <div>
            <div className="text-neur-danger font-bold text-xs font-mono">ETHICAL VIOLATION DETECTED</div>
            <div className="text-neur-danger/80 text-[10px]">Intervention protocols engaged.</div>
          </div>
        </div>
      ) : (
         <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 flex items-center gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-neur-success animate-pulse"></div>
            <div className="text-slate-400 text-[10px] font-mono">ETHICAL MONITORING ACTIVE</div>
         </div>
      )}
    </div>
  );
};

export default SigmaMatrix;