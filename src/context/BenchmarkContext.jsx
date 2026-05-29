import React, { createContext, useContext, useState, useCallback } from 'react';
import { LMC } from '../utils/lmc';
import { ALGORITHMS, getBenchmarkInput } from '../utils/algorithms';
import { benchmarkNativeCode } from '../utils/cpu';

const BenchmarkContext = createContext();

function makeMetricSnapshot(result = {}) {
  return {
    lmc: {
      instructions: result.instructionCount || 0,
      memory: result.memoryAccess || 0,
      branches: result.branchCount || 0,
      cycles: result.cycles || 0
    },
    cpu: {
      instructions: result.nativeInstructions || 0,
      memory: result.nativeMemoryAccess || 0,
      branches: result.nativeBranchCount || 0,
      cycles: result.nativeCycles || 0
    }
  };
}

export function BenchmarkProvider({ children }) {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ready');
  const [statusText, setStatusText] = useState('');
  const [metrics, setMetrics] = useState(makeMetricSnapshot());

  const runBenchmark = useCallback(async (algorithmId, inputSize) => {
    const algorithm = ALGORITHMS[algorithmId];
    if (!algorithm) return;

    setIsRunning(true);
    setStatus('running');
    const sizeLabel = algorithmId === 'simpleArithmetic' ? 'fixed input' : `n=${inputSize}`;
    setStatusText(`Running ${algorithmId} with ${sizeLabel}...`);
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
      const nativeResult = benchmarkNativeCode(algorithmId, size);
      testResults.push({
        algorithmId,
        algorithmNameKey: algorithm.nameKey,
        inputSize: size,
        input,
        codeSize: algorithm.code.split('\n').filter((line) => line.trim() && !line.trim().startsWith(';')).length,
        nativeExecutionTime: nativeResult.executionTime,
        nativeMeasuredTime: nativeResult.measuredTime,
        nativeReferenceTime: nativeResult.referenceTime,
        nativeSampleWindowTime: nativeResult.sampleWindowTime,
        nativeInstructions: nativeResult.instructions,
        nativeMemoryAccess: nativeResult.memoryAccess,
        nativeBranchCount: nativeResult.branchCount,
        nativeCycles: nativeResult.cycles,
        nativeIterations: nativeResult.iterations,
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
    setMetrics(makeMetricSnapshot(latest));
    setIsRunning(false);
    setStatus('completed');
    setStatusText(`Completed ${algorithmId} at ${sizeLabel}`);
    setProgress(100);

    return {
      series: testResults,
      latest
    };
  }, []);

  const resetBenchmark = useCallback(() => {
    setResults([]);
    setMetrics(makeMetricSnapshot());
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
