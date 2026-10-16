import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export default function ProcTable({
  processes,
  totalCount,
  selectedIndex,
  sortBy,
  isReverse,
  searchQuery,
  setSearchQuery,
  isSearching,
  width,
  maxRows = 16,
}) {
  // Selected row ke hisaab se scroll window calculate karein
  const startIndex = Math.max(
    0,
    Math.min(
      selectedIndex - Math.floor(maxRows / 2),
      Math.max(0, processes.length - maxRows)
    )
  );
  const visibleRows = processes.slice(startIndex, startIndex + maxRows);

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      width={width}
    >
      {/* Top Bar: proc | filter | per-core | reverse | tree | services | cpu lazy */}
      <Box justifyContent="space-between">
        <Box>
          <Text color="white" bold>proc </Text>
          {isSearching ? (
            <Box>
              <Text color="yellow">filter: </Text>
              <TextInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="type to filter..."
              />
            </Box>
          ) : (
            <Text color="gray">
              filter{searchQuery ? `(${searchQuery})` : ''} [f]
            </Text>
          )}
        </Box>
        <Box>
          <Text color="gray">per-core </Text>
          <Text color={isReverse ? 'yellow' : 'gray'}>reverse[r] </Text>
          <Text color="gray">tree services </Text>
          <Text color="cyan" bold>◄ {sortBy} lazy[s] ►</Text>
        </Box>
      </Box>

      {/* Table Column Headers */}
      <Box borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="gray">
        <Text color="white" bold>
          {'Pid:'.padStart(7, ' ')}{' '}
          {'Program:'.padEnd(14, ' ')}{' '}
          {'Command:'.padEnd(24, ' ')}{' '}
          {'Threads:'.padStart(8, ' ')}{' '}
          {'User:'.padEnd(8, ' ')}{' '}
          {'MemB'.padStart(6, ' ')}{' '}
          {'Cpu%'.padStart(5, ' ')}
        </Text>
      </Box>

      {/* Process Rows */}
      <Box flexDirection="column">
        {visibleRows.map((proc, idx) => {
          const actualIdx = startIndex + idx;
          const isSelected = actualIdx === selectedIndex;

          const rowString = `${String(proc.pid).padStart(7, ' ')} ${proc.program.padEnd(14, ' ')} ${proc.command.padEnd(24, ' ')} ${String(proc.threads).padStart(8, ' ')} ${proc.user.padEnd(8, ' ')} ${proc.getFormattedMemory().padStart(6, ' ')} ${proc.cpu.toFixed(1).padStart(5, ' ')}`;

          return (
            <Box key={`${proc.pid}-${actualIdx}`}>
              <Text
                backgroundColor={isSelected ? 'cyan' : undefined}
                color={isSelected ? 'black' : proc.cpu > 5 ? 'green' : 'white'}
                bold={isSelected}
              >
                {rowString.slice(0, Math.max(20, width - 4))}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Bottom Footer: select | info | terminate | count */}
      <Box justifyContent="space-between" marginTop={1}>
        <Text color="gray">
          select <Text color="cyan">▲▼</Text> info ↵ terminate[k]  quit[q]
        </Text>
        <Text color="white" bold>
          {processes.length > 0 ? selectedIndex + 1 : 0}/{totalCount}
        </Text>
      </Box>
    </Box>
  );
}