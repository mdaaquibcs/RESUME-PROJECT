import type { ProcessInput, SimulationResponse } from '../types/scheduler';
import { simulateLocally } from './localEngine';

const STORAGE_KEY = 'cpu_sim_backend_url';

/**
 * Returns the currently active backend API base URL.
 * Priority:
 * 1. User manual override stored in localStorage
 * 2. Build-time environment variable `VITE_API_URL`
 * 3. Default relative `/api` (for local proxy or unified deployment)
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return '';
}

/**
 * Allows the user to dynamically configure a custom backend endpoint
 * (useful when frontend is hosted on Vercel/Netlify and backend is on Render/Railway).
 */
export function setApiBaseUrl(url: string): void {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEY, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Resets backend URL to the default environment or relative route.
 */
export function resetApiBaseUrl(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Performs a health check against the backend server.
 */
export async function checkBackendHealth(timeoutMs = 7000): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
  isWakingUp?: boolean;
}> {
  const base = getApiBaseUrl();
  const endpoint = `${base}/api/health`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'online' }));
      return { ok: true, data };
    } else {
      const is502 = res.status === 502;
      return {
        ok: false,
        error: is502
          ? 'Backend server (port 5000) is not running.'
          : `Server responded with HTTP status ${res.status}`
      };
    }
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      isWakingUp: isTimeout,
      error: isTimeout
        ? 'Connection timed out. (If hosted on Render free tier, server may take ~45s to wake up).'
        : (err.message || 'Unable to connect to backend server.')
    };
  }
}

/**
 * Submits processes and time quantum to the backend simulation engine.
 * Automatically falls back to the integrated in-browser C++ logic engine if backend is offline.
 */
export async function simulateProcesses(
  processes: ProcessInput[],
  timeQuantum: number,
  timeoutMs = 12000
): Promise<SimulationResponse> {
  const base = getApiBaseUrl();
  const endpoint = `${base}/api/simulate`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        processes,
        timeQuantum,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data: SimulationResponse = await res.json();
      return data;
    }
    console.warn(`Backend responded with status ${res.status}. Falling back to integrated browser engine.`);
  } catch (err: any) {
    clearTimeout(timer);
    console.warn('Backend unavailable, falling back to integrated browser engine:', err.message);
  }

  // Graceful 1:1 C++ logic fallback in client
  return simulateLocally(processes, timeQuantum);
}
