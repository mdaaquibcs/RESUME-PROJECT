import React, { useState } from 'react';
import type { AlgorithmResult } from '../types/scheduler';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, Trophy, CheckCircle2 } from 'lucide-react';

interface ComparisonDashboardProps {
  results: AlgorithmResult[];
  bestAlgorithmIndex: number;
}

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({ results, bestAlgorithmIndex }) => {
  const [activeMetric, setActiveMetric] = useState<'avg_wt' | 'avg_tat' | 'cpu_utilization' | 'throughput'>('avg_wt');

  const chartData = results.map(r => ({
    name: r.name,
    avg_wt: r.avg_wt,
    avg_tat: r.avg_tat,
    cpu_utilization: r.cpu_utilization,
    throughput: r.throughput,
  }));

  const metricTitles = {
    avg_wt: { label: 'Average Waiting Time (units)', color: '#38bdf8', lowerIsBetter: true },
    avg_tat: { label: 'Average Turnaround Time (units)', color: '#818cf8', lowerIsBetter: true },
    cpu_utilization: { label: 'CPU Utilization (%)', color: '#34d399', lowerIsBetter: false },
    throughput: { label: 'Throughput (Processes / unit time)', color: '#c084fc', lowerIsBetter: false },
  };

  return (
    <div className="space-y-6">
      
      {/* Comparative Summary Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Comparative Algorithm Metrics Matrix
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Winner: {results[bestAlgorithmIndex]?.name}</span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Avg WT (units)</th>
                <th className="px-4 py-3">Avg TAT (units)</th>
                <th className="px-4 py-3">Throughput (P/t)</th>
                <th className="px-4 py-3">CPU Utilization (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {results.map((res, idx) => {
                const isBest = idx === bestAlgorithmIndex;
                return (
                  <tr
                    key={res.name}
                    className={`hover:bg-slate-900/60 transition ${
                      isBest ? 'bg-amber-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-white flex items-center space-x-2">
                      <span>{res.name}</span>
                      {isBest && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>BEST</span>
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-mono ${isBest ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                      {res.avg_wt.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {res.avg_tat.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {res.throughput.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-bold">
                      {res.cpu_utilization.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Recharts Bar Graph */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-base font-bold text-white">Visual Metric Comparison Charts</h4>
            <p className="text-xs text-slate-400">Select a metric to visualize comparative algorithm performance</p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'avg_wt', label: 'Avg WT' },
              { id: 'avg_tat', label: 'Avg TAT' },
              { id: 'cpu_utilization', label: 'CPU Util (%)' },
              { id: 'throughput', label: 'Throughput' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeMetric === m.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Render */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey={activeMetric}
                name={metricTitles[activeMetric].label}
                fill={metricTitles[activeMetric].color}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
