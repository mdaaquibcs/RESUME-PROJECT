import React from 'react';
import { BookOpen, CheckCircle, XCircle, Cpu, ArrowRight } from 'lucide-react';

interface AlgorithmsInfoProps {
  onStartSimulation: () => void;
}

export const AlgorithmsInfo: React.FC<AlgorithmsInfoProps> = ({ onStartSimulation }) => {
  const algorithms = [
    {
      name: 'First Come First Served (FCFS)',
      badge: 'Non-Preemptive',
      type: 'First-In First-Out (FIFO)',
      ds: 'Standard Array / FIFO Queue',
      desc: 'Executes processes strictly in the order of their arrival time without interruption.',
      pros: [
        'Simple to implement & understand',
        'Zero context switching overhead',
        'Fair in order of arrival',
      ],
      cons: [
        'Convoy Effect: Short processes wait behind long ones',
        'High Average Waiting Time for varying burst sizes',
        'Poor CPU throughput for mixed workloads',
      ],
      useCase: 'Batch processing systems where response time is not critical.',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      name: 'Shortest Job First (SJF)',
      badge: 'Non-Preemptive',
      type: 'Greedy Optimal Waiting Time',
      ds: 'Min-Heap / Sorting by Burst Time',
      desc: 'Selects the arrived process with the shortest burst time to run until completion.',
      pros: [
        'Minimizes Average Waiting Time for fixed batch jobs',
        'Efficient CPU utilization',
        'Optimal when burst times are known in advance',
      ],
      cons: [
        'Starvation risk for long-running processes',
        'Requires prior knowledge of process burst times',
        'Non-preemptive: cannot interrupt a long running process once started',
      ],
      useCase: 'Long-term job scheduling where execution durations are predictable.',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      name: 'Shortest Remaining Time First (SRTF)',
      badge: 'Preemptive',
      type: 'Preemptive SJF',
      ds: 'Dynamic Min-Heap / STL priority_queue',
      desc: 'Preempts the current running process whenever a newly arrived process has a shorter remaining burst time.',
      pros: [
        'Provably minimum Average Waiting Time among all schedulers',
        'Extremely responsive for short interactive jobs',
        'Maximizes system throughput',
      ],
      cons: [
        'Frequent context switches introduce CPU overhead',
        'Starvation of long jobs if short jobs keep arriving',
        'Requires continuous remaining time recalculation',
      ],
      useCase: 'Time-sharing systems prioritizing short interactive tasks.',
      color: 'border-indigo-500/40 text-indigo-400',
    },
    {
      name: 'Round Robin (RR)',
      badge: 'Preemptive',
      type: 'Time-Sharing Cycle',
      ds: 'Circular Ready Queue (STL queue)',
      desc: 'Allocates a fixed Time Quantum (TQ) to each process in turn. Unfinished jobs are pushed back to the ready queue.',
      pros: [
        'Guaranteed fairness and bounded response time',
        'Zero starvation: every process gets regular CPU time',
        'Excellent for multi-user time-sharing environments',
      ],
      cons: [
        'Performance heavily depends on Time Quantum choice',
        'If TQ is too small: excessive context switches degrade performance',
        'If TQ is too large: degrades into FCFS',
      ],
      useCase: 'General-purpose OS kernel scheduling (Linux, Windows, macOS).',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      name: 'Preemptive Priority Scheduling with Aging',
      badge: 'Preemptive + Starvation Guard',
      type: 'Priority-Based with Dynamic Aging',
      ds: 'STL priority_queue with Custom Min-Heap Comparator',
      desc: 'Executes highest priority job first. Includes an Aging Mechanism (threshold = 5 units) that boosts waiting process priorities over time to completely eliminate starvation.',
      pros: [
        'Critical real-time tasks execute immediately',
        'Dynamic Aging guarantees starvation-free execution for low-priority jobs',
        'Flexible custom priority mapping',
      ],
      cons: [
        'Slightly higher memory overhead for dynamic heap restructuring',
        'Complexity in tuning aging parameters',
      ],
      useCase: 'Real-time operating systems (RTOS) and mission-critical embedded systems.',
      color: 'border-violet-500/40 text-violet-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-bold text-cyan-400">
          <BookOpen className="w-4 h-4" />
          <span>Educational Reference Guide</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">
          CPU Scheduling Algorithms Explained
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm">
          Comprehensive breakdown of scheduling algorithms, preemption policies, data structures, trade-offs, and starvation prevention mechanisms.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algo) => (
          <div
            key={algo.name}
            className={`glass-panel p-6 rounded-2xl border ${algo.color} bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-cyan-400 transition shadow-xl`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                  {algo.badge}
                </span>
                <Cpu className="w-5 h-5 text-slate-500" />
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {algo.name}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {algo.desc}
              </p>

              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Policy Type:</span>
                  <span className="font-semibold text-slate-200">{algo.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Data Structure:</span>
                  <span className="font-semibold text-cyan-300">{algo.ds}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Advantages</span>
                {algo.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Limitations</span>
                {algo.cons.map((con, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Use Case */}
            <div className="pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">Typical Use Case:</span>
              <span className="text-cyan-300 italic">{algo.useCase}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to test these algorithms live?</h3>
        <button
          onClick={onStartSimulation}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition"
        >
          <span>Launch Simulator Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
