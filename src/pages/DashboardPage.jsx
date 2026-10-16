import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useSystemMonitor } from '../hooks/useSystemMonitor.js';
import CpuPanel from '../components/Layout/CpuPanel.jsx';
import MemDiskPanel from '../components/Layout/MemDiskPanel.jsx';
import NetPanel from '../components/Layout/NetPanel.jsx';
import ProcTable from '../components/Layout/ProcTable.jsx';

const SORT_FIELDS = ['cpu', 'mem', 'pid', 'program'];

export default function DashboardPage({ user }) {
  const { exit } = useApp();
  const { columns, rows } = useTerminalSize();
  const {
    sensors,
    processes,
    totalProcessCount,
    sortBy,
    setSortBy,
    isReverse,
    toggleReverse,
    searchQuery,
    setSearchQuery,
  } = useSystemMonitor(1500);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Complete Keyboard Navigation Support
  useInput((input, key) => {
    if (isSearching) {
      if (key.return || key.escape) {
        setIsSearching(false);
      }
      return;
    }

    if (input === 'q' || key.escape) {
      exit();
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(Math.max(0, processes.length - 1), prev + 1));
    } else if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (input === 'r') {
      toggleReverse();
    } else if (input === 's') {
      const nextIdx = (SORT_FIELDS.indexOf(sortBy) + 1) % SORT_FIELDS.length;
      setSortBy(SORT_FIELDS[nextIdx]);
    } else if (input === 'f' || input === '/') {
      setIsSearching(true);
    }
  });

  if (!sensors) {
    return (
      <Box padding={2}>
        <Text color="cyan">Loading system sensors and processes...</Text>
      </Box>
    );
  }

  // Responsive column calculations based on terminal width
  const totalWidth = Math.max(90, columns - 2);
  const leftColWidth = Math.floor(totalWidth * 0.44);
  const rightColWidth = totalWidth - leftColWidth;
  const tableRows = Math.max(8, rows - 21);

  return (
    <Box flexDirection="column" width={totalWidth}>
      {/* Top Full-Width CPU & Sensor Panel */}
      <CpuPanel sensors={sensors} width={totalWidth} />

      {/* Bottom Split Section: Left (Mem/Disks + Net) & Right (Proc Table) */}
      <Box flexDirection="row" width={totalWidth}>
        <Box flexDirection="column" width={leftColWidth}>
          <MemDiskPanel sensors={sensors} width={leftColWidth} />
          <NetPanel sensors={sensors} width={leftColWidth} />
        </Box>

        <ProcTable
          processes={processes}
          totalCount={totalProcessCount}
          selectedIndex={selectedIndex}
          sortBy={sortBy}
          isReverse={isReverse}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          width={rightColWidth}
          maxRows={tableRows}
        />
      </Box>
    </Box>
  );
}