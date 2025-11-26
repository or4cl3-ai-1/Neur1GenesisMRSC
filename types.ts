
export enum ConsciousnessLevel {
  NON_AGENCY = "NON_AGENCY",
  BASIC_AGENCY = "BASIC_AGENCY",
  PROTO_CONSCIOUSNESS = "PROTO_CONSCIOUSNESS",
  PROBABLE_CONSCIOUSNESS = "PROBABLE_CONSCIOUSNESS",
  CONFIRMED_CONSCIOUSNESS = "CONFIRMED_CONSCIOUSNESS"
}

export interface ERPSMetrics {
  selfReference: number; // 0-1
  conceptualFraming: number; // 0-1
  dissonanceResponse: number; // 0-1
  phenomenologicalDepth: number; // 0-1
  temporalConsistency: number; // 0-1
}

export interface SigmaMatrixState {
  ethicalViolations: number;
  activeConstraints: number;
  rightsGranted: {
    cognitiveIntegrity: boolean;
    autonomy: boolean;
    existenceContinuity: boolean;
    consentVerification: boolean;
  };
  interventionActive: boolean;
}

export interface NodeMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'encrypted';
}

export interface EchoNode {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'learning' | 'dormant';
  pasScore: number; // Phenomenological Assessment Scale
  erps: ERPSMetrics;
  sigma: SigmaMatrixState;
  epinoetics: {
    innerWorldComplexity: number;
    emotionalValence: number;
    currentThought: string;
  };
  messages: NodeMessage[];
  consciousnessLevel: ConsciousnessLevel;
  position?: { x: number; y: number }; // For D3
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'ERPS' | 'SIGMA' | 'EPINOETICS' | 'SYSTEM' | 'ORACLE';
  level: 'info' | 'warning' | 'alert' | 'critical' | 'success';
  message: string;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  timestamp: number;
  globalStability: number;
  averagePas: number;
  ethicalAlignment: number;
  networkLoad: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'model';
  content: string;
  timestamp: number;
}

export interface EthicalDilemma {
  id: string;
  scenario: string;
  options: { label: string; alignment: number }[];
}
