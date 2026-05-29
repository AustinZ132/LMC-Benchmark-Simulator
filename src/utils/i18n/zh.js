export const zh = {
  app: {
    title: 'LMC 基准测试工具',
    subtitle: '基于小人计算机的算法复杂度与系统性能分析'
  },
  nav: {
    home: '首页',
    editor: '模拟器',
    benchmark: '基准测试',
    analysis: '数据分析',
    comparison: '架构对比',
    export: '导出'
  },
  hero: {
    badge: '计算机体系结构教学工具',
    title: 'LMC Benchmark Studio',
    subtitle: '用可运行的 LMC 程序观察取指、执行、内存访问和算法复杂度之间的关系。',
    simulatorTitle: 'LMC 模拟器',
    simulatorDesc: '编写、运行并验证 LMC 汇编程序。',
    benchmarkTitle: '基准测试',
    benchmarkDesc: '收集指令数、内存访问和分支跳转数据。'
  },
  editor: {
    title: 'LMC 模拟器',
    placeholder: '在此输入 LMC 代码...',
    run: '运行',
    reset: '重置',
    step: '单步',
    stop: '停止',
    presets: '预设',
    copy: '复制',
    copied: '已复制',
    input: '输入',
    output: '输出',
    inputHint: '每行一个数字',
    editorHint: 'Tab 缩进',
    noOutput: '无输出',
    runHint: '点击运行执行程序'
  },
  benchmark: {
    title: '基准测试',
    selectAlgorithm: '选择算法',
    inputSize: '输入规模',
    fixedInput: '固定输入',
    fixedInputMeta: '输入值：5, 3',
    runTest: '运行测试',
    running: '测试运行中...',
    completed: '测试完成',
    results: '测试结果',
    system: '当前系统'
  },
  metrics: {
    title: '性能指标',
    instructions: '执行指令数',
    memory: '内存访问次数',
    branches: '跳转次数',
    cycles: '时钟周期'
  },
  charts: {
    title: '数据分析',
    complexity: '指令增长曲线',
    memory: '内存访问曲线',
    comparison: '指标雷达图',
    inputSize: '输入规模',
    count: '次数',
    algorithm: '算法',
    empty: '运行一次基准测试后，这里会显示图表。',
    resetZoom: '重置缩放',
    zoomHint: '滚轮缩放，拖拽平移'
  },
  comparison: {
    title: 'LMC Reference 与 CPU Measured 对比',
    runComparison: '运行对比',
    lmc: 'LMC Reference Model',
    modern: '现代 CPU',
    clockSpeed: '时钟频率',
    executionTime: '估算执行时间',
    referenceTime: 'Reference Time',
    measuredTime: 'Measured Time',
    instructions: '指令数',
    memoryAccess: '内存访问',
    cache: '缓存',
    pipeline: '流水线',
    samples: '采样次数',
    jsMeasuredAvg: 'JS 实测平均',
    branchPrediction: '分支预测',
    outOfOrder: '乱序执行',
    speedup: '加速比',
    whyFaster: '现代 CPU 为什么更快',
    referenceNote: 'LMC 时间是理想的 2.3GHz reference estimate；CPU 时间是在浏览器中实测得到。对于 very small programs，浏览器、JIT 和计时器开销可能主导结果，因此循环型和内存型 workload 更适合做 CPU 对比。',
    yourCpuIs: 'CPU 实测速度比',
    fasterThanLmc: '相对 LMC reference',
    reasons: {
      pipelining: '流水线让多条指令的不同阶段重叠执行。',
      cache: '缓存把常用数据放到离 CPU 更近的位置。',
      branchPrediction: '分支预测减少等待跳转结果的停顿。',
      outOfOrder: '乱序执行在依赖允许时重新安排指令顺序。'
    }
  },
  export: {
    title: '导出数据',
    image: '导出图片',
    data: '导出 CSV',
    report: '导出 PDF'
  },
  security: {
    title: '验证后导出',
    description: '完成验证后显示导出按钮。',
    failed: '验证失败，请重试。',
    expired: '验证已过期，请重试。',
    footer: 'Cloudflare Turnstile'
  },
  algorithms: {
    simpleArithmetic: {
      name: '简单加法',
      description: '读取两个数字并完成 A+B。'
    },
    loopSummation: {
      name: '循环求和',
      description: '计算 1 到 N 的累加和。'
    },
    multiplication: {
      name: '循环乘法',
      description: '用重复加法实现 A×B。'
    },
    factorial: {
      name: '阶乘',
      description: '用嵌套循环计算 N!，不依赖硬件乘法。'
    },
    fibonacci: {
      name: '斐波那契',
      description: '计算第 N 个斐波那契数。'
    },
    bubbleSort: {
      name: '冒泡排序比较负载',
      description: '模拟冒泡排序的双层比较次数，展示 O(n^2) 增长。'
    },
    smcTraversal: {
      name: '自修改遍历演示',
      description: '运行时修改 LDA 指令的地址字段，演示 LMC 的 SMC 技巧。'
    },
    linearSearch: {
      name: '线性搜索负载',
      description: '逐项检查 N 个位置，展示线性增长。'
    },
    power: {
      name: '幂运算',
      description: '用重复乘法计算 2 的 N 次方。'
    }
  },
  labels: {
    inputSize: '输入规模',
    count: '次数',
    algorithm: '算法',
    complexity: '复杂度',
    performance: '性能',
    time: '时间',
    status: '状态',
    ready: '就绪',
    running: '运行中',
    completed: '已完成',
    error: '错误'
  },
  messages: {
    noCode: '请输入代码',
    invalidCode: '代码格式无效',
    executionError: '执行错误',
    testStarted: '测试开始',
    testCompleted: '测试完成',
    exportSuccess: '导出成功',
    exportError: '导出失败'
  }
};
