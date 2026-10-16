export class ProcessSorter {
  constructor(sortBy = 'cpu', isReverse = false) {
    this.sortBy = sortBy; // 'cpu' | 'mem' | 'pid' | 'program'
    this.isReverse = isReverse;
  }

  setSortBy(field) {
    this.sortBy = field;
  }

  toggleReverse() {
    this.isReverse = !this.isReverse;
  }

  sort(processes) {
    const sorted = [...processes].sort((a, b) => {
      switch (this.sortBy) {
        case 'mem':
          return b.memBytes - a.memBytes;
        case 'pid':
          return a.pid - b.pid;
        case 'program':
          return a.program.localeCompare(b.program);
        case 'cpu':
        default:
          return b.cpu - a.cpu;
      }
    });

    return this.isReverse ? sorted.reverse() : sorted;
  }
}