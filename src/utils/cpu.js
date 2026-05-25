export function getCPUInfo() {
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  const deviceMemory = navigator.deviceMemory || 'Unknown';
  
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    browser = 'Chrome';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
  } else if (userAgent.indexOf('Edge') > -1) {
    browser = 'Edge';
  }
  
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'macOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
  } else if (userAgent.indexOf('iOS') > -1) {
    os = 'iOS';
  }
  
  return {
    browser: browser,
    os: os,
    cpu: navigator.platform || 'Unknown',
    cores: cpuCores,
    memory: deviceMemory !== 'Unknown' ? deviceMemory + ' GB' : 'Unknown',
    platform: navigator.platform || 'Unknown'
  };
}

export function benchmarkNativeCode(algorithm, inputSize) {
  const iterations = 100;
  let totalTime = 0;
  let totalInstructions = 0;
  let totalMemoryOps = 0;
  
  for (let iter = 0; iter < iterations; iter++) {
    const startTime = performance.now();
    let instructions = 0;
    let memoryOps = 0;
    
    switch (algorithm) {
      case 'simpleArithmetic': {
        const a = 5, b = 3;
        const result = a + b;
        instructions = 3;
        memoryOps = 3;
        break;
      }
      case 'loopSummation': {
        let sum = 0;
        for (let i = 1; i <= inputSize; i++) {
          sum += i;
          instructions += 2;
          memoryOps += 3;
        }
        break;
      }
      case 'multiplication': {
        let result = 0;
        const a = inputSize;
        const b = inputSize;
        for (let i = 0; i < b; i++) {
          result += a;
          instructions += 2;
          memoryOps += 3;
        }
        break;
      }
      case 'factorial': {
        let result = 1;
        for (let i = 1; i <= inputSize; i++) {
          result *= i;
          instructions += 2;
          memoryOps += 3;
        }
        break;
      }
      case 'fibonacci': {
        let prev = 0, curr = 1;
        for (let i = 0; i < inputSize; i++) {
          const temp = curr;
          curr = curr + prev;
          prev = temp;
          instructions += 3;
          memoryOps += 4;
        }
        break;
      }
      case 'power': {
        let result = 1;
        const base = 2;
        for (let i = 0; i < inputSize; i++) {
          result *= base;
          instructions += 2;
          memoryOps += 3;
        }
        break;
      }
      default:
        instructions = 1;
        memoryOps = 1;
    }
    
    const endTime = performance.now();
    totalTime += (endTime - startTime);
    totalInstructions += instructions;
    totalMemoryOps += memoryOps;
  }
  
  return {
    executionTime: totalTime / iterations,
    instructions: totalInstructions / iterations,
    memoryAccess: totalMemoryOps / iterations,
    iterations: iterations
  };
}

export function getLMCComparisonData(algorithm, inputSize) {
  const lmcClockSpeed = 1;
  
  let lmcInstructions = 0;
  let lmcMemoryAccess = 0;
  
  switch (algorithm) {
    case 'simpleArithmetic':
      lmcInstructions = 6;
      lmcMemoryAccess = 8;
      break;
    case 'loopSummation':
      lmcInstructions = inputSize * 11 + 4;
      lmcMemoryAccess = inputSize * 15 + 6;
      break;
    case 'multiplication':
      lmcInstructions = inputSize * 10 + 5;
      lmcMemoryAccess = inputSize * 14 + 7;
      break;
    case 'factorial':
      lmcInstructions = inputSize * 10 + 5;
      lmcMemoryAccess = inputSize * 14 + 7;
      break;
    case 'fibonacci':
      lmcInstructions = inputSize * 12 + 4;
      lmcMemoryAccess = inputSize * 16 + 6;
      break;
    case 'power':
      lmcInstructions = inputSize * 10 + 5;
      lmcMemoryAccess = inputSize * 14 + 7;
      break;
    default:
      lmcInstructions = inputSize * 10;
      lmcMemoryAccess = inputSize * 15;
  }
  
  const lmcExecutionTimeMs = (lmcInstructions / lmcClockSpeed) * 1000;
  
  return {
    instructions: lmcInstructions,
    memoryAccess: lmcMemoryAccess,
    executionTime: lmcExecutionTimeMs,
    clockSpeed: '1 Hz',
    hasCache: false,
    hasPipeline: false,
    hasBranchPrediction: false
  };
}
