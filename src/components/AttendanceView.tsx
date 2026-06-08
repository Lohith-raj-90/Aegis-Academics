import React, { useState } from "react";
import { AlertCircle, CheckCircle, Shield, Info, InfoIcon } from "lucide-react";

interface AttendanceViewProps {
  currentAttendance: number;
  onUpdateAttendance: (newPct: number) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentAttendance,
  onUpdateAttendance
}) => {
  // Configurable base parameters
  const [totalClasses, setTotalClasses] = useState(60);
  const [attendedClasses, setAttendedClasses] = useState(50);
  const [classesToSkip, setClassesToSkip] = useState(2);
  const [targetRequired, setTargetRequired] = useState(80);

  // Calculations
  const calculatedCurrent = Math.round((attendedClasses / totalClasses) * 100);
  
  // Forecasted calculation
  // Skipping classes maintains current totalClasses, but reduces attendedClasses
  const remainingAttendedForecasted = Math.max(0, attendedClasses - classesToSkip);
  const forecastedAttendance = Math.round((remainingAttendedForecasted / totalClasses) * 100);

  // Sync back state
  React.useEffect(() => {
    onUpdateAttendance(forecastedAttendance);
  }, [forecastedAttendance]);

  // SVG parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const currentOffset = circumference - (calculatedCurrent / 100) * circumference;
  const forecastOffset = circumference - (forecastedAttendance / 100) * circumference;

  const isSafe = forecastedAttendance >= targetRequired;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title */}
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Aegis AI Analytics</span>
        <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Attendance Forecaster</h1>
        <p className="text-neutral-400 text-sm mt-0.5 font-light">
          Simulate skip frequencies against academic requirements to verify your exam eligibility status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parameters Sliders */}
        <div className="lg:col-span-7 bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-6 space-y-6">
          <div className="border-b border-neutral-900 pb-4">
            <h3 className="text-base font-semibold text-white">Forecaster Simulation Parameters</h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">Tweak variables to adjust cognitive forecasting models</p>
          </div>

          <div className="space-y-5">
            {/* Slider 1: Checked Attended classes */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-300">Total Attended (To Date)</span>
                <span className="text-amber-400 font-bold">{attendedClasses} / {totalClasses} classes</span>
              </div>
              <input
                type="range"
                min="30"
                max={totalClasses}
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-950 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 2: Hypothetical Skips */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-300">Classes to Skip (Hypothetical Simulator)</span>
                <span className="text-red-400 font-bold">-{classesToSkip} sessions</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={classesToSkip}
                onChange={(e) => setClassesToSkip(parseInt(e.target.value))}
                className="w-full accent-red-500 bg-neutral-950 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 3: Target required */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-300">Target Clearance Requirement Threshold</span>
                <span className="text-indigo-400 font-bold">{targetRequired}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="90"
                value={targetRequired}
                onChange={(e) => setTargetRequired(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-neutral-950 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Core Warning box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
            isSafe 
              ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300" 
              : "bg-red-950/20 border-red-900/60 text-red-300"
          }`}>
            {isSafe ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold font-mono tracking-wider uppercase">
                {isSafe ? "TARGET CLEARED – SAFE STATUS" : "CLEARANCE EXCEEDED – CRITICAL DEFICIT"}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {isSafe 
                  ? `Your forecasted attendance coefficient of ${forecastedAttendance}% remains above the mandated scholastic threshold of ${targetRequired}%. This node is cleared for examinations.` 
                  : `WARNING! Skipping ${classesToSkip} classes will drop active clearance density to ${forecastedAttendance}%, breaching the required ${targetRequired}%. This node risks an examination block.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Radial Projection Chart */}
        <div className="lg:col-span-5 bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          
          <div className="border-b border-neutral-900 pb-4">
            <h3 className="text-base font-semibold text-white">Radial Forecast Projection</h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">Vector representation of active scholastic attendance limits</p>
          </div>

          {/* SVG Circular Graph */}
          <div className="my-8 flex justify-center items-center relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Slate Outer circle track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-neutral-850 fill-none"
                strokeWidth="10"
              />
              
              {/* Forecasted active circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="fill-none transition-all duration-500"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={forecastOffset}
                strokeLinecap="round"
                stroke={isSafe ? "#f59e0b" : "#ef4444"}
              />
            </svg>

            {/* Inner Percentage Display */}
            <div className="absolute text-center">
              <span className="text-4xl font-sans font-bold text-white block -mb-1">
                {forecastedAttendance}%
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block pb-1">
                predicted
              </span>
              <span className={`inline-block px-1.5 py-0.5 text-[8px] font-mono rounded ${
                isSafe ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>
                {isSafe ? "CLEARED" : "WARNING"}
              </span>
            </div>
          </div>

          {/* Detailed breakdowns */}
          <div className="space-y-3 pt-4 border-t border-neutral-905 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>CURRENT STATE (UNSIMULATED)</span>
              <span className="text-white font-semibold">{calculatedCurrent}%</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>PROJECTED RISK DEGREE</span>
              <span className={`font-semibold ${isSafe ? "text-emerald-400" : "text-red-400"}`}>
                {calculatedCurrent - forecastedAttendance}% Drop
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>CLEARANCE STATUS CONSTRAINTS</span>
              <span className="text-amber-400">{isSafe ? "AUTHORIZED" : "HOLD_LOCK"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
