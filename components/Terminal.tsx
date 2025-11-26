import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'critical': return 'text-neur-danger';
      case 'alert': return 'text-neur-warning';
      case 'success': return 'text-neur-success';
      case 'warning': return 'text-neur-warning';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs">
      <div className="bg-slate-900/80 p-2 border-b border-slate-700 flex justify-between items-center sticky top-0">
        <span className="text-slate-400 font-bold">> SYSTEM_OUTPUT_STREAM</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-neur-danger animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-neur-warning animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-neur-success animate-pulse delay-150"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-black/40">
        {logs.map((log) => (
          <div key={log.id} className="grid grid-cols-[80px_100px_1fr] gap-2 hover:bg-white/5 px-1 rounded transition-colors">
            <span className="text-slate-600">[{log.timestamp}]</span>
            <span className={`font-bold ${getLevelColor(log.level)}`}>{log.source}</span>
            <span className="text-slate-300 break-words">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;