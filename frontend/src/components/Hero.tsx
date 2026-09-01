import React from 'react';
import { Play, BookOpen, Cpu, Zap, Activity, Clock, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onExplore }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Visual background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-semibold text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span>High-Performance C++ Core Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              CPU Scheduling <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Simulator
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Simulate, visualize and compare CPU scheduling algorithms with real-time performance metrics powered directly by our native C++ OS scheduling engine.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStart}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Simulation</span>
              </button>

              <button
                onClick={onExplore}
                className="flex items-center space-x-2 glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all"
              >
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Explore Algorithms</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>5 Core Algorithms</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Gantt Chart Visualizer</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>WT, TAT, Throughput</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Priority Aging Starvation Protection</span>
              </div>
            </div>
          </div>

          {/* Right Processor Graphic Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-8 glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 overflow-hidden">
              {/* Circuit background lines */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="relative p-6 bg-slate-950/90 rounded-2xl border-2 border-cyan-500/40 shadow-inner glow-cyan">
                  <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
                  <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-md">
                    CORE X64
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-indigo-500 text-white font-bold text-[10px] rounded-md">
                    STL HEAP
                  </div>
                </div>

                <div className="w-full space-y-2 text-left">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                    <span>CPU Pipeline Scheduler</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 h-full w-4/5 animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-left">
                    <span className="text-slate-400 block text-[10px]">AVG WAITING TIME</span>
                    <span className="text-sm font-bold text-cyan-400">Min. Optimized</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-left">
                    <span className="text-slate-400 block text-[10px]">CPU UTILIZATION</span>
                    <span className="text-sm font-bold text-emerald-400">100.00% Max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
