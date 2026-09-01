#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <string>
#include <climits>
#include <queue>
#include <sstream>

using namespace std;

class Process {
public:
    int process_id;
    int arrival_time;
    int burst_time;
    int priority;
    int original_priority;
    int remaining_time;

    int completion_time;
    int turnaround_time;
    int waiting_time;

    Process(int pid, int at, int bt, int pr) {
        process_id = pid;
        arrival_time = at;
        burst_time = bt;
        priority = pr;
        original_priority = pr;
        remaining_time = bt;
        completion_time = 0;
        turnaround_time = 0;
        waiting_time = 0;
    }
};

struct GanttEntry {
    int process_id;
    int start_time;
    int end_time;
};

struct AlgorithmResult {
    string name;
    float avg_wt;
    float avg_tat;
    float throughput;
    float cpu_utilization;
    vector<Process> process_results;
    vector<GanttEntry> gantt;
};

struct ComparePriority {
    bool operator()(const Process* const& p1, const Process* const& p2) {
        if (p1->priority == p2->priority) {
            return p1->arrival_time > p2->arrival_time;
        }
        return p1->priority > p2->priority;
    }
};

class CPUScheduling {
public:
    AlgorithmResult FCFS(vector<Process> processList);
    AlgorithmResult SJF(vector<Process> processList);
    AlgorithmResult SRTF(vector<Process> processList);
    AlgorithmResult RoundRobin(vector<Process> processList, int timeQuantum);
    AlgorithmResult PreemptivePriorityWithAging(vector<Process> processList);
};

// 1. First Come First Served (FCFS)
AlgorithmResult CPUScheduling::FCFS(vector<Process> processList) {
    int n = processList.size();
    sort(processList.begin(), processList.end(), [](const Process& a, const Process& b) {
        return a.arrival_time < b.arrival_time;
    });

    int currentTime = 0;
    int totalIdleTime = 0;
    vector<GanttEntry> gantt;

    for (int i = 0; i < n; i++) {
        if (currentTime < processList[i].arrival_time) {
            totalIdleTime += (processList[i].arrival_time - currentTime);
            gantt.push_back({-1, currentTime, processList[i].arrival_time});
            currentTime = processList[i].arrival_time;
        }
        int start = currentTime;
        currentTime += processList[i].burst_time;
        gantt.push_back({processList[i].process_id, start, currentTime});

        processList[i].completion_time = currentTime;
        processList[i].turnaround_time = processList[i].completion_time - processList[i].arrival_time;
        processList[i].waiting_time = processList[i].turnaround_time - processList[i].burst_time;
    }

    float totalWT = 0, totalTAT = 0;
    for (const auto& p : processList) {
        totalWT += p.waiting_time;
        totalTAT += p.turnaround_time;
    }

    float throughput = (float)n / currentTime;
    float cpu_utilization = ((float)(currentTime - totalIdleTime) / currentTime) * 100;

    return {"FCFS", totalWT / n, totalTAT / n, throughput, cpu_utilization, processList, gantt};
}

