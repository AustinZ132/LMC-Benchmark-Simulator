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

export function benchmarkNativeCode(algorithm, inputSize) {
  const iterations = 100;
  let totalTime = 0;
  let totalInstructions = 0;
  let totalMemoryOps = 0;
  let checksum = 0;

  for (let iter = 0; iter < iterations; iter++) {
    const startTime = performance.now();
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

    checksum += result;
    totalTime += performance.now() - startTime;
    totalInstructions += instructions;
    totalMemoryOps += memoryOps;
  }

  return {
    executionTime: totalTime / iterations,
    instructions: totalInstructions / iterations,
    memoryAccess: totalMemoryOps / iterations,
    iterations,
    checksum
  };
}

export function makeLMCComparisonData(result) {
  return {
    instructions: result?.instructionCount || 0,
    memoryAccess: result?.memoryAccess || 0,
    cycles: result?.cycles || 0,
    executionTime: (result?.cycles || 0) * 1000,
    output: result?.output || [],
    clockSpeed: '1 Hz',
    hasCache: false,
    hasPipeline: false,
    hasBranchPrediction: false
  };
}
