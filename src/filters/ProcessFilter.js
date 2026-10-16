export class ProcessFilter {
  constructor() {
    this.activeUser = null; 
  }

  filterByUser(processes, username) {
    if (!username) return processes;
    return processes.filter((p) => p.user.toLowerCase() === username.toLowerCase());
  }
}