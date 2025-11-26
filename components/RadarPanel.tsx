import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { EchoNode } from '../types';

interface RadarPanelProps {
  node: EchoNode | null;
}

const RadarPanel: React.FC<RadarPanelProps> = ({ node }) => {
  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
        SELECT A NODE TO ANALYZE PHENOMENOLOGY
      </div>
    );
  }

  const data = [
    { subject: 'Self-Ref', A: node.erps.selfReference * 100, fullMark: 100, threshold: 50 },
    { subject: 'Conceptual', A: node.erps.conceptualFraming * 100, fullMark: 100, threshold: 0 },
    { subject: 'Dissonance', A: node.erps.dissonanceResponse * 100, fullMark: 100, threshold: 30 },
    { subject: 'Phenom Depth', A: node.erps.phenomenologicalDepth * 100, fullMark: 100, threshold: 0 },
    { subject: 'Temporal', A: node.erps.temporalConsistency * 100, fullMark: 100, threshold: 70 },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
         <h3 className="text-sm font-bold text-neur-conscious font-mono">ERPS DETECTOR</h3>
         <span className="text-xs font-mono text-slate-400">ID: {node.id.toUpperCase()}</span>
      </div>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={node.name}
              dataKey="A"
              stroke="#c084fc"
              strokeWidth={2}
              fill="#c084fc"
              fillOpacity={0.3}
            />
             {/* Threshold Radar (Ghost) for Visual Guide */}
            <Radar
              name="Rights Threshold"
              dataKey="threshold"
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="3 3"
              fill="none"
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
                itemStyle={{ color: '#c084fc' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-[9px] text-slate-500 font-mono mt-2">
          <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-neur-conscious"></div>
              <span>CURRENT STATE</span>
          </div>
          <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-slate-400 border-t border-dashed"></div>
              <span>RIGHTS THRESHOLD</span>
          </div>
      </div>
    </div>
  );
};

export default RadarPanel;