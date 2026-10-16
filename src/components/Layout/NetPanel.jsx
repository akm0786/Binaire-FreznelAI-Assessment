import React from 'react';
import { Box, Text } from 'ink';
import { Formatter } from '../../utils/Formatter.js';

export default function NetPanel({ sensors, width }) {
  if (!sensors) return null;

  const { net } = sensors;
  const dlBits = net.rxSec * 8;
  const ulBits = net.txSec * 8;

  // ASCII graph from network history
  const rxGraph = (net.rxHistory || [])
    .slice(-18)
    .map((v) => (v > 50000 ? '█' : v > 10000 ? '▆' : v > 1000 ? '▃' : '▁'))
    .join('');

  const txGraph = (net.txHistory || [])
    .slice(-18)
    .map((v) => (v > 50000 ? '█' : v > 10000 ? '▆' : v > 1000 ? '▃' : '▁'))
    .join('');

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      width={width}
    >
      {/* Top Header */}
      <Box justifyContent="space-between">
        <Text color="white" bold>
          net <Text color="cyan">{net.ip4}</Text>
        </Text>
        <Text color="gray">
          sync  auto  zero  ◄ <Text color="green">WiFi ({net.iface})</Text> ►
        </Text>
      </Box>

      {/* Main Content: Left Graph + Right Download/Upload Stats */}
      <Box justifyContent="space-between" marginTop={1}>
        <Box flexDirection="column" width={20}>
          <Text color="magenta">{rxGraph}</Text>
          <Text color="blue">{rxGraph}</Text>
          <Text color="cyan">{txGraph}</Text>
        </Box>

        <Box flexDirection="column" width={Math.max(24, width - 25)}>
          <Text color="white" bold>download</Text>
          <Box justifyContent="space-between">
            <Text color="green">▼ {Formatter.formatBytes(net.rxSec)}/s</Text>
            <Text color="gray">({Formatter.formatBytes(dlBits)}itps)</Text>
          </Box>
          <Box justifyContent="space-between">
            <Text color="gray">▼ Total:</Text>
            <Text color="white">{Formatter.formatBytes(net.rxTotal)}</Text>
          </Box>

          <Box marginTop={1} justifyContent="space-between">
            <Text color="magenta">▲ {Formatter.formatBytes(net.txSec)}/s</Text>
            <Text color="gray">({Formatter.formatBytes(ulBits)}itps)</Text>
          </Box>
          <Box justifyContent="space-between">
            <Text color="gray">▲ Total:</Text>
            <Text color="white">{Formatter.formatBytes(net.txTotal)}</Text>
          </Box>
          <Text color="white" bold>upload</Text>
        </Box>
      </Box>
    </Box>
  );
}