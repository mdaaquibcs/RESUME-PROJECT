export interface ProcessInput {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  priority: number;
}

export interface ProcessResult extends ProcessInput {
  original_priority: number;
  final_priority: number;
  completion_time: number;
  turnaround_time: number;
  waiting_time: number;
}

export interface GanttEntry {
  process_id: number;
  start_time: number;
  end_time: number;
}

export interface AlgorithmResult {
  name: string;
  avg_wt: number;
  avg_tat: number;
  throughput: number;
  cpu_utilization: number;
  process_results: ProcessResult[];
  gantt: GanttEntry[];
}

export interface Recommendation {
  burstPattern: string;
  contextSwitchRisk: string;
  recommendedAlgorithm: string;
  reason: string;
}

export interface SimulationResponse {
  timeQuantum: number;
  bestAlgorithmIndex: number;
  bestAlgorithmName: string;
  recommendation: Recommendation;
  results: AlgorithmResult[];
  engineUsed?: string;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  timeQuantum: number;
  processes: ProcessInput[];
}
