import React, { useState } from 'react';
import type { ProcessResult } from '../types/scheduler';
import { Table, ArrowUpDown } from 'lucide-react';

interface ProcessTableProps {
  processResults: ProcessResult[];
  algorithmName: string;
}

type SortField = 'process_id' | 'arrival_time' | 'burst_time' | 'original_priority' | 'completion_time' | 'turnaround_time' | 'waiting_time';

export const ProcessTable: React.FC<ProcessTableProps> = ({ processResults, algorithmName }) => {
  const [sortField, setSortField] = useState<SortField>('process_id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedResults = [...processResults].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Table className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            Detailed Process Results ({algorithmName})
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Click column headers to sort results
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              {[
                { field: 'process_id', label: 'PID' },
                { field: 'arrival_time', label: 'AT' },
                { field: 'burst_time', label: 'BT' },
                { field: 'original_priority', label: 'Priority (Orig / Final)' },
                { field: 'completion_time', label: 'CT' },
                { field: 'turnaround_time', label: 'TAT' },
                { field: 'waiting_time', label: 'WT' },
              ].map(col => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field as SortField)}
                  className="px-4 py-3 cursor-pointer hover:text-cyan-400 transition"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {sortedResults.map((p) => (
              <tr key={p.process_id} className="hover:bg-slate-900/40 transition">
                <td className="px-4 py-3 font-bold text-cyan-400">
                  P{p.process_id}
                </td>
                <td className="px-4 py-3 font-mono text-slate-300">{p.arrival_time}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{p.burst_time}</td>
                <td className="px-4 py-3 font-mono text-slate-300">
                  <span className="text-slate-300">{p.original_priority}</span>
                  {p.final_priority !== p.original_priority && (
                    <span className="ml-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      aged → {p.final_priority}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-sky-400">{p.completion_time}</td>
                <td className="px-4 py-3 font-mono font-bold text-indigo-400">{p.turnaround_time}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-400">{p.waiting_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
