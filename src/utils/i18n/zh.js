export const zh = {
  app: {
    title: 'LMC 基准测试工具',
    subtitle: '基于小人计算机的算法复杂度分析'
  },
  nav: {
    home: '首页',
    editor: '编辑器',
    benchmark: '基准测试',
    analysis: '分析',
    comparison: '架构对比',
    export: '导出'
  },
  editor: {
    title: '代码编辑器',
    placeholder: '在此输入 LMC 代码...',
    run: '运行',
    reset: '重置',
    step: '单步执行',
    stop: '停止'
  },
  benchmark: {
    title: '基准测试',
    selectAlgorithm: '选择算法',
    inputSize: '输入规模',
    runTest: '运行测试',
    running: '测试运行中...',
    completed: '测试完成',
    results: '测试结果'
  },
  metrics: {
    title: '性能指标',
    instructions: '指令执行次数',
    memory: '内存访问次数',
    branches: '分支跳转次数',
    cycles: '时钟周期数'
  },
  charts: {
    title: '数据可视化',
    complexity: '复杂度曲线',
    memory: '内存访问模式',
    comparison: '架构对比',
    inputSize: '输入规模',
    count: '次数',
    algorithm: '算法'
  },
  comparison: {
    title: 'LMC vs 现代CPU架构对比',
    runComparison: '运行对比',
    lmc: 'LMC (小人计算机)',
    modern: '现代CPU (x86/ARM)',
    clockSpeed: '时钟频率',
    executionTime: '执行时间',
    instructions: '指令数',
    memoryAccess: '内存访问',
    cache: '缓存',
    pipeline: '流水线',
    branchPrediction: '分支预测',
    outOfOrder: '乱序执行',
    speedup: '加速比',
    whyFaster: '为什么更快？',
    reasons: {
      pipelining: '流水线：同时执行多条指令',
      cache: '缓存：靠近CPU的快速内存',
      branchPrediction: '分支预测：提前猜测跳转方向',
      outOfOrder: '乱序执行：重排指令提高效率',
      multiCore: '多核：并行处理'
    }
  },
  export: {
    title: '导出数据',
    image: '导出图片',
    data: '导出数据',
    report: '导出报告',
    format: '格式',
    quality: '质量',
    filename: '文件名',
    success: '导出成功',
    error: '导出失败'
  },
  algorithms: {
    simpleArithmetic: {
      name: '简单算术',
      description: '实现 A+B 的基本运算'
    },
    loopSummation: {
      name: '循环求和',
      description: '计算 1 到 N 的累加和'
    },
    multiplication: {
      name: '乘法模拟',
      description: '通过重复加法实现 A×B'
    },
    factorial: {
      name: '阶乘计算',
      description: '计算 N 的阶乘 (N!)'
    },
    fibonacci: {
      name: '斐波那契数列',
      description: '计算第 N 个斐波那契数'
    },
    bubbleSort: {
      name: '冒泡排序',
      description: '对数组进行冒泡排序（需要自修改代码）'
    },
    linearSearch: {
      name: '线性搜索',
      description: '在数组中线性搜索目标值'
    },
    power: {
      name: '幂运算',
      description: '计算 Base 的 Exp 次方'
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
