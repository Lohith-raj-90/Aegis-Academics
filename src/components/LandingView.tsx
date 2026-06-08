import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  Calendar, 
  Award, 
  Database, 
  Users, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Phone, 
  Github, 
  Linkedin,
  Cpu,
  Bookmark
} from "lucide-react";
import { motion } from "motion/react";
import { QuantumCore3D } from "./QuantumCore3D";
import { Tilt3D } from "./Tilt3D";

interface LandingViewProps {
  onBackToLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onBackToLogin }) => {
  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans min-h-screen relative overflow-hidden selection:bg-amber-400 selection:text-neutral-900">
      
      {/* Ambient background vector layout noise */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,172,67,0.045)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Decorative Matrix Grid */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Global Header */}
      <header className="border-b border-neutral-900/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 py-4 px-8 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center p-0.5">
            <GraduationCap className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-mono text-[9px] tracking-[0.2em] font-bold text-amber-500 leading-none block uppercase">Lohith.Labs</span>
            <span className="font-sans font-semibold tracking-tight text-white text-sm">AEGIS ACADEMICS</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <button
            onClick={() => {
              document.getElementById("about-project")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer hidden md:block"
          >
            // WHAT_IS_PROJECT
          </button>
          <button
            onClick={() => {
              document.getElementById("why-necessary")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer hidden md:block"
          >
            // COGNITIVE_NEED
          </button>
          <button
            onClick={() => {
              document.getElementById("developer")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            // THE_DEVELOPER
          </button>
          <button
            onClick={onBackToLogin}
            className="px-4 py-2 border border-neutral-800 hover:border-amber-400/30 hover:bg-amber-400/5 text-amber-400 text-xs rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider"
          >
            Access Core
          </button>
        </div>
      </header>

      {/* Interactive Hero Showcase */}
      <section className="relative px-6 pt-20 pb-16 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm text-neutral-300 font-mono text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Sovereign Student Identity Calibrated
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.12]"
            >
              High-Fidelity <span className="text-amber-400 font-normal">Academic</span> Unified Coordinate Workspace.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-2xl"
            >
              A premium, comprehensive interface designed to elevate student metrics, simulate skipped-class attendance risk factors, index core library knowledge, and deliver server-side AI explanations with stunning 3D interaction.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <button
                onClick={onBackToLogin}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
              >
                Access Command Center
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("about-project");
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/40 text-neutral-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Explore Specifications
              </button>
            </motion.div>
          </div>

          {/* Majestic Hero 3D interactive widget */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <Tilt3D maxTilt={6} scale={1.02} className="w-full max-w-[340px]">
              <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800/80 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">interactive manifold</span>
                    <h3 className="text-sm font-sans font-semibold text-white">Quantum 3D Core</h3>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[8px] font-mono text-neutral-400">
                    SENSORY_ACTIVE
                  </div>
                </div>

                {/* Actual draggable, clickable 3D structure reflecting the planets and polyhedrons */}
                <div className="flex justify-center py-2 bg-neutral-950/40 rounded-xl border border-neutral-850/80">
                  <QuantumCore3D size={190} />
                </div>

                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">drag to rotate coordinates</p>
                  <p className="text-[9px] font-mono text-neutral-500">Supports double orbit layers & gold facet shades</p>
                </div>
              </div>
            </Tilt3D>
          </div>

        </div>
      </section>

      {/* "What is Project" Section */}
      <section id="about-project" className="border-t border-neutral-900 bg-neutral-900/10 py-20 px-6 relative z-10 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-amber-500 uppercase tracking-[0.25em] text-xs font-bold block">// PRIMARY_METRIC</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              What is <span className="text-amber-400">Aegis Academics</span>?
            </h2>
            <div className="w-12 h-0.5 bg-amber-400/50 mx-auto rounded mt-2" />
            <p className="text-neutral-400 leading-relaxed font-light text-sm max-w-xl mx-auto pt-2">
              It is a secure, interactive unified environment mapping essential academic nodes into visual metrics to bypass traditional administrative stress and maximize preparation velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Tilt3D maxTilt={8} className="h-full">
              <div className="bg-neutral-900/30 border border-neutral-800/80 hover:border-amber-500/20 p-8 rounded-2xl flex flex-col justify-between h-full transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">Royal Performance Core</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light">
                    Displays high-velocity metrics tracking readiness coefficients, weekly task schedules, and study frequency. Integrates interactive math indicators into a responsive 3D viewport.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 text-[10px] font-mono text-neutral-500">
                  REF = MODULE_DASHBOARD
                </div>
              </div>
            </Tilt3D>

            <Tilt3D maxTilt={8} className="h-full">
              <div className="bg-neutral-900/30 border border-neutral-800/80 hover:border-amber-500/20 p-8 rounded-2xl flex flex-col justify-between h-full transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">Hypothetical Forecaster</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light">
                    Equipped with diagnostic simulated sliders to measure missed classes and study goals, predicting precise clearance clearances so you never risk eligibility boundaries.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 text-[10px] font-mono text-neutral-500">
                  REF = COMPUTE_ATTENDANCE
                </div>
              </div>
            </Tilt3D>

            <Tilt3D maxTilt={8} className="h-full">
              <div className="bg-neutral-900/30 border border-neutral-800/80 hover:border-amber-500/20 p-8 rounded-2xl flex flex-col justify-between h-full transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors">Sovereign Tutor Intel</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light">
                    Powered by secure server-side APIs utilizing premium Gemini configurations to answer specialized queries, explain calculus proofs, and parse files in real-time.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 text-[10px] font-mono text-neutral-500">
                  REF = NEURAL_ASSISTANT
                </div>
              </div>
            </Tilt3D>

          </div>
        </div>
      </section>

      {/* "Why Necessary" Section */}
      <section id="why-necessary" className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="font-mono text-purple-400 uppercase tracking-[0.25em] text-xs font-bold block">// SYSTEM_ANALYSIS</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Why is this framework <span className="text-amber-400 font-normal">critically necessary</span>?
            </h2>
            <div className="w-16 h-0.5 bg-amber-400/50 rounded" />
            
            <p className="text-neutral-400 leading-relaxed font-light text-sm">
              Traditional academic workflows operate in isolation: notes are decoupled from calendars, mock exams lack responsive analytics, and tracking exam clearance thresholds is usually a matter of guessing. Aegis unites coordinate equations into a single screen of intelligence.
            </p>

            <div className="space-y-4 pt-2">
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">Clearance Eligibility Defense</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Simulate exact attendance deficits using local models, ensuring your coordinates always clear standard university thresholds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">Calibrated Memory Vaults</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Index specific topics, sync external technical syllabus sheets globally, and manage knowledge parameters systematically.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">Interactive Dynamic Math models</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Replaces static graphics by generating live-rendered 20-sided geodesic spheres and double orbit lines directly on standard HTML canvasses.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Trajectory Index */}
          <Tilt3D maxTilt={4} scale={1.015} className="w-full">
            <div className="bg-neutral-900/45 border border-neutral-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
              
              <div className="flex-1 w-full space-y-6">
                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                  <span className="bullet w-2.5 h-2.5 rounded bg-amber-400 block animate-pulse" />
                  COGNITIVE_VELOCITY_PARAMS
                </h3>
                
                <div className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>ATTENDANCE_STRETCH_RATIO</span>
                      <span className="text-amber-400">84% (CLEAR)</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                      <div className="bg-amber-400 h-full rounded" style={{ width: "84%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>PREDICTIVE_READINESS</span>
                      <span className="text-purple-400">86% FACTORS</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                      <div className="bg-purple-500 h-full rounded" style={{ width: "86%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>SYNCED_SYLLABUS_INDEX</span>
                      <span className="text-indigo-400">100% SECURE</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second 3D canvas rendering the charcoal onyx polyhedron with purple stars */}
              <div className="shrink-0 flex items-center justify-center p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-850">
                <QuantumCore3D size={160} />
              </div>
            </div>
          </Tilt3D>

        </div>
      </section>

      {/* "The Developer" Section - LOcomponent */}
      <section id="developer" className="border-t border-neutral-900 bg-neutral-900/10 py-20 px-6 relative z-10 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="font-mono text-amber-500 uppercase tracking-[0.25em] text-xs font-bold block">// TEAM_LEAD</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Meet the <span className="text-amber-400">Sovereign Developer</span>
            </h2>
            <div className="w-12 h-0.5 bg-amber-400/50 mx-auto rounded" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Tilt3D maxTilt={4} scale={1.015}>
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient(ellipse_at_top_right,rgba(224,172,67,0.06)_0%,transparent_70%) pointer-events-none" />
                
                {/* Developer Profile Avatar Visual Placeholder */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-500 via-indigo-600 to-amber-300 rounded-full flex items-center justify-center border border-neutral-800 relative z-10 p-1 flex-shrink-0">
                  <div className="w-full h-full bg-neutral-950 rounded-full flex flex-col items-center justify-center text-white font-mono text-3xl font-bold">
                    LRC
                  </div>
                </div>

                <div className="space-y-4 flex-1 text-center lg:text-left">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white font-sans">Lohith R C</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 mt-1 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Computer Science & Engineering Scholar
                    </span>
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    Lohith R C is an innovative Computer Science and Engineering student studying at the prestigious <span className="text-white font-medium">Kalpataru Institute of Technology, Tiptur</span>. Combining specialized knowledge in computer algorithms, fullstack architecture, and 3D computer graphics equations, Lohith designed Aegis Academics to deliver a unified, premium command dashboard for modern students global coordinate management.
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400 justify-center lg:justify-start">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-950/80 rounded-lg border border-neutral-850">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      Tiptur, KIT Lab Node
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-950/80 rounded-lg border border-neutral-850">
                      <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                      Computer Science & Eng.
                    </div>
                  </div>
                </div>

              </div>
            </Tilt3D>
          </div>

        </div>
      </section>

      {/* "Contact Node Gateway" Section */}
      <section id="contact" className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="font-mono text-indigo-400 uppercase tracking-[0.25em] text-xs font-bold block">// DIRECT_PORT_COORDS</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Connect with <span className="text-amber-400">Lohith R C</span></h2>
            <p className="text-neutral-450 leading-relaxed font-light text-sm max-w-lg mx-auto">
              Ready to collaborate, request customization parameters, or integrate Aegis Academics into local college grids? Access the coordinate channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            
            {/* Contact Card 1 */}
            <Tilt3D maxTilt={10} className="w-full">
              <a 
                href="mailto:lohithraj9090@gmail.com" 
                className="block bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/25 p-6 rounded-2xl space-y-4 group transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono text-amber-400/80 uppercase">Primary Email</span>
                </div>
                <div>
                  <h4 className="text-white text-base font-semibold group-hover:text-amber-400 transition-colors">lohithraj9090@gmail.com</h4>
                  <p className="text-neutral-400 text-xs mt-1 font-light">Send direct coordinates for high-priority inquiries or integrations.</p>
                </div>
              </a>
            </Tilt3D>

            {/* Contact Card 2 */}
            <Tilt3D maxTilt={10} className="w-full">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="block bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-indigo-500/25 p-6 rounded-2xl space-y-4 group transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Github className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400/80 uppercase">Source Endpoint</span>
                </div>
                <div>
                  <h4 className="text-white text-base font-semibold group-hover:text-indigo-400 transition-colors">Lohith R C Github</h4>
                  <p className="text-neutral-400 text-xs mt-1 font-light">Inspect active code frameworks, math tools, and visual structures.</p>
                </div>
              </a>
            </Tilt3D>

          </div>

          <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-xl text-center space-y-4 relative overflow-hidden max-w-xl mx-auto">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <h3 className="text-white font-medium text-sm">Kalpataru Institute of Technology Affiliate Node</h3>
            <p className="text-neutral-450 text-xs leading-relaxed max-w-md mx-auto">
              Kalpataru Institute of Technology (KIT), Tiptur (Department of Computer Science and Engineering). Calibrating scholastic excellence and predictive engineering systems.
            </p>
          </div>

        </div>
      </section>

      {/* Majestic CTA footer back wrapper section */}
      <section className="bg-radial-gradient(circle,rgba(224,172,67,0.02)_0%,transparent_100%) py-20 border-t border-neutral-900 text-center space-y-6">
        <h2 className="text-3xl font-light tracking-tight text-white">Upgrade Your Study Velocity Immediately</h2>
        <p className="text-neutral-450 text-xs max-w-sm mx-auto leading-relaxed font-mono">
          NODE_STATUS = ONLINE_SECURED
        </p>
        <button
          onClick={onBackToLogin}
          className="px-8 py-4 bg-white text-neutral-950 hover:bg-neutral-250 transition-all rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-white/5"
        >
          Enter Command Center
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900/85 py-12 text-center text-xs text-neutral-500 font-mono relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 Aegis Academics Core. Engineered by student scholar Lohith R C under KIT Tiptur.</p>
          <p className="text-neutral-600 text-[10px]">Secure, 100% Client-Authoritative Cryptographic Pipeline Proxy Nodes Active.</p>
        </div>
      </footer>

    </div>
  );
};
