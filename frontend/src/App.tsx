import React, { useState, useEffect } from 'react';
import type { ProcessInput, SimulationResponse } from './types/scheduler';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Simulator } from './pages/Simulator';
import { AlgorithmsInfo } from './pages/AlgorithmsInfo';
import { ComparisonPage } from './pages/ComparisonPage';
import { AboutPage } from './pages/AboutPage';
import { Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Initial Sample Process Queue
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { process_id: 1, arrival_time: 0, burst_time: 8, priority: 3 },
    { process_id: 2, arrival_time: 1, burst_time: 4, priority: 1 },
    { process_id: 3, arrival_time: 2, burst_time: 9, priority: 4 },
    { process_id: 4, arrival_time: 3, burst_time: 2, priority: 2 },
    { process_id: 5, arrival_time: 4, burst_time: 5, priority: 5 },
  ]);

  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [selectedAlgorithmIdx, setSelectedAlgorithmIdx] = useState<number>(0);

  // Check Backend Health & Run Initial Simulation
  useEffect(() => {
    const checkServerAndSimulate = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          setServerOnline(true);
        } else {
          setServerOnline(false);
        }
      } catch (err) {
        setServerOnline(false);
      }

      // Auto-run initial simulation for instant dashboard metrics
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ processes, timeQuantum }),
        });
        if (res.ok) {
          const data: SimulationResponse = await res.json();
          setSimulationData(data);
          setSelectedAlgorithmIdx(data.bestAlgorithmIndex || 0);
        }
      } catch (err) {
        console.warn('Initial auto-simulation fetch warning:', err);
      }
    };

    checkServerAndSimulate();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverOnline={serverOnline}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            onStartSimulation={() => setActiveTab('simulator')}
            onExploreAlgorithms={() => setActiveTab('algorithms')}
            onViewComparison={() => setActiveTab('comparison')}
            simulationData={simulationData}
            selectedAlgorithmIdx={selectedAlgorithmIdx}
            setSelectedAlgorithmIdx={setSelectedAlgorithmIdx}
          />
        )}

        {activeTab === 'simulator' && (
          <Simulator
            processes={processes}
            setProcesses={setProcesses}
            timeQuantum={timeQuantum}
            setTimeQuantum={setTimeQuantum}
            simulationData={simulationData}
            setSimulationData={setSimulationData}
            selectedAlgorithmIdx={selectedAlgorithmIdx}
            setSelectedAlgorithmIdx={setSelectedAlgorithmIdx}
          />
        )}

        {activeTab === 'algorithms' && (
          <AlgorithmsInfo onStartSimulation={() => setActiveTab('simulator')} />
        )}

        {activeTab === 'comparison' && (
          <ComparisonPage
            simulationData={simulationData}
            onStartSimulation={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CPU Scheduling Simulator V2.5 PRO</span>
            <span>—</span>
            <span>Native C++ OS Engine & Web Interface</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-500">
            <span>Built with C++, Express & React</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
