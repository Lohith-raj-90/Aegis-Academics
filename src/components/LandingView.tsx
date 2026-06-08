import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Award, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Github, 
  Linkedin,
  Cpu,
  BookOpen,
  CheckCircle2,
  Send,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Code
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

export const LandingView: React.FC<LandingViewProps> = ({ onBackToLogin }) => {
  // Comparative Pain vs Solution State
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"problems" | "solution">("problems");

  // Concept Sandbox Mini-Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Active Sandbox Topic
  const [activeSandboxTopic, setActiveSandboxTopic] = useState<"graphics" | "database" | "networks">("graphics");

  // Contact Form States
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [messageQueue, setMessageQueue] = useState<MessageEntry[]>([
    {
      id: "demo-1",
      name: "Tiptur CSE Node Coordinator",
      email: "kit.cse@kalpataru.edu",
      message: "Excellent 3D coordinate mathematics on this student dashboard, Lohith!",
      timestamp: "06/08/2026, 09:12 AM"
    }
  ]);

  const handleQuizAnswer = (index: number) => {
    setSelectedQuizAnswer(index);
    if (index === 2) { // Index of correct answer
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

      // Clear layout inputs
      setSenderName("");
      setSenderEmail("");
      setSenderMessage("");

      // Revert sent state back screen after a short delay
      setTimeout(() => {
        setIsSent(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#050507] text-zinc-100 font-sans min-h-screen relative overflow-hidden selection:bg-amber-400 selection:text-neutral-900">
      
      {/* Prime Background Noise Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.035)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-indigo-500/5 blur-[150px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-x-0 top-0 h-[650px] bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Sticky Header with Glassmorphic visual effect */}
      <header className="border-b border-zinc-900/60 bg-neutral-950/60 backdrop-blur-xl sticky top-0 z-40 py-4.5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/5">
            <GraduationCap className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-amber-400 leading-none block uppercase">DEVELOPER LABS</span>
            <span className="font-sans font-semibold tracking-tight text-white text-base">Aegis Academics</span>
          </div>
        </div>

        {/* Navigation center tabs list */}
        <nav className="flex items-center gap-4 md:gap-8 text-xs font-mono font-medium">
          <button
            onClick={() => document.getElementById("about-project")?.scrollIntoView({ behavior: "smooth" })}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:block"
          >
            // OVERVIEW
          </button>
          <button
            onClick={() => document.getElementById("interactive-sandbox")?.scrollIntoView({ behavior: "smooth" })}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:block"
          >
            // COGNITIVE_SANDBOX
          </button>
          <button
            onClick={() => document.getElementById("developer")?.scrollIntoView({ behavior: "smooth" })}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            // THE_DEVELOPER
          </button>
          <button
            onClick={onBackToLogin}
            className="px-4.5 py-2 bg-zinc-900 hover:bg-amber-400 hover:text-neutral-950 border border-zinc-800 hover:border-amber-400 text-zinc-350 text-xs rounded-lg transition-all duration-300 cursor-pointer font-bold uppercase tracking-wider shadow-inner"
          >
            Sign In To Workspace
          </button>
        </nav>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative px-6 pt-24 pb-20 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-7 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/45 backdrop-blur-sm text-zinc-300 font-mono text-xs shadow-sm shadow-amber-400/2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Verified Engineering Scholar Project
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-white leading-[1.1]"
            >
              The Next-Generation <br className="hidden sm:inline" />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-250 to-indigo-400">
                Academic Command
              </span> Suite.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-2xl"
            >
              Ditch fragile administration sheets. Aegis Academics consolidates dynamic syllabus indexing, interactive math models, predictive class-attendance forecasting, and customized AI learning engines into a unified workspace.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <button
                onClick={onBackToLogin}
                className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-450 hover:via-amber-350 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
              >
                Launch Unified Dashboard
                <ArrowRight className="w-4 h-4 text-neutral-900 stroke-[2.5]" />
              </button>
              <button
                onClick={() => document.getElementById("interactive-sandbox")?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-inner"
              >
                Try Interactive Sandbox
              </button>
            </motion.div>
          </div>

          {/* Draggable 3D interactive widget */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-amber-500/5 blur-[90px] rounded-full pointer-events-none" />
            
            <Tilt3D maxTilt={6} scale={1.02} className="w-full max-w-[365px]">
              <div className="bg-zinc-950/80 p-6 rounded-2xl border border-zinc-850/90 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">interactive viewport</span>
                    <h3 className="text-sm font-sans font-semibold text-white">Quantum 3D Core Rendering</h3>
                  </div>
                  <div className="px-2.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                    Interactive
                  </div>
                </div>

                {/* 3D Core with Interactive Canvas */}
                <div className="flex justify-center py-3 bg-neutral-950/70 rounded-xl border border-zinc-900 relative">
                  <QuantumCore3D size={200} />
                </div>

                <div className="space-y-1.5 text-center">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Interactive: Drag to rotate vectors
                  </p>
                  <p className="text-[9px] font-mono text-zinc-500 text-center px-4">
                    Rendered purely using lightweight math projections, simulating the dual orbits and faceted shaders on traditional system parameters.
                  </p>
                </div>
              </div>
            </Tilt3D>
          </div>

        </div>
      </section>

      {/* "What is Project" Bento Grid Section */}
      <section id="about-project" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-amber-400 uppercase tracking-[0.25em] text-xs font-bold block">// SYSTEM_OVERVIEW</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              An Elite Workspace Built Around <span className="text-amber-400 font-semibold">Real Student Utility</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-600 mx-auto rounded-full mt-2" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm max-w-xl mx-auto pt-2">
              Unifying scattered spreadsheets, academic schedules, exam preparation criteria, and live mathematical renderers into a single point of intelligence.
            </p>
          </div>

          {/* Elegant Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card 1 - Main Feature (Long double size) */}
            <div className="md:col-span-8 bg-zinc-950/60 border border-zinc-900 hover:border-amber-400/25 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient(circle_at_top_right,rgba(245,158,11,0.035)_0%,transparent_70%) pointer-events-none" />
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white group-hover:text-amber-400 transition-colors">Unified Performance Analytics Dashboard</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    Displays high-velocity charts monitoring readiness coefficients, weekly agendas, and exam score trends. Incorporates active quiz response monitoring and historical progress indices so you can visually chart your study speed.
                  </p>
                </div>
              </div>

              {/* Graphic Mock representing progress */}
              <div className="mt-8 p-4 bg-zinc-900/30 rounded-xl border border-zinc-850 flex gap-4 overflow-hidden relative">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>SEMESTER_PROGRESS</span>
                    <span className="text-amber-400">76% COMPLETED</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 h-full rounded-full" style={{ width: "76%" }} />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>READY_COEFFICIENT</span>
                    <span className="text-indigo-400">86% STABLE</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full animate-pulse" style={{ width: "86%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 - Attendance (Simple card) */}
            <div className="md:col-span-4 bg-zinc-950/60 border border-zinc-900 hover:border-amber-400/25 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-inner">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">Predictive Attendance Forecaster</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light">
                    Equipped with simulation sliders allowing you to predict critical attendance percentage. Instantly evaluates how skipped classes impact college eligibility margins.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex justify-between items-center">
                <span>MODULE = COMPUTE_RISK</span>
                <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">ELIGIBLE</span>
              </div>
            </div>

            {/* Bento Card 3 - Database Indexing */}
            <div className="md:col-span-4 bg-zinc-950/60 border border-zinc-900 hover:border-amber-400/25 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-inner">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <BookOpen className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-indigo-300 transition-colors">Syllabus Vault Manager</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light">
                    Stores and organizes system topics, tracks reading milestones, and hosts digital study nodes ensuring your exam syllabus is indexed correctly.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                REF = DIGITAL_LIFELINE
              </div>
            </div>

            {/* Bento Card 4 - Server-Side AI (Long double size) */}
            <div className="md:col-span-8 bg-zinc-950/60 border border-zinc-900 hover:border-amber-400/25 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-64 h-64 bg-radial-gradient(circle_at_top_left,rgba(99,102,241,0.035)_0%,transparent_70%) pointer-events-none" />
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Cpu className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white group-hover:text-indigo-400 transition-colors">Intel AI Learning Companion</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    Backed by premium server-side AI endpoints configured to analyze research uploads, explain mathematical calculations, and provide automated recommendations based on academic readiness parameters in real-time.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">Gemini 3.5 Native</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">Double Layer Safety</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">File Parsing Pipeline</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why is this necessary? Comparative Interactive Section */}
      <section id="why-necessary" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="font-mono text-purple-400 uppercase tracking-[0.25em] text-xs font-bold block">// PROBLEM_ VS_SOLUTION</span>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-white leading-tight">
              Why is this system <span className="text-amber-400 font-semibold">critically required</span>?
            </h2>
            <div className="w-16 h-1 bg-purple-500 rounded-full" />
            
            <p className="text-zinc-400 leading-relaxed font-light text-sm">
              Education shouldn't reside on disjointed notebooks or guess-based forecast sheets. Aegis Academics bridges administrative tracking and intuitive computer visualizers into a fluid software experience. Explore the contrast of standard routines against Aegis workflow.
            </p>

            {/* Quick Toggle Buttons */}
            <div className="flex p-1 bg-zinc-900/60 border border-zinc-800 rounded-xl max-w-xs text-xs font-mono">
              <button
                onClick={() => setActiveAnalysisTab("problems")}
                className={`flex-1 py-2 px-3 rounded-lg cursor-pointer transition-all ${
                  activeAnalysisTab === "problems" 
                    ? "bg-zinc-800 text-white font-semibold" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Traditional Student Pain
              </button>
              <button
                onClick={() => setActiveAnalysisTab("solution")}
                className={`flex-1 py-2 px-3 rounded-lg cursor-pointer transition-all ${
                  activeAnalysisTab === "solution" 
                    ? "bg-amber-400 text-neutral-900 font-semibold" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                The Aegis Solution
              </button>
            </div>
          </div>

          {/* Interactive Toggle Display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeAnalysisTab === "problems" ? (
                <motion.div
                  key="problems"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-zinc-950 border border-red-500/10 p-8 rounded-2xl space-y-6 shadow-xl"
                >
                  <div className="flex items-center gap-2 Text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest text-red-400">The Problem Vector</span>
                  </div>

                  <div className="space-y-4 text-xs font-light">
                    <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                      <h4 className="text-zinc-200 font-medium font-sans">Fragmented Coordinates</h4>
                      <p className="text-zinc-400">Notes mapped in paper booklets, syllabus criteria scattered inside university files, and no single source of truth.</p>
                    </div>
                    <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                      <h4 className="text-zinc-200 font-medium font-sans">Underestimating Attendance Deficits</h4>
                      <p className="text-zinc-400">Guessing how missing tomorrow's academic lecture risks qualifying eligibility. No mathematical forecasts.</p>
                    </div>
                    <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                      <h4 className="text-zinc-200 font-medium font-sans">Mechanical Learning Methods</h4>
                      <p className="text-zinc-400">Reviewing static 2D coordinates in black-and-white printouts without physical rotation models to understand layout mathematics.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-zinc-950 border border-amber-500/20 p-8 rounded-2xl space-y-6 shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-amber-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-500">The Aegis Solution</span>
                  </div>

                  <div className="space-y-4 text-xs font-light">
                    <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl space-y-1">
                      <h4 className="text-white font-medium font-sans">A Single Point of Truth</h4>
                      <p className="text-zinc-400">Syllabus indexes, readiness vectors, task reminders, and analytical reports mapped completely onto a professional command grid.</p>
                    </div>
                    <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl space-y-1">
                      <h4 className="text-white font-medium font-sans">Mathematical Forecaster Core</h4>
                      <p className="text-zinc-200">Adjust active attendance sliders dynamically to check real-time percentages before you choose to take leave.</p>
                    </div>
                    <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl space-y-1">
                      <h4 className="text-white font-medium font-sans">Interactive 3D Matrix View</h4>
                      <p className="text-zinc-200">Enables smooth WebGL rotation models to visualize rendering spheres and polyhedrons directly inside the browser viewport.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Interactive Concept Sandbox (Bypasses generic structure) */}
      <section id="interactive-sandbox" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-indigo-400 uppercase tracking-[0.25em] text-xs font-bold block">// ACADEMIC_SANDBOX</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Test the Aegis <span className="text-indigo-400 font-semibold">Cognitive Engine</span> Live
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mt-2" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm max-w-xl mx-auto pt-2">
              Select an engineering topic under our custom curriculum modules and resolve the core coordinate proof to earn readiness credits!
            </p>
          </div>

          {/* Sandbox Layout Workspace */}
          <div className="max-w-5xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
            
            {/* Sidebar selectors */}
            <div className="md:col-span-4 bg-zinc-900/10 border-r border-zinc-900 p-6 space-y-4">
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block">Available Topics</span>
              
              <button
                onClick={() => { setActiveSandboxTopic("graphics"); resetQuiz(); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeSandboxTopic === "graphics"
                    ? "bg-amber-400/[0.04] border-amber-400/25 text-amber-400"
                    : "bg-transparent border-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Code className="w-4 h-4" />
                <div className="text-xs">
                  <span className="font-semibold block font-sans">Computer Graphics 3D</span>
                  <span className="font-mono text-[9px] text-zinc-500">Polygon Shading, Projections</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveSandboxTopic("database"); resetQuiz(); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeSandboxTopic === "database"
                    ? "bg-purple-400/[0.04] border-purple-400/25 text-purple-400"
                    : "bg-transparent border-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <div className="text-xs">
                  <span className="font-semibold block font-sans">Relational Algebra</span>
                  <span className="font-mono text-[9px] text-zinc-500">Schema Joins, DDL Bounds</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveSandboxTopic("networks"); resetQuiz(); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeSandboxTopic === "networks"
                    ? "bg-indigo-400/[0.04] border-indigo-400/25 text-indigo-400"
                    : "bg-transparent border-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Cpu className="w-4 h-4" />
                <div className="text-xs">
                  <span className="font-semibold block font-sans">Networking Protocols</span>
                  <span className="font-mono text-[9px] text-zinc-500">Routing Matrices, Congestion</span>
                </div>
              </button>

              {/* Live Score Counter with gold particles look */}
              <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-mono">EARNED_CREDITS</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  +{quizScore} XP
                </span>
              </div>
            </div>

            {/* Sandbox Main Panel Display */}
            <div className="md:col-span-8 p-8 flex flex-col justify-between space-y-6">
              
              {activeSandboxTopic === "graphics" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest">// MODULE_01 // COMPUTER_GRAPHICS_3D</span>
                    <h3 className="text-lg font-sans font-semibold text-white">How is Depth Sorting handled in 3D orthographic canvas visualizers?</h3>
                  </div>

                  <p className="text-zinc-400 text-xs">
                    In systems with overlapping 3D meshes (such as our custom double orbit grids on physical canvases), typical projections risk clipping if rendered without sorting. Which algorithm solves this coordinates depth sorting challenge?
                  </p>

                  <div className="space-y-2.5">
                    {[
                      "Bresenham's Midpoint Line Coordinate Extrapolator",
                      "Phong Reflection Illuminator Matrix",
                      "Painter's Depth Sorting Algorithm (Depth-Z sorting)",
                      "Fast Fourier Spatial Signal Modulation"
                    ].map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedQuizAnswer !== null}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          selectedQuizAnswer === idx
                            ? idx === 2
                              ? "bg-green-500/10 border-green-500 text-green-400"
                              : "bg-red-500/10 border-red-500 text-red-400"
                            : selectedQuizAnswer !== null && idx === 2
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:text-white cursor-pointer"
                        }`}
                      >
                        <span>{idx + 1}. {ans}</span>
                        {selectedQuizAnswer === idx && idx === 2 && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                        {selectedQuizAnswer === idx && idx !== 2 && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSandboxTopic === "database" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest">// MODULE_02 // RELATIONAL_ALGEBRA</span>
                    <h3 className="text-lg font-sans font-semibold text-white">Which Relational Calculus structure manages foreign key bounds securely?</h3>
                  </div>

                  <p className="text-zinc-400 text-xs">
                    In database index sets, managing foreign boundaries requires enforcing integrity properties to avoid orphaned coordinates across schema logs.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      "Unilateral Vector Shifters",
                      "Referential Integrity Constraints (Foreign Keys)",
                      "Volatile Hash Matrices",
                      "Cyclic Redundancy Coordinates"
                    ].map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedQuizAnswer !== null}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          selectedQuizAnswer === idx
                            ? idx === 1
                              ? "bg-green-500/10 border-green-500 text-green-400"
                              : "bg-red-500/10 border-red-500 text-red-400"
                            : selectedQuizAnswer !== null && idx === 1
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:text-white cursor-pointer"
                        }`}
                      >
                        <span>{idx + 1}. {ans}</span>
                        {selectedQuizAnswer === idx && idx === 1 && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                        {selectedQuizAnswer === idx && idx !== 1 && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSandboxTopic === "networks" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">// MODULE_03 // ROUTING_MATRICES</span>
                    <h3 className="text-lg font-sans font-semibold text-white">Which algorithm prevents loops in physical mesh coordinates?</h3>
                  </div>

                  <p className="text-zinc-400 text-xs">
                    Traditional local networks suffer routing storms back within visual mesh parameters unless looped lines are dynamically pruned.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      "Bilinear Interpolation filter",
                      "Drizzle Schema Generator",
                      "Spanning Tree Protocol (STP)",
                      "Asymmetrical Hash Resolver"
                    ].map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedQuizAnswer !== null}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          selectedQuizAnswer === idx
                            ? idx === 2
                              ? "bg-green-500/10 border-green-500 text-green-400"
                              : "bg-red-500/10 border-red-500 text-red-400"
                            : selectedQuizAnswer !== null && idx === 2
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:text-white cursor-pointer"
                        }`}
                      >
                        <span>{idx + 1}. {ans}</span>
                        {selectedQuizAnswer === idx && idx === 2 && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                        {selectedQuizAnswer === idx && idx !== 2 && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Feedbacks banner */}
              <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                {quizFeedback === "correct" && (
                  <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-green-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Correct coordinate resolved! +10 Credits.
                  </motion.span>
                )}
                {quizFeedback === "incorrect" && (
                  <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-red-400 flex items-center gap-1.5 font-mono">
                    <AlertCircle className="w-4 h-4" /> Proof mismatch. Try again!
                  </motion.span>
                )}
                {quizFeedback === null && (
                  <span className="text-zinc-500 font-mono flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Submit choice above to verify.
                  </span>
                )}

                {selectedQuizAnswer !== null && (
                  <button
                    onClick={resetQuiz}
                    className="font-mono text-[10px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 px-3 py-1 rounded cursor-pointer transition-colors"
                  >
                    Reset & Retry
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Meet the Developer section: Lohith R C */}
      <section id="developer" className="border-t border-zinc-900/60 bg-zinc-900/10 py-24 px-6 relative z-10 scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="font-mono text-amber-400 pathname uppercase tracking-[0.25em] text-xs font-bold block">// FOUNDER_BIO</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight">
              Meet the <span className="text-amber-400 font-semibold">Engineering Student Developer</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Tilt3D maxTilt={4} scale={1.012}>
              <div className="bg-zinc-950 border border-zinc-900 hover:border-amber-400/15 p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center transition-all duration-300">
                <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient(circle_at_top_right,rgba(245,158,11,0.05)_0%,transparent_70%) pointer-events-none" />
                
                {/* Custom Vector Avatar with geometric rotating design */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-purple-500 to-indigo-600 rounded-full blur-[8px] opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
                  <div className="relative w-28 h-28 md:w-36 md:h-36 bg-zinc-950 rounded-full flex flex-col items-center justify-center p-1 border border-zinc-800">
                    <div className="w-full h-full bg-zinc-900 rounded-full flex flex-col items-center justify-center relative overflow-hidden">
                      <GraduationCap className="w-10 h-10 text-amber-400 stroke-[1.2] mb-1" />
                      <span className="font-mono text-lg font-bold text-white leading-none">LRC</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 flex-1 text-center lg:text-left">
                  <div>
                    <h3 className="text-3xl font-extralight tracking-tight text-white">
                      Lohith R C
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mt-2 uppercase tracking-widest bg-amber-400/5 border border-amber-400/15 px-3 py-1 rounded-full">
                      <GraduationCap className="w-3.5 h-3.5 stroke-[2]" />
                      Computer Science & Engineering Student
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    Lohith R C is an innovative Computer Science and Engineering scholar currently studying at <span className="text-white font-medium">Kalpataru Institute of Technology, Tiptur</span> (KIT). With specialized aptitude in full-stack web applications, relational schemas, and interactive browser-based 3D computer graphics vectors, Lohith built Aegis Academics to ease local student administrative pain through elegant layout designs.
                  </p>

                  {/* Badges for academic indicators */}
                  <div className="flex flex-wrap gap-3 text-[10px] font-mono justify-center lg:justify-start">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      KIT Tiptur Campus
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-300">
                      <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                      CSE Department
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-300">
                      <Code className="w-3.5 h-3.5 text-zinc-500" />
                      TypeScript & WebGL
                    </div>
                  </div>
                </div>

              </div>
            </Tilt3D>
          </div>

        </div>
      </section>

      {/* "Contact Direct Gateway Gateway" Sec */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-5 space-y-6">
            <span className="font-mono text-indigo-400 uppercase tracking-[0.25em] text-xs font-bold block">// DIRECT_PORT</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Connect with <span className="text-amber-400 font-semibold">Lohith R C</span></h2>
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <p className="text-zinc-400 leading-relaxed font-light text-sm">
              Ready to request adjustments, integrate the scholastic dashboard into college servers, or write project modifications? Get in touch immediately.
            </p>

            <div className="space-y-4 pt-2">
              <a 
                href="mailto:lohithraj9090@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-amber-400/25 text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Mail className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block">Primary Contact</span>
                  <span className="text-xs font-semibold font-mono">lohithraj9090@gmail.com</span>
                </div>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-indigo-400/25 text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Github className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block">Developer Core</span>
                  <span className="text-xs font-semibold font-mono">github.com/lohithraj9090</span>
                </div>
              </a>
            </div>
          </div>

          {/* Interactive Form Sandbox (Replacing generic text block with genuine activity) */}
          <div className="md:col-span-7 bg-zinc-950 border border-zinc-900 p-8 rounded-2xl relative shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <h3 className="text-base font-semibold text-white font-sans flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Workspace Connection Sandbox
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">LOCAL_ROUTING_SECURE</span>
            </div>

            {isSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-medium text-base">Connection Calibrated Successfully!</h4>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto font-light">
                    Your mock coordinate message was safely stored in local state queue. Observe it listed live below.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Professor Smith"
                      className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Email Node Address</label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. scholar@varsity.edu"
                      className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Coordinate Message</label>
                  <textarea
                    required
                    rows={4}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Type message text here..."
                    className="w-full bg-[#0d0d11] border border-zinc-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-zinc-900 hover:bg-amber-400 text-zinc-300 hover:text-neutral-900 disabled:opacity-50 font-bold text-xs rounded-xl transition-all duration-300 border border-zinc-800 hover:border-amber-400 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest shadow-md"
                >
                  {isSending ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin text-amber-500" />
                      routing packet...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 stroke-[2]" />
                      Route message
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Queue List of Dynamic coordinates sent */}
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Active Message Feed (saved in local memory)</span>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {messageQueue.map((msg) => (
                  <div key={msg.id} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl text-[10px] font-light space-y-1">
                    <div className="flex justify-between font-mono text-zinc-400">
                      <span className="font-semibold text-white">{msg.name} ({msg.email})</span>
                      <span className="text-zinc-550 text-[9px]">{msg.timestamp}</span>
                    </div>
                    <p className="text-zinc-300 italic">"{msg.message}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Modern High-Impact Call-to-action Section */}
      <section className="bg-gradient-to-b from-transparent to-neutral-950 py-24 border-t border-zinc-900 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(245,158,11,0.015)_0%,transparent_70%) pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">Upgrade Your Scholastic Performance</h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Unlock predictive attendance forecasts, study milestone trackers, and live mathematical renderers configured for ambitious students.
        </p>
        <button
          onClick={onBackToLogin}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-neutral-900 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5 hover:shadow-amber-500/12"
        >
          Enter Full-Stack Command Center
          <ArrowRight className="w-4 h-4 text-neutral-900" />
        </button>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-zinc-900/60 py-12 text-center text-[11px] text-zinc-500 font-mono relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 Aegis Academics. Styled in high-contrast cosmic slate and engineered by student developer Lohith R C under KIT Tiptur CSE.</p>
          <div className="flex justify-center gap-4 text-[10px] text-zinc-650 pt-2">
            <span>Client-Authoritative Security</span>
            <span>•</span>
            <span>Kalpataru Institute Node</span>
            <span>•</span>
            <span>No Artificial Over-Decorations</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
