import { useState, useEffect } from 'react';
import { useStdout } from 'ink';

export function useTerminalSize() {
  const { stdout } = useStdout();
  const [size, setSize] = useState({
    columns: stdout?.columns || 120,
    rows: stdout?.rows || 35,
  });

  useEffect(() => {
    if (!stdout) return;
    const handleResize = () => {
      setSize({
        columns: stdout.columns || 120,
        rows: stdout.rows || 35,
      });
    };
    stdout.on('resize', handleResize);
    return () => {
      stdout.off('resize', handleResize);
    };
  }, [stdout]);

  return size;
}
