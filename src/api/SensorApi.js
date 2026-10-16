import si from 'systeminformation';
import os from 'node:os';

export class SensorApi {
  constructor() {
    this.cpuHistory = new Array(40).fill(0);
  }

  async fetchAllSensors() {
    try {
      const [cpu, load, temp, mem, fs, netIfaces, netStats, battery, graphics] =
        await Promise.all([
          si.cpu(),
          si.currentLoad(),
          si.cpuTemperature(),
          si.mem(),
          si.fsSize(),
          si.networkInterfaces(),
          si.networkStats(),
          si.battery(),
          si.graphics(),
        ]);

      const currentCpuLoad = Math.round(load.currentLoad || 0);
      this.cpuHistory.push(currentCpuLoad);
      if (this.cpuHistory.length > 40) this.cpuHistory.shift();

      const activeNet = netStats[0] || {};
      const defaultIface =
        netIfaces.find((n) => !n.internal && n.ip4) || netIfaces[0] || {};
      const gpuController = graphics.controllers?.[0] || {};

      return {
        uptime: os.uptime(),
        loadAvg: os.loadavg().map((n) => n.toFixed(2)), // [1m, 5m, 15m]
        cpu: {
          brand: `${cpu.manufacturer || ''} ${cpu.brand || 'CPU'}`.trim(),
          speed: `${cpu.speed || 0} GHz`,
          totalLoad: currentCpuLoad,
          mainTemp: Math.round(temp.main || 45),
          cores: (load.cpus || []).slice(0, 8).map((c, idx) => ({
            core: idx,
            load: Math.round(c.load || 0),
            temp: Math.round(temp.cores?.[idx] || temp.main || 45),
          })),
          history: [...this.cpuHistory],
        },
        gpu: {
          model: (gpuController.model || 'Integrated Graphics').slice(0, 22),
          load: Math.round(gpuController.utilizationGpu || 0),
          temp: Math.round(gpuController.temperatureGpu || temp.main || 45),
          vramUsed: (gpuController.memoryUsed || 0) * 1024 * 1024,
          vramTotal: (gpuController.memoryTotal || 0) * 1024 * 1024,
        },
        mem: {
          total: mem.total,
          used: mem.used,
          available: mem.available,
          cached: mem.cached,
          swapTotal: mem.swaptotal,
          swapUsed: mem.swapused,
        },
        disks: (fs || []).slice(0, 3).map((d) => ({
          mount: d.mount,
          size: d.size,
          used: d.used,
          available: d.available,
          usePercent: Math.round(d.use || 0),
        })),
        net: {
          iface: defaultIface.iface || 'wlan0',
          ip4: defaultIface.ip4 || '127.0.0.1',
          rxSec: activeNet.rx_sec || 0, // Download speed (Bytes/s)
          txSec: activeNet.tx_sec || 0, // Upload speed (Bytes/s)
          rxTotal: activeNet.rx_bytes || 0,
          txTotal: activeNet.tx_bytes || 0,
        },
        battery: {
          hasBattery: battery.hasBattery,
          percent: battery.hasBattery ? battery.percent : 100,
          isCharging: battery.isCharging,
        },
      };
    } catch (err) {
      return null;
    }
  }
}