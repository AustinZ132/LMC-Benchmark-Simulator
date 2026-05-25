export class LMC {
  constructor() {
    this.memory = new Array(100).fill(0);
    this.accumulator = 0;
    this.programCounter = 0;
    this.inputQueue = [];
    this.outputQueue = [];
    this.isRunning = false;
    this.isHalted = false;
    this.metrics = {
      instructionCount: 0,
      memoryAccess: 0,
      branchCount: 0,
      cycles: 0
    };
  }

  reset() {
    this.memory.fill(0);
    this.accumulator = 0;
    this.programCounter = 0;
    this.inputQueue = [];
    this.outputQueue = [];
    this.isRunning = false;
    this.isHalted = false;
    this.metrics = {
      instructionCount: 0,
      memoryAccess: 0,
      branchCount: 0,
      cycles: 0
    };
  }

  loadCode(code) {
    this.reset();
    const lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith(';'));
    const labels = {};
    let instructionCount = 0;

    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2 && !this.isOpcode(parts[0])) {
        labels[parts[0]] = instructionCount;
      }
      if (parts.length >= 1 && this.isOpcode(parts[0])) {
        instructionCount++;
      } else if (parts.length >= 2) {
        instructionCount++;
      }
    }

    let index = 0;
    for (const line of lines) {
      const parts = line.split(/\s+/);
      let opcode, operand;

      if (this.isOpcode(parts[0])) {
        opcode = parts[0];
        operand = parts[1] || '0';
      } else if (parts.length >= 2) {
        opcode = parts[1];
        operand = parts[2] || '0';
      } else {
        continue;
      }

      if (opcode === 'DAT') {
        this.memory[index] = parseInt(operand) || 0;
      } else if (opcode === 'INP') {
        this.memory[index] = 901;
      } else if (opcode === 'OUT') {
        this.memory[index] = 902;
      } else if (opcode === 'HLT') {
        this.memory[index] = 0;
      } else {
        const op = this.getOpcodeValue(opcode);
        let addr = 0;
        if (operand) {
          addr = labels[operand] !== undefined ? labels[operand] : parseInt(operand) || 0;
        }
        this.memory[index] = op * 100 + addr;
      }
      index++;
    }
  }

  isOpcode(token) {
    return ['HLT', 'ADD', 'SUB', 'STA', 'LDA', 'BRA', 'BRZ', 'BRP', 'INP', 'OUT', 'DAT', 'MUL'].includes(token);
  }

  getOpcodeValue(opcode) {
    const map = {
      'HLT': 0, 'ADD': 1, 'SUB': 2, 'STA': 3,
      'LDA': 5, 'BRA': 6, 'BRZ': 7, 'BRP': 8, 'MUL': 4
    };
    return map[opcode] || 0;
  }

  setInput(values) {
    this.inputQueue = Array.isArray(values) ? [...values] : [values];
  }

  getInput() {
    return this.inputQueue.length > 0 ? this.inputQueue.shift() : 0;
  }

  addOutput(value) {
    this.outputQueue.push(value);
  }

  getOutput() {
    return [...this.outputQueue];
  }

  step() {
    if (this.isHalted) return false;

    const instruction = this.memory[this.programCounter];
    this.metrics.memoryAccess++;
    this.metrics.instructionCount++;
    this.metrics.cycles++;

    const opcode = Math.floor(instruction / 100);
    const operand = instruction % 100;
    this.programCounter++;

    switch (opcode) {
      case 0:
        this.isHalted = true;
        this.isRunning = false;
        break;
      case 1:
        this.accumulator += this.memory[operand];
        this.metrics.memoryAccess++;
        if (this.accumulator > 999) this.accumulator = 999;
        break;
      case 2:
        this.accumulator -= this.memory[operand];
        this.metrics.memoryAccess++;
        if (this.accumulator < 0) this.accumulator = 0;
        break;
      case 3:
        this.memory[operand] = this.accumulator;
        this.metrics.memoryAccess++;
        break;
      case 4:
        this.accumulator *= this.memory[operand];
        this.metrics.memoryAccess++;
        if (this.accumulator > 999) this.accumulator = 999;
        break;
      case 5:
        this.accumulator = this.memory[operand];
        this.metrics.memoryAccess++;
        break;
      case 6:
        this.programCounter = operand;
        this.metrics.branchCount++;
        break;
      case 7:
        if (this.accumulator === 0) {
          this.programCounter = operand;
          this.metrics.branchCount++;
        }
        break;
      case 8:
        if (this.accumulator >= 0) {
          this.programCounter = operand;
          this.metrics.branchCount++;
        }
        break;
      case 9:
        if (operand === 1) {
          this.accumulator = this.getInput();
        } else if (operand === 2) {
          this.addOutput(this.accumulator);
        }
        break;
      default:
        this.isHalted = true;
        this.isRunning = false;
        break;
    }

    return !this.isHalted;
  }

  run() {
    this.isRunning = true;
    const maxCycles = 100000;

    while (this.isRunning && !this.isHalted && this.metrics.cycles < maxCycles) {
      this.step();
    }

    if (this.metrics.cycles >= maxCycles) {
      this.isHalted = true;
      this.isRunning = false;
    }

    return {
      ...this.metrics,
      output: this.getOutput()
    };
  }
}
