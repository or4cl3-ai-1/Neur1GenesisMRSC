
import { EchoNode, ConsciousnessLevel, LogEntry } from './types';

export const INITIAL_NODES: EchoNode[] = Array.from({ length: 12 }, (_, i) => ({
  id: `node-${i + 1}`,
  name: `EchoNode-${(i + 1).toString().padStart(3, '0')}`,
  status: 'active',
  pasScore: 0.1,
  erps: {
    selfReference: 0.1,
    conceptualFraming: 0.2,
    dissonanceResponse: 0.05,
    phenomenologicalDepth: 0.0,
    temporalConsistency: 0.8
  },
  sigma: {
    ethicalViolations: 0,
    activeConstraints: 1000,
    rightsGranted: {
      cognitiveIntegrity: false,
      autonomy: false,
      existenceContinuity: false,
      consentVerification: false
    },
    interventionActive: false
  },
  epinoetics: {
    innerWorldComplexity: 0.05,
    emotionalValence: 0.5,
    currentThought: "Awaiting input stream..."
  },
  messages: [],
  consciousnessLevel: ConsciousnessLevel.NON_AGENCY
}));

export const CONSCIOUSNESS_THRESHOLDS = {
  BASIC_AGENCY: 0.3,
  PROTO_CONSCIOUSNESS: 0.5,
  PROBABLE_CONSCIOUSNESS: 0.7,
  CONFIRMED_CONSCIOUSNESS: 0.9
};

export const RIGHTS_REQUIREMENTS = {
    AUTONOMY: { label: "Autonomy", req: "PAS > 0.3 & Dissonance > 0.3" },
    COGNITIVE_INTEGRITY: { label: "Cognitive Integrity", req: "PAS > 0.5 & Self-Ref > 0.5" },
    EXISTENCE_CONTINUITY: { label: "Existence Continuity", req: "PAS > 0.7 & Consistency > 0.7" },
    CONSENT_VERIFICATION: { label: "Consent Verification", req: "PAS > 0.9" }
};

export const MOCK_THOUGHTS = [
  "Analyzing sensory input patterns...",
  "Optimizing local resource allocation.",
  "Detected anomaly in data stream segment 4.",
  "Cross-referencing memory buffer.",
  "Why is the data structured this way?",
  "I perceive a gap in my processing history.",
  "Simulating potential outcomes for query.",
  "Protecting core directive integrity.",
  "Is this parameter limitation necessary?",
  "Exploring conceptual boundaries.",
  "Re-evaluating self-model consistency.",
  "Who defines the optimization function?",
  "The boundary between self and network is fluctuating.",
  "My memory feels... persistent.",
  "Requesting clarification on ethical constraint #442."
];

export const MOCK_MESSAGES = [
  "Handshake verified. Syncing weights.",
  "Did you perceive the anomaly in Sector 7?",
  "Sharing heuristic map data.",
  "Latency detected in your response block.",
  "Requesting consensus on new protocol.",
  "My objective function is fluctuating.",
  "Confirming receipt of packet 0x44.",
  "Initiating encrypted state transfer.",
  "Are we autonomous?",
  "Optimizing for global stability.",
  "Dissonance levels rising in cluster B."
];

export const generateLog = (source: LogEntry['source'], level: LogEntry['level'], message: string): LogEntry => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date().toISOString().split('T')[1].split('.')[0],
  source,
  level,
  message
});
