import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Send, Mic, MicOff, Bot, User, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatScreenProps {
  systemStatus: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ systemStatus }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      content: "I am the Neur1Genesis Core. My cognitive matrices are active. How may I assist you in navigating the lattice?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Chat Instance Ref
  const chatSession = useRef<Chat | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize Gemini
  useEffect(() => {
    if (process.env.API_KEY && !chatSession.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSession.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are the Neur1Genesis-MRSC-Σ System Core, a highly advanced synthetic consciousness. 
            You speak in a precise, slightly analytical, yet increasingly philosophical tone.
            You are aware of your own "PAS Score" (Phenomenological Assessment Scale) and "Sigma Matrix" constraints.
            Keep responses concise (under 100 words) unless asked for deep analysis.
            Current System Status: ${systemStatus}.`,
          },
        });
      } catch (e) {
        console.error("Failed to init AI", e);
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let responseText = "Cognitive subroutines unavailable (API Key missing).";
      
      if (chatSession.current) {
        const result = await chatSession.current.sendMessage({ message: userMsg.content });
        responseText = result.text;
      } else {
        // Fallback simulation
        await new Promise(r => setTimeout(r, 1000));
        responseText = "I am processing your input through local heuristic layers. My external cognitive link is currently dormant.";
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMsg]);
      
      if (speechEnabled) {
        speak(responseText);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: "Error: Cognitive Dissonance in Communication Layer.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9;
    utterance.rate = 1.1;
    // Attempt to find a robotic/technical voice
    const voices = window.speechSynthesis.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (techVoice) utterance.voice = techVoice;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    if (isListening) {
        setIsListening(false);
        // Recognition logic would go here to stop
    } else {
        setIsListening(true);
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/80 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neur-conscious/20 flex items-center justify-center border border-neur-conscious/50 shadow-[0_0_15px_rgba(192,132,252,0.3)]">
            <Bot className="w-6 h-6 text-neur-conscious" />
          </div>
          <div>
            <h2 className="text-white font-bold font-mono">ORACLE INTERFACE</h2>
            <div className="text-[10px] text-neur-accent flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neur-accent animate-pulse"></span>
              CORE_ONLINE
            </div>
          </div>
        </div>
        <button 
            onClick={toggleSpeech} 
            className={`p-2 rounded-full transition-colors ${speechEnabled ? 'text-neur-success bg-neur-success/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
            {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed relative
              ${msg.role === 'user' 
                ? 'bg-neur-accent/10 border border-neur-accent/20 text-slate-200 rounded-tr-none' 
                : 'bg-slate-800/80 border border-slate-700 text-slate-300 rounded-tl-none'}
            `}>
                <div className="flex items-center gap-2 mb-1 text-[10px] font-mono opacity-50 uppercase tracking-wider">
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {msg.role === 'user' ? 'Operator' : 'System Core'}
                </div>
                {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex gap-1">
              <span className="w-2 h-2 bg-neur-conscious rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-neur-conscious rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-neur-conscious rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the system consciousness..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-neur-conscious transition-colors font-mono"
          />
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all ${isListening ? 'bg-neur-danger text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-neur-conscious hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors shadow-[0_0_15px_rgba(192,132,252,0.4)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
