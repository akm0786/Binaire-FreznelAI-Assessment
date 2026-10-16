export class Formatter {
  // Bytes ko GiB / MiB / KiB me convert karne ke liye (jaise screenshot me 15.8 GiB hai)
  static formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

  // Seconds ko HH:MM:SS uptime me convert karne ke liye (jaise up 03:38:55)
  static formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  // Percentage (0-100) ko Terminal Progress Bar (███░░░) me badalne ke liye
  static createBar(percentage, width = 15) {
    const clamped = Math.max(0, Math.min(100, percentage || 0));
    const filledLength = Math.round((clamped / 100) * width);
    const emptyLength = Math.max(0, width - filledLength);
    return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
  }
}