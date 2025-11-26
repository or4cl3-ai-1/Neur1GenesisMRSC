
import React, { useEffect, useRef, useState } from 'react';
import { EchoNode } from '../types';
import { Radio, ArrowDownLeft, ArrowUpRight, Lock, CheckCircle, Send, Globe, Link2 } from 'lucide-react';
import { MOCK_MESSAGES } from '../constants';

interface NodeCommLogProps {
  selectedNode: EchoNode | null;
  allNodes: EchoNode[];
  onSendMessage: (fromId: string, toId: string, content: string) => void;
  selectedConnection?: { source: string; target: string } | null;
}

const NodeCommLog: React.FC<NodeCommLogProps> = ({ selectedNode, allNodes, onSendMessage, selectedConnection }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [targetId, setTargetId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedNode?.messages, selectedConnection]);

  // Set default target for manual send
  useEffect(() => {
      if (allNodes.length > 0 && !targetId && selectedNode) {
          const others = allNodes.filter(n => n.id !== selectedNode.id);
          if (others.length > 0) setTargetId(others[0].id);
      }
  }, [allNodes, selectedNode, targetId]);

  const handleSend = () => {
      const source = selectedConnection ? selectedConnection.source : selectedNode?.id;
      const target = selectedConnection ? selectedConnection.target : targetId;
      
      if (!source || !target) return;
      const content = customMessage || MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      onSendMessage(source, target, content);
      setCustomMessage('');
  };

  // Logic to determine what messages to show
  let displayMessages: { msg: any, type: 'in' | 'out' }[] = [];
  let headerContent;

  if (selectedConnection) {
      // LINK MODE
      const nodeA = allNodes.find(n => n.id === selectedConnection.source);
      const nodeB = allNodes.find(n => n.id === selectedConnection.target);
      
      headerContent = (
         <div className="flex items-center gap-2">
            <Link2 className="w-3 h-3 text-neur-accent animate-pulse" />
            <span className="text-neur-accent font-bold">SECURE LINK</span>
            <span className="text-slate-500">::</span>
            <span className="text-white text-[10px] md:text-xs">
                {nodeA?.name} <span className="text-neur-accent">&lt;-&gt;</span> {nodeB?.name}
            </span>
         </div>
      );

      // Gather messages between A and B
      // We can iterate over A's messages and find those involving B, or vice versa.
      if (nodeA && nodeB) {
          const relevant = nodeA.messages.filter(m => 
             (m.fromId === nodeA.id && m.toId === nodeB.id) || 
             (m.fromId === nodeB.id && m.toId === nodeA.id)
          ).sort((a, b) => a.timestamp - b.timestamp);

          displayMessages = relevant.map(m => ({
              msg: m,
              type: m.fromId === nodeA.id ? 'out' : 'in'
          }));
      }

  } else if (selectedNode) {
      // NODE MODE
      headerContent = (
        <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-neur-accent" />
            <span className="text-neur-accent font-bold">COMMS_LINK</span>
            <span className="text-slate-500">::</span>
            <span className="text-white">{selectedNode.name}</span>
        </div>
      );
      
      displayMessages = selectedNode.messages.map(m => ({
          msg: m,
          type: m.toId === selectedNode.id ? 'in' : 'out'
      })).sort((a, b) => a.msg.timestamp - b.msg.timestamp);

  } else {
    // EMPTY STATE
    return (
      <div className="h-full flex items-center justify-center flex-col text-slate-500 font-mono text-xs gap-2">
        <Radio className="w-8 h-8 opacity-50" />
        <span>ESTABLISH LINK: SELECT NODE OR CONNECTION</span>
      </div>
    );
  }

  const otherNodes = allNodes.filter(n => n.id !== selectedNode?.id);

  return (
    <div className="h-full flex flex-col font-mono text-xs bg-slate-900/30">
      {/* Header */}
      <div className="bg-slate-900/80 p-2 border-b border-slate-700 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
        {headerContent}
        <div className="text-[9px] text-slate-500 flex items-center gap-1">
            STATUS: <span className="text-neur-success">ACTIVE</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {displayMessages.length === 0 ? (
            <div className="text-center text-slate-600 mt-10 italic">No traffic recorded on this channel.</div>
        ) : (
            displayMessages.map(({ msg, type }) => {
                return (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${type === 'in' ? 'items-start' : 'items-end'}`}
                    >
                        <div className={`
                            max-w-[90%] rounded-lg p-2 border relative
                            ${type === 'in'
                                ? 'bg-slate-800/80 border-slate-700 text-slate-300 rounded-tl-none' 
                                : 'bg-neur-accent/10 border-neur-accent/20 text-neur-accent rounded-tr-none'}
                        `}>
                            <div className="flex items-center gap-2 mb-1 text-[9px] opacity-70">
                                {type === 'in' ? (
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

      {/* Manual Controls */}
      <div className="p-2 border-t border-slate-700 bg-slate-900/50">
          <div className="text-[9px] text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Manual Transmission Protocol
          </div>
          <div className="flex gap-2 mb-2">
               {!selectedConnection && (
                   <select 
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="bg-slate-800 border border-slate-600 text-slate-300 rounded px-2 py-1 text-[10px] focus:outline-none focus:border-neur-accent flex-1"
                   >
                       {otherNodes.map(n => (
                           <option key={n.id} value={n.id}>To: {n.name}</option>
                       ))}
                   </select>
               )}
               <button 
                  onClick={handleSend}
                  className="bg-neur-accent hover:bg-sky-400 text-black px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ml-auto"
               >
                   <Send className="w-3 h-3" /> SEND
               </button>
          </div>
          <input 
              type="text" 
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter packet payload (optional)..."
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-neur-accent"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
      </div>
    </div>
  );
};

export default NodeCommLog;
