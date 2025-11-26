
import React, { useEffect, useRef } from 'react';
import { EchoNode } from '../types';
import { Radio, ArrowDownLeft, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface NodeCommLogProps {
  selectedNode: EchoNode | null;
}

const NodeCommLog: React.FC<NodeCommLogProps> = ({ selectedNode }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedNode?.messages]);

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center flex-col text-slate-500 font-mono text-xs gap-2">
        <Radio className="w-8 h-8 opacity-50" />
        <span>ESTABLISH LINK: SELECT A NODE</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs bg-slate-900/30">
      {/* Header */}
      <div className="bg-slate-900/80 p-2 border-b border-slate-700 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-neur-accent" />
            <span className="text-neur-accent font-bold">COMMS_LINK</span>
            <span className="text-slate-500">::</span>
            <span className="text-white">{selectedNode.name}</span>
        </div>
        <div className="text-[9px] text-slate-500 flex items-center gap-1">
            STATUS: <span className="text-neur-success">ENCRYPTED</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {selectedNode.messages.length === 0 ? (
            <div className="text-center text-slate-600 mt-10 italic">No recent transmissions recorded.</div>
        ) : (
            selectedNode.messages.map((msg) => {
                const isIncoming = msg.toId === selectedNode.id;
                return (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}
                    >
                        <div className={`
                            max-w-[90%] rounded-lg p-2 border relative
                            ${isIncoming 
                                ? 'bg-slate-800/80 border-slate-700 text-slate-300 rounded-tl-none' 
                                : 'bg-neur-accent/10 border-neur-accent/20 text-neur-accent rounded-tr-none'}
                        `}>
                            <div className="flex items-center gap-2 mb-1 text-[9px] opacity-70">
                                {isIncoming ? (
                                    <>
                                        <ArrowDownLeft className="w-3 h-3" />
                                        <span>FROM: {msg.fromId.toUpperCase()}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>TO: {msg.toId.toUpperCase()}</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                    </>
                                )}
                            </div>
                            <div className="leading-tight">{msg.content}</div>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-600">
                            {new Date(msg.timestamp).toISOString().substr(11, 8)}
                            {msg.status === 'encrypted' && <Lock className="w-2 h-2" />}
                            {msg.status === 'delivered' && <CheckCircle className="w-2 h-2" />}
                        </div>
                    </div>
                );
            })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default NodeCommLog;
