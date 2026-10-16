export class ProcessSearch {
  constructor(query = '') {
    this.query = query;
  }

  setQuery(query) {
    this.query = query.trim().toLowerCase();
  }

  search(processes) {
    if (!this.query) return processes;
    return processes.filter(
      (p) =>
        p.program.toLowerCase().includes(this.query) ||
        p.command.toLowerCase().includes(this.query) ||
        String(p.pid).includes(this.query)
    );
  }
}