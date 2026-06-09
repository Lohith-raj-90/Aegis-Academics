import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Bot, 
  Settings, 
  LogOut, 
  Crown, 
  User, 
  ChevronRight, 
  ShieldAlert,
  Info
} from "lucide-react";

import { TabType, ExamTask, UnscheduledTarget, LibraryResource, ChatMessage } from "./types";
import { DEFAULT_TASKS, DEFAULT_UNSCHEDULED, LIBRARY_RESOURCES } from "./data";

// Import custom views
import { LoginView } from "./components/LoginView";
import { LandingView } from "./components/LandingView";
import { DashboardContainer } from "./components/DashboardContainer";
import { AttendanceView } from "./components/AttendanceView";
import { PlannerView } from "./components/PlannerView";
import { LibraryView } from "./components/LibraryView";
import { QuizView } from "./components/QuizView";
import { ChatView } from "./components/ChatView";
import { SmoothCursor } from "./components/SmoothCursor";

// Schema Version constant for safe caching schema migration
const AEGIS_SCHEMA_VERSION = 2;

// Deep recursive validation check comparing cached structures against blueprint templates
function verifyAndReconcileTypes(cached: any, blueprint: any, contextPath: string = "root"): any {
  // Defensive check for primitive types or null/undefined blueprints
  if (blueprint === null || blueprint === undefined) {
    return cached;
  }
  if (cached === null || cached === undefined) {
    console.info(`[Self-Healing] Restoring defaulted sub-property at "${contextPath}".`);
    return JSON.parse(JSON.stringify(blueprint));
  }

  const blueprintType = typeof blueprint;
  const cachedType = typeof cached;

  // Handle arrays
  if (Array.isArray(blueprint)) {
    if (!Array.isArray(cached)) {
      console.warn(`[Self-Healing] Structural type mismatch at "${contextPath}". Expected Array, received "${cachedType}". Safe fallback deployed.`);
      return JSON.parse(JSON.stringify(blueprint));
    }
    
    // Arrays elements type evaluation: check items if blueprint contains a template row entry
    if (blueprint.length > 0) {
      const templateItem = blueprint[0];
      return cached.map((element: any, index: number) => 
        verifyAndReconcileTypes(element, templateItem, `${contextPath}[${index}]`)
      );
    }
    return cached;
  }

  // Handle objects
  if (blueprintType === "object") {
    if (cachedType !== "object" || Array.isArray(cached)) {
      console.warn(`[Self-Healing] Structural type mismatch at "${contextPath}". Expected Object, received "${cachedType}". Resetting sub-property.`);
      return JSON.parse(JSON.stringify(blueprint));
    }

    const reconciled: any = { ...cached };
    
    // Check all template fields
    for (const key of Object.keys(blueprint)) {
      if (!(key in reconciled)) {
        console.info(`[Self-Healing] Context expansion: Appending missing key "${key}" under "${contextPath}".`);
        reconciled[key] = JSON.parse(JSON.stringify(blueprint[key]));
      } else {
        // Deep recursive matching for field properties
        reconciled[key] = verifyAndReconcileTypes(reconciled[key], blueprint[key], `${contextPath}.${key}`);
      }
    }

    // Purge outdated properties that are not present in current factory configurations
    for (const key of Object.keys(reconciled)) {
      if (!(key in blueprint)) {
        console.info(`[Self-Healing] Cleared deprecated key "${key}" from storage.`);
        delete reconciled[key];
      }
    }

    return reconciled;
  }

  // Handle Primitives (number, string, boolean)
  if (blueprintType !== cachedType) {
    console.warn(`[Self-Healing] Type mismatch at "${contextPath}". Expected "${blueprintType}", received "${cachedType}". Resetting property value.`);
    return blueprint;
  }

  return cached;
}

