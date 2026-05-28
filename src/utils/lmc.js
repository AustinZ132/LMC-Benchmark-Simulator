const MEMORY_SIZE = 100;
const MAX_VALUE = 999;
const MIN_VALUE = -999;
const MAX_CYCLES = 100000;

const OPCODES = {
  HLT: 0,
  ADD: 1,
  SUB: 2,
  STA: 3,
  STO: 3,
  LDA: 5,
  BRA: 6,
  BR: 6,
  BRZ: 7,
  BRP: 8
};

const NO_OPERAND_OPS = new Set(['HLT', 'INP', 'OUT']);

function stripComment(line) {
  return line.replace(/;.*/, '').trim();
}

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clampAddress(address) {
  if (address < 0 || address >= MEMORY_SIZE) {
    throw new Error(`Memory address ${address} is outside 00-99.`);
  }
  return address;
}

function normalizeValue(value) {
  if (value > MAX_VALUE) return value % (MAX_VALUE + 1);
  if (value < MIN_VALUE) return -((-value) % (MAX_VALUE + 1));
  return value;
}

export class LMC {
  constructor() {
    this.reset();
  }

  reset() {
    this.memory = new Array(MEMORY_SIZE).fill(0);
    this.sourceMap = new Array(MEMORY_SIZE).fill('');
    this.accumulator = 0;
    this.programCounter = 0;
    this.inputQueue = [];
    this.outputQueue = [];
    this.trace = [];
    this.isRunning = false;
    this.isHalted = false;
    this.haltedByLimit = false;
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
    const parsedLines = [];
    let address = 0;

    for (const rawLine of lines) {
      const line = stripComment(rawLine);
      if (!line) continue;

      const parts = line.split(/\s+/);
      let label = null;
      let opcode = parts[0].toUpperCase();
      let operandToken = parts[1];

      if (!this.isOpcode(opcode)) {
        label = opcode;
        opcode = (parts[1] || '').toUpperCase();
        operandToken = parts[2];
      }

      if (!this.isOpcode(opcode)) {
        throw new Error(`Unknown instruction: ${line}`);
      }

      clampAddress(address);
      if (label) labels[label] = address;
      parsedLines.push({ address, opcode, operandToken, rawLine: rawLine.trim() });
      address++;
    }

    for (const parsed of parsedLines) {
      this.memory[parsed.address] = this.encodeInstruction(parsed, labels);
      this.sourceMap[parsed.address] = parsed.rawLine;
    }
  }

  encodeInstruction({ opcode, operandToken }, labels) {
    if (opcode === 'DAT') {
      return normalizeValue(parseNumber(operandToken, 0));
    }

    if (opcode === 'INP') return 901;
    if (opcode === 'OUT') return 902;
    if (opcode === 'HLT') return 0;

    const op = this.getOpcodeValue(opcode);
    let operand = 0;

    if (!NO_OPERAND_OPS.has(opcode)) {
      if (!operandToken) {
        throw new Error(`${opcode} requires an operand.`);
      }
      const token = operandToken.toUpperCase();
      operand = labels[token] !== undefined ? labels[token] : parseNumber(token, Number.NaN);
      if (Number.isNaN(operand)) {
        throw new Error(`Unknown label or address: ${operandToken}`);
      }
      clampAddress(operand);
    }

    return op * 100 + operand;
  }

  isOpcode(token = '') {
    const normalized = token.toUpperCase();
    return normalized === 'DAT' || normalized === 'INP' || normalized === 'OUT' || normalized in OPCODES;
  }

  getOpcodeValue(opcode) {
    return OPCODES[opcode] ?? 0;
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
    clampAddress(this.programCounter);

    const pcBefore = this.programCounter;
    const instruction = this.memory[this.programCounter];
    this.metrics.memoryAccess++;
    this.metrics.instructionCount++;
    this.metrics.cycles++;

    const opcode = Math.floor(Math.abs(instruction) / 100);
    const operand = Math.abs(instruction) % 100;
    this.programCounter++;

    switch (opcode) {
      case 0:
        this.isHalted = true;
        this.isRunning = false;
        break;
      case 1:
        this.accumulator = normalizeValue(this.accumulator + this.memory[operand]);
        this.metrics.memoryAccess++;
        break;
      case 2:
        this.accumulator = normalizeValue(this.accumulator - this.memory[operand]);
        this.metrics.memoryAccess++;
        break;
      case 3:
        this.memory[operand] = normalizeValue(this.accumulator);
        this.metrics.memoryAccess++;
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
          this.accumulator = normalizeValue(this.getInput());
        } else if (operand === 2) {
          this.addOutput(this.accumulator);
        } else {
          throw new Error(`Unknown I/O instruction: ${instruction}`);
        }
        break;
      default:
        throw new Error(`Unknown opcode ${opcode} at address ${pcBefore}.`);
    }

    if (this.trace.length < 500) {
      this.trace.push({
        pc: pcBefore,
        instruction,
        source: this.sourceMap[pcBefore],
        accumulator: this.accumulator,
        nextPc: this.programCounter
      });
    }

    return !this.isHalted;
  }

  run(code, inputValues) {
    if (typeof code === 'string') {
      this.loadCode(code);
    }

    if (inputValues !== undefined) {
      this.setInput(inputValues);
    }

    this.isRunning = true;

    while (this.isRunning && !this.isHalted && this.metrics.cycles < MAX_CYCLES) {
      this.step();
    }

    if (this.metrics.cycles >= MAX_CYCLES) {
      this.haltedByLimit = true;
      this.isHalted = true;
      this.isRunning = false;
    }

    return {
      ...this.metrics,
      output: this.getOutput(),
      trace: [...this.trace],
      haltedByLimit: this.haltedByLimit
    };
  }
}
