import { useState, useEffect, useRef, useCallback } from 'react';
import { SensorApi } from '../api/SensorApi.js';
import { ProcessApi } from '../api/ProcessApi.js';
import { ProcessSorter } from '../sorting/ProcessSorter.js';
import { ProcessSearch } from '../search/ProcessSearch.js';

export function useSystemMonitor(refreshMs = 1500) {
  const sensorApiRef = useRef(new SensorApi());
  const processApiRef = useRef(new ProcessApi());
  const sorterRef = useRef(new ProcessSorter('cpu', false));
  const searchRef = useRef(new ProcessSearch(''));

  const [sensors, setSensors] = useState(null);
  const [rawProcesses, setRawProcesses] = useState([]);
  const [sortBy, setSortBy] = useState('cpu');
  const [isReverse, setIsReverse] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = useCallback(async () => {
    const [sensorData, processData] = await Promise.all([
      sensorApiRef.current.fetchAllSensors(),
      processApiRef.current.fetchProcesses(),
    ]);
    if (sensorData) setSensors(sensorData);
    setRawProcesses(processData);
  }, []);

  useEffect(() => {
    refreshData();
    const timer = setInterval(refreshData, refreshMs);
    return () => clearInterval(timer);
  }, [refreshData, refreshMs]);

  searchRef.current.setQuery(searchQuery);
  sorterRef.current.setSortBy(sortBy);
  sorterRef.current.isReverse = isReverse;

  const filteredProcesses = sorterRef.current.sort(
    searchRef.current.search(rawProcesses)
  );

  return {
    sensors,
    processes: filteredProcesses,
    totalProcessCount: rawProcesses.length,
    sortBy,
    setSortBy,
    isReverse,
    toggleReverse: () => setIsReverse((prev) => !prev),
    searchQuery,
    setSearchQuery,
  };
}
