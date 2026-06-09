import React, { useState } from "react";
import { Search, Database, HardDrive, RefreshCw, Eye, CheckCircle, Copy } from "lucide-react";
import { LibraryResource } from "../types";

interface LibraryViewProps {
  resources: LibraryResource[];
  onToggleSync: (id: string) => void;
  activeHighlightKeyword?: string | null;
  highlightOpacity?: number;
  onClearHighlightKeyword?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  onToggleSync,
  activeHighlightKeyword,
  highlightOpacity,
  onClearHighlightKeyword
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(resources[0] || null);

  const isHighlightedMatch = (res: LibraryResource, keyword: string | null | undefined) => {
    if (!keyword) return false;
    const key = keyword.toLowerCase();
    
    if (key === "calculus") {
      return res.category === "Mathematics" || res.title.toLowerCase().includes("calculus") || res.title.toLowerCase().includes("formula");
    }
    if (key === "quantum") {
      return res.category === "Physics" || res.title.toLowerCase().includes("quantum") || res.title.toLowerCase().includes("circuit");
    }
    if (key === "automata") {
      return res.category === "Computer Science" || res.title.toLowerCase().includes("automata") || res.title.toLowerCase().includes("turing");
    }
    if (key === "attendance") {
      return res.title.toLowerCase().includes("compliance") || res.abstract.toLowerCase().includes("attendance") || res.abstract.toLowerCase().includes("eligibility") || res.title.toLowerCase().includes("ledger");
    }
    return false;
  };

  // Filter matching queries
  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const syncedResources = resources.filter(r => r.synced);
  const syncedCount = syncedResources.length;
  
  // Calculate size in megabytes safely
  const calculateTotalSize = () => {
    let sizeMb = 0;
    syncedResources.forEach(r => {
      const parsedSize = parseFloat(r.fileSize.split(" ")[0]);
      if (!isNaN(parsedSize)) {
        sizeMb += parsedSize;
      }
    });
    return Math.round(sizeMb * 10) / 10;
  };

  const currentSizeMb = calculateTotalSize();
  const maxCapacityMb = 40.0;
  const capacityPct = Math.round((currentSizeMb / maxCapacityMb) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Resource Hub</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Modern Academic Library</h1>
          <p className="text-neutral-400 text-sm mt-0.5 font-light">
            Index advanced reference formulations, quantum files, analytics assets, and activate Aegis sync telemetry.
          </p>
        </div>

        {/* Sync Status Header */}
        <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-850 p-2.5 rounded-lg text-xs font-mono">
          <Database className="w-4 h-4 text-amber-400" />
          <div className="text-left leading-none">
            <span className="text-[9px] uppercase text-neutral-500 block">CORE SYNC PULSE</span>
            <span className="text-white font-semibold">COGNITIVE_SAFE</span>
          </div>
        </div>
      </div>

      {/* Stats Bento Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vault Capacity stats */}
        <div className="bg-neutral-900/30 border border-neutral-850 p-5 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Neural Vault Capacity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-sans text-white">{currentSizeMb} MB</span>
              <span className="text-xs font-mono text-neutral-500">/ {maxCapacityMb} MB Limit</span>
            </div>
            
            <div className="w-full bg-neutral-950 h-1.5 rounded overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded transition-all duration-500" 
                style={{ width: `${Math.min(100, capacityPct)}%` }} 
              />
            </div>
          </div>
          <div className="w-12 h-12 bg-neutral-950 rounded-lg flex items-center justify-center text-amber-400/90 border border-neutral-850 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>

        {/* Knowledge Absorbed statistical cards */}
        <div className="bg-neutral-900/30 border border-neutral-850 p-5 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Synced Indices</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-sans text-white">{syncedCount} / {resources.length}</span>
              <span className="text-xs font-mono text-amber-400">UN LOCKED INDICES</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-light">Memory retrieval latency optimized at zero bounds.</p>
          </div>
          <div className="w-12 h-12 bg-neutral-950 rounded-lg flex items-center justify-center text-indigo-400/90 border border-neutral-850 shrink-0">
            <CheckCircle className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Search & Indices Table */}
        <div className="lg:col-span-7 bg-neutral-900/30 border border-neutral-850 rounded-xl p-5 space-y-4">
          
