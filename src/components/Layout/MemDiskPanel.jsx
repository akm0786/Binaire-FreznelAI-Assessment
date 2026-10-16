import React from 'react';
import { Box, Text } from 'ink';
import { Formatter } from '../../utils/Formatter.js';

export default function MemDiskPanel({ sensors, width }) {
  if (!sensors) return null;

  const { mem, gpu, disks } = sensors;
  const usedPct = (mem.used / mem.total) * 100;
  const availPct = (mem.available / mem.total) * 100;
  const cachePct = (mem.cached / mem.total) * 100;
  const swapPct = mem.swapTotal > 0 ? (mem.swapUsed / mem.swapTotal) * 100 : 15;
  const gpuPct = gpu.vramTotal > 0 ? (gpu.vramUsed / gpu.vramTotal) * 100 : 12;

  const halfWidth = Math.max(24, Math.floor(width / 2));

  return (
    <Box width={width} flexDirection="row">
      {/* Left Box: MEM */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
        width={halfWidth}
      >
        <Text color="white" bold>mem</Text>
        <Box justifyContent="space-between">
          <Text color="white">Total:</Text>
          <Text color="white" bold>{Formatter.formatBytes(mem.total)}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="red">Used</Text>
          <Text color="red">{Formatter.createBar(usedPct, 8)}</Text>
          <Text color="white">{Formatter.formatBytes(mem.used)}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="yellow">Avail</Text>
          <Text color="yellow">{Formatter.createBar(availPct, 8)}</Text>
          <Text color="white">{Formatter.formatBytes(mem.available)}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="blue">Cache</Text>
          <Text color="blue">{Formatter.createBar(cachePct, 8)}</Text>
          <Text color="white">{Formatter.formatBytes(mem.cached)}</Text>
        </Box>

        <Box marginTop={1} justifyContent="space-between">
          <Text color="gray">GPU Shared:</Text>
          <Text color="white">{Formatter.formatBytes(gpu.vramTotal)}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="green">Used</Text>
          <Text color="green">{Formatter.createBar(gpuPct, 8)}</Text>
          <Text color="white">{Formatter.formatBytes(gpu.vramUsed)}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Page+Virt:</Text>
          <Text color="white">{Formatter.formatBytes(mem.swapTotal || mem.total)}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="green">Used</Text>
          <Text color="green">{Formatter.createBar(swapPct, 8)}</Text>
          <Text color="white">{Formatter.formatBytes(mem.swapUsed)}</Text>
        </Box>
      </Box>

      {/* Right Box: DISKS */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
        width={width - halfWidth}
      >
        <Box justifyContent="space-between">
          <Text color="white" bold>disks</Text>
          <Text color="cyan">io</Text>
        </Box>

        {disks.map((d, idx) => {
          const freePct = 100 - d.usePercent;
          return (
            <Box key={idx} flexDirection="column" marginBottom={1}>
              <Box justifyContent="space-between">
                <Text color="cyan" bold>{d.mount.slice(0, 10)}</Text>
                <Text color="white">{Formatter.formatBytes(d.size, 0)}</Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="gray">Free: {freePct}%</Text>
                <Text color="green">{Formatter.createBar(freePct, 6)}</Text>
                <Text color="white">{Formatter.formatBytes(d.available, 0)}</Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="gray">Used: {d.usePercent}%</Text>
                <Text color="yellow">{Formatter.createBar(d.usePercent, 6)}</Text>
                <Text color="white">{Formatter.formatBytes(d.used, 0)}</Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}