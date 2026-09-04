const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cppEngineFallback = require('./engine/scheduler_logic');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurable CORS for split deployment (e.g. Vercel/Netlify frontend + Render backend)
const allowedOrigins = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*';
const corsOptions = {
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const binExe = path.join(__dirname, 'bin', process.platform === 'win32' ? 'scheduler.exe' : 'scheduler');

/**
 * Executes compiled C++ executable via child_process spawn
 */
function runCppBinary(processes, timeQuantum) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(binExe)) {
      return reject(new Error('C++ Binary not found'));
    }

    const child = spawn(binExe, ['--json']);
    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', data => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', data => {
      stderrData += data.toString();
    });

    child.on('error', err => {
      reject(err);
    });

    child.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`C++ binary exited with code ${code}: ${stderrData}`));
      }
      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse C++ JSON output: ${e.message}`));
      }
    });

    // Write process input to C++ process stdin
    // Format: n pid1 at1 bt1 pr1 pid2 at2 bt2 pr2 ... timeQuantum
    let inputStr = `${processes.length}\n`;
    processes.forEach(p => {
      inputStr += `${p.process_id} ${p.arrival_time} ${p.burst_time} ${p.priority}\n`;
    });
    inputStr += `${timeQuantum}\n`;

    child.stdin.write(inputStr);
    child.stdin.end();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const binaryAvailable = fs.existsSync(binExe);
  res.json({
    status: 'online',
    engine: 'C++ Scheduling Simulator Engine (V2.5 PRO)',
    binaryAvailable,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simulation endpoint
app.post('/api/simulate', async (req, res) => {
  try {
    const { processes, timeQuantum } = req.body;

    if (!Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ error: 'Processes must be a non-empty array' });
    }

    const tq = Number(timeQuantum) || 2;
    if (tq <= 0) {
      return res.status(400).json({ error: 'Time Quantum must be greater than 0' });
    }

    // Validate processes structure
    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];
      if (p.arrival_time < 0 || p.burst_time <= 0 || p.priority < 0) {
        return res.status(400).json({
          error: `Invalid process at index ${i}: Arrival time must be >= 0, Burst time > 0, Priority >= 0`
        });
      }
    }

    // Attempt direct C++ Binary Execution first
    try {
      if (fs.existsSync(binExe)) {
        const cppResult = await runCppBinary(processes, tq);
        return res.json({
          ...cppResult,
          engineUsed: 'C++ Executable Binary (scheduler.exe)'
        });
      }
    } catch (cppError) {
      console.warn('C++ binary execution warning:', cppError.message, '- Falling back to 1:1 C++ logic engine.');
    }

    // 1:1 C++ Logic Engine execution fallback
    const result = cppEngineFallback.simulateAll(processes, tq);
    return res.json({
      ...result,
      engineUsed: 'C++ Engine Core (1:1 Native Bridge)'
    });

  } catch (error) {
    console.error('Simulation Endpoint Error:', error);
    res.status(500).json({ error: 'Internal Server Simulation Error: ' + error.message });
  }
});

// Serve frontend static build files in unified full-stack deployment
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  console.log(`[Unified Server] Serving production frontend build from: ${frontendDist}`);
  app.use(express.static(frontendDist));

  // SPA fallback for non-API client routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // If frontend not built yet, provide informational root endpoint
  app.get('/', (req, res) => {
    res.json({
      service: 'CPU Scheduling Simulator API Server (V2.5 PRO)',
      status: 'online',
      message: 'Backend API is active. To serve frontend on this port, build the frontend (`npm run build`).',
      endpoints: {
        health: '/api/health',
        simulate: 'POST /api/simulate'
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CPU SCHEDULING SIMULATOR BACKEND ENGINE (V2.5 PRO)  `);
  console.log(`=======================================================`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  Binary Status: ${fs.existsSync(binExe) ? 'Available (' + binExe + ')' : 'Using 1:1 Integrated C++ Engine'}`);
  console.log(`  Frontend Status: ${fs.existsSync(frontendDist) ? 'Built & Serving (Unified Mode)' : 'API Only Mode'}`);
  console.log(`=======================================================`);
});
