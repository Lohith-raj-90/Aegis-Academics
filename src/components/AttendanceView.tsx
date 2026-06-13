import React, { useState, useEffect } from "react";
import {
  AlertCircle, CheckCircle, Plus, Trash2, CalendarDays,
  ShieldAlert, TrendingDown, TrendingUp, ChevronDown, ChevronUp, Zap
} from "lucide-react";

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

const WEEKLY_TIMETABLE: Record<string, string[]> = {
  Monday: ["Advanced Calculus (MA-301)", "Fluid Dynamics (ME-302)", "Quantum Computing (CS-303)"],
  Tuesday: ["Advanced Calculus (MA-301)", "Neural Networks (CS-304)", "Formal Automata (CS-305)"],
  Wednesday: ["Fluid Dynamics (ME-302)", "Quantum Computing (CS-303)", "Neural Networks (CS-304)"],
  Thursday: ["Advanced Calculus (MA-301)", "Formal Automata (CS-305)", "Fluid Dynamics (ME-302)"],
  Friday: ["Quantum Computing (CS-303)", "Neural Networks (CS-304)", "Formal Automata (CS-305)"],
};

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

interface AttendanceViewProps {
  currentAttendance: number;
  onUpdateAttendance: (newPct: number) => void;
}

function calculateBunkRecovery(attended: number, total: number): { canSkip: number; mustAttend: number } {
  if (total === 0) return { canSkip: 0, mustAttend: 0 };
  const currentPct = (attended / total) * 100;

  if (currentPct >= 75) {
    let canSkip = 0;
    let testAttended = attended;
    let testTotal = total;
    while (true) {
      testTotal += 1;
      const newPct = (testAttended / testTotal) * 100;
      if (newPct < 75) break;
      canSkip++;
      if (canSkip > 100) break;
    }
    return { canSkip, mustAttend: 0 };
  } else {
    let mustAttend = 0;
    let testAttended = attended;
    let testTotal = total;
    while ((testAttended / testTotal) * 100 < 75) {
      testAttended += 1;
      testTotal += 1;
      mustAttend++;
      if (mustAttend > 100) break;
    }
    return { canSkip: 0, mustAttend };
  }
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const width = 80;
  const height = 24;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) / (data.length - 1) * width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
}

