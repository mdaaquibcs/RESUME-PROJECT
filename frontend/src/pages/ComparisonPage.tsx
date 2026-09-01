import React from 'react';
import type { SimulationResponse } from '../types/scheduler';
import { ComparisonDashboard } from '../components/ComparisonDashboard';
import { MetricCards } from '../components/MetricCards';
import { RecommendationCard } from '../components/RecommendationCard';
import { BarChart3, PlayCircle } from 'lucide-react';

interface ComparisonPageProps {
  simulationData: SimulationResponse | null;
  onStartSimulation: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ simulationData, onStartSimulation }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            <span>Algorithm Performance Comparison</span>
          </h1>
          <p className="text-sm text-slate-400">
            Comparative analysis of FCFS, SJF, SRTF, Round Robin, and Preemptive Priority with Aging.
          </p>
        </div>
      </div>

      {simulationData ? (
        <div className="space-y-8">
          <MetricCards simulationData={simulationData} />
          
          <RecommendationCard
            recommendation={simulationData.recommendation}
            bestAlgorithmName={simulationData.bestAlgorithmName}
          />

          <ComparisonDashboard
            results={simulationData.results}
            bestAlgorithmIndex={simulationData.bestAlgorithmIndex}
          />
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-900 text-cyan-400 w-16 h-16 mx-auto flex items-center justify-center border border-slate-800">
            <PlayCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Active Simulation Data</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Run a simulation first to view detailed comparative performance charts and metrics matrix across all 5 scheduling algorithms.
          </p>
          <button
            onClick={onStartSimulation}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
          >
            Run Simulation Now
          </button>
        </div>
      )}

    </div>
  );
};
