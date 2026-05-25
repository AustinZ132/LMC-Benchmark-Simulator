export function getCPUInfo() {
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  const deviceMemory = navigator.deviceMemory || 'Unknown';
  
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  let cpuArch = 'Unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    browser = 'Chrome ' + (match ? match[1] : '');
  } else if (userAgent.indexOf('Firefox') > -1) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    browser = 'Firefox ' + (match ? match[1] : '');
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
  } else if (userAgent.indexOf('Edge') > -1) {
    const match = userAgent.match(/Edge\/(\d+)/);
    browser = 'Edge ' + (match ? match[1] : '');
  }
  
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      const version = match[1];
      if (version === '10.0') os = 'Windows 10/11';
      else if (version === '6.3') os = 'Windows 8.1';
      else if (version === '6.2') os = 'Windows 8';
      else if (version === '6.1') os = 'Windows 7';
    }
  } else if (userAgent.indexOf('Mac OS X') > -1) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    os = 'macOS ' + (match ? match[1].replace('_', '.') : '');
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    const match = userAgent.match(/Android (\d+)/);
    os = 'Android ' + (match ? match[1] : '');
  } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    os = 'iOS';
  }
  
  if (userAgent.indexOf('x86_64') > -1 || userAgent.indexOf('Win64') > -1 || userAgent.indexOf('x64') > -1) {
    cpuArch = 'x86_64';
  } else if (userAgent.indexOf('x86') > -1 || userAgent.indexOf('Win32') > -1) {
    cpuArch = 'x86';
  } else if (userAgent.indexOf('arm64') > -1 || userAgent.indexOf('aarch64') > -1) {
    cpuArch = 'ARM64';
  } else if (userAgent.indexOf('arm') > -1) {
    cpuArch = 'ARM';
  }
  
  let cpuModel = cpuArch;
  if (cpuCores >= 16) {
    cpuModel += ' (' + cpuCores + ' cores)';
  } else if (cpuCores >= 1) {
    cpuModel += ' (' + cpuCores + ' cores)';
  }
  
  return {
    browser: browser,
    os: os,
    cpu: cpuModel,
    cores: cpuCores,
    memory: deviceMemory !== 'Unknown' ? deviceMemory + ' GB' : 'Unknown',
    platform: navigator.platform || 'Unknown',
    arch: cpuArch
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
  
  const lmcClockSpeed = 1;
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
