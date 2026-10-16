import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Formatter } from '../../utils/Formatter.js';

export default function CpuPanel({ sensors, width }) {
  const [clock, setClock] = useState(new Date().toTimeString().slice(0, 8));

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toTimeString().slice(0, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!sensors) return null;

  const { cpu, gpu, uptime, loadAvg, battery } = sensors;
  const graphWidth = Math.max(20, width - 48);

  // Convert CPU history array into 2-line ASCII sparkline graph
  const historySlice = cpu.history.slice(-graphWidth);
  const topGraphLine = historySlice
    .map((val) => (val > 75 ? '█' : val > 55 ? '▄' : ' '))
    .join('');
  const bottomGraphLine = historySlice
    .map((val) => (val > 50 ? '█' : val > 25 ? '▆' : val > 10 ? '▃' : '▁'))
    .join('');

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      width={width}
    >
      {/* Top Header Row: cpu | menu | preset | Clock | BAT | 1500ms */}
      <Box justifyContent="space-between" width="100%">
        <Box>
          <Text color="white" bold>cpu</Text>
          <Text color="gray">  menu  preset *</Text>
        </Box>
        <Text color="cyan" bold>{clock}</Text>
        <Box>
          <Text color="green" bold>
            BAT■ {battery.percent}% { Formatter.createBar(battery.percent, 6) }
          </Text>
          <Text color="white">  1500ms</Text>
        </Box>
      </Box>

      {/* Main Content Row: Left Graph + Right CPU/Core/GPU Box */}
      <Box justifyContent="space-between" marginTop={0}>
        {/* Left: ASCII History Graph */}
        <Box flexDirection="column" width={graphWidth}>
          <Text color="yellow">{topGraphLine}</Text>
          <Text color="green">{bottomGraphLine}</Text>
          <Box justifyContent="center">
            <Text color="gray">cpu ▲▼ gpu</Text>
          </Box>
          <Text color="cyan">{bottomGraphLine.split('').reverse().join('')}</Text>
          <Text color="gray">up {Formatter.formatUptime(uptime)}</Text>
        </Box>

        {/* Right: CPU Model, Cores, Temps, Load AVG, GPU */}
        <Box flexDirection="column" width={42} borderStyle="single" borderColor="gray" paddingX={1}>
          <Box justifyContent="space-between">
            <Text color="white" bold>{cpu.brand.slice(0, 18)}</Text>
            <Text color="cyan">{cpu.speed}</Text>
          </Box>

          <Box justifyContent="space-between">
            <Text color="green" bold>CPU</Text>
            <Text color="yellow">{Formatter.createBar(cpu.totalLoad, 10)}</Text>
            <Text color="white">{String(cpu.totalLoad).padStart(3, ' ')}%</Text>
            <Text color="cyan">{cpu.mainTemp}°C</Text>
          </Box>

          {cpu.cores.slice(0, 4).map((c) => (
            <Box key={c.core} justifyContent="space-between">
              <Text color="white">C{c.core} </Text>
              <Text color="green">{Formatter.createBar(c.load, 10)}</Text>
              <Text color="white">{String(c.load).padStart(3, ' ')}%</Text>
              <Text color="cyan">{c.temp}°C</Text>
            </Box>
          ))}

          <Box justifyContent="space-between">
            <Text color="gray">Load AVG:</Text>
            <Text color="white">{loadAvg.join('  ')}</Text>
          </Box>

          <Box justifyContent="space-between">
            <Text color="cyan" bold>GPU</Text>
            <Text color="green">{Formatter.createBar(gpu.load, 10)}</Text>
            <Text color="white">{String(gpu.load).padStart(3, ' ')}%</Text>
            <Text color="cyan">{gpu.temp}°C</Text>
          </Box>
          <Text color="gray">{gpu.model}</Text>
        </Box>
      </Box>
    </Box>
  );
}