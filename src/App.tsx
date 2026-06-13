import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ShieldAlert
} from "lucide-react";

import { TabType, ExamTask, UnscheduledTarget, LibraryResource, ChatMessage } from "./types";

import { LoginView } from "./components/LoginView";
import { RegistrationView } from "./components/RegistrationView";
import { LandingView } from "./components/LandingView";
import { DashboardContainer } from "./components/DashboardContainer";
import { AttendanceView } from "./components/AttendanceView";
import { PlannerView } from "./components/PlannerView";
import { LibraryView } from "./components/LibraryView";
import { QuizView } from "./components/QuizView";
import { ChatView } from "./components/ChatView";
import { SmoothCursor } from "./components/SmoothCursor";

const TOKEN_KEY = "aegis_token";
const USER_CACHE_KEY = "aegis_user_cache";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getCachedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_CACHE_KEY);
  }
}

function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  badge: string;
  avatarUrl: string;
  readinessScore: number;
  attendancePct: number;
}

export default function App() {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isViewingPromo, setIsViewingPromo] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<ExamTask[]>([]);
  const [unscheduled, setUnscheduled] = useState<UnscheduledTarget[]>([]);
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  const [attendancePct, setAttendancePct] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsNameInput, setSettingsNameInput] = useState("");
  const [settingsEmailInput, setSettingsEmailInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [modelName, setModelName] = useState<string>("GEMINI_2.5_FLASH");
  const [modelLatency, setModelLatency] = useState<number | null>(35);
  const [responseFidelity, setResponseFidelity] = useState({ level: "High", percentage: 80 });
  const [modelMemoryEnabled, setModelMemoryEnabled] = useState<boolean>(true);
  const [activeHighlightKeyword, setActiveHighlightKeyword] = useState<string | null>(null);
  const [highlightOpacity, setHighlightOpacity] = useState(1);

  const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };
    const res = await fetch(endpoint, { ...options, headers });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore logout errors
    }
    setTokenState(null);
    setToken(null);
    setUserProfile(null);
    setCachedUser(null);
    setTasks([]);
    setUnscheduled([]);
    setLibraryResources([]);
    setChatMessages([]);
    setAttendancePct(0);
    setReadinessScore(0);
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  }, [apiFetch]);

  const fetchUserData = useCallback(async (retryCount = 0) => {
    try {
      const profile = await apiFetch("/api/auth/me");
      setUserProfile(profile.user);
      setCachedUser(profile.user);
      setSettingsNameInput(profile.user.name);
      setSettingsEmailInput(profile.user.email);
      setAttendancePct(profile.user.attendancePct);
      setReadinessScore(profile.user.readinessScore);

      const [tasksData, unscheduledData, libraryData, chatData] = await Promise.all([
        apiFetch("/api/tasks"),
        apiFetch("/api/unscheduled"),
        apiFetch("/api/library"),
        apiFetch("/api/chat/messages"),
      ]);

      setTasks(tasksData);
      setUnscheduled(unscheduledData);
      setLibraryResources(libraryData);
      setChatMessages(chatData);
    } catch (err: any) {
      console.error("Failed to fetch user data:", err);
      if (err.message?.includes("401") || err.message?.includes("Unauthorized") || err.message?.includes("expired")) {
        handleLogout();
      } else if (retryCount < 3) {
        await new Promise(r => setTimeout(r, 2000 * (retryCount + 1)));
        return fetchUserData(retryCount + 1);
      } else {
        const cached = getCachedUser();
        if (cached) {
          setUserProfile(cached);
          setSettingsNameInput(cached.name);
          setSettingsEmailInput(cached.email);
          setAttendancePct(cached.attendancePct);
          setReadinessScore(cached.readinessScore);
        }
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, [apiFetch, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsAuthLoading(false);
    }
  }, [token, fetchUserData]);

  useEffect(() => {
    if (!activeHighlightKeyword) {
      setHighlightOpacity(0);
      return;
    }
    setHighlightOpacity(1);
    const startTime = Date.now();
    const duration = 60000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingProgress = Math.max(0, 1 - elapsed / duration);
      setHighlightOpacity(remainingProgress);
      if (remainingProgress <= 0) {
        clearInterval(interval);
        setActiveHighlightKeyword(null);
      }
    }, 200);
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

  const handleLoginSuccess = (email: string) => {
    setTokenState(getToken());
    setIsLoggedIn(true);
    setIsViewingPromo(false);
    setActiveTab("dashboard");
  };

  const handleRegisterSuccess = (email: string) => {
    setTokenState(getToken());
    setIsLoggedIn(true);
    setIsViewingPromo(false);
    setActiveTab("dashboard");
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    await apiFetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: updated.completed }),
    });
  };

  const handleAddTask = async (newTask: Omit<ExamTask, "id">) => {
    const saved = await apiFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
    });
    setTasks(prev => [...prev, saved]);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  const handleAddUnscheduled = async (newTarget: Omit<UnscheduledTarget, "id">) => {
    const saved = await apiFetch("/api/unscheduled", {
      method: "POST",
      body: JSON.stringify(newTarget),
    });
    setUnscheduled(prev => [...prev, saved]);
  };

  const handleDeleteUnscheduled = async (id: string) => {
    setUnscheduled(prev => prev.filter(t => t.id !== id));
    await apiFetch(`/api/unscheduled/${id}`, { method: "DELETE" });
  };

  const handleToggleLibrarySync = async (id: string) => {
    const resource = libraryResources.find(r => r.id === id);
    if (!resource) return;
    const updated = { ...resource, synced: !resource.synced };
    setLibraryResources(prev => prev.map(r => r.id === id ? updated : r));
    await apiFetch(`/api/library/${id}/sync`, {
      method: "PUT",
      body: JSON.stringify({ synced: updated.synced }),
    });
  };

  const handleSendMessage = async (text: string) => {
    const startTime = Date.now();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC";
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: text,
      timestamp,
    };

    observeKeywords(text);
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const saved = await apiFetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify(userMsg),
      });
      setChatMessages(prev => [...prev, saved]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessagesRef.current, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) throw new Error("Express server-proxy returned non-success code");
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now()}-reply`,
        role: "assistant",
        content: data.content || "Communication coordinate error.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC",
      };

      observeKeywords(assistantMsg.content);
      setChatMessages(prev => [...prev, assistantMsg]);
      await apiFetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify(assistantMsg),
      });
    } catch (e) {
      console.warn("Server Endpoint offline. Deploying scholarly Offline Fallback Buffer:", e);
      const fallbackText = `[AEGIS LOCAL SECURE OFFLINE BUFFER]\nGreetings, Scholar. The AI core is currently offline. Please try again later.`;
      const fallbackMsg: ChatMessage = {
        id: `chat-${Date.now()}-fallback`,
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " UTC",
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setModelLatency(Date.now() - startTime);
      setIsChatLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsNameInput.trim() || settingsEmailInput.trim()) {
      await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name: settingsNameInput, email: settingsEmailInput }),
      });
      if (userProfile) {
        setUserProfile({ ...userProfile, name: settingsNameInput, email: settingsEmailInput });
      }
    }
    setIsSettingsOpen(false);
  };

  const handleUpdateAttendance = useCallback(async (newPct: number) => {
    setAttendancePct(newPct);
    await apiFetch("/api/user/attendance", {
      method: "PUT",
      body: JSON.stringify({ percentage: newPct }),
    });
  }, [apiFetch]);

  const handleUpdateReadiness = useCallback(async (score: number) => {
    setReadinessScore(score);
    await apiFetch("/api/user/readiness", {
      method: "PUT",
      body: JSON.stringify({ score }),
    });
  }, [apiFetch]);

  if (isViewingPromo) {
    return (
      <>
        <SmoothCursor />
        <LandingView onBackToLogin={() => setIsViewingPromo(false)} />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <SmoothCursor />
        {authMode === "login" ? (
          <LoginView 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToPromo={() => setIsViewingPromo(true)}
            onNavigateToRegister={() => setAuthMode("register")}
          />
        ) : (
          <RegistrationView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setAuthMode("login")}
            onNavigateToPromo={() => setIsViewingPromo(true)}
          />
        )}
      </>
    );
  }

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const displayName = userProfile?.name || "Scholar";
  const displayEmail = userProfile?.email || "";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-amber-400 selection:text-neutral-950">
      <div className={`absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_top,rgba(180,140,80,0.05)_0%,transparent_70%)] pointer-events-none transition-all duration-1000 ${isDeepFocus ? "opacity-15 blur-lg" : "opacity-100"}`} />

      <aside className="w-64 border-r border-neutral-900 bg-neutral-950 flex flex-col justify-between shrink-0 p-5 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Crown className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-400 block leading-none">Command shell</span>
              <span className="font-sans font-bold text-white tracking-tight block mt-0.5 text-base">AEGIS CORE</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-neutral-950 rounded-full border border-neutral-800 flex items-center justify-center text-amber-400 font-bold font-mono">
                {displayName ? displayName.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="leading-tight">
                <span className="text-xs font-semibold text-white block truncate max-w-[120px]">{displayName}</span>
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Crown Member</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {(["dashboard", "attendance", "planner", "resources", "quiz", "chat"] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab === "dashboard" && <LayoutDashboard className="w-4 h-4" />}
                  {tab === "attendance" && <Clock className="w-4 h-4" />}
                  {tab === "planner" && <Calendar className="w-4 h-4" />}
                  {tab === "resources" && <BookOpen className="w-4 h-4" />}
                  {tab === "quiz" && <GraduationCap className="w-4 h-4" />}
                  {tab === "chat" && <Bot className="w-4 h-4" />}
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </div>
                {activeTab === tab && <ChevronRight className="w-3 h-3 text-amber-500" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-1.5 border-t border-neutral-900 pt-5">
          <button
            onClick={() => {
              setSettingsNameInput(displayName);
              setSettingsEmailInput(displayEmail);
              setIsSettingsOpen(true);
            }}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/40 rounded-lg cursor-pointer transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 px-3 text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#070707] min-h-screen">
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

          <div className="flex items-center bg-neutral-900/65 border border-neutral-800 rounded-lg p-0.5 font-mono text-[10px] shadow-inner select-none">
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
            <span className="hidden md:inline select-none">NODE_IDENTITY :: {displayEmail}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${isDeepFocus ? "bg-indigo-400" : "bg-amber-400"}`} title="Connection state" />
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardContainer
              onNavigateToTab={setActiveTab}
              attendancePct={attendancePct}
              completedTasksCount={completedTasksCount}
              totalTasksCount={tasks.length}
              readinessScore={readinessScore}
              username={displayName}
              isDeepFocus={isDeepFocus}
              activeHighlightKeyword={activeHighlightKeyword}
              highlightOpacity={highlightOpacity}
              onClearHighlightKeyword={() => setActiveHighlightKeyword(null)}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceView
              currentAttendance={attendancePct}
              onUpdateAttendance={handleUpdateAttendance}
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
              onUpdateReadiness={handleUpdateReadiness}
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
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1">
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
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Academic Coordinate Email</label>
                <input
                  type="email"
                  value={settingsEmailInput}
                  onChange={(e) => setSettingsEmailInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg text-[10px] font-mono text-neutral-400 space-y-1">
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