// Helper hook for version-controlled state hydration and structural healing
function useLocalStorageSecure<T>(key: string, initialValue: T, schemaVersion: number = AEGIS_SCHEMA_VERSION): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return initialValue;
      }
      
      const parsedEnvelope = JSON.parse(raw);
      
      // Self-Healing Data Recovery Layer Active
      let unpackedData: any = parsedEnvelope;
      
      if (parsedEnvelope && typeof parsedEnvelope === "object" && "version" in parsedEnvelope && "data" in parsedEnvelope) {
        if (parsedEnvelope.version === schemaVersion) {
          unpackedData = parsedEnvelope.data;
        } else {
          console.warn(`[Secure Hydrator] Schema version mismatch for key "${key}" (Stored: ${parsedEnvelope.version}, Required: ${schemaVersion}). Initiating recursive healing.`);
          unpackedData = parsedEnvelope.data;
        }
      } else {
        // Handle retro vintage stored structures (upgrade gracefully)
        console.info(`[Secure Hydrator] Elevating legacy unversioned data for key "${key}" into schema envelopes.`);
      }
      
      // Perform deep-dive type validation check to guarantee runtime type safety and prevent crashes
      return verifyAndReconcileTypes(unpackedData, initialValue, key) as T;
    } catch (error) {
      console.warn(`[Secure Hydrator] Failed reading target key "${key}". Reverting safely to schema fallback:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const envelope = {
        version: schemaVersion,
        data: valueToStore
      };
      window.localStorage.setItem(key, JSON.stringify(envelope));
    } catch (error) {
      console.warn(`[Secure Hydrator] Failed setting target key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default function App() {
  // Authentication & Layout Routes
  const [isLoggedIn, setIsLoggedIn] = useLocalStorageSecure("aegis_is_logged_in", false);
  const [isViewingPromo, setIsViewingPromo] = useState(false);
  const [activeTab, setActiveTab] = useLocalStorageSecure<TabType>("aegis_active_tab", "dashboard");

  // Layout Calibration modes
  const [isDeepFocus, setIsDeepFocus] = useLocalStorageSecure("aegis_deep_focus_mode", false);

  // Global Sync States
  const [username, setUsername] = useLocalStorageSecure("aegis_username", "Lohith R C");
  const [userEmail, setUserEmail] = useLocalStorageSecure("aegis_user_email", "lohithraj9095@gmail.com");
  const [attendancePct, setAttendancePct] = useLocalStorageSecure("aegis_attendance_pct", 84);
  const [readinessScore, setReadinessScore] = useLocalStorageSecure("aegis_readiness_score", 86);

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsNameInput, setSettingsNameInput] = useState(username);
  const [settingsEmailInput, setSettingsEmailInput] = useState(userEmail);

  // Dynamic lists with persistence hydration
  const [tasks, setTasks] = useLocalStorageSecure<ExamTask[]>("aegis_tasks", DEFAULT_TASKS);
  const [unscheduled, setUnscheduled] = useLocalStorageSecure<UnscheduledTarget[]>("aegis_unscheduled", DEFAULT_UNSCHEDULED);
  const [libraryResources, setLibraryResources] = useLocalStorageSecure<LibraryResource[]>("aegis_library_resources", LIBRARY_RESOURCES);

  // Chat memory persistence
  const [chatMessages, setChatMessages] = useLocalStorageSecure<ChatMessage[]>("aegis_chat_messages", [
    {
      id: "greet-1",
      role: "assistant",
      content: "Academic coordinate synchronization complete, Scholar. Welcome back to the Aegis Command Center.",
      timestamp: "09:00 UTC"
    },
    {
      id: "greet-2",
      role: "assistant",
      content: "Active placement diagnostic readiness factor is calibrated at 86/100. Let's optimize calculus limit derivations today.",
      timestamp: "09:01 UTC"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [modelName, setModelName] = useState<string>("GEMINI_3.5_FLASH");
  const [modelLatency, setModelLatency] = useState<number | null>(35);
  const [responseFidelity, setResponseFidelity] = useState({ level: "High", percentage: 80 });
  const [modelMemoryEnabled, setModelMemoryEnabled] = useState<boolean>(true);
  const [activeHighlightKeyword, setActiveHighlightKeyword] = useLocalStorageSecure<string | null>("aegis_highlight_keyword", null);
  
  // Temporal Decay for Shared AI Context: opacity states and animated countdown loop
  const [highlightOpacity, setHighlightOpacity] = useState(1);

  React.useEffect(() => {
    if (!activeHighlightKeyword) {
      setHighlightOpacity(0);
      return;
    }

    // Reset indicator opacity to 100% on active trigger or keyword shift
    setHighlightOpacity(1);

    const startTime = Date.now();
    const duration = 60000; // 60 seconds fading duration window

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingProgress = Math.max(0, 1 - elapsed / duration);
      
      setHighlightOpacity(remainingProgress);

      if (remainingProgress <= 0) {
        clearInterval(interval);
        // Cleanly restore standard presentation state once fully faded
        setActiveHighlightKeyword(null);
      }
    }, 200); // 200ms ticks for fluid sub-second visual performance adjustments

    return () => clearInterval(interval);
  }, [activeHighlightKeyword]);

  const observeKeywords = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes("calculus") || text.includes("limit") || text.includes("green") || text.includes("fourier") || text.includes("math") || text.includes("integral") || text.includes("coordinate")) {
      setActiveHighlightKeyword("Calculus");
    } else if (text.includes("quantum") || text.includes("schrodinger") || text.includes("qubit") || text.includes("circuits") || text.includes("superposition") || text.includes("physics") || text.includes("gate")) {
      setActiveHighlightKeyword("Quantum");
    } else if (text.includes("np") || text.includes("halt") || text.includes("automata") || text.includes("turing") || text.includes("tape") || text.includes("languages") || text.includes("reduc")) {
      setActiveHighlightKeyword("Automata");
    } else if (text.includes("attendance") || text.includes("vtu") || text.includes("clearance") || text.includes("hours")) {
      setActiveHighlightKeyword("Attendance");
    }
  };

  // Sign-in callback
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setSettingsEmailInput(email);
    setIsLoggedIn(true);
    setIsViewingPromo(false);
    setActiveTab("dashboard");
  };

  // Scheduled planner handlers
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (newTask: Omit<ExamTask, "id">) => {
    const task: ExamTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [...prev, task]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Unscheduled goals handlers
  const handleAddUnscheduled = (newTarget: Omit<UnscheduledTarget, "id">) => {
    const target: UnscheduledTarget = {
      ...newTarget,
      id: `unsched-${Date.now()}`
    };
    setUnscheduled(prev => [...prev, target]);
  };

  const handleDeleteUnscheduled = (id: string) => {
    setUnscheduled(prev => prev.filter(t => t.id !== id));
  };

  // Library Sync Toggle handler
  const handleToggleLibrarySync = (id: string) => {
    setLibraryResources(prev => prev.map(res => {
      if (res.id === id) {
        return { ...res, synced: !res.synced };
      }
      return res;
    }));
  };

  // Specialized rule-matching static processor for bulletproof offline recovery (Upgrade 5)
  const getLocalFallbackResponse = (userText: string): string => {
    const query = userText.toLowerCase();

    if (query.includes("calculus") || query.includes("limit") || query.includes("green") || query.includes("fourier") || query.includes("math") || query.includes("integral") || query.includes("coordinate")) {
      return `[AEGIS OFFLINE CORE :: CALCULUS ADVICE]
Hello Lohith R C, I have resolved your Calculus coordinates locally. In Calculus MAT-301, the Green's Scalar Theorem converts double-integral coordinate boundary regions into single line integrals:

∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA

For fourier series, ensure the boundary intervals satisfy the Dirichlet limits on a standard [0, 2π] coordinate axis.`;
    }

    if (query.includes("quantum") || query.includes("schrodinger") || query.includes("qubit") || query.includes("circuits") || query.includes("superposition") || query.includes("physics") || query.includes("gate")) {
      return `[AEGIS OFFLINE CORE :: QUANTUM CIRCUIT EQUATIONS]
Schrödinger wave mechanics and Bloch Sphere coordinates have been loaded locally:

1. Qubit rotations scale on vector states:
   |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
2. Superposition coordinates represent probability amplitudes where |α|^2 + |β|^2 = 1.

I recommend keeping your study practice velocity high on your command dashboard to lock in optimal metrics.`;
    }

    if (query.includes("np") || query.includes("halt") || query.includes("automata") || query.includes("turing") || query.includes("tape") || query.includes("languages") || query.includes("reduc")) {
      return `[AEGIS OFFLINE CORE :: COMPUTABILITY LIMITS]
Under Turing Machine and Formal Language Automata limits:
- The classic Halting Problem (H_TM) is proven undecidable but Turing-recognizable.
- Chomsky Hierarchy outlines 4 standard language classes (Regular, Context-Free, Context-Sensitive, Recursively Enumerable).
- NP-Complete algorithms can be reduced to Boolean SAT via Cook-Levin mapping logic in O(n^k) polynomial duration.`;
    }

    if (query.includes("attendance") || query.includes("vtu") || query.includes("clearance") || query.includes("scores") || query.includes("skip") || query.includes("lecture") || query.includes("forecaster")) {
      return `[AEGIS OFFLINE CORE :: VTU REGULATORY SYSTEM]
VTU Academic Eligibility Regulations mandate:
- Minimum required attendance thresholds are set strictly at 75%.
- Pre-emptive alerts and warnings trigger when calculated quotients drop below 80%.
- Deficit under 75% will detain the academic node and block active exam hall registration.

Interact with your daily class ledger on the Attendance sub-tab to simulate lecture statuses and safeguard qualifications!`;
    }

    if (query.includes("planner") || query.includes("study") || query.includes("tasks") || query.includes("goals") || query.includes("schedule")) {
      return `[AEGIS OFFLINE CORE :: STUDY ARCHITECTURE RECOMMENDATION]
Scholastic planners synced:
- Schedule a minimum 1.5 Hour practice block for low mastery subjects like Automata (54%).
- Use checkbox items on the targets ledger to automatically hydrate overall exam readiness.
- Maintain regular focus durations over the course of the week.`;
    }

    return `[AEGIS LOCAL SECURE OFFLINE BUFFER]
Greetings, Scholar. Although the server-side AI connection is currently offline, my localized rule-matching processors are active.

I can guide you on:
- "VTU Attendance eligibility policies"
- "Green's Theorem & Calculus integrals"
- "Schrödinger & Bloch Sphere qubits"
- "Turing machines & NP-Reductions"

Please input any matching keywords to trigger coordinate analytics advice.`;
  };

  // Chat message sender integration (real Express API)
  const handleSendMessage = async (text: string) => {
    const startTime = Date.now();
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC"
    };

    observeKeywords(text);
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Express server-proxy returned non-success code");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now()}-reply`,
        role: "assistant",
        content: data.content || "Communication coordinate error.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC"
      };

      observeKeywords(assistantMsg.content);
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.warn("Server Endpoint offline. Deploying scholarly Offline Fallback Buffer:", e);
      
      const fallbackText = getLocalFallbackResponse(text);
      observeKeywords(fallbackText);
      
      const fallbackMsg: ChatMessage = {
        id: `chat-${Date.now()}-fallback`,
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC"
      };
      
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setModelLatency(Date.now() - startTime);
      setIsChatLoading(false);
    }
  };

  // Save Settings panel handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsNameInput.trim()) {
      setUsername(settingsNameInput);
    }
    if (settingsEmailInput.trim()) {
      setUserEmail(settingsEmailInput);
    }
    setIsSettingsOpen(false);
  };

  // Public Promotion Landing Bypass router
  if (isViewingPromo) {
    return (
      <>
        <SmoothCursor />
        <LandingView onBackToLogin={() => setIsViewingPromo(false)} />
      </>
    );
  }

  // Secure Portal Gate
  if (!isLoggedIn) {
    return (
      <>
        <SmoothCursor />
        <LoginView 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToPromo={() => setIsViewingPromo(true)} 
        />
      </>
    );
  }

  const completedTasksCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Decorative ambient visual background glows - dimmed in deep focus mode */}
      <div className={`absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_top,rgba(180,140,80,0.05)_0%,transparent_70%)] pointer-events-none transition-all duration-1000 ${isDeepFocus ? "opacity-15 blur-lg" : "opacity-100"}`} />

      {/* LEFT SIDEBAR REPLICA (Document 1 layout style) */}
      <aside className="w-64 border-r border-neutral-900 bg-neutral-950 flex flex-col justify-between shrink-0 p-5 relative z-10">
        
        {/* Core elements */}
        <div className="space-y-6">
          
          {/* Top Logo Badge */}
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Crown className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-400 block leading-none">Command shell</span>
              <span className="font-sans font-bold text-white tracking-tight block mt-0.5 text-base">AEGIS CORE</span>
            </div>
          </div>

          {/* Profile Card & Gold Badge "Crown Member" (Document 1 detail) */}
          <div className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-neutral-950 rounded-full border border-neutral-800 flex items-center justify-center text-amber-400 font-bold font-mono">
                {username ? username.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="leading-tight">
                <span className="text-xs font-semibold text-white block truncate max-w-[120px]">{username}</span>
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Crown Member</span>
              </div>
            </div>
          </div>

          {/* Side Nav Elements list */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "dashboard"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeTab === "dashboard" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "attendance"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Attendance</span>
              </div>
              {activeTab === "attendance" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "planner"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Planner</span>
              </div>
              {activeTab === "planner" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>

            <button
              onClick={() => setActiveTab("resources")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "resources"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </div>
              {activeTab === "resources" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4" />
                <span>Quiz Suite</span>
              </div>
              {activeTab === "quiz" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === "chat"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4" />
                <span>AI Chat</span>
              </div>
              {activeTab === "chat" && <ChevronRight className="w-3 h-3 text-amber-500" />}
            </button>
          </nav>
        </div>

        {/* Secondary Navigation elements */}
        <div className="space-y-1.5 border-t border-neutral-900 pt-5">
          <button
            onClick={() => {
              setSettingsNameInput(username);
              setSettingsEmailInput(userEmail);
              setIsSettingsOpen(true);
            }}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/40 rounded-lg cursor-pointer transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setActiveTab("dashboard");
            }}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN MAIN VIEW PORT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#070707] min-h-screen">
        
        {/* Top Header Section */}
        <header className="border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md py-3.5 px-8 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {activeTab.toUpperCase()}_STAGE
            </span>
            {activeHighlightKeyword && (
              <span 
                style={{ opacity: highlightOpacity, transition: "opacity 0.2s ease-out" }}
                className="animate-pulse flex items-center gap-1.5 font-mono text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full select-none"
              >
                <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                LINKED: {activeHighlightKeyword.toUpperCase()}
                <button
                  type="button"
                  onClick={() => setActiveHighlightKeyword(null)}
                  className="ml-1 text-zinc-400 hover:text-white font-bold cursor-pointer transition-colors"
                  title="Clear linked context"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Interactive Layout Mode Switcher */}
          <div className="flex items-center bg-neutral-900/65 border border-neutral-850 rounded-lg p-0.5 font-mono text-[10px] shadow-inner select-none">
            <button
              onClick={() => setIsDeepFocus(false)}
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                !isDeepFocus
                  ? "bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              ANALYTICS_COMMAND
            </button>
            <button
              onClick={() => setIsDeepFocus(true)}
              className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                isDeepFocus
                  ? "bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 animate-pulse"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              <span className={`w-1 h-1 rounded-full bg-indigo-400 ${isDeepFocus ? "block" : "hidden"}`} />
              DEEP_FOCUS
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 font-light">
            <span className="hidden md:inline select-none">NODE_IDENTITY :: {userEmail}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${isDeepFocus ? "bg-indigo-400" : "bg-amber-400"}`} title="Connection state" />
          </div>
        </header>

        {/* Primary View content with scrollable wrapper */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardContainer 
              onNavigateToTab={setActiveTab}
              attendancePct={attendancePct}
              completedTasksCount={completedTasksCount}
              totalTasksCount={tasks.length}
              readinessScore={readinessScore}
              username={username}
              isDeepFocus={isDeepFocus}
              activeHighlightKeyword={activeHighlightKeyword}
              highlightOpacity={highlightOpacity}
              onClearHighlightKeyword={() => setActiveHighlightKeyword(null)}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceView 
              currentAttendance={attendancePct}
              onUpdateAttendance={setAttendancePct}
            />
          )}

          {activeTab === "planner" && (
            <PlannerView 
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              unscheduled={unscheduled}
              onAddUnscheduled={handleAddUnscheduled}
              onDeleteUnscheduled={handleDeleteUnscheduled}
            />
          )}

          {activeTab === "resources" && (
            <LibraryView 
              resources={libraryResources}
              onToggleSync={handleToggleLibrarySync}
              activeHighlightKeyword={activeHighlightKeyword}
              highlightOpacity={highlightOpacity}
              onClearHighlightKeyword={() => setActiveHighlightKeyword(null)}
            />
          )}

          {activeTab === "quiz" && (
            <QuizView 
              currentReadiness={readinessScore}
              onUpdateReadiness={setReadinessScore}
            />
          )}

          {activeTab === "chat" && (
            <ChatView 
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              isDeepFocus={isDeepFocus}
              modelName={modelName}
              latency={modelLatency}
              responseFidelity={responseFidelity}
              modelMemoryEnabled={modelMemoryEnabled}
            />
          )}
        </div>
      </main>

      {/* CORE MODAL: Settings and configuration panel overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="border-b border-neutral-950 pb-3">
              <h3 className="text-base font-semibold text-white font-mono flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-400" />
                SYSTEM_CALIBRATIONS
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 font-light">Modify command identities and sync profiles</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-450 flex items-center gap-1">
                  <User className="w-3 h-3 text-neutral-500" />
                  Your Profile Name
                </label>
                <input 
                  type="text" 
                  value={settingsNameInput}
                  onChange={(e) => setSettingsNameInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-450">Academic Coordinate Email</label>
                <input 
                  type="email" 
                  value={settingsEmailInput}
                  onChange={(e) => setSettingsEmailInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-neutral-950/40 border border-neutral-850 rounded-lg text-[10px] font-mono text-neutral-400 space-y-1">
                <span className="text-amber-400 font-bold block">TELEMETRY_STATUS:</span>
                <p className="leading-relaxed">
                  Credentials verified under sovereign federated coordinate rules. Sync is active and local memories are backed up seamlessly.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg cursor-pointer"
                >
                  Save Calibrations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
