import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, ArrowRight, ShieldCheck, Zap, Award, Mail, MapPin,
  GraduationCap, Github, Linkedin, Cpu, BookOpen, CheckCircle2,
  Send, MessageSquare, AlertCircle, HelpCircle, Code, Star,
  Users, BarChart3, Brain, Globe, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QuantumCore3D } from "./QuantumCore3D";
import { Tilt3D } from "./Tilt3D";

interface LandingViewProps {
  onBackToLogin: () => void;
}

interface MessageEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const STATS = [
  { label: "Active Students", value: "500+", icon: Users },
  { label: "Study Hours Logged", value: "12K+", icon: BarChart3 },
  { label: "AI Queries Answered", value: "8K+", icon: Brain },
  { label: "Syllabus Topics", value: "200+", icon: BookOpen },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Attendance Forecasting",
    description: "Predictive simulators calculate exactly how many classes you can skip before losing exam eligibility.",
    color: "amber",
    stat: "75% VTU threshold monitored"
  },
  {
    icon: Brain,
    title: "AI Study Companion",
    description: "Ask questions about calculus, quantum physics, or automata theory and get instant, structured answers.",
    color: "purple",
    stat: "Powered by Gemini 2.5 Flash"
  },
  {
    icon: Globe,
    title: "3D Math Visualizer",
    description: "Interactive WebGL renderer lets you drag and rotate mathematical projections in real-time.",
    color: "indigo",
    stat: "60fps browser rendering"
  },
  {
    icon: BookOpen,
    title: "Syllabus Vault",
    description: "Organize and track all your VTU curriculum resources in one synced digital library.",
    color: "emerald",
    stat: "Auto-sync enabled"
  },
];

