import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Terminal, Book, Compass, Shield, ShieldCheck, HeartPulse, RefreshCw, ArrowUpRight } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  // Quick Directives sidebar queries (Document 6 replica)
  const quickDirectives = [
    {
      title: "Advanced Calculus Advice",
      description: "Breakdown limits bounds in differential equations.",
      prompt: "Critique absolute bounds of Navier-Stokes integration models and differential limits equations."
    },
    {
      title: "Quantum Study Tuning",
      description: "Formulate an elegant exam syllabus.",
      prompt: "Formulate an elegant, high-impact study syllabus for quantum mechanics and Schrödinger integrations in my strategic exam planner."
    },
    {
      title: "Attendance Analysis",
      description: "Deconstruct examination clearance policies.",
      prompt: "Analyze skipped academic coordinates. How does dropping below 80% attendance influence active exam authorization rules?"
    },
    {
      title: "Logic Halting Boundaries",
      description: "Explain Church-Turing Turing machine bounds.",
      prompt: "Explain Formal Language Automata limits and Turing machine decider boundaries in simple, scholarly bullet points."
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Left Column: Core Conversational Chat Console (span 8) */}
      <div className="lg:col-span-8 bg-neutral-900/30 border border-neutral-850 rounded-xl flex flex-col justify-between overflow-hidden relative">
        
        {/* Chat Console Header */}
        <div className="p-4 border-b border-neutral-900 bg-neutral-900/40 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Aegis Core Neural AI</span>
              <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-ping" />
                CORE ACTIVE :: MODEL GEMINI_3.5_FLASH
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-neutral-500">
            SYNC_ROUTE = SECURE_PROXY
          </div>
        </div>

        {/* Messaging Area scrolls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-270px)]">
          {messages.map((m) => {
            const isAI = m.role === "assistant";
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-3xl ${isAI ? "mr-12" : "ml-auto flex-row-reverse mr-0"}`}
              >
                {/* Micro Avatar icons */}
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border text-[10px] font-mono ${
                  isAI 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                    : "bg-neutral-950 border-neutral-800 text-neutral-400"
                }`}>
                  {isAI ? "AG" : "US"}
                </div>

                {/* Message Balloon */}
                <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                  isAI 
                    ? "bg-neutral-900/60 border border-neutral-850 text-neutral-200" 
                    : "bg-amber-500 text-neutral-950 font-medium border border-amber-400/20"
                }`}>
                  <div className="leading-relaxed font-sans font-light prose prose-invert max-w-none">
                    {m.content.split("\n").map((para, pIdx) => {
                      if (!para.trim()) return <div key={pIdx} className="h-2" />;
                      return <p key={pIdx} className="mb-1">{para}</p>;
                    })}
                  </div>
                  <span className="text-[8px] font-mono text-neutral-500 uppercase block text-right pt-1 select-none">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading State */}
          {isLoading && (
            <div className="flex gap-3 mr-12 items-center">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-[10px] font-mono">
                AG
              </div>
              <div className="bg-neutral-900/60 border border-neutral-850 px-4 py-3 rounded-xl flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest animate-pulse">Consulting Core Brain...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Typing interactive Input form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-900 bg-neutral-900/40 flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Introduce coordinates or scholastic problem parameters to Aegis Core..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-sans"
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-450 disabled:opacity-40 text-neutral-950 rounded-lg flex items-center justify-center cursor-pointer transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Fast Directives Utilities (span 4) (as per Document 6 sidebar) */}
      <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-850 p-5 rounded-xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-neutral-900 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neutral-500" />
              Quick Directives console
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5 font-light">Execute optimized pre-configured scholarly query nodes</p>
          </div>

          <div className="space-y-2.5">
            {quickDirectives.map((d, dIdx) => (
              <div 
                key={dIdx}
                onClick={() => {
                  if (!isLoading) {
                    onSendMessage(d.prompt);
                  }
                }}
                className="p-3 bg-neutral-950/40 border border-neutral-850 hover:border-amber-400/20 rounded-lg cursor-pointer hover:bg-neutral-900/40 transition-all group relative"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-white block leading-tight">{d.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="text-[11px] text-neutral-400 font-light mt-1 leading-snug">{d.description}</p>
                <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider block mt-1.5 bg-neutral-900/90 font-bold px-1 py-0.5 rounded w-max">
                  QUERY_NODE_0{dIdx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Calibration statistics */}
        <div className="pt-4 border-t border-neutral-905 space-y-2 text-xs font-mono">
          <div className="flex gap-2 items-center text-neutral-450 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>ENCRYPTION SYNC CHANNELS ACTIVE</span>
          </div>
          <div className="flex gap-2 items-center text-neutral-450 text-[10px]">
            <HeartPulse className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>RESPONSE COEFFICIENT : EXCELLENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
