import React, { useState } from 'react';
import { Cpu, LayoutDashboard, PlayCircle, BookOpen, BarChart3, Info, CheckCircle2, AlertCircle, Settings, Radio } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, checkBackendHealth } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverOnline: boolean | null;
  onRefreshHealth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, serverOnline, onRefreshHealth }) => {
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [backendInput, setBackendInput] = useState<string>(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      // Temporarily set to test
      setApiBaseUrl(backendInput);
      const res = await checkBackendHealth(8000);
      if (res.ok) {
        setTestStatus({ ok: true, message: 'Successfully connected to backend API engine!' });
        if (onRefreshHealth) onRefreshHealth();
      } else {
        setTestStatus({
          ok: false,
          message: res.error || 'Failed to reach backend at this URL. Check URL or CORS settings.'
        });
      }
    } catch (e: any) {
      setTestStatus({ ok: false, message: e.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveUrl = async () => {
    setApiBaseUrl(backendInput);
    setShowConfigModal(false);
    if (onRefreshHealth) onRefreshHealth();
  };

  const handleResetUrl = () => {
    resetApiBaseUrl();
    setBackendInput('');
    setTestStatus(null);
    if (onRefreshHealth) onRefreshHealth();
  };

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

          {/* Backend Status Badge & Config Modal Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowConfigModal(true)}
              title="Click to configure or test Backend API Connection"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs transition-colors cursor-pointer group"
            >
              {serverOnline ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Backend Ready</span>
                </>
              ) : serverOnline === false ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-amber-400 font-medium">Backend Reconnecting</span>
                </>
              ) : (
                <span className="text-slate-500 animate-pulse">Checking Engine...</span>
              )}
              <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              Simulate Now
            </button>
          </div>
        </div>
      </div>

      {/* Backend Connection Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Backend Connection Setup</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white text-xl leading-none p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If your backend is deployed on <strong className="text-cyan-300">Render, Railway, or VPS</strong> while your frontend is on <strong className="text-cyan-300">Vercel or Netlify</strong>, provide your backend URL below.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>API Endpoint URL</span>
                <span className="text-slate-500 font-normal">
                  {backendInput ? 'Custom URL' : 'Default (/api)'}
                </span>
              </label>
              <input
                type="text"
                value={backendInput}
                onChange={(e) => setBackendInput(e.target.value)}
                placeholder="e.g. https://cpu-scheduler-backend.onrender.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {testStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                testStatus.ok ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300' : 'bg-rose-950/60 border border-rose-800/80 text-rose-300'
              }`}>
                {testStatus.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{testStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleResetUrl}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Reset to Default
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestConnection}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors disabled:opacity-50"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-900/30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
