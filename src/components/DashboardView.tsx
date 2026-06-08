import React, { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  ArrowUpRight, 
  GraduationCap, 
  ArrowRight,
  Cpu,
  Activity,
  Flame,
  Sliders,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  BookmarkCheck,
  UserCheck,
  HelpCircle
} from "lucide-react";
import { TabType } from "../types";
import { QuantumCore3D } from "./QuantumCore3D";
import { Tilt3D } from "./Tilt3D";
import { motion, AnimatePresence } from "motion/react";

interface DashboardViewProps {
  onNavigateToTab: (tab: TabType) => void;
  attendancePct: number;
  completedTasksCount: number;
  totalTasksCount: number;
  readinessScore: number;
  username: string;
}

// Structured Mock Subjects for stateful masteries
interface SubjectNode {
  id: string;
  name: string;
  code: string;
  masteryPct: number;
  requiredSyllabus: string[];
  recommendedHours: number;
  completedSessions: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  attendancePct: initialAttendance,
  completedTasksCount,
  totalTasksCount,
  readinessScore: initialReadiness,
  username
}) => {
  // 1. STATEFUL: Active Simulated Lecture Simulator
  const [sessionLecturesSkipped, setSessionLecturesSkipped] = useState<number>(0);
  const totalLecturesCount = 45;
  const attendedLecturesCount = Math.round((initialAttendance / 100) * totalLecturesCount);
  
  // Calculate simulated attendance percentage
  const currentAttendedSimulated = Math.max(0, attendedLecturesCount - sessionLecturesSkipped);
  const simulatedAttendancePct = Math.round((currentAttendedSimulated / totalLecturesCount) * 100);

  // 2. STATEFUL: Detailed Subject Nodes with interactive progress logs
  const [subjects, setSubjects] = useState<SubjectNode[]>([
    {
      id: "calc-101",
      name: "Calculus & Vector Coordinates",
      code: "MAT-301",
      masteryPct: 78,
      requiredSyllabus: ["Fourier Transformations", "Taylor Series Exponent", "Green's Scalar Projections"],
      recommendedHours: 12,
      completedSessions: 4
    },
    {
      id: "quant-45",
      name: "Quantum Superpositions & Circuits",
      code: "PHY-340",
      masteryPct: 62,
      requiredSyllabus: ["Qubit Rotations", "Bloch Sphere Coordinates", "Deutsch-Jozsa Logic"],
      recommendedHours: 16,
      completedSessions: 2
    },
    {
      id: "db-alg",
      name: "Relational Algebra & Schemas",
      code: "CSE-402",
      masteryPct: 86,
      requiredSyllabus: ["Boyce-Codd Normal Index", "Tuple Calculus", "Drizzle Migrations"],
      recommendedHours: 10,
      completedSessions: 6
    },
    {
      id: "aut-99",
      name: "Automata & Computability bounds",
      code: "CSE-405",
      masteryPct: 54,
      requiredSyllabus: ["Chomsky Hierarchy Boundary", "Tape Shifting Limits", "NP-Complete Reductions"],
      recommendedHours: 18,
      completedSessions: 1
    }
  ]);

  const [activeSubjectId, setActiveSubjectId] = useState<string>("calc-101");
  const selectedSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  // 3. STATEFUL: Real-time user logs / activities
  const [localLogs, setLocalLogs] = useState<Array<{ id: string; text: string; time: string; type: "success" | "warning" | "info" }>>([
    { id: "log-1", text: "Matrix coordinate visualization initial calibration set.", time: "10:14 AM", type: "success" },
    { id: "log-2", text: "Calculus diagnostic quiz completed successfully.", time: "09:45 AM", type: "success" },
    { id: "log-3", text: "Attendance forecasted drop to warning zone under simulation.", time: "08:12 AM", type: "warning" }
  ]);

  // 4. STATEFUL: Dynamic Weekly Learning Hours Chart
  const [weeklyVelocity, setWeeklyVelocity] = useState([
    { day: "Mon", hours: 6, label: "Calculus MAT-301" },
    { day: "Tue", hours: 4, label: "Relational CSE-402" },
    { day: "Wed", hours: 8, label: "Quantum PHY-340" },
    { day: "Thu", hours: 5, label: "Automata CSE-405" },
    { day: "Fri", hours: 9, label: "AI Labs Workspace" },
    { day: "Sat", hours: 3, label: "Library Retrieval" },
    { day: "Sun", hours: 2, label: "Syllabus Review" }
  ]);

  // Slider for adding study hours to active day
  const [selectedVelocityDay, setSelectedVelocityDay] = useState<string>("Fri");
  const [logHoursAmount, setLogHoursAmount] = useState<number>(1.5);

  const handleLogStudyTime = () => {
    setWeeklyVelocity(prev => prev.map(item => {
      if (item.day === selectedVelocityDay) {
        return {
          ...item,
          hours: Math.min(12, Number((item.hours + logHoursAmount).toFixed(1)))
        };
      }
      return item;
    }));

    // Spawn alert notification log
    const activeSubjectName = selectedSubject.name.split(" ")[0];
    const newLog = {
      id: `log-${Date.now()}`,
      text: `Registered ${logHoursAmount} hrs practice focus toward ${activeSubjectName}!`,
      time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
      type: "success" as const
    };

    setLocalLogs(prev => [newLog, ...prev]);

    // Boost selected subject mastery
    setSubjects(prev => prev.map(s => {
      if (s.id === selectedSubject.id) {
        return {
          ...s,
          masteryPct: Math.min(100, s.masteryPct + 4),
          completedSessions: s.completedSessions + 1
        };
      }
      return s;
    }));
  };

  // 5. STATEFUL: Live AI insights generator
  const insightOptions = [
    "Verify Green's Scalar Theorem bounds. Current calculus vectors score indicates optimal performance but weak coordinate derivation limits.",
    "Prioritize Cape automata proof parameters. Your 54% mastery remains the primary drag vector preventing an Overall Genius tier rating.",
    "Database schema structures are highly stable. We suggest shifting 2 hours from Relational Algebra to Bloch Sphere circuit equations.",
    "Attendance simulation alert! If you skip another class lecture, you will hit 78%, which is below the VTU minimum 80% boundary constraint.",
    "Aegis Neural advisor suggests practicing a mock Calculus Flashcard set to boost diagnostic index above the 90 thresholds.",
  ];
  const [activeInsightIndex, setActiveInsightIndex] = useState<number>(0);
  const [isSpinningInsight, setIsSpinningInsight] = useState<boolean>(false);

  const triggerNextInsight = () => {
    setIsSpinningInsight(true);
    setTimeout(() => {
      setActiveInsightIndex((prev) => (prev + 1) % insightOptions.length);
      setIsSpinningInsight(false);
    }, 600);
  };

  const maxHours = 12;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 bg-amber-400/5 px-2.5 py-0.5 rounded border border-amber-400/15">
              Command Node Ready
            </span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase">SYS_REV = AEGIS_V1</span>
          </div>
          <h1 className="text-3xl font-sans font-extralight text-white tracking-tight mt-1.5 leading-none">
            Unified Interface: <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400">{username || "Scholar"}</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1.5 font-light">
            All database pathways synchronized. Real-time VTU administrative calculations calibrated and active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={triggerNextInsight}
            className="p-2 border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Force Neural Checkpoint"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSpinningInsight ? "animate-spin text-amber-400" : ""}`} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/10 bg-amber-500/5 text-amber-400/90 font-mono text-xs shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>AEGIS_COGNITIVE_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Core Showcase Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Modern Interactive Hero Console with Tilt */}
        <div className="lg:col-span-8">
          <Tilt3D maxTilt={2} scale={1.002} className="w-full h-full">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-zinc-950 p-8 shadow-2xl h-full flex flex-col justify-between">
              
              {/* Radial decor gradient */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient(circle_at_top_right,rgba(245,158,11,0.04)_0%,transparent_70%) pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03)_0%,transparent_70%) pointer-events-none" />

              <div className="space-y-4 max-w-xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-zinc-850 bg-zinc-900/80 text-zinc-400 font-mono text-[9px] uppercase tracking-wider">
                  SYSTEM ENGINE VIEWPORT
                </div>
                <h2 className="text-2xl md:text-3xl font-extralight text-white leading-tight">
                  Your academic preparation index is <span className="text-amber-400 font-medium">highly stable</span>. Keep orbits aligned.
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  Welcome to Aegis Academics. This custom software merges complex VTU coordinate graphs, interactive physics simulations, and adaptive mock testing modules to accelerate learning milestones.
                </p>
                
                {/* Active Dynamic Micro-Counter */}
                <div className="grid grid-cols-3 gap-4 pt-2 max-w-sm">
                  <div className="border border-zinc-900 bg-zinc-950/45 p-2 px-3 rounded-lg text-center backdrop-blur-xs">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Ready Level</span>
                    <span className="text-base font-bold text-white font-mono">{initialReadiness}%</span>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-950/45 p-2 px-3 rounded-lg text-center backdrop-blur-xs">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Active Subjects</span>
                    <span className="text-base font-bold text-indigo-400 font-mono">4 Modules</span>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-950/45 p-2 px-3 rounded-lg text-center backdrop-blur-xs">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Tasks Remain</span>
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {totalTasksCount - completedTasksCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action hubs */}
              <div className="flex flex-wrap gap-3 pt-6 relative z-10">
                <button
                  onClick={() => onNavigateToTab("quiz")}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-450 hover:to-amber-450 text-neutral-900 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md shadow-amber-500/5 group"
                >
                  <Play className="w-3 h-3 text-neutral-900 fill-neutral-900 group-hover:scale-110 transition-transform" />
                  Initiate Exam Preparedness Diagnostic
                </button>
                <button
                  onClick={() => onNavigateToTab("planner")}
                  className="px-5 py-2.5 border border-zinc-850 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-inner"
                >
                  Formulate Study Architecture
                </button>
              </div>

            </div>
          </Tilt3D>
        </div>

        {/* Right Side: Quantum 3D Core Viewport */}
        <div className="lg:col-span-4 h-full">
          <div className="border border-zinc-900 bg-zinc-950/80 rounded-2xl p-6 h-full flex flex-col justify-between shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start pb-2 border-b border-zinc-900">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-amber-400 block">spatial renderer v2</span>
                <h3 className="text-sm font-sans font-semibold text-white">Quantum Vector Space</h3>
              </div>
              <div className="px-2 py-0.5 rounded bg-zinc-900/80 text-[8px] font-mono text-zinc-400 border border-zinc-850">
                DRAG ORBIT
              </div>
            </div>

            {/* Render Canvas */}
            <div className="py-4 flex justify-center items-center">
              <QuantumCore3D size={185} colorTheme="amber" />
            </div>

            <div className="space-y-1 bg-zinc-900/30 border border-zinc-900 p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-mono text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Helios Coordinates Active
              </p>
              <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                Double vector rings rotatable on coordinate axis. Hover elements to focus details.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Stateful Action Row - Dynamic Lecture Skipper & Smart Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Dynamic Forecaster & Simulator Widget */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 block">// PREVENTIVE_FORECAST</span>
              <h3 className="text-base font-semibold text-white">VTU Attendance Simulator</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-[8px] font-mono text-zinc-400 uppercase border border-zinc-850 tracking-wider">
              Eligibility math
            </span>
          </div>

          <p className="text-zinc-400 text-xs font-light">
            Slide block to simulate missing upcoming college lectures and inspect warning metrics. Total lectures monitored = {totalLecturesCount}.
          </p>

          {/* Interactive Simulation Panel */}
          <div className="py-2.5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400 font-light">Upcoming Lectures Skipped:</span>
                <span className="text-amber-400 font-bold">{sessionLecturesSkipped} Lectures</span>
              </div>
              <input 
                type="range"
                min="0"
                max="12"
                value={sessionLecturesSkipped}
                onChange={(e) => setSessionLecturesSkipped(Number(e.target.value))}
                className="w-full accent-amber-450 bg-zinc-900 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Calculations Output */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-zinc-900/35 border border-zinc-900 rounded-xl">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block">Simulated Attend.</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className={`text-2xl font-mono font-bold ${
                    simulatedAttendancePct >= 80 ? "text-emerald-400" : simulatedAttendancePct >= 75 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {simulatedAttendancePct}%
                  </span>
                  <span className="text-[10px] text-zinc-400">({currentAttendedSimulated}/{totalLecturesCount})</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/35 border border-zinc-900 rounded-xl">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block">College Clearance Status</span>
                <div className="mt-1">
                  {simulatedAttendancePct >= 80 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/15">
                      ✓ EXAM ELIGIBLE
                    </span>
                  ) : simulatedAttendancePct >= 75 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-amber-450 bg-amber-400/5 px-2.5 py-0.5 rounded border border-amber-400/15">
                      ⚠ WARNING DEFICIT
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-red-400 bg-red-400/5 px-2.5 py-0.5 rounded border border-red-400/15">
                      ⚡ BLOCKED // DETAINED
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <span>CALCULATION = DYNAMIC</span>
            <button 
              onClick={() => onNavigateToTab("attendance")}
              className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              Open Forecaster Engine <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Aegis AI Neural Advisor Feed (Dynamic advisor cards) */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-semibold text-white">Aegis Neural Advisor</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-450 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              REAL-TIME INSIGHT
            </span>
          </div>

          {/* Dynamic Insight Banner space */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-4.5 relative overflow-hidden flex-1 flex flex-col justify-center min-h-[110px]">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/2 bg-radial-gradient pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInsightIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                <p className="text-zinc-200 text-xs italic font-light leading-relaxed">
                  "{insightOptions[activeInsightIndex]}"
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                  <span>SOURCE_NODES = MATHS_COMPSC</span>
                  <span>CALIBRATION CONFIDENCE: 94%</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
            <button 
              onClick={triggerNextInsight}
              className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              Cycle Recommendation
            </button>
            <span className="text-[10px] font-mono text-zinc-500">
              INDEX: {activeInsightIndex + 1}/{insightOptions.length}
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Curriculum Mastery Matrix & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Subjects & Curriculum Mastery Matrix */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                Syllabus Mastery Nodes
              </h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Select a core syllabus component to analyze criteria requirements</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">COUNT = 4 CORES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {subjects.map((sub) => {
              const isActive = sub.id === activeSubjectId;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubjectId(sub.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive 
                      ? "bg-amber-400/[0.04] border-amber-400/30 text-white shadow-lg" 
                      : "bg-transparent border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[9px] text-zinc-500 block uppercase tracking-wider">{sub.code}</span>
                  <span className="font-sans font-medium text-xs block leading-tight mt-1 truncate">{sub.name}</span>
                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono">
                    <span className="text-zinc-500">Mastery</span>
                    <span className={isActive ? "text-amber-400 font-bold" : "text-zinc-400"}>{sub.masteryPct}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details about currently selected Subject Node with Practice state */}
          <div className="bg-zinc-900/25 border border-zinc-900 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="space-y-3.5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono bg-indigo-500/5 text-indigo-400 border border-indigo-500/15 px-2.5 py-0.5 rounded uppercase tracking-widest">
                  Active Focus Analysis
                </span>
                <h4 className="text-sm font-semibold text-white mt-1.5">{selectedSubject.name} ({selectedSubject.code})</h4>
              </div>

              {/* Syllabus metrics checklist */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Required Syllabus Criteria:</span>
                <div className="space-y-1.5">
                  {selectedSubject.requiredSyllabus.map((syl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-light text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 stroke-[2] shrink-0" />
                      <span>{syl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Practice Simulator (Adds hours and increases mastery) */}
            <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-4">
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block">Session Practice Logger</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Log Hours</label>
                  <select 
                    value={logHoursAmount}
                    onChange={(e) => setLogHoursAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="1">1.0 Hour</option>
                    <option value="1.5">1.5 Hours</option>
                    <option value="2">2.0 Hours</option>
                    <option value="3">3.0 Hours</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Day of Log</label>
                  <select
                    value={selectedVelocityDay}
                    onChange={(e) => setSelectedVelocityDay(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleLogStudyTime}
                className="w-full px-4 py-2 bg-zinc-900 hover:bg-amber-400 border border-zinc-850 hover:border-amber-400 text-zinc-200 hover:text-neutral-950 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                Register Focus Session
              </button>
            </div>

          </div>
        </div>

        {/* Real-Time Live Activity Streams */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                Activity Timeline
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">LIVE FEED</span>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {localLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-zinc-900/35 border border-zinc-900/60 rounded-xl space-y-1 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-zinc-500">{log.time}</span>
                    <span className={`text-[8px] font-mono px-1 rounded uppercase tracking-wider ${
                      log.type === "success" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/10" 
                        : log.type === "warning"
                        ? "bg-red-500/10 text-red-400 border border-red-500/10"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-zinc-200 text-xs font-light leading-snug">{log.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <span>SECURE SYSTEM FLUSH</span>
            <span className="text-zinc-400 text-[9px]">UTC STATUS = OK</span>
          </div>
        </div>

      </div>

      {/* Interactive Velocity Chart & Academic Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Dynamic Focus hours bar visualization */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Dynamic Focus Analytics
              </h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Real-time study duration logging (Max: 12 hrs/day threshold limits)</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Unit = Decimal Hours</span>
          </div>

          {/* Interactive Bars Projection */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 relative border-b border-zinc-900/60 pb-1">
            {weeklyVelocity.map((val) => {
              const heightPct = (val.hours / maxHours) * 100;
              const isSelected = val.day === selectedVelocityDay;

              return (
                <div 
                  key={val.day} 
                  onClick={() => setSelectedVelocityDay(val.day)}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                >
                  
                  {/* Floating badge details */}
                  <div className="absolute bottom-full mb-2 bg-neutral-950 border border-zinc-800 text-[9px] font-mono text-amber-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-center z-20 shadow-xl whitespace-nowrap">
                    {val.label}<br />
                    <span className="text-white font-bold">{val.hours} Hours Focused</span>
                  </div>

                  {/* Single column bar container */}
                  <div className="w-full bg-zinc-900/35 group-hover:bg-zinc-900/60 rounded-t h-full flex items-end relative overflow-hidden">
                    <div 
                      className={`w-full rounded-t transition-all duration-305 ${
                        isSelected 
                          ? "bg-gradient-to-t from-indigo-600 via-amber-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                          : "bg-gradient-to-t from-zinc-800 to-amber-550/85 group-hover:from-zinc-700 group-hover:to-amber-400"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Horizontal visual label */}
                  <span className={`text-[10px] font-mono mt-2 transition-colors ${
                    isSelected ? "text-amber-400 font-bold" : "text-zinc-400"
                  }`}>{val.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <span>TIP: Click any bar column above to select active simulation target day.</span>
            <span>VELOCITY_STRETCH = {Math.round(weeklyVelocity.reduce((sum, current) => sum + current.hours, 0))} HRS / WEEK</span>
          </div>
        </div>

        {/* Milestones Panel */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                Strategic Objectives
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">VTU TARGETS</span>
            </div>

            <div className="space-y-3.5">
              <div 
                onClick={() => onNavigateToTab("quiz")}
                className="p-3 bg-zinc-900/35 border border-zinc-900 hover:border-amber-400/20 rounded-xl flex justify-between items-center transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors block">Calculus Diagnostic Tests</span>
                  <span className="text-[9px] text-zinc-500 font-mono">Green's theorems & series bounds</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/5 text-amber-400 border border-amber-400/20 font-bold">Dec 11</span>
              </div>

              <div 
                onClick={() => onNavigateToTab("quiz")}
                className="p-3 bg-zinc-900/35 border border-zinc-900 hover:border-indigo-400/20 rounded-xl flex justify-between items-center transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors block">Quantum Circuit Equations</span>
                  <span className="text-[9px] text-zinc-500 font-mono">Bloch sphere & superposition gates</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-400/5 text-indigo-400 border border-indigo-400/20 font-bold">Dec 15</span>
              </div>

              <div 
                onClick={() => onNavigateToTab("planner")}
                className="p-3 bg-zinc-900/35 border border-zinc-900 hover:border-purple-400/20 rounded-xl flex justify-between items-center transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors block">NP-Complete Computations</span>
                  <span className="text-[9px] text-zinc-500 font-mono">Turing tape halts and reductions</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850">Dec 20</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 text-right">
            SECURE ADVISOR COMPLIATED ✓
          </div>
        </div>

      </div>

    </div>
  );
};
