import React, { useState, useEffect } from "react";
import { Award, Zap, Clock, CheckCircle, AlertTriangle, ArrowRight, HelpCircle, BookOpen, RefreshCw, Star, ArrowUpRight } from "lucide-react";
import { CALCULUS_QUESTIONS, FLASHCARDS } from "../data";
import { QuizQuestion } from "../types";

interface QuizViewProps {
  currentReadiness: number;
  onUpdateReadiness: (score: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  currentReadiness,
  onUpdateReadiness
}) => {
  const [activeModule, setActiveModule] = useState<'multiple-choice' | 'flashcards' | 'short-answer' | 'technical'>('multiple-choice');
  
  // Multiple Choice Quiz State
  const [mcIndex, setMcIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [mcCompleted, setMcCompleted] = useState(false);
  const [mcScore, setMcScore] = useState(0);
  const [submitsCount, setSubmitsCount] = useState<Record<number, boolean>>({});
  const [gradedAnswers, setGradedAnswers] = useState<Record<number, { selected: string, isCorrect: boolean }>>({});

  // Flashcards state
  const [fcIndex, setFcIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Short Answer Critique State
  const [shortAnswerText, setShortAnswerText] = useState("");
  const [shortAnswerFeedback, setShortAnswerFeedback] = useState("");
  const [shortAnswerLoading, setShortAnswerLoading] = useState(false);

  // Technical Challenge state
  const [techSolution, setTechSolution] = useState("");
  const [techFeedback, setTechFeedback] = useState("");
  const [techLoading, setTechLoading] = useState(false);

  // Remaining active countdown session seconds
  const [secondsRemaining, setSecondsRemaining] = useState(300);

  // Timer simulation
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Format countdown clock
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Submit active Multiple-Choice question answer
  const handleMcSubmit = () => {
    if (!selectedOpt) return;
    const currentQ = CALCULUS_QUESTIONS[mcIndex];
    const isCorrect = selectedOpt === currentQ.correctAnswer;
    
    // Track grade
    setGradedAnswers(prev => ({
      ...prev,
      [mcIndex]: { selected: selectedOpt, isCorrect }
    }));

    if (isCorrect) {
      setMcScore(prev => prev + 1);
      // Increment globally mapped readiness factor
      onUpdateReadiness(Math.min(100, currentReadiness + 3));
    } else {
      // Small deficit adjustment
      onUpdateReadiness(Math.max(30, currentReadiness - 1));
    }

    setSubmitsCount(prev => ({ ...prev, [mcIndex]: true }));
  };

  // Skip or go to next MCQ
  const handleMcNext = () => {
    if (mcIndex + 1 < CALCULUS_QUESTIONS.length) {
      setMcIndex(prev => prev + 1);
      setSelectedOpt("");
    } else {
      setMcCompleted(true);
    }
  };

  // Reset MCQ session
  const resetMcQuiz = () => {
    setMcIndex(0);
    setSelectedOpt("");
    setMcCompleted(false);
    setMcScore(0);
    setSubmitsCount({});
    setGradedAnswers({});
    setSecondsRemaining(300);
  };

  // Real-time AI Short Answer Grading via server proxy route (Document 6/1 integrations)
  const handleShortAnswerCritiqueSubmit = async () => {
    if (!shortAnswerText.trim()) return;
    setShortAnswerLoading(true);
    setShortAnswerFeedback("");

    try {
      const messagesPayload = [
        {
          role: "user",
          content: `Grade this short answer calculus critique. Prompt: "Explain the fundamental difference between conditional and absolute convergence."\nStudent's Answer: "${shortAnswerText}"\nIdentify accuracy, provide direct critique mathematically, and evaluate a simulated score (e.g. 8/10). Keep it elegant and brief.`
        }
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesPayload })
      });
      
      const data = await res.json();
      if (data.error) {
        setShortAnswerFeedback(`Neural Core connection error: ${data.error}`);
      } else {
        setShortAnswerFeedback(data.content);
        onUpdateReadiness(Math.min(100, currentReadiness + 5)); // Reward with placement bonus!
      }
    } catch (err: any) {
      setShortAnswerFeedback("Core gateway is temporarily un-syncable. Please verify secret tokens.");
    } finally {
      setShortAnswerLoading(false);
    }
  };

  // Technical coding algorithm grader (Euler integrations)
  const handleTechChallengeSubmit = async () => {
    if (!techSolution.trim()) return;
    setTechLoading(true);
    setTechFeedback("");

    try {
      const messagesPayload = [
        {
          role: "user",
          content: `Verify and critique this TypeScript mathematical Euler integration code.\nStudent code:\n${techSolution}\nReview limits, bounds, performance, and structure. Score out of 10.`
        }
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesPayload })
      });
      
      const data = await res.json();
      if (data.error) {
        setTechFeedback(`Tech calibration offline: ${data.error}`);
      } else {
        setTechFeedback(data.content);
        onUpdateReadiness(Math.min(100, currentReadiness + 6));
      }
    } catch (err) {
      setTechFeedback("Gateway offline.");
    } finally {
      setTechLoading(false);
    }
  };

  // SVG Gauge calculations matching Document 1 sidebar readiness gauge
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const gaugeOffset = circ - (currentReadiness / 100) * circ;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Diagnostic Suite</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Placement Quiz Suite</h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Measure knowledge margins under timed pressure grids. Engage in multi-format evaluation loops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Column: Active Quiz Module Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active module select pills */}
          <div className="flex flex-wrap gap-2.5 p-1 rounded-xl bg-neutral-900/60 border border-neutral-850">
            <button 
              onClick={() => setActiveModule('multiple-choice')}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-mono rounded-lg cursor-pointer transition-all ${
                activeModule === 'multiple-choice' 
                  ? "bg-amber-500 text-neutral-950 font-bold" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              4-in-1 Multiple Choice
            </button>
            <button 
              onClick={() => {
                setActiveModule('flashcards');
                setIsFlipped(false);
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-mono rounded-lg cursor-pointer transition-all ${
                activeModule === 'flashcards' 
                  ? "bg-amber-500 text-neutral-950 font-bold" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Flashcard Mastery
            </button>
            <button 
              onClick={() => setActiveModule('short-answer')}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-mono rounded-lg cursor-pointer transition-all ${
                activeModule === 'short-answer' 
                  ? "bg-amber-500 text-neutral-950 font-bold" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Short Answer Critique
            </button>
            <button 
              onClick={() => setActiveModule('technical')}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-mono rounded-lg cursor-pointer transition-all ${
                activeModule === 'technical' 
                  ? "bg-amber-500 text-neutral-950 font-bold" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Technical Challenge
            </button>
          </div>

          {/* Module 1: MULTIPLE CHOICE */}
          {activeModule === 'multiple-choice' && (
            <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-6 space-y-6">
              
              {!mcCompleted ? (
                <>
                  {/* Progress Header */}
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold uppercase block">Advanced Calculus Diagnostic</span>
                      <span className="text-neutral-400 text-xs mt-0.5 block font-light">Target concept coordinates : Series & Limits</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-850">
                      <Clock className="w-3.5 h-3.5 text-neutral-500 animate-pulse" />
                      <span className="text-xs font-mono text-white font-bold">{formatTime(secondsRemaining)}</span>
                    </div>
                  </div>

                  {/* Active Question Box */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Question {mcIndex + 1} of {CALCULUS_QUESTIONS.length}</span>
                    <h3 className="text-base text-white font-medium tracking-tight">
                      {CALCULUS_QUESTIONS[mcIndex].question}
                    </h3>
                  </div>

                  {/* Radiolist Options */}
                  <div className="space-y-3">
                    {CALCULUS_QUESTIONS[mcIndex].options?.map((opt) => {
                      const isGraded = submitsCount[mcIndex];
                      const grade = gradedAnswers[mcIndex];
                      const isOptCorrect = opt === CALCULUS_QUESTIONS[mcIndex].correctAnswer;
                      const isOptSelected = selectedOpt === opt;

                      let borderStyle = "border-neutral-850 hover:border-neutral-700 bg-neutral-950/20";
                      if (isOptSelected) borderStyle = "border-amber-400 bg-amber-500/5";
                      if (isGraded) {
                        if (isOptCorrect) borderStyle = "border-emerald-500/50 bg-emerald-500/5 text-emerald-300";
                        else if (isOptSelected) borderStyle = "border-red-500/50 bg-red-500/5 text-red-300";
                      }

                      return (
                        <label 
                          key={opt}
                          className={`p-3.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-all leading-tight text-xs ${borderStyle}`}
                        >
                          <input 
                            type="radio" 
                            name="mc-selector"
                            disabled={isGraded}
                            value={opt}
                            checked={selectedOpt === opt}
                            onChange={(e) => setSelectedOpt(e.target.value)}
                            className="accent-amber-400 bg-neutral-950 border-neutral-800 shrink-0"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {submitsCount[mcIndex] && (
                    <div className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-lg space-y-1.5 text-xs">
                      <span className="font-mono text-neutral-400 uppercase tracking-wider block">Diagnostics Explanation Coordinates:</span>
                      <p className="text-neutral-350 leading-relaxed font-light">
                        {CALCULUS_QUESTIONS[mcIndex].explanation}
                      </p>
                    </div>
                  )}

                  {/* Primary submit action button */}
                  <div className="pt-2 flex justify-end gap-3 text-xs">
                    {!submitsCount[mcIndex] ? (
                      <button 
                        onClick={handleMcSubmit}
                        disabled={!selectedOpt}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold font-mono uppercase tracking-wider rounded-lg cursor-pointer"
                      >
                        Submit Coefficient
                      </button>
                    ) : (
                      <button 
                        onClick={handleMcNext}
                        className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-bold font-mono uppercase tracking-wider rounded-lg hover:border-neutral-700 cursor-pointer flex items-center gap-1"
                      >
                        Proceed coordinate
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-5">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mx-auto border border-amber-500/20">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">Diagnostics Completed Successfully</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light leading-relaxed">
                      Your completed metrics have been cataloged into the core student trajectory. Total Score: <span className="text-white font-semibold">{mcScore} / {CALCULUS_QUESTIONS.length} Correct</span>.
                    </p>
                  </div>
                  <button 
                    onClick={resetMcQuiz}
                    className="px-4 py-2 border border-neutral-850 bg-neutral-950 hover:bg-neutral-900 text-xs font-mono text-amber-400 rounded-lg cursor-pointer"
                  >
                    Repeat Diagnostic Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Module 2: FLASHCARDS */}
          {activeModule === 'flashcards' && (
            <div className="space-y-6">
              {/* Card Container with custom flip CSS simulation */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="bg-neutral-900/30 border border-neutral-850 rounded-2xl p-12 min-h-64 flex flex-col justify-between items-center text-center cursor-pointer hover:border-amber-400/20 active:scale-[0.99] transition-all relative overflow-hidden"
              >
                {/* Overlay card status indicators */}
                <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest uppercase text-neutral-500">
                  FLASHCARD INDICES {fcIndex + 1} / {FLASHCARDS.length}
                </span>

                <span className="absolute top-4 right-4 text-[9px] font-mono uppercase text-amber-400">
                  {isFlipped ? "ANSWER VIEW ACTIVE" : "CONCEPT DEFINITION"}
                </span>

                <div className="my-auto max-w-lg space-y-4">
                  {isFlipped ? (
                    <p className="text-lg font-light text-amber-200 leading-relaxed font-sans">
                      {FLASHCARDS[fcIndex].correctAnswer}
                    </p>
                  ) : (
                    <p className="text-xl font-medium text-white leading-relaxed font-sans tracking-tight">
                      {FLASHCARDS[fcIndex].question}
                    </p>
                  )}
                </div>

                {isFlipped && (
                  <div className="p-3 bg-neutral-950 rounded-lg text-xs leading-normal font-light text-neutral-400 max-w-md">
                    <span className="text-[9px] font-mono uppercase text-amber-400 block pb-1">Telemetry note:</span>
                    {FLASHCARDS[fcIndex].explanation}
                  </div>
                )}

                <span className="text-[10px] font-mono text-neutral-500 uppercase mt-4">
                  Click on canvas to trigger dynamic flip card
                </span>
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center">
                <button
                  disabled={fcIndex === 0}
                  onClick={() => {
                    setFcIndex(prev => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 disabled:opacity-40 text-xs font-mono text-white rounded-lg cursor-pointer"
                >
                  ◀ previous card
                </button>
                <button
                  disabled={fcIndex + 1 === FLASHCARDS.length}
                  onClick={() => {
                    setFcIndex(prev => Math.min(FLASHCARDS.length - 1, prev + 1));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 disabled:opacity-40 text-xs font-mono text-white rounded-lg cursor-pointer"
                >
                  next card ▶
                </button>
              </div>
            </div>
          )}

          {/* Module 3: SHORT-ANSWER CRITIQUE */}
          {activeModule === 'short-answer' && (
            <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-6 space-y-6">
              <div className="border-b border-neutral-900 pb-4 space-y-1">
                <h3 className="text-base font-semibold text-white">Mathematical Analytic Short Critique</h3>
                <p className="text-xs text-neutral-400 font-light">Input physical conceptual proofs. Aegis Core AI grades parameters automatically.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-lg text-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">Critique Prompt Challenge:</span>
                  <p className="text-white text-sm font-medium tracking-tight">
                    "Explain the fundamental difference between conditional and absolute convergence of infinite series."
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">Your Formulaic Proof Formulation</label>
                  <textarea
                    rows={4}
                    value={shortAnswerText}
                    onChange={(e) => setShortAnswerText(e.target.value)}
                    placeholder="Provide an explanation... (e.g. Absolute convergence maintains limit summation of positive absolute bounds, whereas conditional convergence alters when elements oscillate sign values)"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleShortAnswerCritiqueSubmit}
                  disabled={shortAnswerLoading || !shortAnswerText.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-450 disabled:opacity-50 text-neutral-950 text-xs font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {shortAnswerLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {shortAnswerLoading ? "DEPLOYING TO CORE FOR GRADING..." : "SUBMIT COGNITIVE PROOF CRITIQUE"}
                </button>
              </div>

              {shortAnswerFeedback && (
                <div className="p-5 bg-neutral-950 border border-amber-500/10 rounded-xl text-xs space-y-3">
                  <span className="font-mono text-amber-400 uppercase tracking-wider block">Neural Core feedback report:</span>
                  <div className="text-neutral-300 leading-relaxed font-light prose prose-invert max-w-none text-xs">
                    {shortAnswerFeedback.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Module 4: TECHNICAL CHALLENGE */}
          {activeModule === 'technical' && (
            <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-6 space-y-6">
              <div className="border-b border-neutral-900 pb-4 space-y-1">
                <h3 className="text-base font-semibold text-white">Technical Integrations Challenge</h3>
                <p className="text-xs text-neutral-400 font-light">Code algorithms for continuous evaluation coordinates.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-lg text-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">Coding Objective:</span>
                  <p className="text-white text-sm font-medium">
                    "Write a TypeScript function simulating Euler integration on a basic linear differential system dy/dx = y for n steps."
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">Solution Editor Panel</label>
                  <textarea
                    rows={6}
                    value={techSolution}
                    onChange={(e) => setTechSolution(e.target.value)}
                    placeholder="function eulerIntegration(y0: number, steps: number, h: number) { ... }"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-amber-200 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleTechChallengeSubmit}
                  disabled={techLoading || !techSolution.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-450 disabled:opacity-50 text-neutral-950 text-xs font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {techLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {techLoading ? "COMPILES AND RUNNING DIAGS..." : "EXECUTE METHODOLOGY EVALUATION"}
                </button>
              </div>

              {techFeedback && (
                <div className="p-5 bg-neutral-950 border border-indigo-500/10 rounded-xl text-xs space-y-3">
                  <span className="font-mono text-indigo-400 uppercase tracking-wider block">Euler system verification telemetry:</span>
                  <div className="text-neutral-300 leading-relaxed font-light prose prose-invert max-w-none text-xs">
                    {techFeedback.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Column: Dynamic Gauges Sidebar */}
        <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-850 p-6 rounded-xl flex flex-col justify-between space-y-6">
          
          <div className="border-b border-neutral-900 pb-4">
            <h3 className="text-sm font-semibold text-white font-mono">PL_READINESS_COILS</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-light">Scholastic placement index metrics</p>
          </div>

          {/* SVG Circular Readiness Gauge (Document 1 sidebar gauge replica) */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative flex justify-center items-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-neutral-850 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="fill-none transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={gaugeOffset}
                  strokeLinecap="round"
                  stroke="#f59e0b"
                />
              </svg>
              
              <div className="absolute text-center">
                <span className="text-3xl font-sans font-bold text-white block -mb-0.5">
                  {currentReadiness}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 block">
                  readiness
                </span>
              </div>
            </div>

            <div className="mt-4 text-center space-y-1">
              <span className="text-xs font-semibold text-white block">
                {currentReadiness >= 85 ? "Placement Level: Advanced Placement (CO-4)" : "Placement Level: Standard Core"}
              </span>
              <p className="text-[11px] text-neutral-400 font-light max-w-xs leading-normal">
                Based on active derivatives, convergence validations, and Euler critiques. Score above 85 to qualify for sovereign credentials.
              </p>
            </div>
          </div>

          {/* Core session metadata list */}
          <div className="space-y-3 pt-4 border-t border-neutral-905 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>MC_SCORE (LAST SESSION)</span>
              <span className="text-white">{mcScore} pts</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>ACTIVE COILS PULSE</span>
              <span className="text-emerald-400 animate-pulse">OK_ONLINE</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>COGNITIVE ACCELERANT</span>
              <span className="text-amber-400">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
