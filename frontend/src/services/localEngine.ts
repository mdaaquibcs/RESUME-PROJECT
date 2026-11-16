import type { ProcessInput, ProcessResult, GanttEntry, AlgorithmResult, SimulationResponse } from '../types/scheduler';

class Process {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  priority: number;
  original_priority: number;
  final_priority: number;
  remaining_time: number;
  completion_time: number;
  turnaround_time: number;
  waiting_time: number;

  constructor(pid: number, at: number, bt: number, pr: number) {
    this.process_id = Number(pid);
    this.arrival_time = Number(at);
    this.burst_time = Number(bt);
    this.priority = Number(pr);
    this.original_priority = Number(pr);
    this.final_priority = Number(pr);
    this.remaining_time = Number(bt);
    this.completion_time = 0;
    this.turnaround_time = 0;
    this.waiting_time = 0;
  }
}

function runFCFS(inputProcesses: ProcessInput[]): AlgorithmResult {
  const processList = inputProcesses.map(
    p => new Process(p.process_id, p.arrival_time, p.burst_time, p.priority)
  );
  const n = processList.length;

  processList.sort((a, b) => a.arrival_time - b.arrival_time);

  let currentTime = 0;
  let totalIdleTime = 0;
  const gantt: GanttEntry[] = [];

  for (let i = 0; i < n; i++) {
    if (currentTime < processList[i].arrival_time) {
      totalIdleTime += processList[i].arrival_time - currentTime;
      gantt.push({ process_id: -1, start_time: currentTime, end_time: processList[i].arrival_time });
      currentTime = processList[i].arrival_time;
    }
    const start = currentTime;
    currentTime += processList[i].burst_time;
    gantt.push({ process_id: processList[i].process_id, start_time: start, end_time: currentTime });

    processList[i].completion_time = currentTime;
    processList[i].turnaround_time = processList[i].completion_time - processList[i].arrival_time;
    processList[i].waiting_time = processList[i].turnaround_time - processList[i].burst_time;
    processList[i].final_priority = processList[i].priority;
  }

  let totalWT = 0, totalTAT = 0;
  processList.forEach(p => {
    totalWT += p.waiting_time;
    totalTAT += p.turnaround_time;
  });

  const throughput = n / (currentTime || 1);
  const cpu_utilization = currentTime > 0 ? ((currentTime - totalIdleTime) / currentTime) * 100 : 100;

  return {
    name: 'FCFS',
    avg_wt: Number((totalWT / n).toFixed(2)),
    avg_tat: Number((totalTAT / n).toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    cpu_utilization: Number(cpu_utilization.toFixed(2)),
    process_results: processList as ProcessResult[],
    gantt
  };
}

function runSJF(inputProcesses: ProcessInput[]): AlgorithmResult {
  const processList = inputProcesses.map(
    p => new Process(p.process_id, p.arrival_time, p.burst_time, p.priority)
  );
  const n = processList.length;
  let currentTime = 0, completed = 0, totalIdleTime = 0;
  const isCompleted = new Array(n).fill(false);
  const gantt: GanttEntry[] = [];
  const results: Process[] = [];

  while (completed < n) {
    let idx = -1;
    let minBurst = Infinity;

    for (let i = 0; i < n; i++) {
      if (!isCompleted[i] && processList[i].arrival_time <= currentTime) {
        if (processList[i].burst_time < minBurst) {
          minBurst = processList[i].burst_time;
          idx = i;
        } else if (processList[i].burst_time === minBurst) {
          if (processList[i].arrival_time < processList[idx].arrival_time) {
            idx = i;
          }
        }
      }
    }

    if (idx === -1) {
      let nextArrival = Infinity;
      for (let i = 0; i < n; i++) {
        if (!isCompleted[i]) nextArrival = Math.min(nextArrival, processList[i].arrival_time);
      }
      totalIdleTime += nextArrival - currentTime;
      gantt.push({ process_id: -1, start_time: currentTime, end_time: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    const start = currentTime;
    currentTime += processList[idx].burst_time;
    gantt.push({ process_id: processList[idx].process_id, start_time: start, end_time: currentTime });

    processList[idx].completion_time = currentTime;
    processList[idx].turnaround_time = processList[idx].completion_time - processList[idx].arrival_time;
    processList[idx].waiting_time = processList[idx].turnaround_time - processList[idx].burst_time;
    processList[idx].final_priority = processList[idx].priority;

    isCompleted[idx] = true;
    results.push(processList[idx]);
    completed++;
  }

  let totalWT = 0, totalTAT = 0;
  results.forEach(p => {
    totalWT += p.waiting_time;
    totalTAT += p.turnaround_time;
  });

  const throughput = n / (currentTime || 1);
  const cpu_utilization = currentTime > 0 ? ((currentTime - totalIdleTime) / currentTime) * 100 : 100;

  return {
    name: 'SJF',
    avg_wt: Number((totalWT / n).toFixed(2)),
    avg_tat: Number((totalTAT / n).toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    cpu_utilization: Number(cpu_utilization.toFixed(2)),
    process_results: results as ProcessResult[],
    gantt
  };
}

function runSRTF(inputProcesses: ProcessInput[]): AlgorithmResult {
  const processList = inputProcesses.map(
    p => new Process(p.process_id, p.arrival_time, p.burst_time, p.priority)
  );
  const n = processList.length;
  const remTime = processList.map(p => p.burst_time);

  let currentTime = 0, completed = 0, totalIdleTime = 0;
  let lastPID = -2;
  let segmentStart = 0;
  const gantt: GanttEntry[] = [];

  while (completed < n) {
    let idx = -1;
    let minRemaining = Infinity;

    for (let i = 0; i < n; i++) {
      if (processList[i].arrival_time <= currentTime && remTime[i] > 0) {
        if (remTime[i] < minRemaining) {
          minRemaining = remTime[i];
          idx = i;
        } else if (remTime[i] === minRemaining) {
          if (processList[i].arrival_time < processList[idx].arrival_time) {
            idx = i;
          }
        }
      }
    }

    const currentPID = idx === -1 ? -1 : processList[idx].process_id;

    if (currentPID !== lastPID) {
      if (currentTime > segmentStart) {
        gantt.push({ process_id: lastPID, start_time: segmentStart, end_time: currentTime });
        if (lastPID === -1) totalIdleTime += currentTime - segmentStart;
      }
      segmentStart = currentTime;
      lastPID = currentPID;
    }

    if (idx === -1) {
      currentTime++;
      continue;
    }

    remTime[idx]--;
    currentTime++;

    if (remTime[idx] === 0) {
      completed++;
      processList[idx].completion_time = currentTime;
      processList[idx].turnaround_time = processList[idx].completion_time - processList[idx].arrival_time;
      processList[idx].waiting_time = processList[idx].turnaround_time - processList[idx].burst_time;
      processList[idx].final_priority = processList[idx].priority;
    }
  }

  if (currentTime > segmentStart) {
    gantt.push({ process_id: lastPID, start_time: segmentStart, end_time: currentTime });
    if (lastPID === -1) totalIdleTime += currentTime - segmentStart;
  }

  let totalWT = 0, totalTAT = 0;
  processList.forEach(p => {
    totalWT += p.waiting_time;
    totalTAT += p.turnaround_time;
  });

  const throughput = n / (currentTime || 1);
  const cpu_utilization = currentTime > 0 ? ((currentTime - totalIdleTime) / currentTime) * 100 : 100;

  return {
    name: 'SRTF',
    avg_wt: Number((totalWT / n).toFixed(2)),
    avg_tat: Number((totalTAT / n).toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    cpu_utilization: Number(cpu_utilization.toFixed(2)),
    process_results: processList as ProcessResult[],
    gantt
  };
}

function runRoundRobin(inputProcesses: ProcessInput[], timeQuantum: number): AlgorithmResult {
  const processList = inputProcesses.map(
    p => new Process(p.process_id, p.arrival_time, p.burst_time, p.priority)
  );
  const n = processList.length;
  const remTime = processList.map(p => p.burst_time);

  let currentTime = 0, completed = 0, totalIdleTime = 0;
  const gantt: GanttEntry[] = [];
  const readyQueue: number[] = [];
  const inQueue = new Array(n).fill(false);

  processList.sort((a, b) => a.arrival_time - b.arrival_time);

  for (let i = 0; i < n; i++) {
    if (processList[i].arrival_time === 0) {
      readyQueue.push(i);
      inQueue[i] = true;
    }
  }

  while (completed < n) {
    if (readyQueue.length === 0) {
      let nextArrival = Infinity;
      for (let i = 0; i < n; i++) {
        if (remTime[i] > 0) nextArrival = Math.min(nextArrival, processList[i].arrival_time);
      }
      totalIdleTime += nextArrival - currentTime;
      gantt.push({ process_id: -1, start_time: currentTime, end_time: nextArrival });
      currentTime = nextArrival;

      for (let i = 0; i < n; i++) {
        if (processList[i].arrival_time <= currentTime && !inQueue[i] && remTime[i] > 0) {
          readyQueue.push(i);
          inQueue[i] = true;
        }
      }
      continue;
    }

    const idx = readyQueue.shift()!;

    const execTime = Math.min(timeQuantum, remTime[idx]);
    const start = currentTime;
    currentTime += execTime;
    remTime[idx] -= execTime;
    gantt.push({ process_id: processList[idx].process_id, start_time: start, end_time: currentTime });

    for (let i = 0; i < n; i++) {
      if (processList[i].arrival_time <= currentTime && !inQueue[i] && remTime[i] > 0) {
        readyQueue.push(i);
        inQueue[i] = true;
      }
    }

    if (remTime[idx] > 0) {
      readyQueue.push(idx);
    } else {
      completed++;
      processList[idx].completion_time = currentTime;
      processList[idx].turnaround_time = processList[idx].completion_time - processList[idx].arrival_time;
      processList[idx].waiting_time = processList[idx].turnaround_time - processList[idx].burst_time;
      processList[idx].final_priority = processList[idx].priority;
    }
  }

  let totalWT = 0, totalTAT = 0;
  processList.forEach(p => {
    totalWT += p.waiting_time;
    totalTAT += p.turnaround_time;
  });

  const throughput = n / (currentTime || 1);
  const cpu_utilization = currentTime > 0 ? ((currentTime - totalIdleTime) / currentTime) * 100 : 100;

  return {
    name: 'Round Robin',
    avg_wt: Number((totalWT / n).toFixed(2)),
    avg_tat: Number((totalTAT / n).toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    cpu_utilization: Number(cpu_utilization.toFixed(2)),
    process_results: processList as ProcessResult[],
    gantt
  };
}

function runPreemptivePriorityWithAging(inputProcesses: ProcessInput[]): AlgorithmResult {
  const processList = inputProcesses.map(
    p => new Process(p.process_id, p.arrival_time, p.burst_time, p.priority)
  );
  const n = processList.length;
  let currentTime = 0, completed = 0, totalIdleTime = 0;
  let lastPID = -2, segmentStart = 0;

  const gantt: GanttEntry[] = [];
  const AGING_THRESHOLD = 5;
  const hasArrived = new Array(n).fill(false);

  function sortPQ(pq: Process[]) {
    pq.sort((p1, p2) => {
      if (p1.priority === p2.priority) {
        return p1.arrival_time - p2.arrival_time;
      }
      return p1.priority - p2.priority;
    });
  }

  const pq: Process[] = [];

  while (completed < n) {
    for (let i = 0; i < n; i++) {
      if (processList[i].arrival_time <= currentTime && processList[i].remaining_time > 0 && !hasArrived[i]) {
        pq.push(processList[i]);
        hasArrived[i] = true;
      }
    }

    if (pq.length > 0) {
      pq.forEach(p => {
        const currentWaitingTime = currentTime - p.arrival_time - (p.burst_time - p.remaining_time);
        if (currentWaitingTime > 0 && currentWaitingTime % AGING_THRESHOLD === 0) {
          if (p.priority > 1) {
            p.priority--;
          }
        }
      });
      sortPQ(pq);
    }

    const currentPID = pq.length === 0 ? -1 : pq[0].process_id;

    if (currentPID !== lastPID) {
      if (currentTime > segmentStart) {
        gantt.push({ process_id: lastPID, start_time: segmentStart, end_time: currentTime });
        if (lastPID === -1) totalIdleTime += currentTime - segmentStart;
      }
      segmentStart = currentTime;
      lastPID = currentPID;
    }

    if (pq.length === 0) {
      currentTime++;
      continue;
    }

    const currentJob = pq.shift()!;
    currentJob.remaining_time--;
    currentTime++;

    if (currentJob.remaining_time === 0) {
      completed++;
      currentJob.completion_time = currentTime;
      currentJob.turnaround_time = currentJob.completion_time - currentJob.arrival_time;
      currentJob.waiting_time = currentJob.turnaround_time - currentJob.burst_time;
      currentJob.final_priority = currentJob.priority;
    } else {
      pq.push(currentJob);
      sortPQ(pq);
    }
  }

  if (currentTime > segmentStart) {
    gantt.push({ process_id: lastPID, start_time: segmentStart, end_time: currentTime });
    if (lastPID === -1) totalIdleTime += currentTime - segmentStart;
  }

  let totalWT = 0, totalTAT = 0;
  processList.forEach(p => {
    totalWT += p.waiting_time;
    totalTAT += p.turnaround_time;
  });

  const throughput = n / (currentTime || 1);
  const cpu_utilization = currentTime > 0 ? ((currentTime - totalIdleTime) / currentTime) * 100 : 100;

  return {
    name: 'Preemptive Priority',
    avg_wt: Number((totalWT / n).toFixed(2)),
    avg_tat: Number((totalTAT / n).toFixed(2)),
    throughput: Number(throughput.toFixed(4)),
    cpu_utilization: Number(cpu_utilization.toFixed(2)),
    process_results: processList as ProcessResult[],
    gantt
  };
}

function getRecommendation(masterList: ProcessInput[], summary: AlgorithmResult[], bestAlgoIdx: number) {
  let allSameBurst = true;
  let highBurstVariance = false;
  const firstBurst = masterList[0].burst_time;
  let maxBurst = -Infinity, minBurst = Infinity;

  masterList.forEach(p => {
    if (p.burst_time !== firstBurst) allSameBurst = false;
    if (p.burst_time > maxBurst) maxBurst = p.burst_time;
    if (p.burst_time < minBurst) minBurst = p.burst_time;
  });

  if ((maxBurst - minBurst) > 10) highBurstVariance = true;

  const burstPattern = allSameBurst ? 'Uniform/Equally Distributed' : 'Varying Lengths';
  const contextSwitchRisk = highBurstVariance ? 'High (Mix of Long & Short Tasks)' : 'Low/Moderate';

  let recAlgo: string;
  let reason: string;
  if (allSameBurst) {
    recAlgo = 'Round Robin / FCFS';
    reason = "Uniform burst distribution renders SRTF's overhead useless. RR guarantees fairness without extra overhead.";
  } else if (highBurstVariance) {
    recAlgo = 'SRTF (Shortest Remaining Time First)';
    reason = 'High variance benefit heavily from preemption. SRTF maximizes throughput by sweeping short jobs instantly.';
  } else {
    recAlgo = summary[bestAlgoIdx].name;
    reason = `Based on current live metric simulation, it maintains optimal balance maximizing CPU Utilization (${summary[bestAlgoIdx].cpu_utilization.toFixed(2)}%).`;
  }

  return { burstPattern, contextSwitchRisk, recommendedAlgorithm: recAlgo, reason };
}

export function simulateLocally(processes: ProcessInput[], timeQuantum: number): SimulationResponse {
  const summary = [
    runFCFS(processes),
    runSJF(processes),
    runSRTF(processes),
    runRoundRobin(processes, timeQuantum),
    runPreemptivePriorityWithAging(processes)
  ];

  let bestAlgoIndex = 0;
  let minWT = summary[0].avg_wt;
  for (let i = 0; i < summary.length; i++) {
    if (summary[i].avg_wt < minWT) {
      minWT = summary[i].avg_wt;
      bestAlgoIndex = i;
    }
  }

  const recommendation = getRecommendation(processes, summary, bestAlgoIndex);

  return {
    timeQuantum: Number(timeQuantum),
    bestAlgorithmIndex: bestAlgoIndex,
    bestAlgorithmName: summary[bestAlgoIndex].name,
    recommendation,
    results: summary,
    engineUsed: 'Integrated C++ Engine Core (Local Fallback)'
  };
}
