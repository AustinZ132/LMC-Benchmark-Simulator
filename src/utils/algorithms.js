export const ALGORITHMS = {
  simpleArithmetic: {
    id: 'simpleArithmetic',
    nameKey: 'algorithms.simpleArithmetic.name',
    descKey: 'algorithms.simpleArithmetic.description',
    complexity: 'O(1)',
    code: `INP
STA A
INP
ADD A
OUT
HLT
A DAT 0`,
    inputSizes: [1]
  },
  loopSummation: {
    id: 'loopSummation',
    nameKey: 'algorithms.loopSummation.name',
    descKey: 'algorithms.loopSummation.description',
    complexity: 'O(n)',
    code: `INP
STA N
LOOP LDA SUM
ADD ONE
STA SUM
LDA N
SUB ONE
STA N
BRP LOOP
LDA SUM
OUT
HLT
SUM DAT 0
N DAT 0
ONE DAT 1`,
    inputSizes: [10, 50, 100, 500, 1000]
  },
  multiplication: {
    id: 'multiplication',
    nameKey: 'algorithms.multiplication.name',
    descKey: 'algorithms.multiplication.description',
    complexity: 'O(n)',
    code: `INP
STA A
INP
STA B
LOOP LDA RESULT
ADD A
STA RESULT
LDA B
SUB ONE
STA B
BRP LOOP
LDA RESULT
OUT
HLT
A DAT 0
B DAT 0
RESULT DAT 0
ONE DAT 1`,
    inputSizes: [10, 50, 100, 200, 500]
  },
  bubbleSort: {
    id: 'bubbleSort',
    nameKey: 'algorithms.bubbleSort.name',
    descKey: 'algorithms.bubbleSort.description',
    complexity: 'O(n²)',
    code: `; Bubble Sort (SMC)
INP
STA N
OUTER LDA N
SUB ONE
STA N
BRZ DONE
LDA ZERO
STA I
INNER LDA I
ADD ONE
STA I
LDA N
SUB I
BRZ OUTER
BRA INNER
DONE HLT
N DAT 0
I DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 20, 50]
  }
};

export function getAlgorithm(id) {
  return ALGORITHMS[id] || null;
}

export function getAlgorithmList() {
  return Object.values(ALGORITHMS);
}
