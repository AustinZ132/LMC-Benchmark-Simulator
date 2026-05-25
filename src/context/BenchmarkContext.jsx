import React, { createContext, useContext, useState, useCallback } from 'react';
import { LMC } from '../utils/lmc';
import { ALGORITHMS } from '../utils/algorithms';

const BenchmarkContext = createContext();

export function BenchmarkProvider({ children }) {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ready');
  const [statusText, setStatusText] = useState('');
  const [metrics, setMetrics] = useState({
    instructions: 0,
    memory: 0,
    branches: 0,
    cycles: 0
  });

  const runBenchmark = useCallback(async (algorithmId, inputSize) => {
    const algorithm = ALGORITHMS[algorithmId];
    if (!algorithm) return;

    setIsRunning(true);
    setStatus('running');
    setStatusText(`Running ${algorithm.name} with n=${inputSize}...`);
    setProgress(0);

    const lmc = new LMC();
    const testResults = [];

    for (let i = 0; i < inputSize; i++) {
      lmc.reset();
      lmc.loadCode(algorithm.code);
      lmc.setInput(i + 1);
      
      const result = lmc.run();
      testResults.push({
        inputSize: i + 1,
        ...result
      });

      setProgress(((i + 1) / inputSize) * 100);
      
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const totalMetrics = testResults.reduce((acc, r) => ({
      instructions: acc.instructions + r.instructionCount,
      memory: acc.memory + r.memoryAccess,
      branches: acc.branches + r.branchCount,
      cycles: acc.cycles + r.cycles
    }), { instructions: 0, memory: 0, branches: 0, cycles: 0 });

    setResults(testResults);
    setMetrics(totalMetrics);
    setIsRunning(false);
    setStatus('completed');
    setStatusText('Test completed');
    setProgress(100);

    return testResults;
  }, []);

  const resetBenchmark = useCallback(() => {
    setResults([]);
    setMetrics({ instructions: 0, memory: 0, branches: 0, cycles: 0 });
    setStatus('ready');
    setStatusText('');
    setProgress(0);
  }, []);

  return (
    <BenchmarkContext.Provider value={{
      results,
      isRunning,
      progress,
      status,
      statusText,
      metrics,
      runBenchmark,
      resetBenchmark
    }}>
      {children}
    </BenchmarkContext.Provider>
  );
}

export function useBenchmark() {
  const context = useContext(BenchmarkContext);
  if (!context) {
    throw new Error('useBenchmark must be used within a BenchmarkProvider');
  }
  return context;
}
