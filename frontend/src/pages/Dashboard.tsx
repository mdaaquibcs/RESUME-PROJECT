import React from 'react';
import { Hero } from '../components/Hero';
import type { SimulationResponse } from '../types/scheduler';
import { MetricCards } from '../components/MetricCards';
import { RecommendationCard } from '../components/RecommendationCard';
import { GanttChartVisualizer } from '../components/GanttChartVisualizer';
import { ProcessTable } from '../components/ProcessTable';
import { ComparisonDashboard } from '../components/ComparisonDashboard';
import { PlayCircle, BarChart3, BookOpen, Cpu, Activity, LineChart, Zap } from 'lucide-react';

interface DashboardProps {
  onStartSimulation: () => void;
  onExploreAlgorithms: () => void;
  onViewComparison: () => void;
  simulationData: SimulationResponse | null;
  selectedAlgorithmIdx: number;
  setSelectedAlgorithmIdx: (idx: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartSimulation,
  onExploreAlgorithms,
  onViewComparison,
  simulationData,
  selectedAlgorithmIdx,
  setSelectedAlgorithmIdx,
}) => {
  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <Hero onStart={onStartSimulation} onExplore={onExploreAlgorithms} />

      {/* System Overview Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Quick System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">TOTAL ALGORITHMS</span>
              <span className="text-xl font-bold text-white">5 Core Engines</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">SCHEDULING TYPE</span>
              <span className="text-xl font-bold text-white">Preemptive & Non-P.</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">VISUALIZATION</span>
              <span className="text-xl font-bold text-white">Dynamic Gantt Chart</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-violet-950/80 border border-violet-500/30 text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">KEY METRICS</span>
              <span className="text-xl font-bold text-white">WT / TAT / Throughput</span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={onStartSimulation}
            className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 cursor-pointer space-y-3 group hover:border-cyan-400"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-cyan-400">ACTION 01</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
              Start New Simulation
            </h3>
            <p className="text-xs text-slate-400">
              Configure custom process queues, set time quantum, and execute simulations in real-time.
            </p>
          </div>

          <div
            onClick={onViewComparison}
            className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/60 cursor-pointer space-y-3 group hover:border-indigo-400"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">
                <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-indigo-400">ACTION 02</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
              Compare Algorithms
            </h3>
            <p className="text-xs text-slate-400">
              Compare FCFS, SJF, SRTF, Round Robin, and Preemptive Priority on interactive performance bar charts.
            </p>
          </div>

          <div
            onClick={onExploreAlgorithms}
            className="glass-card p-6 rounded-2xl border border-violet-500/30 bg-slate-900/60 cursor-pointer space-y-3 group hover:border-violet-400"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-violet-950/80 text-violet-400 border border-violet-500/40">
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-violet-400">ACTION 03</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition">
              Learn Algorithms
            </h3>
            <p className="text-xs text-slate-400">
              Explore in-depth theoretical concepts, preemption policies, data structures, and starvation mechanisms.
            </p>
          </div>
        </div>

        {/* Live Active Simulation Dashboard (if simulation run) */}
        {simulationData ? (
          <div className="space-y-8 pt-4 border-t border-slate-800">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Latest Simulation Overview</h2>
                <p className="text-xs text-slate-400">
                  Engine used: <span className="text-cyan-400 font-medium">{simulationData.engineUsed || 'C++ Scheduling Engine'}</span>
                </p>
              </div>

              {/* Algorithm selector tabs for results */}
              <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                {simulationData.results.map((res, idx) => (
                  <button
                    key={res.name}
                    onClick={() => setSelectedAlgorithmIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedAlgorithmIdx === idx
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {res.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Cards */}
            <MetricCards simulationData={simulationData} />

            {/* Recommendation Card */}
            <RecommendationCard
              recommendation={simulationData.recommendation}
              bestAlgorithmName={simulationData.bestAlgorithmName}
            />

            {/* Gantt Chart */}
            <GanttChartVisualizer
              gantt={simulationData.results[selectedAlgorithmIdx].gantt}
              algorithmName={simulationData.results[selectedAlgorithmIdx].name}
            />

            {/* Process Results Table */}
            <ProcessTable
              processResults={simulationData.results[selectedAlgorithmIdx].process_results}
              algorithmName={simulationData.results[selectedAlgorithmIdx].name}
            />

            {/* Comparison Dashboard */}
            <ComparisonDashboard
              results={simulationData.results}
              bestAlgorithmIndex={simulationData.bestAlgorithmIndex}
            />

          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
            <div className="p-4 rounded-full bg-slate-900 text-cyan-400 w-16 h-16 mx-auto flex items-center justify-center border border-slate-800">
              <PlayCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Simulation Run Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Launch a simulation using our interactive builder to view Gantt charts, compare metrics, and read the C++ AI recommendation.
            </p>
            <button
              onClick={onStartSimulation}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Start Simulation
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
