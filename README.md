# CPU Scheduling Simulator (V2.5 PRO)

An interactive, high-performance Operating System CPU Scheduling Simulator web application. Powered directly by our ISO C++ scheduling engine, featuring real-time metric calculations, dynamic Gantt chart timelines, interactive comparison dashboards, and an automated Intelligent Recommendation Engine.

---

## 🌟 Key Features

1. **Native C++ Engine Source of Truth**: Preserves all core C++ scheduling logic (`FCFS`, `SJF`, `SRTF`, `Round Robin`, `Preemptive Priority with Aging`).
2. **5 Core CPU Algorithms**:
   - **FCFS** (First Come First Served)
   - **SJF** (Shortest Job First - Non-preemptive)
   - **SRTF** (Shortest Remaining Time First - Preemptive)
   - **Round Robin** (Time Quantum circular queue)
   - **Preemptive Priority with Aging** (STL `priority_queue` with dynamic starvation protection threshold = 5 units)
3. **Dynamic Interactive Gantt Chart**:
   - Color-coded process execution blocks with duration badges.
   - Clear visual representation of **IDLE** CPU time segments.
   - Hover tooltips showing exact start, end, and duration timestamps.
4. **Calculated OS Metrics**:
   - Completion Time (CT)
   - Turnaround Time (TAT)
   - Waiting Time (WT)
   - Average Waiting Time & Average Turnaround Time
   - Throughput (processes / unit time)
   - CPU Utilization (%)
5. **Intelligent Scheduler Recommendation Engine**:
   - Analyzes workload parameters (uniform vs. varying burst lengths, context-switch risk).
   - Generates automated algorithm verdicts matching the native C++ engine.
6. **Interactive Comparative Dashboard**:
   - Multi-metric comparative table.
   - Visual Recharts bar graphs for Avg WT, Avg TAT, CPU Utilization, and Throughput.
7. **Preset Scenarios & Custom Input Builder**:
   - Dynamic process builder with real-time validation (positive burst time, non-negative arrival time, unique PIDs).
   - One-click presets (Varying Bursts, Uniform Bursts, Priority Starvation & Aging).

---

## 🏗️ Architecture

```
CPU PROJECT/
├── backend/
│   ├── cpp/
│   │   └── scheduler.cpp       # ISO C++ Scheduling Engine (JSON IPC enabled)
│   ├── bin/
│   │   └── scheduler.exe       # Compiled native executable
│   ├── engine/
│   │   └── scheduler_logic.js  # Integrated 1:1 C++ logic bridge fallback
│   ├── server.js               # Express API bridge (Port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Hero, DynamicInputForm, GanttChartVisualizer, etc.
│   │   ├── pages/              # Dashboard, Simulator, AlgorithmsInfo, ComparisonPage, AboutPage
│   │   └── App.tsx
│   └── package.json
├── run-app.js                  # Master launcher script
└── README.md
```

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Optional: `g++`, `clang++`, or MSVC `cl` compiler (if present in system PATH, the backend will auto-compile `scheduler.cpp` into `scheduler.exe`).

### Installation & Launch

1. **Install Dependencies & Launch App**:
   ```bash
   npm run dev
   ```
   *or manually:*
   ```bash
   # Terminal 1: Backend API Server
   cd backend
   npm install
   node server.js

   # Terminal 2: Frontend React Web UI
   cd frontend
   npm install
   npx vite --port 3000
   ```

2. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Verification & Testing

- Navigate to the **Simulator** tab.
- Click **Run Simulation** or select any preset scenario (**Preset 1: Varying Bursts**, **Preset 2: Uniform Bursts**, or **Preset 3: Priority Starvation & Aging**).
- Observe real-time metric calculations, dynamic Gantt timeline visualization, metric comparison charts, and AI recommendation verdicts.
