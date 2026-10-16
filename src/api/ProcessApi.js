import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { ProcessModel } from '../models/ProcessModel.js';

const execAsync = promisify(exec);

export class ProcessApi {
  async fetchProcesses() {
    try {
      // Linux command to get PID, Program, Threads(nlwp), User, Memory(rss in KB), CPU%, and Full Command
      const cmd = `ps -eo pid,comm,nlwp,user,rss,%cpu,args --sort=-%cpu --no-headers | head -n 120`;
      const { stdout } = await execAsync(cmd);

      return stdout
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const parts = line.trim().split(/\s+/);
          const [pid, program, threads, user, rssKb, cpu] = parts;
          const command = parts.slice(6).join(' ');
          return new ProcessModel({ pid, program, command, threads, user, rssKb, cpu });
        });
    } catch (error) {
      return [];
    }
  }
}