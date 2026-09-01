import React from 'react';
import type { SimulationResponse } from '../types/scheduler';
import { Trophy, Clock, RefreshCw, Cpu, TrendingUp } from 'lucide-react';

interface MetricCardsProps {
  simulationData: SimulationResponse;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ simulationData }) => {
  const { results, bestAlgorithmIndex } = simulationData;
  const bestAlgo = results[bestAlgorithmIndex];

  // Calculate lowest Avg WT, lowest Avg TAT, highest CPU Util, highest Throughput across algorithms
  let lowestWT = results[0];
  let lowestTAT = results[0];
  let highestCPU = results[0];
  let highestThroughput = results[0];

  results.forEach(res => {
    if (res.avg_wt < lowestWT.avg_wt) lowestWT = res;
    if (res.avg_tat < lowestTAT.avg_tat) lowestTAT = res;
    if (res.cpu_utilization > highestCPU.cpu_utilization) highestCPU = res;
    if (res.throughput > highestThroughput.throughput) highestThroughput = res;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. Best Algorithm Card */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 relative overflow-hidden shadow-lg shadow-amber-950/20">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Trophy className="w-16 h-16 text-amber-400" />
        </div>
        <div className="flex items-center space-x-2 text-amber-400 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Best Algorithm</span>
        </div>
        <div className="text-2xl font-black text-white truncate">
          {bestAlgo.name}
        </div>
        <p className="text-xs text-amber-300/80 mt-1">
          Lowest Avg WT ({bestAlgo.avg_wt} units)
        </p>
      </div>

      {/* 2. Lowest Avg Waiting Time */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60">
        <div className="flex items-center space-x-2 text-cyan-400 mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Lowest Avg WT</span>
        </div>
        <div className="text-2xl font-black text-cyan-300">
          {lowestWT.avg_wt} <span className="text-xs font-medium text-slate-400">units</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Achieved by <span className="font-semibold text-cyan-400">{lowestWT.name}</span>
        </p>
      </div>

      {/* 3. Lowest Avg Turnaround Time */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/60">
        <div className="flex items-center space-x-2 text-indigo-400 mb-2">
          <RefreshCw className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Lowest Avg TAT</span>
        </div>
        <div className="text-2xl font-black text-indigo-300">
          {lowestTAT.avg_tat} <span className="text-xs font-medium text-slate-400">units</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Achieved by <span className="font-semibold text-indigo-400">{lowestTAT.name}</span>
        </p>
      </div>

      {/* 4. Highest CPU Utilization */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/60">
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <Cpu className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Max CPU Util.</span>
        </div>
        <div className="text-2xl font-black text-emerald-300">
          {highestCPU.cpu_utilization.toFixed(2)}%
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Achieved by <span className="font-semibold text-emerald-400">{highestCPU.name}</span>
        </p>
      </div>

      {/* 5. Highest Throughput */}
      <div className="glass-panel p-5 rounded-2xl border border-violet-500/30 bg-slate-900/60">
        <div className="flex items-center space-x-2 text-violet-400 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Max Throughput</span>
        </div>
        <div className="text-2xl font-black text-violet-300">
          {highestThroughput.throughput.toFixed(3)} <span className="text-xs font-medium text-slate-400">P/t</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Achieved by <span className="font-semibold text-violet-400">{highestThroughput.name}</span>
        </p>
      </div>

    </div>
  );
};
