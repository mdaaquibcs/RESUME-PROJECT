import React, { useState } from 'react';
import type { ProcessInput, PresetScenario } from '../types/scheduler';
import { Plus, Trash2, RotateCcw, Play, Layers, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface DynamicInputFormProps {
  processes: ProcessInput[];
  setProcesses: React.Dispatch<React.SetStateAction<ProcessInput[]>>;
  timeQuantum: number;
  setTimeQuantum: (tq: number) => void;
  onRunSimulation: () => void;
  isLoading: boolean;
}

const PRESETS: PresetScenario[] = [
  {
    id: 'preset-varying',
    name: 'Preset 1: Varying Bursts (Mixed Workload)',
    description: 'High burst time variance, ideal to observe SRTF performance superiority.',
    timeQuantum: 2,
    processes: [
      { process_id: 1, arrival_time: 0, burst_time: 8, priority: 3 },
      { process_id: 2, arrival_time: 1, burst_time: 4, priority: 1 },
      { process_id: 3, arrival_time: 2, burst_time: 9, priority: 4 },
      { process_id: 4, arrival_time: 3, burst_time: 2, priority: 2 },
      { process_id: 5, arrival_time: 4, burst_time: 5, priority: 5 },
    ],
  },
  {
    id: 'preset-uniform',
    name: 'Preset 2: Uniform Bursts (Equal Length Jobs)',
    description: 'All processes have equal burst times. Shows Round Robin & FCFS fairness.',
    timeQuantum: 3,
    processes: [
      { process_id: 1, arrival_time: 0, burst_time: 5, priority: 2 },
      { process_id: 2, arrival_time: 1, burst_time: 5, priority: 1 },
      { process_id: 3, arrival_time: 2, burst_time: 5, priority: 3 },
      { process_id: 4, arrival_time: 3, burst_time: 5, priority: 4 },
    ],
  },
  {
    id: 'preset-priority',
    name: 'Preset 3: Priority Starvation & Aging',
    description: 'Low-priority long arrival jobs receive dynamic priority boosts via Aging.',
    timeQuantum: 2,
    processes: [
      { process_id: 1, arrival_time: 0, burst_time: 10, priority: 5 },
      { process_id: 2, arrival_time: 1, burst_time: 1, priority: 1 },
      { process_id: 3, arrival_time: 2, burst_time: 2, priority: 2 },
      { process_id: 4, arrival_time: 3, burst_time: 1, priority: 1 },
      { process_id: 5, arrival_time: 4, burst_time: 12, priority: 6 },
    ],
  },
];

export const DynamicInputForm: React.FC<DynamicInputFormProps> = ({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  onRunSimulation,
  isLoading,
}) => {
  const [newPid, setNewPid] = useState<number>(processes.length > 0 ? Math.max(...processes.map(p => p.process_id)) + 1 : 1);
  const [newAt, setNewAt] = useState<number>(0);
  const [newBt, setNewBt] = useState<number>(4);
  const [newPr, setNewPr] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation rules
    if (newPid <= 0 || isNaN(newPid)) {
      setErrorMsg('Process ID must be a positive integer.');
      return;
    }
    if (processes.some(p => p.process_id === newPid)) {
      setErrorMsg(`Process ID P${newPid} already exists! PIDs must be unique.`);
      return;
    }
    if (newAt < 0 || isNaN(newAt)) {
      setErrorMsg('Arrival Time cannot be negative.');
      return;
    }
    if (newBt <= 0 || isNaN(newBt)) {
      setErrorMsg('Burst Time must be greater than 0.');
      return;
    }
    if (newPr < 0 || isNaN(newPr)) {
      setErrorMsg('Priority must be 0 or a positive integer.');
      return;
    }

    setProcesses([...processes, { process_id: newPid, arrival_time: newAt, burst_time: newBt, priority: newPr }]);
    setNewPid(newPid + 1);
    setNewAt(newAt + 1);
  };

  const handleRemoveProcess = (pid: number) => {
    if (processes.length <= 1) {
      setErrorMsg('Simulation requires at least 1 process.');
      return;
    }
    setProcesses(processes.filter(p => p.process_id !== pid));
    setErrorMsg(null);
  };

  const handleProcessChange = (index: number, field: keyof ProcessInput, value: number) => {
    setErrorMsg(null);
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: value };
    setProcesses(updated);
  };

  const handleReset = () => {
    setProcesses([
      { process_id: 1, arrival_time: 0, burst_time: 6, priority: 2 },
      { process_id: 2, arrival_time: 1, burst_time: 4, priority: 1 },
      { process_id: 3, arrival_time: 2, burst_time: 8, priority: 3 },
    ]);
    setTimeQuantum(2);
    setErrorMsg(null);
  };

  const handleLoadPreset = (presetId: string) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setProcesses(found.processes);
      setTimeQuantum(found.timeQuantum);
      setNewPid(Math.max(...found.processes.map(p => p.process_id)) + 1);
      setErrorMsg(null);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header controls & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Process Queue Configuration</span>
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically add, edit, or customize processes for simulation.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue=""
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl text-xs px-3 py-2 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="" disabled>Load Preset Scenario...</option>
            {PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Error Alert */}
      {errorMsg && (
        <div className="flex items-center space-x-2 p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Process Table Input */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">PID</th>
              <th className="px-4 py-3">Arrival Time (AT)</th>
              <th className="px-4 py-3">Burst Time (BT)</th>
              <th className="px-4 py-3">Priority (Lower = Higher)</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {processes.map((p, idx) => (
              <tr key={p.process_id} className="hover:bg-slate-900/40 transition">
                <td className="px-4 py-2.5 font-bold text-cyan-400">
                  P{p.process_id}
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="0"
                    value={p.arrival_time}
                    onChange={(e) => handleProcessChange(idx, 'arrival_time', parseInt(e.target.value) || 0)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="1"
                    value={p.burst_time}
                    onChange={(e) => handleProcessChange(idx, 'burst_time', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="1"
                    value={p.priority}
                    onChange={(e) => handleProcessChange(idx, 'priority', parseInt(e.target.value) || 1)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => handleRemoveProcess(p.process_id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition"
                    title="Remove Process"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Process Form */}
      <form onSubmit={handleAddProcess} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Process ID</label>
          <input
            type="number"
            min="1"
            value={newPid}
            onChange={(e) => setNewPid(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Arrival Time</label>
          <input
            type="number"
            min="0"
            value={newAt}
            onChange={(e) => setNewAt(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Burst Time</label>
          <input
            type="number"
            min="1"
            value={newBt}
            onChange={(e) => setNewBt(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority</label>
          <input
            type="number"
            min="1"
            value={newPr}
            onChange={(e) => setNewPr(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-400 font-bold py-2 rounded-lg text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process</span>
          </button>
        </div>
      </form>

      {/* Bottom Controls: Round Robin TQ & Run Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-300">Round Robin Time Quantum (TQ):</label>
          <input
            type="number"
            min="1"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 bg-slate-900 border border-cyan-500/50 rounded-xl px-3 py-1.5 text-sm font-bold text-cyan-400 focus:outline-none text-center"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isLoading || processes.length === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-7 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Simulating...</span>
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