function AttendanceTrendSparkline({ entries, subject }: { entries: LedgerEntry[]; subject: string }) {
  const subjectEntries = entries
    .filter(e => e.subject === subject)
    .sort((a, b) => a.date.localeCompare(b.date));

  const trendData: number[] = [];
  let runningAttended = 0;
  let runningTotal = 0;

  for (const entry of subjectEntries) {
    runningTotal += 1;
    if (entry.status === "Attended" || entry.status === "Duty Leave") {
      runningAttended += 1;
    }
    trendData.push(Math.round((runningAttended / runningTotal) * 100));
  }

  const current = trendData[trendData.length - 1] ?? 100;
  const prev = trendData[trendData.length - 2] ?? current;
  const isUp = current >= prev;
  const color = current >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      <MiniSparkline data={trendData} color={color} />
      <span className={`flex items-center gap-0.5 text-[10px] font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isUp ? "Up" : "Down"}
      </span>
    </div>
  );
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentAttendance,
  onUpdateAttendance,
}) => {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [skipSimulations, setSkipSimulations] = useState<Record<string, number>>({});
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LIST[0]);
  const [selectedStatus, setSelectedStatus] = useState<LedgerEntry["status"]>("Attended");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [batchDate, setBatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [batchStatuses, setBatchStatuses] = useState<Record<string, LedgerEntry["status"]>>({});
  const [expandedBunk, setExpandedBunk] = useState<string | null>(null);
  const [showBatchLog, setShowBatchLog] = useState(false);

  useEffect(() => {
    const initial: Record<string, number> = {};
    const batchInit: Record<string, LedgerEntry["status"]> = {};
    SUBJECT_LIST.forEach((sub) => {
      initial[sub] = 0;
      batchInit[sub] = "Attended";
    });
    setSkipSimulations(initial);
    setBatchStatuses(batchInit);
    setLedger(DEFAULT_LEDGER);
  }, []);

  const getSubjectMetrics = (subject: string) => {
    const entries = ledger.filter((item) => item.subject === subject);
    let totalConducted = entries.length;
    let totalAttended = entries.filter((item) => item.status === "Attended").length;
    let dutyLeaves = entries.filter((item) => item.status === "Duty Leave").length;
    totalAttended += dutyLeaves;
    const simulatedSkips = skipSimulations[subject] || 0;
    const simulatedConducted = totalConducted + simulatedSkips;
    const simulatedAttended = totalAttended;
    const realPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100;
    const simulatedPercentage = simulatedConducted > 0 ? Math.round((simulatedAttended / simulatedConducted) * 100) : 100;
    return {
      realPercentage, simulatedPercentage, totalConducted, totalAttended,
      dutyLeaves, absences: entries.filter((item) => item.status === "Absent" || item.status === "Mass Bunk").length,
      simulatedSkips,
    };
  };

  const overallMetrics = () => {
    let grandConducted = 0, grandAttended = 0, grandConductedSim = 0, grandAttendedSim = 0;
    SUBJECT_LIST.forEach((sub) => {
      const m = getSubjectMetrics(sub);
      grandConducted += m.totalConducted;
      grandAttended += m.totalAttended;
      grandConductedSim += m.totalConducted + m.simulatedSkips;
      grandAttendedSim += m.totalAttended;
    });
    return {
      realAverage: grandConducted > 0 ? Math.round((grandAttended / grandConducted) * 100) : 100,
      simulatedAverage: grandConductedSim > 0 ? Math.round((grandAttendedSim / grandConductedSim) * 100) : 100,
      grandConducted, grandAttended,
    };
  };

  const metrics = overallMetrics();
  const overallSimulated = metrics.simulatedAverage;

  useEffect(() => {
    onUpdateAttendance(overallSimulated);
  }, [overallSimulated, onUpdateAttendance]);

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

  const handleDeleteEntry = (id: string) => {
    setLedger((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateSimSkips = (subject: string, value: number) => {
    setSkipSimulations((prev) => ({ ...prev, [subject]: value }));
  };

  const handleResetSimulations = () => {
    const neutral: Record<string, number> = {};
    SUBJECT_LIST.forEach((sub) => { neutral[sub] = 0; });
    setSkipSimulations(neutral);
  };

  const handleBatchDateChange = (date: string) => {
    setBatchDate(date);
    const dayName = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" });
    const subjects = WEEKLY_TIMETABLE[dayName] || [];
    const updated: Record<string, LedgerEntry["status"]> = {};
    SUBJECT_LIST.forEach((sub) => {
      updated[sub] = subjects.includes(sub) ? "Attended" : "Absent";
    });
    setBatchStatuses(updated);
  };

  const handleBatchStatusChange = (subject: string, status: LedgerEntry["status"]) => {
    setBatchStatuses((prev) => ({ ...prev, [subject]: status }));
  };

  const handleCommitBatch = () => {
    const newEntries: LedgerEntry[] = SUBJECT_LIST.map((sub, i) => ({
      id: `batch-${Date.now()}-${i}`,
      subject: sub,
      date: batchDate,
      status: batchStatuses[sub] || "Attended",
    }));
    setLedger((prev) => [...newEntries, ...prev]);
    setShowBatchLog(false);
  };

  const batchDayName = new Date(batchDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" });
  const batchSubjects = WEEKLY_TIMETABLE[batchDayName] || [];

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const forecastOffset = circumference - (overallSimulated / 100) * circumference;
  const isSafe = overallSimulated >= 75;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500">Live Attendance Tracker</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-0.5">Attendance Overview</h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Track attendance and forecast eligibility under the VTU 75% examination threshold.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBatchLog(!showBatchLog)}
            className={`px-3.5 py-1.5 self-start md:self-auto border text-[11px] font-mono transition-all rounded-lg flex items-center gap-1.5 cursor-pointer ${
              showBatchLog
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Log Full Day
          </button>
          <button
            onClick={handleResetSimulations}
            className="px-3.5 py-1.5 self-start md:self-auto bg-neutral-900 border border-neutral-800 text-[11px] font-mono hover:text-white hover:border-neutral-700 transition-all rounded-lg text-neutral-400"
          >
            Reset Simulations
          </button>
        </div>
      </div>

      {showBatchLog && (
        <div className="bg-neutral-900/40 border border-emerald-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Log Entire Day
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Date</label>
              <input
                type="date"
                value={batchDate}
                onChange={(e) => handleBatchDateChange(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400 font-sans"
              />
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 font-mono">
            {batchDayName} schedule: {batchSubjects.length > 0 ? batchSubjects.join(", ") : "No scheduled subjects"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SUBJECT_LIST.map((subject) => {
              const isScheduled = batchSubjects.includes(subject);
              return (
                <div
                  key={subject}
                  className={`p-3 rounded-xl border transition-all ${
                    isScheduled
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-neutral-950/40 border-neutral-850"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white font-mono">{subject.split(" (")[0]}</span>
                    {isScheduled && (
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        SCHEDULED
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(["Attended", "Absent", "Mass Bunk", "Duty Leave"] as const).map((status) => {
                      const isActive = batchStatuses[subject] === status;
                      let btnColor = "bg-neutral-900 border-neutral-800 text-neutral-400";
                      if (isActive) {
                        if (status === "Attended") btnColor = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                        if (status === "Absent") btnColor = "bg-red-500/20 border-red-500/40 text-red-300";
                        if (status === "Mass Bunk") btnColor = "bg-orange-500/20 border-orange-500/40 text-orange-300";
                        if (status === "Duty Leave") btnColor = "bg-teal-500/20 border-teal-500/40 text-teal-300";
                      }
                      return (
                        <button
                          key={status}
                          onClick={() => handleBatchStatusChange(subject, status)}
                          className={`py-1.5 px-1 text-[9px] font-mono border rounded transition-all cursor-pointer ${btnColor}`}
                          aria-label={`Mark ${subject.split(" (")[0]} as ${status}`}
                        >
                          {status === "Mass Bunk" ? "Mass" : status.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCommitBatch}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <CheckCircle className="w-4 h-4" />
              Commit All Records
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5 border-b border-neutral-850 pb-3">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Log Single Session
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
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Status</label>
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
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Date</label>
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

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
            <div className="border-b border-neutral-850 pb-3">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Attendance Verdict
              </h3>
            </div>
            <div className="my-5 flex justify-center items-center relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r={radius} className="stroke-neutral-850 fill-none" strokeWidth="8" />
                <circle
                  cx="72" cy="72" r={radius}
                  className="fill-none transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={forecastOffset}
                  strokeLinecap="round"
                  stroke={isSafe ? "#f59e0b" : "#ef4444"}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-sans font-bold text-white block -mb-0.5">{overallSimulated}%</span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block">Simulated</span>
                <span className={`inline-block px-1.5 py-0.5 mt-1 text-[8px] font-mono rounded ${
                  isSafe ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {isSafe ? "VTU CLEARED" : "SHORTAGE LOCK"}
                </span>
              </div>
            </div>
            <div className={`p-3.5 rounded-lg border text-xs font-light leading-relaxed ${
              isSafe
                ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-300"
                : "bg-red-950/10 border-red-900/40 text-red-300"
            }`}>
              {isSafe ? (
                <p>
                  Your average is healthy at <span className="text-emerald-400 font-semibold font-mono">{overallSimulated}%</span>,
                  above the mandatory <span className="text-emerald-400 font-semibold font-mono">75%</span> threshold.
                  Examination halls authorized.
                </p>
              ) : (
                <p>
                  Warning: Average at <span className="font-semibold font-mono text-white">{overallSimulated}%</span>,
                  below the mandatory <span className="text-red-400 font-semibold font-mono">75%</span>.
                  Attend upcoming sessions to recover eligibility.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center justify-between border-b border-neutral-850 pb-3">
              <span>Subject Overview (VTU Minimum: 75%)</span>
              <span className="text-[10px] uppercase text-neutral-500">Live & Simulated Forecast</span>
            </h3>
            <div className="space-y-4 pt-1">
              {SUBJECT_LIST.map((subject) => {
                const subM = getSubjectMetrics(subject);
                const subPercent = subM.realPercentage;
                const simPercent = subM.simulatedPercentage;
                const activePercent = simPercent;
                const subIsSafe = activePercent >= 75;
                const bunkCalc = calculateBunkRecovery(subM.totalAttended, subM.totalConducted);
                const isBunkExpanded = expandedBunk === subject;

                return (
                  <div key={subject} className={`bg-neutral-950/60 p-4 border rounded-xl space-y-3 transition-all ${
                    !subIsSafe ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-neutral-850"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white font-mono">{subject}</h4>
                          {!subIsSafe && (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded animate-pulse">
                              <AlertCircle className="w-2.5 h-2.5" />
                              BELOW 75%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-400">
                          <span>Attended: <b className="text-neutral-200">{subM.totalAttended}</b></span>
                          <span>·</span>
                          <span>Conducted: <b className="text-neutral-200">{subM.totalConducted}</b></span>
                          {subM.dutyLeaves > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-teal-400">Duty Leave: <b>{subM.dutyLeaves}</b></span>
                            </>
                          )}
                          {subM.absences > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-red-400">Skips: <b>{subM.absences}</b></span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AttendanceTrendSparkline entries={ledger} subject={subject} />
                        <div className="text-right">
                          <span className="text-xs text-neutral-400 font-mono block">Real / Simulated</span>
                          <span className={`text-sm font-bold font-mono ${subIsSafe ? "text-amber-400" : "text-red-400"}`}>
                            {subPercent}% / {simPercent}%
                          </span>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${subIsSafe ? "bg-amber-400" : "bg-red-400 animate-pulse"}`} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="absolute left-[75%] top-0 w-0.5 h-full bg-neutral-700 z-10" />
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${!subIsSafe ? "animate-pulse" : ""}`}
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

                    <button
                      onClick={() => setExpandedBunk(isBunkExpanded ? null : subject)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900/30 border border-neutral-850/40 rounded-lg text-[10px] font-mono text-neutral-300 hover:bg-neutral-900/50 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Can I Bunk Calculator
                      </span>
                      {isBunkExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isBunkExpanded && (
                      <div className={`p-3 rounded-lg border text-[11px] font-light leading-relaxed ${
                        bunkCalc.canSkip > 0
                          ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-300"
                          : "bg-amber-950/10 border-amber-900/40 text-amber-300"
                      }`}>
                        {bunkCalc.canSkip > 0 ? (
                          <p>
                            You can safely skip the next <span className="font-bold font-mono text-emerald-400">{bunkCalc.canSkip}</span> consecutive session{bunkCalc.canSkip !== 1 ? "s" : ""} without dropping below 75%.
                          </p>
                        ) : (
                          <p>
                            You must attend the next <span className="font-bold font-mono text-amber-400">{bunkCalc.mustAttend}</span> consecutive session{bunkCalc.mustAttend !== 1 ? "s" : ""} to recover back to 75%.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 space-y-4">
        <div className="border-b border-neutral-850 pb-3 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
            <CalendarDays className="w-4.5 h-4.5 text-amber-500" />
            Attendance History
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">{ledger.length} total entries</span>
        </div>
        {ledger.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-neutral-500">
            No attendance records yet. Start logging sessions above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 text-neutral-500">
                  <th className="py-2.5 px-3 font-normal uppercase">Date</th>
                  <th className="py-2.5 px-3 font-normal uppercase">Subject</th>
                  <th className="py-2.5 px-3 font-normal uppercase">Status</th>
                  <th className="py-2.5 px-3 text-right font-normal uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {ledger.map((entry) => {
                  let badgeColor = "bg-neutral-900 border-neutral-800 text-neutral-300";
                  if (entry.status === "Attended") badgeColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
                  if (entry.status === "Absent") badgeColor = "bg-red-500/10 border-red-500/20 text-red-400";
                  if (entry.status === "Mass Bunk") badgeColor = "bg-orange-500/10 border-orange-500/20 text-orange-400";
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
                          title="Delete record"
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
