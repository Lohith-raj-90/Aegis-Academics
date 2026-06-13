import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Terminal, Compass, ShieldCheck, RefreshCw, ArrowUpRight } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  isDeepFocus?: boolean;
  modelName?: string;
  latency?: number | string;
  responseFidelity?: {
    level: string;
    percentage: number;
  };
  modelMemoryEnabled?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  isDeepFocus = false,
  modelName,
  latency,
  responseFidelity,
  modelMemoryEnabled,
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

  const displayModelName = modelName ?? "Unknown model";
  const displayLatency = typeof latency === "number"
    ? `${latency} ms`
    : latency
      ? `${latency}`
      : "— ms";
  const fidelity = responseFidelity ?? { level: "High", percentage: 80 };
  const memoryEnabled = modelMemoryEnabled ?? true;
  const fidelityWidth = `${Math.max(0, Math.min(100, fidelity.percentage))}%`;
  const memoryStateClass = memoryEnabled ? "text-emerald-300" : "text-rose-400";
  const memoryStateLabel = memoryEnabled ? "Enabled" : "Disabled";

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
      <div className={`${isDeepFocus ? "lg:col-span-12" : "lg:col-span-8"} bg-neutral-900/30 border border-neutral-800 rounded-3xl flex flex-col overflow-hidden transition-all duration-300`}>
        <div className="p-5 border-b border-neutral-900/70 bg-gradient-to-r from-slate-950 via-neutral-900 to-amber-950/10 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-3xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.08)]">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Aegis Core Neural Interface</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-mono">Study assistant optimized for academic mastery</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="w-3.5 h-3.5" /> {displayModelName}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-300 font-mono">
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-4">
              <span className="block text-neutral-400 uppercase">Active mode</span>
              <p className="mt-2 text-sm font-semibold text-white">Study Companion</p>
            </div>
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-4">
              <span className="block text-neutral-400 uppercase">Sync channel</span>
              <p className="mt-2 text-sm font-semibold text-white">Secure Proxy Link</p>
            </div>
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-4">
              <span className="block text-neutral-400 uppercase">Latency</span>
              <p className="mt-2 text-sm font-semibold text-white">{displayLatency}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 max-h-[calc(100vh-280px)]">
          {messages.map((message) => {
            const isAI = message.role === "assistant";
            return (
              <div
                key={message.id}
                className={`flex gap-4 max-w-3xl ${isAI ? "mr-12" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`w-10 h-10 rounded-3xl flex items-center justify-center shrink-0 text-[11px] font-semibold ${
                  isAI
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                    : "bg-slate-900/90 border border-slate-800 text-slate-300"
                }`}>
                  {isAI ? "AG" : "YOU"}
                </div>

                <div className={`rounded-[32px] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ${
                  isAI
                    ? "bg-slate-950/80 border border-slate-800 text-slate-100"
                    : "bg-gradient-to-br from-amber-500 to-orange-400 text-slate-950 border border-amber-400/30"
                }`}>
                  <div className="space-y-3 text-sm leading-7">
                    {message.content.split("\n").map((paragraph, index) => {
                      if (!paragraph.trim()) return <div key={index} className="h-2" />;
                      return <p key={index} className="mb-0">{paragraph}</p>;
                    })}
                  </div>
                  <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 text-right select-none">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-4 mr-12 items-center animate-fade-in">
              <div className="w-10 h-10 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 text-[11px] font-semibold">
                AG
              </div>
              <div className="rounded-[32px] bg-slate-950/75 border border-slate-800 px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-neutral-300 flex items-center gap-3 shadow-[0_14px_40px_rgba(15,23,42,0.18)]">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" /> Consulting Aegis Core...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-900/70 bg-neutral-950/60 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask the model a question, start a study plan, or request a concept breakdown..."
            className="flex-1 min-w-0 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4 text-sm font-semibold text-slate-950 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send to Core
          </button>
        </form>
      </div>

      {!isDeepFocus && (
        <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-800 p-5 rounded-3xl flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="border-b border-neutral-900/80 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-neutral-500" /> Model Quick Actions
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1 font-light">Launch curated prompts and tune response style instantly.</p>
            </div>

            <div className="space-y-3">
              {quickDirectives.map((directive, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!isLoading) onSendMessage(directive.prompt);
                  }}
                  className="w-full rounded-3xl border border-neutral-800/80 bg-slate-950/75 p-4 text-left transition-all hover:border-amber-400/40 hover:bg-slate-900/90"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white leading-snug">{directive.title}</p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{directive.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                  </div>
                  <span className="mt-3 inline-flex rounded-full bg-neutral-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
                    PROMPT NODE {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800/80 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 uppercase tracking-[0.22em]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure inference channel
            </div>
            <div className="rounded-3xl bg-neutral-900/70 p-4">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-[0.18em]">
                <span>Response fidelity</span>
                <span className="text-emerald-300">{fidelity.level}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: fidelityWidth }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em]">
              <span className="text-neutral-400">Model memory</span>
              <span className={`${memoryStateClass}`}>{memoryStateLabel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