// 2. Shortest Job First (SJF)
AlgorithmResult CPUScheduling::SJF(vector<Process> processList) {
    int n = processList.size();
    int currentTime = 0, completed = 0, totalIdleTime = 0;
    vector<bool> isCompleted(n, false);
    vector<GanttEntry> gantt;
    vector<Process> results;

    while (completed < n) {
        int idx = -1;
        int minBurst = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!isCompleted[i] && processList[i].arrival_time <= currentTime) {
                if (processList[i].burst_time < minBurst) {
                    minBurst = processList[i].burst_time;
                    idx = i;
                }
                else if (processList[i].burst_time == minBurst) {
                    if (processList[i].arrival_time < processList[idx].arrival_time)
                        idx = i;
                }
            }
        }

        if (idx == -1) {
            int nextArrival = INT_MAX;
            for (int i = 0; i < n; i++) {
                if (!isCompleted[i]) nextArrival = min(nextArrival, processList[i].arrival_time);
            }
            totalIdleTime += (nextArrival - currentTime);
            gantt.push_back({-1, currentTime, nextArrival});
            currentTime = nextArrival;
            continue;
        }

        int start = currentTime;
        currentTime += processList[idx].burst_time;
        gantt.push_back({processList[idx].process_id, start, currentTime});

        processList[idx].completion_time = currentTime;
        processList[idx].turnaround_time = processList[idx].completion_time - processList[idx].arrival_time;
        processList[idx].waiting_time = processList[idx].turnaround_time - processList[idx].burst_time;
        
        isCompleted[idx] = true;
        results.push_back(processList[idx]);
        completed++;
    }

    float totalWT = 0, totalTAT = 0;
    for (const auto& p : results) {
        totalWT += p.waiting_time;
        totalTAT += p.turnaround_time;
    }

    float throughput = (float)n / currentTime;
    float cpu_utilization = ((float)(currentTime - totalIdleTime) / currentTime) * 100;

    return {"SJF", totalWT / n, totalTAT / n, throughput, cpu_utilization, results, gantt};
}

// 3. Shortest Remaining Time First (SRTF)
AlgorithmResult CPUScheduling::SRTF(vector<Process> processList) {
    int n = processList.size();
    vector<int> remTime(n);
    for (int i = 0; i < n; i++) remTime[i] = processList[i].burst_time;

    int currentTime = 0, completed = 0, totalIdleTime = 0;
    int lastPID = -2; 
    int segmentStart = 0;
    vector<GanttEntry> gantt;

    while (completed < n) {
        int idx = -1;
        int minRemaining = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (processList[i].arrival_time <= currentTime && remTime[i] > 0) {
                if (remTime[i] < minRemaining) {
                    minRemaining = remTime[i];
                    idx = i;
                }
                else if (remTime[i] == minRemaining) {
                    if (processList[i].arrival_time < processList[idx].arrival_time)
                        idx = i;
                }
            }
        }

        int currentPID = (idx == -1) ? -1 : processList[idx].process_id;

        if (currentPID != lastPID) {
            if (currentTime > segmentStart) {
                gantt.push_back({lastPID, segmentStart, currentTime});
                if (lastPID == -1) totalIdleTime += (currentTime - segmentStart);
            }
            segmentStart = currentTime;
            lastPID = currentPID;
        }

        if (idx == -1) {
            currentTime++;
            continue;
        }

        remTime[idx]--;
        currentTime++;

        if (remTime[idx] == 0) {
            completed++;
            processList[idx].completion_time = currentTime;
            processList[idx].turnaround_time = processList[idx].completion_time - processList[idx].arrival_time;
            processList[idx].waiting_time = processList[idx].turnaround_time - processList[idx].burst_time;
        }
    }
    if (currentTime > segmentStart) {
        gantt.push_back({lastPID, segmentStart, currentTime});
        if (lastPID == -1) totalIdleTime += (currentTime - segmentStart);
    }

    float totalWT = 0, totalTAT = 0;
    for (const auto& p : processList) {
        totalWT += p.waiting_time;
        totalTAT += p.turnaround_time;
    }

    float throughput = (float)n / currentTime;
    float cpu_utilization = ((float)(currentTime - totalIdleTime) / currentTime) * 100;

    return {"SRTF", totalWT / n, totalTAT / n, throughput, cpu_utilization, processList, gantt};
}

