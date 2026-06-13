import React, { useState } from "react";
import { PlusCircle, CheckSquare, Square, Trash2, Calendar, Target, Shield, HelpCircle, X } from "lucide-react";
import { ExamTask, UnscheduledTarget } from "../types";

interface PlannerViewProps {
  tasks: ExamTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<ExamTask, "id">) => void;
  onDeleteTask: (id: string) => void;
  unscheduled: UnscheduledTarget[];
  onAddUnscheduled: (target: Omit<UnscheduledTarget, "id">) => void;
  onDeleteUnscheduled: (id: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  unscheduled,
  onAddUnscheduled,
  onDeleteUnscheduled
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDay, setNewDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");
  const [newDuration, setNewDuration] = useState("14:00 - 15:30");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // State for adding Unscheduled fields
  const [isUnscheduledModalOpen, setIsUnscheduledModalOpen] = useState(false);
  const [unschedSubject, setUnschedSubject] = useState("");
  const [unschedTopic, setUnschedTopic] = useState("");
  const [unschedHours, setUnschedHours] = useState(4);

  // Dynamic calculation for Command Center values
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const readinessFactor = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newTopic) return;
    onAddTask({
      subject: newSubject,
      topic: newTopic,
      day: newDay,
      duration: newDuration,
      priority: newPriority,
      completed: false
    });
    setNewSubject("");
    setNewTopic("");
    setIsModalOpen(false);
  };

  const handleUnschedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unschedSubject || !unschedTopic) return;
    onAddUnscheduled({
      subject: unschedSubject,
      topic: unschedTopic,
      estimatedHours: unschedHours
    });
    setUnschedSubject("");
    setUnschedTopic("");
    setIsUnscheduledModalOpen(false);
  };

  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday")[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ];

  return (
    <div className="space-y-6 font-sans relative">
      
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Curriculum Scheduler</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Strategic Exam Planner</h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Formulate high-priority study blocks, track completion rates, and index unscheduled subject targets.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-neutral-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <PlusCircle className="w-4 h-4" />
            New Target
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Day Grid (Monday, Tuesday, Wednesday...) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {days.map(day => {
              const dayTasks = tasks.filter(t => t.day === day);
              return (
                <div key={day} className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {day}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{dayTasks.length} tasks</span>
                  </div>

                  {dayTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-600 font-mono italic">
                      No study coordinates mapped for {day}.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded-lg border transition-all relative group flex justify-between items-start gap-2 ${
                            task.completed 
                              ? "bg-neutral-950/20 border-neutral-900/60 opacity-60" 
                              : "bg-neutral-900/60 border-neutral-800/80 hover:border-amber-400/20"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <button 
                              onClick={() => onToggleTask(task.id)}
                              className="mt-0.5 text-amber-400/80 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              {task.completed ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-white block leading-tight">{task.subject}</span>
                              <p className="text-[11px] text-neutral-400 font-light leading-snug">{task.topic}</p>
                              
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[9px] font-mono text-neutral-500">{task.duration}</span>
                                <span className={`text-[8px] font-mono px-1 rounded uppercase tracking-wider ${
                                  task.priority === "High" 
                                    ? "bg-red-500/10 text-red-400 border border-red-500/10" 
                                    : task.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" 
                                    : "bg-neutral-800 text-neutral-400"
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="text-neutral-600 hover:text-red-400 transition-colors p-1 cursor-pointer absolute right-2 top-2 opacity-0 group-hover:opacity-100"
                            title="Delete Target"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Command Center readiness & Unscheduled list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Command Center Stats Block */}
          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5 border-b border-neutral-900 pb-2">
              <Shield className="w-4 h-4 text-amber-400" />
              PLANNER_TELEMETRY
            </h3>

            <div className="space-y-4">
              {/* Readiness Score */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Readiness Score Factor</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-sans font-bold text-white leading-tight">
                    {readinessFactor}%
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">OPTIMIZED</span>
                </div>
                <div className="w-full bg-neutral-950 h-1 rounded overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded transition-all duration-500" 
                    style={{ width: `${readinessFactor}%` }} 
                  />
                </div>
              </div>

              {/* Study Plan Meta */}
              <div className="p-3 bg-neutral-900/60 rounded-lg space-y-1">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Active Weekly Goal</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  Complete advanced Integration and Hamiltonian proofs prior to diagnostic evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* Unscheduled Targets */}
          <div className="bg-neutral-900/30 border border-neutral-800 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 font-mono">
                <Target className="w-3.5 h-3.5 text-neutral-500" />
                Unscheduled Targets
              </h3>
              <button 
                onClick={() => setIsUnscheduledModalOpen(true)}
                className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {unscheduled.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg flex justify-between items-center relative group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white block">{item.subject}</span>
                    <p className="text-[10px] text-neutral-400 font-light leading-snug">{item.topic}</p>
                    <span className="text-[9px] font-mono text-amber-400/80 block mt-1">Est. {item.estimatedHours} hours remaining</span>
                  </div>
                  <button 
                    onClick={() => onDeleteUnscheduled(item.id)}
                    className="text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add Day scheduled Target */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Add Curriculum Target</h3>
              <p className="text-xs text-neutral-400 font-light">Deploy a new structured target coordinate into the weekly planner.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Course Subject</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Advanced Calculus"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Target Topic (Detailed)</label>
                <input 
                  type="text" 
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Taylor Series Expansions"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Day Planned</label>
                  <select 
                    value={newDay} 
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Time / Duration</label>
                  <input 
                    type="text" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 14:00 - 15:30"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Study Priority</label>
                <div className="flex gap-4">
                  {["High", "Medium", "Low"].map((p) => (
                    <label key={p} className="flex items-center gap-2 text-xs text-neutral-350 cursor-pointer">
                      <input 
                        type="radio" 
                        name="priority" 
                        checked={newPriority === p}
                        onChange={() => setNewPriority(p as any)}
                        className="accent-amber-500 bg-neutral-950 border-neutral-800"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg cursor-pointer"
                >
                  Confirm Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Unscheduled Target */}
      {isUnscheduledModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            
            <button 
              onClick={() => setIsUnscheduledModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Add Unscheduled Objective</h3>
              <p className="text-xs text-neutral-400 font-light">Index an unscheduled topic goal pending active slot reservation.</p>
            </div>

            <form onSubmit={handleUnschedSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Subject</label>
                <input 
                  type="text" 
                  value={unschedSubject}
                  onChange={(e) => setUnschedSubject(e.target.value)}
                  placeholder="e.g. Molecular Chemistry"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Topic Area</label>
                <input 
                  type="text" 
                  value={unschedTopic}
                  onChange={(e) => setUnschedTopic(e.target.value)}
                  placeholder="e.g. Covalent bond configuration bounds"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Estimated Duration Hours ({unschedHours}h)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={unschedHours}
                  onChange={(e) => setUnschedHours(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-950 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsUnscheduledModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg cursor-pointer"
                >
                  Add Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
