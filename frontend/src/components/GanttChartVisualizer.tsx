import React from 'react';
import type { GanttEntry } from '../types/scheduler';
import { Activity, Clock } from 'lucide-react';

interface GanttChartVisualizerProps {
  gantt: GanttEntry[];
  algorithmName: string;
}

const PROCESS_COLORS: { [key: number]: { bg: string; border: string; text: string } } = {
  1: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-300' },
  2: { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' },
  3: { bg: 'bg-violet-500/20', border: 'border-violet-400', text: 'text-violet-300' },
  4: { bg: 'bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-300' },
  5: { bg: 'bg-rose-500/20', border: 'border-rose-400', text: 'text-rose-300' },
  6: { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300' },
  7: { bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-400', text: 'text-fuchsia-300' },
  8: { bg: 'bg-teal-500/20', border: 'border-teal-400', text: 'text-teal-300' },
};

export const GanttChartVisualizer: React.FC<GanttChartVisualizerProps> = ({ gantt, algorithmName }) => {
  if (!gantt || gantt.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 border border-slate-800">
        No Gantt Chart data available. Run simulation to visualize timeline.
      </div>
    );
  }

  const totalTime = gantt[gantt.length - 1].end_time;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            Gantt Chart Timeline ({algorithmName})
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Total Execution Time: <strong className="text-cyan-300 font-mono text-sm">{totalTime} units</strong></span>
        </div>
      </div>

      {/* Responsive Visual Timeline Container */}
      <div className="overflow-x-auto pt-4 pb-6">
        <div className="min-w-[650px] space-y-2">
          
          {/* Gantt Blocks Bar */}
          <div className="flex w-full h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-1 space-x-1">
            {gantt.map((entry, idx) => {
              const duration = entry.end_time - entry.start_time;
              const widthPct = totalTime > 0 ? (duration / totalTime) * 100 : 0;
              const isIdle = entry.process_id === -1;

              const style = isIdle
                ? { bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-500' }
                : PROCESS_COLORS[((entry.process_id - 1) % 8) + 1] || PROCESS_COLORS[1];

              return (
                <div
                  key={idx}
                  style={{ width: `${Math.max(widthPct, 4)}%` }}
                  className={`group relative flex flex-col items-center justify-center h-full rounded-lg border ${style.bg} ${style.border} transition-all duration-200 hover:scale-[1.02] hover:z-20 cursor-pointer shadow-md`}
                >
                  <span className={`text-xs font-extrabold ${style.text}`}>
                    {isIdle ? 'IDLE' : `P${entry.process_id}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {duration}t
                  </span>

                  {/* Interactive Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                    <div className="bg-slate-900 border border-slate-700 text-white text-[11px] rounded-lg p-2 shadow-xl whitespace-nowrap space-y-1">
                      <div className="font-bold text-cyan-400">
                        {isIdle ? 'CPU IDLE STATE' : `PROCESS P${entry.process_id}`}
                      </div>
                      <div className="text-slate-300">
                        Start: <span className="font-mono text-cyan-300">{entry.start_time}</span> | End: <span className="font-mono text-cyan-300">{entry.end_time}</span>
                      </div>
                      <div className="text-slate-400">
                        Duration: <span className="font-mono text-emerald-400">{duration} time units</span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700 -mt-1"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timestamp Ruler Below */}
          <div className="relative w-full h-6 pt-1">
            {gantt.map((entry, idx) => {
              const leftPct = totalTime > 0 ? (entry.start_time / totalTime) * 100 : 0;
              return (
                <span
                  key={`start-${idx}`}
                  style={{ left: `${leftPct}%` }}
                  className="absolute text-[11px] font-mono text-slate-400 transform -translate-x-1/2"
                >
                  {entry.start_time}
                </span>
              );
            })}
            {/* End time of last entry */}
            <span
              style={{ left: '100%' }}
              className="absolute text-[11px] font-mono text-cyan-400 font-bold transform -translate-x-full"
            >
              {totalTime}
            </span>
          </div>

        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-800">
        <span className="text-slate-400 font-semibold">Legend:</span>
        {Array.from(new Set(gantt.map(g => g.process_id))).map(pid => {
          const isIdle = pid === -1;
          const style = isIdle
            ? { bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-400' }
            : PROCESS_COLORS[((pid - 1) % 8) + 1] || PROCESS_COLORS[1];

          return (
            <div key={pid} className={`flex items-center space-x-1.5 px-2 py-0.5 rounded border ${style.bg} ${style.border}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isIdle ? 'bg-slate-600' : 'bg-current'}`}></div>
              <span className={`font-semibold ${style.text}`}>{isIdle ? 'IDLE' : `P${pid}`}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
