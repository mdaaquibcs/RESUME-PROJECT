const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('=======================================================');
console.log('   LAUNCHING CPU SCHEDULING SIMULATOR (V2.5 PRO)       ');
console.log('=======================================================');

// 1. Start Backend Express API Server (Port 5000)
const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Vite Dev Server (Port 3000)
const frontend = spawn('npx', ['vite', '--port', '3000'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