          {/* Custom Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge metrics by title, abstract or course..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
            />
          </div>

          {/* Table list */}
          <div className="space-y-3">
            {filteredResources.map(res => {
              const isMatched = isHighlightedMatch(res, activeHighlightKeyword);
              
              const currentOpacity = highlightOpacity !== undefined ? highlightOpacity : 1;
              const dynamicRowStyles = isMatched ? {
                borderColor: `rgba(245, 158, 11, ${currentOpacity})`,
                boxShadow: `0 0 10px rgba(245, 158, 11, ${0.1 * currentOpacity})`,
                transition: "border-color 0.2s ease-out, box-shadow 0.2s ease-out",
                opacity: 0.3 + 0.7 * currentOpacity
              } : undefined;

              return (
                <div 
                  key={res.id} 
                  onClick={() => setPreviewResource(res)}
                  style={dynamicRowStyles}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-4 relative overflow-hidden ${
                    previewResource?.id === res.id 
                      ? isMatched
                        ? "bg-amber-400/[0.05]"
                        : "bg-neutral-900/80 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.05)]" 
                      : isMatched
                        ? "bg-amber-400/[0.02] animate-pulse"
                        : "bg-neutral-900/40 border-neutral-850 hover:border-neutral-700"
                  }`}
                >
                  {isMatched && (
                    <div 
                      style={{ opacity: currentOpacity }}
                      className="absolute top-0 right-0 bg-amber-400 text-neutral-950 font-mono text-[7px] font-bold px-1.5 py-0.5 rounded-bl uppercase tracking-wider"
                    >
                      Interlinked
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white block">{res.title}</span>
                      <span className="text-[8px] font-mono px-1 rounded bg-neutral-950 text-neutral-400 border border-neutral-850">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light truncate max-w-sm">
                      {res.abstract}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-neutral-500">{res.fileSize}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSync(res.id);
                      }}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        res.synced 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20" 
                          : "bg-neutral-950 text-neutral-300 border border-neutral-850 hover:border-amber-400/40 hover:text-amber-400"
                      }`}
                    >
                      {res.synced ? "SYNCED" : "SYNC"}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredResources.length === 0 && (
              <div className="py-12 text-center text-xs text-neutral-600 font-mono italic">
                No matching reference coordinates indexed in the Core database.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Document Sync Preview Card (Document 2 detail) */}
        <div className="lg:col-span-5 bg-neutral-900/30 border border-neutral-850 p-6 rounded-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          {previewResource ? (
            <>
              {/* Card top badge */}
              <div className="border-b border-neutral-900 pb-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-amber-400 flex items-center gap-1">
                    <span className="bullet w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                    AEGIS CORE SYNC ACTIVE
                  </span>
                  <span className="text-neutral-500 uppercase">PREVIEWING_COORD</span>
                </div>
                <h3 className="text-lg font-medium text-white tracking-tight">{previewResource.title}</h3>
                <span className="inline-block text-[9px] font-mono uppercase bg-neutral-950 text-indigo-400 border border-neutral-800 px-2 py-0.5 rounded">
                  {previewResource.category} REFERENCE UNIT
                </span>
              </div>

              {/* Document abstract */}
              <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-lg text-xs leading-relaxed text-neutral-350 space-y-2 font-light">
                <span className="text-[9px] uppercase text-neutral-500 font-mono block">Abstract Synopsis:</span>
                <p>{previewResource.abstract}</p>
              </div>

              {/* Data specifications */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-905 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>METRIC DESIRED VALUE</span>
                  <span className="text-white">COGNITIVE_INDEX</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GRID RESOURCE ID</span>
                  <span className="text-neutral-500 text-[10px]">{previewResource.id.toUpperCase()}-NODE</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>CUMULATIVE LOAD SIZE</span>
                  <span className="text-white font-semibold">{previewResource.fileSize}</span>
                </div>
              </div>

              {/* Large Sync CTA */}
              <button
                onClick={() => onToggleSync(previewResource.id)}
                className={`w-full py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  previewResource.synced 
                    ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-neutral-950 hover:text-white hover:border-neutral-800" 
                    : "bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-amber-500/5"
                }`}
              >
                {previewResource.synced ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Unlink Repository Data
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Acquire Index Data
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="my-auto py-12 text-center text-xs text-neutral-500 font-mono italic">
              Select any scholastic document from left matrix to display full concept specs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
