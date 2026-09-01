import React from 'react';
import { Info, Cpu, Server, Layout, Code } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Title */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-bold text-cyan-400">
          <Info className="w-4 h-4" />
          <span>System Architecture & Overview</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          CPU Scheduling Simulator (V2.5 PRO)
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm">
          A full-stack Operating System CPU scheduling analysis environment bridging a native C++ scheduling engine with a modern interactive web visualizer.
        </p>
      </div>

      {/* 3-Tier Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: C++ Core */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800">
              TIER 01 - ENGINE
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Native C++ Core Engine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Written in ISO C++ with standard template libraries (`vector`, `queue`, `priority_queue`). Calculates process metrics (CT, TAT, WT), Gantt chart intervals, and executes the Intelligent Recommendation Engine.
          </p>
          <div className="pt-2 text-xs space-y-1 text-slate-400 border-t border-slate-800">
            <div>• <strong className="text-cyan-300">File:</strong> <code className="text-cyan-400">backend/cpp/scheduler.cpp</code></div>
            <div>• <strong className="text-cyan-300">Binary:</strong> <code className="text-cyan-400">backend/bin/scheduler.exe</code></div>
          </div>
        </div>

        {/* Tier 2: API Bridge */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/40 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">
              <Server className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded border border-indigo-800">
              TIER 02 - API BRIDGE
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Express API Server</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Node.js Express backend acting as an API IPC bridge. Spawns `scheduler.exe` with JSON stdin/stdout, while providing an integrated 1:1 C++ logic fallback to guarantee 100% execution availability.
          </p>
          <div className="pt-2 text-xs space-y-1 text-slate-400 border-t border-slate-800">
            <div>• <strong className="text-indigo-300">Endpoint:</strong> <code className="text-indigo-400">POST /api/simulate</code></div>
            <div>• <strong className="text-indigo-300">Port:</strong> <code className="text-indigo-400">5000</code></div>
          </div>
        </div>

        {/* Tier 3: React Frontend */}
        <div className="glass-panel p-6 rounded-2xl border border-violet-500/40 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-violet-950/80 text-violet-400 border border-violet-500/40">
              <Layout className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-950 text-violet-400 rounded border border-violet-800">
              TIER 03 - FRONTEND
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">React + Tailwind Web UI</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern, responsive UI built with Vite, React 18, TypeScript, Tailwind CSS, Lucide icons, and Recharts. Features interactive Gantt timelines, sortable tables, preset scenarios, and performance graphs.
          </p>
          <div className="pt-2 text-xs space-y-1 text-slate-400 border-t border-slate-800">
            <div>• <strong className="text-violet-300">Stack:</strong> React + TS + Vite</div>
            <div>• <strong className="text-violet-300">Port:</strong> <code className="text-violet-400">3000</code></div>
          </div>
        </div>

      </div>

      {/* Included Algorithms Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <span>Supported CPU Scheduling Algorithms</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { name: '1. FCFS', desc: 'First Come First Served' },
            { name: '2. SJF', desc: 'Shortest Job First (Non-preemptive)' },
            { name: '3. SRTF', desc: 'Shortest Remaining Time First (Preemptive)' },
            { name: '4. Round Robin', desc: 'Time Quantum Circular Queue' },
            { name: '5. Priority + Aging', desc: 'STL Min-Heap with Dynamic Aging Guard' },
          ].map((a) => (
            <div key={a.name} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">{a.name}</span>
              <span className="text-slate-400 block">{a.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