export const LandingView: React.FC<LandingViewProps> = ({ onBackToLogin }) => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"problems" | "solution">("problems");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [activeSandboxTopic, setActiveSandboxTopic] = useState<"graphics" | "database" | "networks">("graphics");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [messageQueue, setMessageQueue] = useState<MessageEntry[]>([
    {
      id: "demo-1",
      name: "Tiptur CSE Node Coordinator",
      email: "kit.cse@kalpataru.edu",
      message: "Excellent 3D coordinate mathematics on this student dashboard, Lohith!",
      timestamp: "06/08/2026, 09:12 AM"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % STATS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleQuizAnswer = (index: number) => {
    setSelectedQuizAnswer(index);
    const correctAnswers: Record<string, number> = { graphics: 2, database: 1, networks: 2 };
    if (index === correctAnswers[activeSandboxTopic]) {
      setQuizFeedback("correct");
      setQuizScore((prev) => prev + 10);
    } else {
      setQuizFeedback("incorrect");
    }
  };

  const resetQuiz = () => {
    setSelectedQuizAnswer(null);
    setQuizFeedback(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !senderMessage) return;
    setIsSending(true);
    setTimeout(() => {
      const newMessage: MessageEntry = {
        id: Math.random().toString(),
        name: senderName,
        email: senderEmail,
        message: senderMessage,
        timestamp: new Date().toLocaleString()
      };
      setMessageQueue((prev) => [newMessage, ...prev]);
      setIsSending(false);
      setIsSent(true);
      setSenderName("");
      setSenderEmail("");
      setSenderMessage("");
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  const quizQuestions: Record<string, { question: string; context: string; options: string[]; correct: number; module: string; color: string }> = {
    graphics: {
      module: "MODULE_01",
      color: "amber",
      question: "How is Depth Sorting handled in 3D orthographic canvas visualizers?",
      context: "In systems with overlapping 3D meshes (such as custom double orbit grids on physical canvases), typical projections risk clipping if rendered without sorting. Which algorithm solves this coordinates depth sorting challenge?",
      options: [
        "Bresenham's Midpoint Line Coordinate Extrapolator",
        "Phong Reflection Illuminator Matrix",
        "Painter's Depth Sorting Algorithm (Depth-Z sorting)",
        "Fast Fourier Spatial Signal Modulation"
      ],
      correct: 2
    },
    database: {
      module: "MODULE_02",
      color: "purple",
      question: "Which Relational Calculus structure manages foreign key bounds securely?",
      context: "In database index sets, managing foreign boundaries requires enforcing integrity properties to avoid orphaned coordinates across schema logs.",
      options: [
        "Unilateral Vector Shifters",
        "Referential Integrity Constraints (Foreign Keys)",
        "Volatile Hash Matrices",
        "Cyclic Redundancy Coordinates"
      ],
      correct: 1
    },
    networks: {
      module: "MODULE_03",
      color: "indigo",
      question: "Which algorithm prevents loops in physical mesh coordinates?",
      context: "Traditional local networks suffer routing storms back within visual mesh parameters unless looped lines are dynamically pruned.",
      options: [
        "Bilinear Interpolation filter",
        "Drizzle Schema Generator",
        "Spanning Tree Protocol (STP)",
        "Asymmetrical Hash Resolver"
      ],
      correct: 2
    }
  };

  const currentQuiz = quizQuestions[activeSandboxTopic];

  return (
    <div className="bg-[#050507] text-zinc-100 font-sans min-h-screen relative overflow-hidden selection:bg-amber-400 selection:text-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.035)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[650px] bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-25 pointer-events-none" />

      <header className="border-b border-zinc-900/60 bg-neutral-950/60 backdrop-blur-xl sticky top-0 z-40 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/5">
            <GraduationCap className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-amber-400 leading-none block uppercase">DEVELOPER LABS</span>
            <span className="font-sans font-semibold tracking-tight text-white text-base">Aegis Academics</span>
          </div>
        </div>
        <nav className="flex items-center gap-4 md:gap-8 text-xs font-mono font-medium">
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:block">
            // FEATURES
          </button>
          <button onClick={() => document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" })} className="text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:block">
            // SANDBOX
          </button>
          <button onClick={() => document.getElementById("developer")?.scrollIntoView({ behavior: "smooth" })} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
            // DEVELOPER
          </button>
          <button onClick={onBackToLogin} className="px-4 py-2 bg-zinc-900 hover:bg-amber-400 hover:text-neutral-950 border border-zinc-800 hover:border-amber-400 text-zinc-300 text-xs rounded-lg transition-all duration-300 cursor-pointer font-bold uppercase tracking-wider">
            Sign In
          </button>
        </nav>
      </header>

      <section className="relative px-6 pt-20 pb-24 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/45 backdrop-blur-sm text-zinc-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              VTU-Optimized Student Platform
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
              The Command Center for <br className="hidden sm:inline" />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400">
                Academic Excellence
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-2xl">
              Stop juggling spreadsheets, paper notes, and guesswork. Aegis Academics unifies attendance forecasting, exam planning, syllabus tracking, placement quizzes, and an AI study companion into one powerful workspace.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-wrap gap-4">
              <button onClick={onBackToLogin}
                className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-900 font-bold rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm">
                Launch Dashboard
                <ArrowRight className="w-4 h-4 text-neutral-900 stroke-[2.5]" />
              </button>
              <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer">
                Explore Features
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-8 pt-6">
              {STATS.map((stat, i) => (
                <div key={i} className={`text-center transition-all duration-500 ${i === currentStat ? "opacity-100 scale-105" : "opacity-50 scale-100"}`}>
                  <span className="text-xl font-bold text-white font-mono block">{stat.value}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-amber-500/5 blur-[90px] rounded-full pointer-events-none" />
            <Tilt3D maxTilt={6} scale={1.02} className="w-full max-w-[365px]">
              <div className="bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800/90 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">live preview</span>
                    <h3 className="text-sm font-sans font-semibold text-white">Quantum 3D Core</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-[8px] font-mono text-zinc-400 uppercase">Interactive</span>
                </div>
                <div className="flex justify-center py-3 bg-neutral-950/70 rounded-xl border border-zinc-900">
                  <QuantumCore3D size={200} />
                </div>
                <div className="space-y-1.5 text-center">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Drag to rotate vectors
                  </p>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-amber-400 uppercase tracking-[0.25em] text-xs font-bold block">// FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Everything You Need to <span className="text-amber-400 font-semibold">Ace Your Semester</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => {
              const colorMap: Record<string, string> = {
                amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
                purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              };
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-zinc-950/60 border border-zinc-900 hover:border-amber-400/25 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:shadow-lg hover:shadow-amber-500/5">
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorMap[feature.color]}`}>
                      <feature.icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium text-white group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed font-light">{feature.description}</p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                    {feature.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-mono text-purple-400 uppercase tracking-[0.25em] text-xs font-bold block">// WHY_AEGIS</span>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-white leading-tight">
              Why students <span className="text-amber-400 font-semibold">love this platform</span>
            </h2>
            <div className="w-16 h-1 bg-purple-500 rounded-full" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm">
              Education shouldn't live on disjointed notebooks. Aegis Academics bridges tracking, forecasting, and learning into a fluid experience.
            </p>
            <div className="flex p-1 bg-zinc-900/60 border border-zinc-800 rounded-xl max-w-xs text-xs font-mono">
              <button onClick={() => setActiveAnalysisTab("problems")}
                className={`flex-1 py-2 px-3 rounded-lg cursor-pointer transition-all ${activeAnalysisTab === "problems" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-white"}`}>
                Before Aegis
              </button>
              <button onClick={() => setActiveAnalysisTab("solution")}
                className={`flex-1 py-2 px-3 rounded-lg cursor-pointer transition-all ${activeAnalysisTab === "solution" ? "bg-amber-400 text-neutral-900 font-semibold" : "text-zinc-400 hover:text-white"}`}>
                With Aegis
              </button>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {activeAnalysisTab === "problems" ? (
                <motion.div key="problems" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35 }}
                  className="bg-zinc-950 border border-red-500/10 p-8 rounded-2xl space-y-6 shadow-xl">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest">The Problem</span>
                  </div>
                  <div className="space-y-4 text-xs font-light">
                    {[
                      { title: "Fragmented Notes", desc: "Syllabus scattered across paper booklets, university files, and WhatsApp groups with no single source of truth." },
                      { title: "Attendance Guesswork", desc: "No way to predict how missing tomorrow's lecture impacts your 75% VTU eligibility threshold." },
                      { title: "Passive Learning", desc: "Studying from static 2D textbook diagrams without interactive models to visualize complex concepts." }
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                        <h4 className="text-zinc-200 font-medium font-sans">{item.title}</h4>
                        <p className="text-zinc-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="solution" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35 }}
                  className="bg-zinc-950 border border-amber-500/20 p-8 rounded-2xl space-y-6 shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-amber-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest">The Aegis Solution</span>
                  </div>
                  <div className="space-y-4 text-xs font-light">
                    {[
                      { title: "Single Command Center", desc: "Syllabus, readiness scores, tasks, and analytics unified on one professional dashboard." },
                      { title: "Mathematical Forecaster", desc: "Adjust attendance sliders in real-time to see exact impact before you decide to skip." },
                      { title: "Interactive 3D Models", desc: "Rotate and explore mathematical projections directly in your browser with WebGL rendering." }
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl space-y-1">
                        <h4 className="text-white font-medium font-sans">{item.title}</h4>
                        <p className="text-zinc-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="sandbox" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-indigo-400 uppercase tracking-[0.25em] text-xs font-bold block">// INTERACTIVE SANDBOX</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Try the <span className="text-indigo-400 font-semibold">Cognitive Engine</span> Live
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mt-2" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm max-w-xl mx-auto pt-2">
              Pick a topic and answer the quiz to earn readiness credits. Test your knowledge before the exam.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 bg-zinc-900/10 border-r border-zinc-900 p-6 space-y-4">
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block">Topics</span>
              {[
                { key: "graphics" as const, label: "Computer Graphics 3D", sub: "Polygon Shading, Projections", icon: Code, color: "amber" },
                { key: "database" as const, label: "Relational Algebra", sub: "Schema Joins, DDL Bounds", icon: BookOpen, color: "purple" },
                { key: "networks" as const, label: "Networking Protocols", sub: "Routing Matrices, Congestion", icon: Cpu, color: "indigo" },
              ].map((topic) => (
                <button key={topic.key} onClick={() => { setActiveSandboxTopic(topic.key); resetQuiz(); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    activeSandboxTopic === topic.key
                      ? `bg-${topic.color}-400/[0.04] border-${topic.color}-400/25 text-${topic.color}-400`
                      : "bg-transparent border-zinc-900 text-zinc-400 hover:text-white"
                  }`}>
                  <topic.icon className="w-4 h-4" />
                  <div className="text-xs">
                    <span className="font-semibold block font-sans">{topic.label}</span>
                    <span className="font-mono text-[9px] text-zinc-500">{topic.sub}</span>
                  </div>
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-mono">CREDITS</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">+{quizScore} XP</span>
              </div>
            </div>

            <div className="md:col-span-8 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className={`font-mono text-[10px] text-${currentQuiz.color}-400 uppercase tracking-widest`}>// {currentQuiz.module}</span>
                  <h3 className="text-lg font-sans font-semibold text-white">{currentQuiz.question}</h3>
                </div>
                <p className="text-zinc-400 text-xs">{currentQuiz.context}</p>
                <div className="space-y-2.5">
                  {currentQuiz.options.map((ans, idx) => (
                    <button key={idx} onClick={() => handleQuizAnswer(idx)} disabled={selectedQuizAnswer !== null}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        selectedQuizAnswer === idx
                          ? idx === currentQuiz.correct
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-red-500/10 border-red-500 text-red-400"
                          : selectedQuizAnswer !== null && idx === currentQuiz.correct
                          ? "bg-green-500/10 border-green-500 text-green-400"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                      }`}>
                      <span>{idx + 1}. {ans}</span>
                      {selectedQuizAnswer === idx && idx === currentQuiz.correct && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                      {selectedQuizAnswer === idx && idx !== currentQuiz.correct && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                {quizFeedback === "correct" && (
                  <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-green-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Correct! +10 Credits.
                  </motion.span>
                )}
                {quizFeedback === "incorrect" && (
                  <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-red-400 flex items-center gap-1.5 font-mono">
                    <AlertCircle className="w-4 h-4" /> Incorrect. Try again!
                  </motion.span>
                )}
                {quizFeedback === null && (
                  <span className="text-zinc-500 font-mono flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Select an answer above.
                  </span>
                )}
                {selectedQuizAnswer !== null && (
                  <button onClick={resetQuiz} className="font-mono text-[10px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1 rounded cursor-pointer transition-colors">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="developer" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="font-mono text-amber-400 uppercase tracking-[0.25em] text-xs font-bold block">// DEVELOPER</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight">
              Built by <span className="text-amber-400 font-semibold">Lohith R C</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Tilt3D maxTilt={4} scale={1.012}>
              <div className="bg-zinc-950 border border-zinc-900 hover:border-amber-400/15 p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center transition-all duration-300">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-purple-500 to-indigo-600 rounded-full blur-[8px] opacity-40 group-hover:opacity-70 transition duration-1000" />
                  <div className="relative w-28 h-28 md:w-36 md:h-36 bg-zinc-950 rounded-full flex flex-col items-center justify-center p-1 border border-zinc-800">
                    <div className="w-full h-full bg-zinc-900 rounded-full flex flex-col items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-amber-400 stroke-[1.2] mb-1" />
                      <span className="font-mono text-lg font-bold text-white leading-none">LRC</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-5 flex-1 text-center lg:text-left">
                  <div>
                    <h3 className="text-3xl font-extralight tracking-tight text-white">Lohith R C</h3>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mt-2 uppercase tracking-widest bg-amber-400/5 border border-amber-400/15 px-3 py-1 rounded-full">
                      <GraduationCap className="w-3.5 h-3.5 stroke-[2]" />
                      CSE Student at KIT Tiptur
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    An innovative Computer Science and Engineering scholar at <span className="text-white font-medium">Kalpataru Institute of Technology, Tiptur</span>. Specializing in full-stack web apps, relational schemas, and interactive 3D graphics, Lohith built Aegis Academics to solve real student problems.
                  </p>
                  <div className="flex flex-wrap gap-3 text-[10px] font-mono justify-center lg:justify-start">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> KIT Tiptur
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
                      <Cpu className="w-3.5 h-3.5 text-zinc-500" /> CSE Department
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
                      <Code className="w-3.5 h-3.5 text-zinc-500" /> TypeScript & WebGL
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 space-y-6">
            <span className="font-mono text-indigo-400 uppercase tracking-[0.25em] text-xs font-bold block">// CONTACT</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Get in <span className="text-amber-400 font-semibold">Touch</span></h2>
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm">
              Want to integrate this into your college, request features, or collaborate? Reach out directly.
            </p>
            <div className="space-y-4 pt-2">
              <a href="mailto:lohithraj9090@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-amber-400/25 text-zinc-300 hover:text-white transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block">Email</span>
                  <span className="text-xs font-semibold font-mono">lohithraj9090@gmail.com</span>
                </div>
              </a>
              <a href="https://github.com/Lohith-raj-90" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-indigo-400/25 text-zinc-300 hover:text-white transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block">GitHub</span>
                  <span className="text-xs font-semibold font-mono">github.com/Lohith-raj-90</span>
                </div>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 bg-zinc-950 border border-zinc-900 p-8 rounded-2xl relative shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <h3 className="text-base font-semibold text-white font-sans flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Send a Message
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">SECURE</span>
            </div>

            {isSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-medium text-base">Message Sent!</h4>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto font-light">Your message has been recorded. Check the feed below.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Name</label>
                    <input type="text" required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name"
                      className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Email</label>
                    <input type="email" required value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Message</label>
                  <textarea required rows={4} value={senderMessage} onChange={(e) => setSenderMessage(e.target.value)} placeholder="Your message..."
                    className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all resize-none" />
                </div>
                <button type="submit" disabled={isSending}
                  className="w-full py-3 bg-zinc-900 hover:bg-amber-400 text-zinc-300 hover:text-neutral-900 disabled:opacity-50 font-bold text-xs rounded-xl transition-all duration-300 border border-zinc-800 hover:border-amber-400 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
                  {isSending ? (<><Cpu className="w-4 h-4 animate-spin text-amber-500" /> Sending...</>) : (<><Send className="w-3.5 h-3.5 stroke-[2]" /> Send Message</>)}
                </button>
              </form>
            )}

            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Recent Messages</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {messageQueue.map((msg) => (
                  <div key={msg.id} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl text-[10px] font-light space-y-1">
                    <div className="flex justify-between font-mono text-zinc-400">
                      <span className="font-semibold text-white">{msg.name}</span>
                      <span className="text-zinc-500 text-[9px]">{msg.timestamp}</span>
                    </div>
                    <p className="text-zinc-300 italic">"{msg.message}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-transparent to-neutral-950 py-24 border-t border-zinc-900 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.015)_0%,transparent_70%)] pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">Ready to Transform Your Studies?</h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Join hundreds of students using Aegis Academics to track attendance, prepare for exams, and ace their semesters.
        </p>
        <button onClick={onBackToLogin}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-900 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5">
          Get Started Free
          <ArrowRight className="w-4 h-4 text-neutral-900" />
        </button>
      </section>

      <footer className="border-t border-zinc-900/60 py-12 text-center text-[11px] text-zinc-500 font-mono relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>&copy; 2026 Aegis Academics. Built by Lohith R C | KIT Tiptur CSE</p>
          <div className="flex justify-center gap-4 text-[10px] text-zinc-600 pt-2">
            <span>VTU Compliant</span>
            <span>&bull;</span>
            <span>Open Source</span>
            <span>&bull;</span>
            <a href="https://github.com/Lohith-raj-90/Aegis-Academics" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
