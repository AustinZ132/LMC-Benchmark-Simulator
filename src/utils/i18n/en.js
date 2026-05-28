export const en = {
  app: {
    title: 'LMC Benchmark Tool',
    subtitle: 'Algorithm complexity and system performance analysis based on the Little Man Computer'
  },
  nav: {
    home: 'Home',
    editor: 'Simulator',
    benchmark: 'Benchmark',
    analysis: 'Analysis',
    comparison: 'Comparison',
    export: 'Export'
  },
  hero: {
    badge: 'Computer architecture teaching tool',
    title: 'LMC Benchmark Studio',
    subtitle: 'Run LMC programs and observe how fetch, execute, memory access, and algorithm complexity connect.',
    simulatorTitle: 'LMC Simulator',
    simulatorDesc: 'Write, run, and validate LMC assembly programs.',
    benchmarkTitle: 'Benchmark',
    benchmarkDesc: 'Collect instruction, memory access, and branch metrics.'
  },
  editor: {
    title: 'LMC Simulator',
    placeholder: 'Enter LMC code here...',
    run: 'Run',
    reset: 'Reset',
    step: 'Step',
    stop: 'Stop',
    presets: 'Presets',
    copy: 'Copy',
    copied: 'Copied',
    input: 'Input',
    output: 'Output',
    inputHint: 'One number per line',
    editorHint: 'Tab to indent',
    noOutput: 'No output',
    runHint: 'Click Run to execute'
  },
  benchmark: {
    title: 'Benchmark',
    selectAlgorithm: 'Select Algorithm',
    inputSize: 'Input Size',
    runTest: 'Run Test',
    running: 'Running test...',
    completed: 'Test completed',
    results: 'Test Results',
    system: 'Current System'
  },
  metrics: {
    title: 'Performance Metrics',
    instructions: 'Instruction Count',
    memory: 'Memory Access Count',
    branches: 'Taken Branches',
    cycles: 'Clock Cycles'
  },
  charts: {
    title: 'Data Analysis',
    complexity: 'Instruction Growth',
    memory: 'Memory Access Growth',
    comparison: 'Metric Radar',
    inputSize: 'Input Size',
    count: 'Count',
    algorithm: 'Algorithm',
    empty: 'Run a benchmark to show charts here.',
    resetZoom: 'Reset zoom',
    zoomHint: 'Scroll to zoom, drag to pan'
  },
  comparison: {
    title: 'LMC vs Modern CPU',
    runComparison: 'Run Comparison',
    lmc: 'LMC',
    modern: 'Modern CPU',
    clockSpeed: 'Clock Speed',
    executionTime: 'Estimated Time',
    instructions: 'Instructions',
    memoryAccess: 'Memory Access',
    cache: 'Cache',
    pipeline: 'Pipeline',
    samples: 'Samples',
    branchPrediction: 'Branch Prediction',
    outOfOrder: 'Out-of-Order',
    speedup: 'Speedup',
    whyFaster: 'Why modern CPUs are faster',
    yourCpuIs: 'Your CPU is about',
    fasterThanLmc: 'times faster than the 1Hz LMC model',
    reasons: {
      pipelining: 'Pipelining overlaps different stages of multiple instructions.',
      cache: 'Cache keeps frequently used data close to the CPU.',
      branchPrediction: 'Branch prediction reduces stalls while waiting for jump outcomes.',
      outOfOrder: 'Out-of-order execution rearranges work when dependencies allow it.'
    }
  },
  export: {
    title: 'Export Data',
    image: 'Export Image',
    data: 'Export CSV',
    report: 'Export PDF'
  },
  security: {
    title: 'LMC Benchmark Studio',
    description: 'Complete the human verification before opening the simulator and benchmark tools.',
    checking: 'Verifying...',
    failed: 'Verification did not pass. Refresh the challenge and try again.',
    expired: 'The verification expired. Complete the challenge again.',
    footer: 'Protected by Cloudflare Turnstile'
  },
  algorithms: {
    simpleArithmetic: {
      name: 'Simple Addition',
      description: 'Read two numbers and compute A+B.'
    },
    loopSummation: {
      name: 'Loop Summation',
      description: 'Calculate the sum from 1 to N.'
    },
    multiplication: {
      name: 'Loop Multiplication',
      description: 'Implement A times B with repeated addition.'
    },
    factorial: {
      name: 'Factorial',
      description: 'Compute N! with nested loops and no hardware multiply instruction.'
    },
    fibonacci: {
      name: 'Fibonacci',
      description: 'Compute the Nth Fibonacci number.'
    },
    bubbleSort: {
      name: 'Bubble Sort Workload',
      description: 'Model the nested comparison count of bubble sort to show O(n^2) growth.'
    },
    smcTraversal: {
      name: 'Self-Modifying Traversal',
      description: 'Increment the address field of an LDA instruction at runtime.'
    },
    linearSearch: {
      name: 'Linear Search Workload',
      description: 'Inspect N positions one by one to show linear growth.'
    },
    power: {
      name: 'Power',
      description: 'Compute 2 to the Nth power using repeated multiplication.'
    }
  },
  labels: {
    inputSize: 'Input Size',
    count: 'Count',
    algorithm: 'Algorithm',
    complexity: 'Complexity',
    performance: 'Performance',
    time: 'Time',
    status: 'Status',
    ready: 'Ready',
    running: 'Running',
    completed: 'Completed',
    error: 'Error'
  },
  messages: {
    noCode: 'Please enter code',
    invalidCode: 'Invalid code format',
    executionError: 'Execution error',
    testStarted: 'Test started',
    testCompleted: 'Test completed',
    exportSuccess: 'Export successful',
    exportError: 'Export failed'
  }
};
