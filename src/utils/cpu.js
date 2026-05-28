export function getCPUInfo() {
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  const deviceMemory = navigator.deviceMemory || 'Unknown';
  const userAgent = navigator.userAgent;

  let browser = 'Unknown';
  let os = 'Unknown';
  let cpuArch = 'Unknown';

  if (userAgent.includes('Edg/')) {
    const match = userAgent.match(/Edg\/(\d+)/);
    browser = `Edge ${match ? match[1] : ''}`.trim();
  } else if (userAgent.includes('Chrome')) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    browser = `Chrome ${match ? match[1] : ''}`.trim();
  } else if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    browser = `Firefox ${match ? match[1] : ''}`.trim();
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  }

  if (userAgent.includes('Windows')) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match?.[1] === '10.0') os = 'Windows 10/11';
  } else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    os = `macOS ${match ? match[1].replace('_', '.') : ''}`.trim();
  } else if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android (\d+)/);
    os = `Android ${match ? match[1] : ''}`.trim();
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  if (userAgent.includes('x86_64') || userAgent.includes('Win64') || userAgent.includes('x64')) {
    cpuArch = 'x86_64';
  } else if (userAgent.includes('x86') || userAgent.includes('Win32')) {
    cpuArch = 'x86';
  } else if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
    cpuArch = 'ARM64';
  } else if (userAgent.includes('arm')) {
    cpuArch = 'ARM';
  }

  return {
    browser,
    os,
    cpu: cpuArch,
    cores: cpuCores,
    memory: deviceMemory !== 'Unknown' ? `${deviceMemory} GB` : 'Unknown',
    platform: navigator.platform || 'Unknown',
    arch: cpuArch
  };
}

function runNativeWorkload(algorithm, inputSize) {
  let instructions = 0;
  let memoryOps = 0;
  let result = 0;

  switch (algorithm) {
    case 'simpleArithmetic': {
      const a = 5;
      const b = 3;
      result = a + b;
      instructions = 3;
      memoryOps = 3;
      break;
    }
    case 'loopSummation': {
      for (let i = 1; i <= inputSize; i++) {
        result += i;
        instructions += 2;
        memoryOps += 2;
      }
      break;
    }
    case 'multiplication': {
      const a = 4;
      for (let i = 0; i < inputSize; i++) {
        result += a;
        instructions += 2;
        memoryOps += 2;
      }
      break;
    }
    case 'factorial': {
      result = 1;
      for (let i = 1; i <= inputSize; i++) {
        result *= i;
        instructions += 2;
        memoryOps += 2;
      }
      break;
    }
    case 'fibonacci': {
      let prev = 0;
      let curr = 1;
      if (inputSize === 0) {
        result = 0;
      } else {
        for (let i = 1; i < inputSize; i++) {
          const next = prev + curr;
          prev = curr;
          curr = next;
          instructions += 3;
          memoryOps += 3;
        }
        result = curr;
      }
      break;
    }
    case 'bubbleSort': {
      for (let outer = inputSize - 1; outer > 0; outer--) {
        for (let inner = outer; inner > 0; inner--) {
          result++;
          instructions += 3;
          memoryOps += 2;
        }
      }
      break;
    }
    case 'smcTraversal':
    case 'linearSearch': {
      for (let i = 0; i < inputSize; i++) {
        result++;
        instructions += 2;
        memoryOps += 2;
      }
      break;
    }
    case 'power': {
      result = 1;
      for (let i = 0; i < inputSize; i++) {
        result *= 2;
        instructions += 2;
        memoryOps += 2;
      }
      break;
    }
    default:
      instructions = 1;
      memoryOps = 1;
  }

  return { result, instructions, memoryOps };
}

export function benchmarkNativeCode(algorithm, inputSize) {
  const minMeasureMs = 32;
  const maxIterations = 1_000_000;
  let iterations = 0;
  let totalInstructions = 0;
  let totalMemoryOps = 0;
  let checksum = 0;

  for (let i = 0; i < 128; i++) {
    checksum += runNativeWorkload(algorithm, inputSize).result;
  }

  const startTime = performance.now();
  let elapsedTime = 0;

  while (elapsedTime < minMeasureMs && iterations < maxIterations) {
    const batchSize = iterations < 10_000 ? 100 : 1000;

    for (let i = 0; i < batchSize && iterations < maxIterations; i++) {
      const run = runNativeWorkload(algorithm, inputSize);
      checksum += run.result;
      totalInstructions += run.instructions;
      totalMemoryOps += run.memoryOps;
      iterations++;
    }

    elapsedTime = performance.now() - startTime;
  }

  const averageTime = Math.max(elapsedTime / Math.max(iterations, 1), 0.000001);

  return {
    executionTime: averageTime,
    measuredTime: elapsedTime,
    instructions: Math.round(totalInstructions / Math.max(iterations, 1)),
    memoryAccess: Math.round(totalMemoryOps / Math.max(iterations, 1)),
    iterations,
    checksum
  };
}

const LMC_REFERENCE_CLOCK_HZ = 2_300_000_000;

export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0 ms';
  if (ms < 0.001) return `${(ms * 1_000_000).toFixed(2)} ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(ms < 0.01 ? 3 : 2)} us`;
  if (ms < 1000) return `${ms.toFixed(3)} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
  return `${(ms / 60000).toFixed(2)} min`;
}

export function formatMultiplier(value) {
  if (!Number.isFinite(value) || value <= 0) return '0x';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}Bx`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}Mx`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}Kx`;
  if (value >= 10) return `${value.toFixed(0)}x`;
  return `${value.toFixed(2)}x`;
}

export function makeLMCComparisonData(result) {
  const cycles = result?.cycles || 0;

  return {
    instructions: result?.instructionCount || 0,
    memoryAccess: result?.memoryAccess || 0,
    cycles,
    executionTime: (cycles / LMC_REFERENCE_CLOCK_HZ) * 1000,
    output: result?.output || [],
    clockSpeed: '2.3 GHz reference',
    hasCache: false,
    hasPipeline: false,
    hasBranchPrediction: false
  };
}
