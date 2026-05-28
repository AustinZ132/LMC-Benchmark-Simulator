import React, { createContext, useContext, useState, useCallback } from 'react';
import { LMC } from '../utils/lmc';
import { ALGORITHMS, getBenchmarkInput } from '../utils/algorithms';

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
    setStatusText(`Running ${algorithmId} with n=${inputSize}...`);
    setProgress(0);

    const testResults = [];
    const sizeSet = new Set((algorithm.inputSizes || [inputSize]).filter((size) => size <= inputSize));
    sizeSet.add(inputSize);
    const sizes = [...sizeSet].sort((a, b) => a - b);

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const lmc = new LMC();
      const input = getBenchmarkInput(algorithm, size);
      lmc.loadCode(algorithm.code);
      lmc.setInput(input);
      
      const result = lmc.run();
      testResults.push({
        algorithmId,
        algorithmNameKey: algorithm.nameKey,
        inputSize: size,
        input,
        codeSize: algorithm.code.split('\n').filter((line) => line.trim() && !line.trim().startsWith(';')).length,
        ...result
      });

      setProgress(((i + 1) / sizes.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    const latest = testResults[testResults.length - 1] || {
      instructionCount: 0,
      memoryAccess: 0,
      branchCount: 0,
      cycles: 0
    };

    setResults(testResults);
    setMetrics({
      instructions: latest.instructionCount,
      memory: latest.memoryAccess,
      branches: latest.branchCount,
      cycles: latest.cycles
    });
    setIsRunning(false);
    setStatus('completed');
    setStatusText(`Completed ${algorithmId} at n=${inputSize}`);
    setProgress(100);

    return {
      series: testResults,
      latest
    };
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