// 4. Round Robin (RR) using STL Queue
AlgorithmResult CPUScheduling::RoundRobin(vector<Process> processList, int timeQuantum) {
    int n = processList.size();
    vector<int> remTime(n);
    for (int i = 0; i < n; i++) remTime[i] = processList[i].burst_time;

    int currentTime = 0, completed = 0, totalIdleTime = 0;
    vector<GanttEntry> gantt;
    queue<int> readyQueue;
    vector<bool> inQueue(n, false);

    sort(processList.begin(), processList.end(), [](const Process& a, const Process& b) {
        return a.arrival_time < b.arrival_time;
    });

    for(int i=0; i<n; i++) {
        if(processList[i].arrival_time == 0) {
            readyQueue.push(i);
            inQueue[i] = true;
        }
    }

    while (completed < n) {
        if (readyQueue.empty()) {
            int nextArrival = INT_MAX;
            for(int i=0; i<n; i++) {
                if(remTime[i] > 0) nextArrival = min(nextArrival, processList[i].arrival_time);
            }
            totalIdleTime += (nextArrival - currentTime);
            gantt.push_back({-1, currentTime, nextArrival});
            currentTime = nextArrival;
            
            for(int i=0; i<n; i++) {
                if(processList[i].arrival_time <= currentTime && !inQueue[i] && remTime[i] > 0) {
                    readyQueue.push(i);
                    inQueue[i] = true;
                }
            }
            continue;
        }

        int idx = readyQueue.front();
        readyQueue.pop();

        int execTime = min(timeQuantum, remTime[idx]);
        int start = currentTime;
        currentTime += execTime;
        remTime[idx] -= execTime;
        gantt.push_back({processList[idx].process_id, start, currentTime});

        for (int i = 0; i < n; i++) {
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
        }
    }

    float totalWT = 0, totalTAT = 0;
    for (const auto& p : processList) {
        totalWT += p.waiting_time;
        totalTAT += p.turnaround_time;
    }

    float throughput = (float)n / currentTime;
    float cpu_utilization = ((float)(currentTime - totalIdleTime) / currentTime) * 100;

    return {"Round Robin", totalWT / n, totalTAT / n, throughput, cpu_utilization, processList, gantt};
}

// 5. Preemptive Priority Scheduling with ACTUAL STL priority_queue & Aging
AlgorithmResult CPUScheduling::PreemptivePriorityWithAging(vector<Process> processList) {
    int n = processList.size();
    int currentTime = 0, completed = 0, totalIdleTime = 0;
    int lastPID = -2, segmentStart = 0;

    vector<GanttEntry> gantt;
    priority_queue<Process*, vector<Process*>, ComparePriority> pq;

    const int AGING_THRESHOLD = 5; 
    vector<bool> hasArrived(n, false);

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (processList[i].arrival_time <= currentTime && processList[i].remaining_time > 0 && !hasArrived[i]) {
                pq.push(&processList[i]);
                hasArrived[i] = true;
            }
        }

        if (!pq.empty()) {
            vector<Process*> tempStorage;
            while(!pq.empty()) {
                Process* p = pq.top();
                pq.pop();

                int currentWaitingTime = currentTime - p->arrival_time - (p->burst_time - p->remaining_time);
                if (currentWaitingTime > 0 && currentWaitingTime % AGING_THRESHOLD == 0) {
                    if (p->priority > 1) { 
                        p->priority--;
                    }
                }
                tempStorage.push_back(p);
            }
            for(auto* p : tempStorage) pq.push(p);
        }

        int currentPID = pq.empty() ? -1 : pq.top()->process_id;

        if (currentPID != lastPID) {
            if (currentTime > segmentStart) {
                gantt.push_back({lastPID, segmentStart, currentTime});
                if (lastPID == -1) totalIdleTime += (currentTime - segmentStart);
            }
            segmentStart = currentTime;
            lastPID = currentPID;
        }

        if (pq.empty()) {
            currentTime++;
            continue;
        }

        Process* currentJob = pq.top();
        pq.pop();

        currentJob->remaining_time--;
        currentTime++;

        if (currentJob->remaining_time == 0) {
            completed++;
            currentJob->completion_time = currentTime;
            currentJob->turnaround_time = currentJob->completion_time - currentJob->arrival_time;
            currentJob->waiting_time = currentJob->turnaround_time - currentJob->burst_time;
        } else {
            pq.push(currentJob);
        }
    }

    if (currentTime > segmentStart) {
        gantt.push_back({lastPID, segmentStart, currentTime});
        if (lastPID == -1) totalIdleTime += (currentTime - segmentStart);
    }

    float totalWT = 0, totalTAT = 0;
    for (const auto& p : processList) {
        totalWT += p.waiting_time;
        totalTAT += p.turnaround_time;
    }

    float throughput = (float)n / currentTime;
    float cpu_utilization = ((float)(currentTime - totalIdleTime) / currentTime) * 100;

    return {"Preemptive Priority", totalWT / n, totalTAT / n, throughput, cpu_utilization, processList, gantt};
}

