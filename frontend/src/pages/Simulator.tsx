import React, { useState } from 'react';
import type { ProcessInput, SimulationResponse } from '../types/scheduler';
import { DynamicInputForm } from '../components/DynamicInputForm';
import { MetricCards } from '../components/MetricCards';
import { RecommendationCard } from '../components/RecommendationCard';
import { GanttChartVisualizer } from '../components/GanttChartVisualizer';
import { ProcessTable } from '../components/ProcessTable';
import { ComparisonDashboard } from '../components/ComparisonDashboard';
import { PlayCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface SimulatorProps {
  processes: ProcessInput[];
  setProcesses: React.Dispatch<React.SetStateAction<ProcessInput[]>>;
  timeQuantum: number;
  setTimeQuantum: (tq: number) => void;
  simulationData: SimulationResponse | null;
  setSimulationData: (data: SimulationResponse | null) => void;
  selectedAlgorithmIdx: number;
  setSelectedAlgorithmIdx: (idx: number) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  simulationData,
  setSimulationData,
  selectedAlgorithmIdx,
  setSelectedAlgorithmIdx,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processes,
          timeQuantum,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: 'Simulation server error' }));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data: SimulationResponse = await response.json();
      setSimulationData(data);
    } catch (err: any) {
      console.error('Simulation request failed:', err);
      setError(err.message || 'Failed to connect to CPU Scheduling Simulation Server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <PlayCircle className="w-8 h-8 text-cyan-400" />
            <span>Interactive Simulator</span>
          </h1>
          <p className="text-sm text-slate-400">
            Define process parameters and trigger the native C++ Scheduling Engine.
          </p>
        </div>

        {/* Algorithm Select Tabs */}
        {simulationData && (
          <div className="flex flex-wrap gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
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
        )}
      </div>

      {/* Process Input Configuration Form */}
      <DynamicInputForm
        processes={processes}
        setProcesses={setProcesses}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        onRunSimulation={runSimulation}
        isLoading={isLoading}
      />

      {/* Error Alert Box */}
      {error && (
        <div className="glass-panel p-5 rounded-2xl border border-rose-600/50 bg-rose-950/40 text-rose-200 space-y-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h4 className="font-bold text-base text-rose-300">Simulation Error</h4>
          </div>
          <p className="text-xs text-rose-300/90">{error}</p>
          <button
            onClick={runSimulation}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Simulation</span>
          </button>
        </div>
      )}

      {/* Simulation Results Section */}
      {simulationData && (
        <div className="space-y-8 pt-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              <span>Simulation Results Dashboard</span>
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              Engine: {simulationData.engineUsed || 'C++ Core Engine'}
            </span>
          </div>

          {/* Metric Summary Cards */}
          <MetricCards simulationData={simulationData} />

          {/* Intelligent Scheduler Recommendation */}
          <RecommendationCard
            recommendation={simulationData.recommendation}
            bestAlgorithmName={simulationData.bestAlgorithmName}
          />

          {/* Gantt Chart Visualizer */}
          <GanttChartVisualizer
            gantt={simulationData.results[selectedAlgorithmIdx].gantt}
            algorithmName={simulationData.results[selectedAlgorithmIdx].name}
          />

          {/* Process Result Table */}
          <ProcessTable
            processResults={simulationData.results[selectedAlgorithmIdx].process_results}
            algorithmName={simulationData.results[selectedAlgorithmIdx].name}
          />

          {/* Comparative Algorithm Performance Dashboard */}
          <ComparisonDashboard
            results={simulationData.results}
            bestAlgorithmIndex={simulationData.bestAlgorithmIndex}
          />

        </div>
      )}

    </div>
  );
};
