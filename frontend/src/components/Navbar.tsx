import React from 'react';
import { Cpu, LayoutDashboard, PlayCircle, BookOpen, BarChart3, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverOnline: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, serverOnline }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Simulator', icon: PlayCircle },
    { id: 'algorithms', label: 'Algorithms', icon: BookOpen },
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative p-2.5 bg-cyan-950/80 rounded-xl border border-cyan-500/40 shadow-lg shadow-cyan-900/20 group">
              <Cpu className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  CPU Scheduling Simulator
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-md">
                  V2.5 PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive Operating System Scheduling Analysis
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950 border border-cyan-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              {serverOnline ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">C++ Engine Ready</span>
                </>
              ) : serverOnline === false ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-medium">Engine Connecting...</span>
                </>
              ) : (
                <span className="text-slate-500 animate-pulse">Initializing...</span>
              )}
            </div>

            <button
              onClick={() => setActiveTab('simulator')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              Simulate Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-800/80 px-2 py-2 bg-slate-950/90 justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive ? 'text-cyan-400 bg-cyan-950/50' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