struct Recommendation {
    string burstPattern;
    string contextSwitchRisk;
    string recommendedAlgorithm;
    string reason;
};

Recommendation getRecommendation(const vector<Process>& masterList, const vector<AlgorithmResult>& summary, int bestAlgoIdx) {
    bool allSameBurst = true;
    bool highBurstVariance = false;
    int firstBurst = masterList[0].burst_time;
    int maxBurst = INT_MIN, minBurst = INT_MAX;

    for(const auto& p : masterList) {
        if(p.burst_time != firstBurst) allSameBurst = false;
        if(p.burst_time > maxBurst) maxBurst = p.burst_time;
        if(p.burst_time < minBurst) minBurst = p.burst_time;
    }
    if((maxBurst - minBurst) > 10) highBurstVariance = true;

    string burstPattern = allSameBurst ? "Uniform/Equally Distributed" : "Varying Lengths";
    string contextSwitchRisk = highBurstVariance ? "High (Mix of Long & Short Tasks)" : "Low/Moderate";

    string recAlgo, reason;
    if (allSameBurst) {
        recAlgo = "Round Robin / FCFS";
        reason = "Uniform burst distribution renders SRTF's overhead useless. RR guarantees fairness without extra overhead.";
    } else if (highBurstVariance) {
        recAlgo = "SRTF (Shortest Remaining Time First)";
        reason = "High variance benefit heavily from preemption. SRTF maximizes throughput by sweeping short jobs instantly.";
    } else {
        recAlgo = summary[bestAlgoIdx].name;
        ostringstream oss;
        oss << fixed << setprecision(2) << summary[bestAlgoIdx].cpu_utilization;
        reason = "Based on current live metric simulation, it maintains optimal balance maximizing CPU Utilization (" + oss.str() + "%).";
    }

    return {burstPattern, contextSwitchRisk, recAlgo, reason};
}

string jsonEscape(const string& s) {
    string out;
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else if (c == '\n') out += "\\n";
        else out += c;
    }
    return out;
}

