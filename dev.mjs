import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Запуск интернет-магазина футболок «Тест» (Palette 4)...');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const backendProcess = spawn(npmCmd, ['--prefix', 'backend', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

const frontendProcess = spawn(npmCmd, ['--prefix', 'frontend', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

function handleExit(code) {
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(code ?? 0);
}

process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));
backendProcess.on('exit', (code) => {
  if (code !== 0) console.error(`Backend process exited with code ${code}`);
});
frontendProcess.on('exit', (code) => {
  if (code !== 0) console.error(`Frontend process exited with code ${code}`);
});
