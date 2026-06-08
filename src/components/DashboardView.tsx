import React from "react";
import { Sparkles, Calendar, TrendingUp, Award, Clock, ArrowUpRight, GraduationCap, ArrowRight } from "lucide-react";
import { TabType } from "../types";
import { QuantumCore3D } from "./QuantumCore3D";
import { Tilt3D } from "./Tilt3D";

interface DashboardViewProps {
  onNavigateToTab: (tab: TabType) => void;
  attendancePct: number;
  completedTasksCount: number;
  totalTasksCount: number;
  readinessScore: number;
  username: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  attendancePct,
  completedTasksCount,
  totalTasksCount,
  readinessScore,
  username
}) => {
  const remainingTasks = totalTasksCount - completedTasksCount;

  // Learning hours velocity mock data for the visual chart
  const weeklyVelocity = [
    { day: "Mon", hours: 6, label: "Calculus" },
    { day: "Tue", hours: 4, label: "Fluid Dyn" },
    { day: "Wed", hours: 8, label: "Quantum" },
    { day: "Thu", hours: 5, label: "Logic" },
    { day: "Fri", hours: 9, label: "Analytics" },
    { day: "Sat", hours: 3, label: "Library" },
    { day: "Sun", hours: 2, label: "Review" }
  ];

  const maxHours = 10;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">Command Dashboard</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">
            Welcome back, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{username || "Scholar"}</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Your academic trajectory is ascending. Core nodes synchronized successfully.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/10 bg-amber-500/5 text-amber-400/90 font-mono text-xs shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>SSO COORDINATES STABLE</span>
        </div>
      </div>

      {/* Royal 3D Premium Hero Banner */}
      <Tilt3D maxTilt={3} scale={1.005} className="w-full">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-linear-to-r from-neutral-900 to-neutral-950 p-8 shadow-2xl w-full">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(180,140,80,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="max-w-xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-neutral-800 bg-neutral-950/80 text-neutral-400 font-mono text-[10px] uppercase">
              immersive visual matrix
            </div>
            <h2 className="text-2xl font-light text-white leading-tight">
              Explore your study dashboard built on <span className="text-amber-400 font-normal">advanced student metrics</span> to out-pace exam timelines.
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-md font-light">
              Access secure diagnostic parameters, tweak skipped-class simulators, index core texts, and evaluate performance logs with Aegis Neural Core.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigateToTab("quiz")}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-neutral-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg shadow-amber-500/5"
              >
                Take Calculus Quiz
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab("planner")}
                className="px-4 py-2 border border-neutral-850 hover:border-neutral-700 bg-neutral-900/60 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Formulate Blueprint
              </button>
            </div>
          </div>

          {/* Quantum 3D Interactive Engine (Actual Drag-and-click 3D coordinates system) */}
          <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 z-20">
            <QuantumCore3D size={190} colorTheme="amber" />
          </div>
        </div>
      </Tilt3D>


      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Attendance Forecaster Quickview */}
        <Tilt3D maxTilt={8} scale={1.02} className="h-full">
          <div 
            onClick={() => onNavigateToTab("attendance")}
            className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-xl hover:border-amber-400/20 hover:bg-neutral-900/60 transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 transition-colors group-hover:text-amber-400 flex items-center gap-0.5">
                FORECAST <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Attendance Index</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-sans font-bold text-white tracking-tight">
                  {attendancePct}%
                </span>
                <span className="text-xs text-emerald-400 font-mono">
                  {attendancePct >= 80 ? "▲ SECURE" : "▼ DEFICIT"}
                </span>
              </div>
              <p className="text-neutral-400 text-xs mt-1.5 font-light">
                Required: 80% parameter threshold to unlock exam clearance.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex justify-between">
              <span>DIAG_CRIT = ACTIVE</span>
              <span>SIM_SLIDES</span>
            </div>
          </div>
        </Tilt3D>

        {/* Card 2: Weekly Target progress */}
        <Tilt3D maxTilt={8} scale={1.02} className="h-full">
          <div 
            onClick={() => onNavigateToTab("planner")}
            className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-xl hover:border-amber-400/20 hover:bg-neutral-900/60 transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 transition-colors group-hover:text-amber-400 flex items-center gap-0.5">
                BLUEPRINT <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Weekly Progress</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-sans font-bold text-white tracking-tight">
                  {completedTasksCount}/{totalTasksCount}
                </span>
                <span className="text-xs text-amber-400 font-mono">
                  {remainingTasks === 0 ? "★ CLEARED" : `${remainingTasks} REMAINING`}
                </span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasksCount / (totalTasksCount || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex justify-between">
              <span>WEEK_COMPLETION = {Math.round((completedTasksCount / (totalTasksCount || 1)) * 100)}%</span>
              <span>MODAL_SET</span>
            </div>
          </div>
        </Tilt3D>

        {/* Card 3: Placement Score Readiness factor */}
        <Tilt3D maxTilt={8} scale={1.02} className="h-full">
          <div 
            onClick={() => onNavigateToTab("quiz")}
            className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-xl hover:border-amber-400/20 hover:bg-neutral-900/60 transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 transition-colors group-hover:text-amber-400 flex items-center gap-0.5">
                DIAGNOSTIC <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Placement Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-sans font-bold text-white tracking-tight">
                  {readinessScore}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  / 100 FACTOR
                </span>
              </div>
              <p className="text-neutral-400 text-xs mt-1.5 font-light">
                Diagnostic level: <span className="text-white font-medium">{readinessScore >= 85 ? "Sovereign Genius" : "Rising Expert"}</span>.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex justify-between">
              <span>READY_COEF = {readinessScore >= 80 ? "EXCEL" : "BOOST"}</span>
              <span>Placement v1.0</span>
            </div>
          </div>
        </Tilt3D>
      </div>

      {/* Learning velocity visual row and milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Learning velocity visual bar representation (Document 4 layout) */}
        <div className="lg:col-span-8 bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Learning Velocity
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">Focus hours registered across active system subjects</p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">UNIT = METRIC_HOURS</span>
          </div>

          {/* Graph bars representation */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6">
            {weeklyVelocity.map((val) => {
              const heightPct = (val.hours / maxHours) * 100;
              return (
                <div key={val.day} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  
                  {/* Floating tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-neutral-950 border border-neutral-800 text-[9px] font-mono text-amber-200 px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-center z-10 shadow-lg">
                    {val.label}<br />
                    <span className="text-white font-bold">{val.hours} hrs</span>
                  </div>

                  {/* Visual single bar column */}
                  <div className="w-full bg-neutral-900/60 rounded-t h-full flex items-end">
                    <div 
                      className="w-full rounded-t bg-linear-to-t from-amber-500/80 to-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:from-amber-450 group-hover:to-amber-300 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Label x-axis */}
                  <span className="text-[10px] font-mono text-neutral-400 mt-2">{val.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Upcoming Scholar Milestones */}
        <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              Strategic Milestones
            </h3>
            <span className="text-[10px] font-mono text-amber-400/80 cursor-pointer hover:underline" onClick={() => onNavigateToTab("planner")}>Edit</span>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-neutral-900/60 border border-neutral-850 hover:border-amber-400/20 rounded-lg flex justify-between items-center transition-all">
              <div>
                <span className="text-xs font-semibold text-white block">Calculus Diagnostic</span>
                <span className="text-[10px] text-neutral-400 font-mono">Integration bounds & Series</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">Dec 11</span>
            </div>

            <div className="p-3 bg-neutral-900/60 border border-neutral-850 hover:border-amber-400/20 rounded-lg flex justify-between items-center transition-all">
              <div>
                <span className="text-xs font-semibold text-white block">Quantum Circuits</span>
                <span className="text-[10px] text-neutral-400 font-mono">Qubit matrix simulations</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">Dec 15</span>
            </div>

            <div className="p-3 bg-neutral-900/60 border border-neutral-850 hover:border-amber-400/20 rounded-lg flex justify-between items-center transition-all">
              <div>
                <span className="text-xs font-semibold text-white block">Automata Bound essay</span>
                <span className="text-[10px] text-neutral-400 font-mono">Church-Turing Limits</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-500/10 text-neutral-300 border border-neutral-500/10 whitespace-nowrap">Dec 20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
