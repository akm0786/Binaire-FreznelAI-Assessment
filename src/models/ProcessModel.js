export class ProcessModel {
  constructor({ pid, program, command, threads, user, rssKb, cpu }) {
    this.pid = Number(pid);
    this.program = (program || '').slice(0, 14);
    this.command = (command || program || '').slice(0, 26);
    this.threads = Number(threads) || 1;
    this.user = (user || 'root').slice(0, 8);
    this.memBytes = (Number(rssKb) || 0) * 1024;
    this.cpu = parseFloat(cpu) || 0.0;
  }

  // Memory ko table ke hisaab se short format (230M, 84K) me dikhane ke liye
  getFormattedMemory() {
    const mb = this.memBytes / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)}G`;
    if (mb >= 1) return `${Math.round(mb)}M`;
    return `${Math.round(this.memBytes / 1024)}K`;
  }
}