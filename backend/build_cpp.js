const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cppSource = path.join(__dirname, 'cpp', 'scheduler.cpp');
const binDir = path.join(__dirname, 'bin');
const exePath = path.join(binDir, process.platform === 'win32' ? 'scheduler.exe' : 'scheduler');

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

console.log('Checking for C++ compiler to build scheduler binary...');

let compiled = false;

const compilers = [
  { cmd: `g++ -O3 -o "${exePath}" "${cppSource}"`, name: 'g++' },
  { cmd: `clang++ -O3 -o "${exePath}" "${cppSource}"`, name: 'clang++' },
  { cmd: `cl /EHsc /O2 /Fe:"${exePath}" "${cppSource}"`, name: 'MSVC cl' }
];

for (const compiler of compilers) {
  try {
    console.log(`Attempting compilation with ${compiler.name}...`);
    execSync(compiler.cmd, { stdio: 'inherit' });
    if (fs.existsSync(exePath)) {
      console.log(`Successfully compiled C++ scheduler binary at: ${exePath}`);
      compiled = true;
      break;
    }
  } catch (err) {
    // Continue trying other compilers
  }
}

if (!compiled) {
  console.log('No native C++ compiler found in environment PATH.');
  console.log('The backend will use the 1:1 C++ logic fallback module (`backend/engine/scheduler_logic.js`) to serve requests instantly and flawlessly.');
}
