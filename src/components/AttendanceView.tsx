import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Plus, Trash2, CalendarDays, ShieldAlert, Sparkles, Smile, Frown } from "lucide-react";

interface AttendanceViewProps {
  currentAttendance: number;
  onUpdateAttendance: (newPct: number) => void;
}

interface LedgerEntry {
  id: string;
  subject: string;
  date: string;
  status: "Attended" | "Absent" | "Mass Bunk" | "Duty Leave";
}

const SUBJECT_LIST = [
  "Advanced Calculus (MA-301)",
  "Fluid Dynamics (ME-302)",
  "Quantum Computing (CS-303)",
  "Neural Networks (CS-304)",
  "Formal Automata (CS-305)",
];

// Initial pre-populated diagnostic entries to match 84% starting point
const DEFAULT_LEDGER: LedgerEntry[] = [
  { id: "log-1", subject: "Advanced Calculus (MA-301)", date: "2026-06-01", status: "Attended" },
  { id: "log-2", subject: "Advanced Calculus (MA-301)", date: "2026-06-02", status: "Attended" },
  { id: "log-3", subject: "Advanced Calculus (MA-301)", date: "2026-06-03", status: "Absent" },
  { id: "log-4", subject: "Advanced Calculus (MA-301)", date: "2026-06-04", status: "Attended" },
  { id: "log-5", subject: "Fluid Dynamics (ME-302)", date: "2026-06-01", status: "Attended" },
  { id: "log-6", subject: "Fluid Dynamics (ME-302)", date: "2026-06-02", status: "Attended" },
  { id: "log-7", subject: "Fluid Dynamics (ME-302)", date: "2026-06-03", status: "Attended" },
  { id: "log-8", subject: "Quantum Computing (CS-303)", date: "2026-05-28", status: "Attended" },
  { id: "log-9", subject: "Quantum Computing (CS-303)", date: "2026-05-29", status: "Mass Bunk" },
  { id: "log-10", subject: "Quantum Computing (CS-303)", date: "2026-06-01", status: "Attended" },
  { id: "log-11", subject: "Quantum Computing (CS-303)", date: "2026-06-02", status: "Duty Leave" },
  { id: "log-12", subject: "Neural Networks (CS-304)", date: "2026-06-01", status: "Attended" },
  { id: "log-13", subject: "Neural Networks (CS-304)", date: "2026-06-02", status: "Attended" },
  { id: "log-14", subject: "Neural Networks (CS-304)", date: "2026-06-03", status: "Attended" },
  { id: "log-15", subject: "Formal Automata (CS-305)", date: "2026-06-01", status: "Attended" },
  { id: "log-16", subject: "Formal Automata (CS-305)", date: "2026-06-02", status: "Absent" },
  { id: "log-17", subject: "Formal Automata (CS-305)", date: "2026-06-03", status: "Attended" },
];

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentAttendance,
  onUpdateAttendance,
}) => {
  // Try loading from localStorage first to maintain high fidelity
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    try {
      const saved = window.localStorage.getItem("aegis_attendance_ledger");
      return saved ? JSON.parse(saved) : DEFAULT_LEDGER;
    } catch {
      return DEFAULT_LEDGER;
    }
  });

  // Entry Form States
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LIST[0]);
  const [selectedStatus, setSelectedStatus] = useState<LedgerEntry["status"]>("Attended");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Simulator skip overrides state
  const [skipSimulations, setSkipSimulations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SUBJECT_LIST.forEach((sub) => {
      initial[sub] = 0;
    });
    return initial;
  });

  // Track state persistence
  useEffect(() => {
    try {
      window.localStorage.setItem("aegis_attendance_ledger", JSON.stringify(ledger));
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }, [ledger]);

  // Derive counts per subject
  const getSubjectMetrics = (subject: string) => {
    const entries = ledger.filter((item) => item.subject === subject);
    
    let totalConducted = entries.length;
    // Waived logic: Count as conducted, but Duty Leaves count positively
    let totalAttended = entries.filter((item) => item.status === "Attended").length;
    let dutyLeaves = entries.filter((item) => item.status === "Duty Leave").length;

    // In many schools, Duty Leave is either ignored or counted as fully attended.
    // Let's count them as attended to avoid penalizing hard-working students of Aegis.
    totalAttended += dutyLeaves;

    // Future predicted skips for simulation
    const simulatedSkips = skipSimulations[subject] || 0;
    const simulatedConducted = totalConducted + simulatedSkips;
    // Future skips don't change attended count, but increase total conducted sessions to simulate missing upcoming ones
    const simulatedAttended = totalAttended;

    const realPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100;
    const simulatedPercentage = simulatedConducted > 0 ? Math.round((simulatedAttended / simulatedConducted) * 100) : 100;

    return {
      realPercentage,
      simulatedPercentage,
      totalConducted,
      totalAttended,
      dutyLeaves,
      absences: entries.filter((item) => item.status === "Absent" || item.status === "Mass Bunk").length,
      simulatedSkips,
    };
  };

  // Overall statistics calculation
  const overallMetrics = () => {
    let grandConducted = 0;
    let grandAttended = 0;

    let grandConductedSim = 0;
    let grandAttendedSim = 0;

    SUBJECT_LIST.forEach((sub) => {
      const metrics = getSubjectMetrics(sub);
      grandConducted += metrics.totalConducted;
      grandAttended += metrics.totalAttended;

      grandConductedSim += metrics.totalConducted + metrics.simulatedSkips;
      grandAttendedSim += metrics.totalAttended;
    });

    const realAverage = grandConducted > 0 ? Math.round((grandAttended / grandConducted) * 100) : 100;
    const simulatedAverage = grandConductedSim > 0 ? Math.round((grandAttendedSim / grandConductedSim) * 100) : 100;

    return {
      realAverage,
      simulatedAverage,
      grandConducted,
      grandAttended,
    };
  };

  const metrics = overallMetrics();
  const overallSimulated = metrics.simulatedAverage;

  // Propagate core calculated value back to central App hub container state
  useEffect(() => {
    onUpdateAttendance(overallSimulated);
  }, [overallSimulated, onUpdateAttendance]);

  // Handler to add ledger entry
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LedgerEntry = {
      id: `log-${Date.now()}`,
      subject: selectedSubject,
      date: selectedDate,
      status: selectedStatus,
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  // Handler to remove ledger entry
  const handleDeleteEntry = (id: string) => {
    setLedger((prev) => prev.filter((item) => item.id !== id));
  };

  // Slider simulator updates
  const handleUpdateSimSkips = (subject: string, value: number) => {
    setSkipSimulations((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  // Reset simulator values
  const handleResetSimulations = () => {
    const neutral: Record<string, number> = {};
    SUBJECT_LIST.forEach((sub) => {
      neutral[sub] = 0;
    });
    setSkipSimulations(neutral);
  };

  // SVG Radial constants
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const forecastOffset = circumference - (overallSimulated / 100) * circumference;
  const isSafe = overallSimulated >= 75; // VTU Mandate code

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500">Live Attendance Matriculation</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-0.5">VTU Ledger & Forecaster</h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Keep track of live attendance records directly synced with the strict VTU 75% examinations threshold.
          </p>
        </div>
        <button
          onClick={handleResetSimulations}
          className="px-3.5 py-1.5 self-start md:self-auto bg-neutral-900 border border-neutral-800 text-[11px] font-mono hover:text-white hover:border-neutral-700 transition-all rounded-lg text-neutral-400"
        >
          RESET_SIMULATIONS
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* SIDE ACTIONS: Log Class session panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Quick Logging form */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5 border-b border-neutral-850 pb-3">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              LOG_CLASS_SESSION
            </h3>

            <form onSubmit={handleAddEntry} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-sans"
                >
                  {SUBJECT_LIST.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Lecture Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as LedgerEntry["status"])}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-sans"
                  >
                    <option value="Attended">Attended</option>
                    <option value="Absent">Absent</option>
                    <option value="Mass Bunk">Mass Bunk</option>
                    <option value="Duty Leave">Duty Leave</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Date Logged</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 mt-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Commit Record
              </button>
            </form>
          </div>

          {/* Quick Stats overview panel */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
            <div className="border-b border-neutral-85pb pb-3">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                VERDICT_METEOROLOGY
              </h3>
            </div>

            {/* Circular representation */}
            <div className="my-5 flex justify-center items-center relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-neutral-850 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="fill-none transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={forecastOffset}
                  strokeLinecap="round"
                  stroke={isSafe ? "#f59e0b" : "#ef4444"}
                />
              </svg>

              <div className="absolute text-center">
                <span className="text-3xl font-sans font-bold text-white block -mb-0.5">
                  {overallSimulated}%
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block">
                  Simulated
                </span>
                <span className={`inline-block px-1.5 py-0.5 mt-1 text-[8px] font-mono rounded ${
                  isSafe ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {isSafe ? "VTU CLEARED" : "SHORTAGE LOCK"}
                </span>
              </div>
            </div>

            {/* Verification Warnings */}
            <div className={`p-3.5 rounded-lg border text-xs font-light leading-relaxed ${
              isSafe 
                ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-300"
                : "bg-red-950/10 border-red-900/40 text-red-300"
            }`}>
              {isSafe ? (
                <p>
                  Sovereign matrix healthy! Average coefficient remains above the mandatory 
                  <span className="text-emerald-400 font-semibold font-mono"> 75% </span> threshold. 
                  Examination halls authorized.
                </p>
              ) : (
                <p>
                  CRITICAL DEFICIT! Simulated records project average at 
                  <span className="font-semibold font-mono text-white"> {overallSimulated}% </span>, 
                  under-cutting the mandatory <span className="text-red-400 font-semibold font-mono">75%</span>. 
                  Academic block warnings issued.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TIMETABLE & SUBJECT REGISTRY */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center justify-between border-b border-neutral-850 pb-3">
              <span>ACTIVE SUBJECT MATRIX (VTU MINIMUM: 75%)</span>
              <span className="text-[10px] uppercase text-neutral-500">Live & Simulated Forecast</span>
            </h3>

            <div className="space-y-4 pt-1">
              {SUBJECT_LIST.map((subject) => {
                const subM = getSubjectMetrics(subject);
                const subPercent = subM.realPercentage;
                const simPercent = subM.simulatedPercentage;
                const activePercent = simPercent;
                const subIsSafe = activePercent >= 75;

                return (
                  <div key={subject} className="bg-neutral-950/60 p-4 border border-neutral-850 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-white font-mono">{subject}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-400">
                          <span>Attended: <b className="text-neutral-200">{subM.totalAttended}</b></span>
                          <span>•</span>
                          <span>Conducted: <b className="text-neutral-200">{subM.totalConducted}</b></span>
                          {subM.dutyLeaves > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-teal-400">Duty Leave: <b>{subM.dutyLeaves}</b></span>
                            </>
                          )}
                          {subM.absences > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-red-400" title="Absences + Mass Bunks">Skips: <b>{subM.absences}</b></span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Subject Metrics Display */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-neutral-400 font-mono block">Real / Simulated</span>
                          <span className={`text-sm font-bold font-mono ${subIsSafe ? "text-amber-400" : "text-red-400"}`}>
                            {subPercent}% / {simPercent}%
                          </span>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${subIsSafe ? "bg-amber-400" : "bg-red-400 animate-pulse"}`} />
                      </div>
                    </div>

                    {/* Progress Bar representation */}
                    <div className="space-y-1.5">
                      <div className="relative w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        {/* Target line indicator at 75% */}
                        <div className="absolute left-[75%] top-0 w-0.5 h-full bg-neutral-700 z-10" />
                        
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{
                            width: `${Math.min(100, activePercent)}%`,
                            backgroundColor: subIsSafe ? "#f59e0b" : "#ef4444"
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                        <span>0%</span>
                        <span className="text-neutral-400">75% VTU clearance barrier</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Simulation Slider inside individual subjects */}
                    <div className="bg-neutral-900/20 px-3 py-2 border border-neutral-850/40 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="text-neutral-400">Simulate upcoming skips:</span>
                        <span className="text-red-400 font-bold">-{subM.simulatedSkips} sessions</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={subM.simulatedSkips}
                        onChange={(e) => handleUpdateSimSkips(subject, parseInt(e.target.value))}
                        className="w-full sm:w-48 accent-red-500 bg-neutral-950 h-1 rounded-md cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LEDGER ARCHIVES - Historic logs display table */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
        <div className="border-b border-neutral-850 pb-3 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
            <CalendarDays className="w-4.5 h-4.5 text-amber-500" />
            HISTORIC_LEDGER_ARCHIVES
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">{ledger.length} total entries registered</span>
        </div>

        {ledger.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-neutral-500">
            No active attendance records registered. Try logging some class sessions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 text-neutral-500">
                  <th className="py-2.5 px-3 font-normal uppercase">Date</th>
                  <th className="py-2.5 px-3 font-normal uppercase">Syllabus subject</th>
                  <th className="py-2.5 px-3 font-normal uppercase">Status classification</th>
                  <th className="py-2.5 px-3 text-right font-normal uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {ledger.map((entry) => {
                  let badgeColor = "bg-neutral-900 border-neutral-800 text-neutral-300";
                  if (entry.status === "Attended") badgeColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
                  if (entry.status === "Absent") badgeColor = "bg-red-500/10 border-red-500/20 text-red-400";
                  if (entry.status === "Mass Bunk") badgeColor = "bg-orange-500/10 border-orange-500/20 text-orange-400 uppercase tracking-tight";
                  if (entry.status === "Duty Leave") badgeColor = "bg-teal-500/10 border-teal-500/20 text-teal-400";

                  return (
                    <tr key={entry.id} className="hover:bg-neutral-900/20 transition-colors">
                      <td className="py-2 px-3 text-neutral-400">{entry.date}</td>
                      <td className="py-2 px-3 font-sans font-medium text-white">{entry.subject}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-block border px-2 py-0.5 rounded text-[9px] font-mono ${badgeColor}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Erase log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