string generateJSONOutput(const vector<Process>& masterList, const vector<AlgorithmResult>& summary, int timeQuantum) {
    int bestAlgoIndex = 0;
    float minWT = summary[0].avg_wt;
    for (size_t i = 0; i < summary.size(); i++) {
        if (summary[i].avg_wt < minWT) {
            minWT = summary[i].avg_wt;
            bestAlgoIndex = i;
        }
    }

    Recommendation rec = getRecommendation(masterList, summary, bestAlgoIndex);

    ostringstream json;
    json << "{\n";
    json << "  \"timeQuantum\": " << timeQuantum << ",\n";
    json << "  \"bestAlgorithmIndex\": " << bestAlgoIndex << ",\n";
    json << "  \"bestAlgorithmName\": \"" << jsonEscape(summary[bestAlgoIndex].name) << "\",\n";
    
    json << "  \"recommendation\": {\n";
    json << "    \"burstPattern\": \"" << jsonEscape(rec.burstPattern) << "\",\n";
    json << "    \"contextSwitchRisk\": \"" << jsonEscape(rec.contextSwitchRisk) << "\",\n";
    json << "    \"recommendedAlgorithm\": \"" << jsonEscape(rec.recommendedAlgorithm) << "\",\n";
    json << "    \"reason\": \"" << jsonEscape(rec.reason) << "\"\n";
    json << "  },\n";

    json << "  \"results\": [\n";
    for (size_t i = 0; i < summary.size(); i++) {
        const auto& res = summary[i];
        json << "    {\n";
        json << "      \"name\": \"" << jsonEscape(res.name) << "\",\n";
        json << "      \"avg_wt\": " << fixed << setprecision(2) << res.avg_wt << ",\n";
        json << "      \"avg_tat\": " << fixed << setprecision(2) << res.avg_tat << ",\n";
        json << "      \"throughput\": " << fixed << setprecision(4) << res.throughput << ",\n";
        json << "      \"cpu_utilization\": " << fixed << setprecision(2) << res.cpu_utilization << ",\n";

        json << "      \"process_results\": [\n";
        for (size_t p = 0; p < res.process_results.size(); p++) {
            const auto& proc = res.process_results[p];
            json << "        {\n";
            json << "          \"process_id\": " << proc.process_id << ",\n";
            json << "          \"arrival_time\": " << proc.arrival_time << ",\n";
            json << "          \"burst_time\": " << proc.burst_time << ",\n";
            json << "          \"original_priority\": " << proc.original_priority << ",\n";
            json << "          \"final_priority\": " << proc.priority << ",\n";
            json << "          \"completion_time\": " << proc.completion_time << ",\n";
            json << "          \"turnaround_time\": " << proc.turnaround_time << ",\n";
            json << "          \"waiting_time\": " << proc.waiting_time << "\n";
            json << "        }" << (p + 1 < res.process_results.size() ? "," : "") << "\n";
        }
        json << "      ],\n";

        json << "      \"gantt\": [\n";
        for (size_t g = 0; g < res.gantt.size(); g++) {
            const auto& entry = res.gantt[g];
            json << "        {\n";
            json << "          \"process_id\": " << entry.process_id << ",\n";
            json << "          \"start_time\": " << entry.start_time << ",\n";
            json << "          \"end_time\": " << entry.end_time << "\n";
            json << "        }" << (g + 1 < res.gantt.size() ? "," : "") << "\n";
        }
        json << "      ]\n";

        json << "    }" << (i + 1 < summary.size() ? "," : "") << "\n";
    }
    json << "  ]\n";
    json << "}\n";

    return json.str();
}

int main(int argc, char* argv[]) {
    bool jsonMode = false;
    for (int i = 1; i < argc; i++) {
        if (string(argv[i]) == "--json") {
            jsonMode = true;
            break;
        }
    }

    if (jsonMode) {
        int n, timeQuantum;
        if (!(cin >> n)) return 0;

        vector<Process> masterList;
        for (int i = 0; i < n; i++) {
            int pid, at, bt, pr;
            cin >> pid >> at >> bt >> pr;
            masterList.push_back(Process(pid, at, bt, pr));
        }
        cin >> timeQuantum;

        CPUScheduling scheduler;
        vector<AlgorithmResult> summaryDashboard;
        summaryDashboard.push_back(scheduler.FCFS(masterList));
        summaryDashboard.push_back(scheduler.SJF(masterList));
        summaryDashboard.push_back(scheduler.SRTF(masterList));
        summaryDashboard.push_back(scheduler.RoundRobin(masterList, timeQuantum));
        summaryDashboard.push_back(scheduler.PreemptivePriorityWithAging(masterList));

        cout << generateJSONOutput(masterList, summaryDashboard, timeQuantum);
        return 0;
    }

    int n, timeQuantum;
    if (!(cin >> n)) return 0;

    vector<Process> masterList;
    for (int i = 0; i < n; i++) {
        int pid, at, bt, pr;
        cin >> pid >> at >> bt >> pr;
        masterList.push_back(Process(pid, at, bt, pr));
    }
    cin >> timeQuantum;

    CPUScheduling scheduler;
    vector<AlgorithmResult> summaryDashboard;

    summaryDashboard.push_back(scheduler.FCFS(masterList));
    summaryDashboard.push_back(scheduler.SJF(masterList));
    summaryDashboard.push_back(scheduler.SRTF(masterList));
    summaryDashboard.push_back(scheduler.RoundRobin(masterList, timeQuantum));
    summaryDashboard.push_back(scheduler.PreemptivePriorityWithAging(masterList));

    cout << generateJSONOutput(masterList, summaryDashboard, timeQuantum);
    return 0;
}
