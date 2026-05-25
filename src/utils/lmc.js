export class LMC {
  constructor() {
    this.reset();
  }

  reset() {
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

  loadCode(code) {
    this.reset();
    const lines = code.split('\n');
    const labels = {};
    let address = 0;

    // First pass: collect labels
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(';')) continue;
      
      const parts = trimmed.split(/\s+/);
      const firstToken = parts[0].toUpperCase();
      
      if (!this.isOpcode(firstToken)) {
        labels[firstToken] = address;
        if (parts.length > 1) {
          address++;
        }
      } else {
        address++;
      }
    }

    // Second pass: generate code
    address = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(';')) continue;
      
      const parts = trimmed.split(/\s+/);
      let opcode, operand;
      let idx = 0;

      if (this.isOpcode(parts[0].toUpperCase())) {
        opcode = parts[0].toUpperCase();
        idx = 1;
      } else if (parts.length >= 2) {
        opcode = parts[1].toUpperCase();
        idx = 2;
      } else {
        continue;
      }

      if (opcode === 'DAT') {
        const val = parts[idx] ? parseInt(parts[idx]) : 0;
        this.memory[address] = val;
      } else if (opcode === 'INP') {
        this.memory[address] = 901;
      } else if (opcode === 'OUT') {
        this.memory[address] = 902;
      } else if (opcode === 'HLT') {
        this.memory[address] = 0;
      } else {
        const op = this.getOpcodeValue(opcode);
        let addr = 0;
        if (parts[idx]) {
          const token = parts[idx].toUpperCase();
          addr = labels[token] !== undefined ? labels[token] : (parseInt(token) || 0);
        }
        this.memory[address] = op * 100 + addr;
      }
      address++;
    }
  }

  isOpcode(token) {
    const opcodes = ['HLT', 'ADD', 'SUB', 'STA', 'LDA', 'BRA', 'BRZ', 'BRP', 'INP', 'OUT', 'DAT', 'MUL'];
    return opcodes.includes(token.toUpperCase());
  }

  getOpcodeValue(opcode) {
    const map = {
      'HLT': 0, 'ADD': 1, 'SUB': 2, 'STA': 3, 'MUL': 4,
      'LDA': 5, 'BRA': 6, 'BRZ': 7, 'BRP': 8
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
      case 0: // HLT
        this.isHalted = true;
        this.isRunning = false;
        break;
      case 1: // ADD
        this.accumulator += this.memory[operand];
        this.metrics.memoryAccess++;
        break;
      case 2: // SUB
        this.accumulator -= this.memory[operand];
        this.metrics.memoryAccess++;
        break;
      case 3: // STA
        this.memory[operand] = this.accumulator;
        this.metrics.memoryAccess++;
        break;
      case 4: // MUL
        this.accumulator *= this.memory[operand];
        this.metrics.memoryAccess++;
        break;
      case 5: // LDA
        this.accumulator = this.memory[operand];
        this.metrics.memoryAccess++;
        break;
      case 6: // BRA
        this.programCounter = operand;
        this.metrics.branchCount++;
        break;
      case 7: // BRZ
        if (this.accumulator === 0) {
          this.programCounter = operand;
          this.metrics.branchCount++;
        }
        break;
      case 8: // BRP
        if (this.accumulator >= 0) {
          this.programCounter = operand;
          this.metrics.branchCount++;
        }
        break;
      case 9: // INP/OUT
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
