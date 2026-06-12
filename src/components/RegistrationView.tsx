import React, { useState } from "react";
import { Shield, Mail, Key, User, Terminal, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Tilt3D } from "./Tilt3D";

interface RegistrationViewProps {
  onRegisterSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToPromo: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToPromo,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please supply a valid academic coordinate (email address).");
      return;
    }
    if (password.length < 6) {
      setError("Access Key must be at least 6 characters for security protocols.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Access Key confirmation does not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("aegis_token", data.token);
      onRegisterSuccess(email);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,140,80,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-10 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Shield className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400 block">System Secure</span>
            <span className="font-sans font-bold tracking-tight text-white block -mt-1 text-lg">AEGIS ACADEMICS</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900/40 text-xs font-mono hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </button>
          <button
            onClick={onNavigateToPromo}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900/40 text-xs font-mono hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            PUBLIC PROMO
          </button>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto my-auto z-10">
        <Tilt3D maxTilt={5} scale={1.01}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl relative shadow-2xl shadow-black/80"
          >
            <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 font-mono text-[10px] uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                New Scholar Registration
              </div>
              <h1 className="text-3xl font-sans font-medium tracking-tight text-white">Create Account</h1>
              <p className="text-xs text-neutral-400 mt-2 font-mono">
                Initialize your sovereign academic identity.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-300 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping inline-block" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-neutral-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all font-sans"
                  placeholder="Scholar Full Name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-neutral-500" />
                  Academic Coordinate
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all font-mono"
                  placeholder="name@university.edu"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-neutral-500" />
                  Command Access Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all font-mono"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-neutral-500" />
                  Confirm Access Key
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all font-mono"
                  placeholder="Re-enter access key"
                  required
                />
              </div>

              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isLoading}
                className="w-full relative group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-[1px] shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-neutral-950 group-hover:bg-transparent text-white group-hover:text-neutral-950 font-semibold text-sm py-3.5 rounded-[11px] transition-all flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 transition-all" />
                      <span>Initialize Command Center</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800" /></div>
              <span className="relative bg-neutral-900/90 text-neutral-500 px-3 text-[10px] font-mono tracking-widest uppercase">federated gate</span>
            </div>

            <button
              onClick={onNavigateToLogin}
              className="w-full py-3 px-4 border border-neutral-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-neutral-300 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Already have credentials? Sign In
            </button>
          </motion.div>
        </Tilt3D>

        <div className="mt-6 flex justify-between items-center px-4 text-[9px] font-mono text-neutral-600">
          <span>PORT :: 3000 // STATUS ACTIVE</span>
          <span className="text-amber-400/40 animate-pulse">● SECURE SYNC CHANNEL</span>
        </div>
      </div>

      <div className="text-center z-10">
        <p className="text-[10px] font-mono text-neutral-500">
          Aegis Academics Core &copy; {new Date().getFullYear()} – Authorized Scholastic Users Only.
        </p>
      </div>
    </div>
  );
};
