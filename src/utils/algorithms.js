const constantAdditionInput = () => [5, 3];
const singleNInput = (n) => [n];
const multiplyInput = (n) => [4, n];
const powerInput = (n) => [2, n];

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
    inputSizes: [1],
    makeInput: constantAdditionInput
  },
  loopSummation: {
    id: 'loopSummation',
    nameKey: 'algorithms.loopSummation.name',
    descKey: 'algorithms.loopSummation.description',
    complexity: 'O(n)',
    code: `INP
STA N
LDA ZERO
STA SUM
STA I
LOOP LDA N
BRZ DONE
LDA I
ADD ONE
STA I
LDA SUM
ADD I
STA SUM
LDA N
SUB ONE
STA N
BRA LOOP
DONE LDA SUM
OUT
HLT
SUM DAT 0
I DAT 0
N DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 25, 50, 100],
    makeInput: singleNInput
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
LDA ZERO
STA RESULT
LOOP LDA B
BRZ DONE
LDA RESULT
ADD A
STA RESULT
LDA B
SUB ONE
STA B
BRA LOOP
DONE LDA RESULT
OUT
HLT
A DAT 0
B DAT 0
RESULT DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 25, 50, 100],
    makeInput: multiplyInput
  },
  factorial: {
    id: 'factorial',
    nameKey: 'algorithms.factorial.name',
    descKey: 'algorithms.factorial.description',
    complexity: 'O(n^2)',
    code: `INP
STA N
LDA ONE
STA RESULT
OUTER LDA N
BRZ DONE
LDA ZERO
STA TEMP
LDA N
STA COUNT
INNER LDA COUNT
BRZ SAVE
LDA TEMP
ADD RESULT
STA TEMP
LDA COUNT
SUB ONE
STA COUNT
BRA INNER
SAVE LDA TEMP
STA RESULT
LDA N
SUB ONE
STA N
BRA OUTER
DONE LDA RESULT
OUT
HLT
N DAT 0
RESULT DAT 0
TEMP DAT 0
COUNT DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [1, 3, 5, 7, 9],
    makeInput: singleNInput
  },
  fibonacci: {
    id: 'fibonacci',
    nameKey: 'algorithms.fibonacci.name',
    descKey: 'algorithms.fibonacci.description',
    complexity: 'O(n)',
    code: `INP
STA N
BRZ OUTZERO
SUB ONE
BRZ OUTONE
LDA ZERO
STA PREV
LDA ONE
STA CURR
LDA N
SUB ONE
STA COUNT
LOOP LDA COUNT
BRZ DONE
LDA CURR
STA TEMP
ADD PREV
STA CURR
LDA TEMP
STA PREV
LDA COUNT
SUB ONE
STA COUNT
BRA LOOP
DONE LDA CURR
OUT
HLT
OUTZERO LDA ZERO
OUT
HLT
OUTONE LDA ONE
OUT
HLT
N DAT 0
COUNT DAT 0
PREV DAT 0
CURR DAT 0
TEMP DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 15, 20, 25],
    makeInput: singleNInput
  },
  bubbleSort: {
    id: 'bubbleSort',
    nameKey: 'algorithms.bubbleSort.name',
    descKey: 'algorithms.bubbleSort.description',
    complexity: 'O(n^2)',
    code: `; Bubble-sort comparison workload
; Counts nested-loop comparisons for N items.
INP
STA N
LDA ZERO
STA COUNT
OUTER LDA N
SUB ONE
STA N
BRZ DONE
LDA N
STA I
INNER LDA COUNT
ADD ONE
STA COUNT
LDA I
SUB ONE
STA I
BRZ OUTER
BRA INNER
DONE LDA COUNT
OUT
HLT
N DAT 0
I DAT 0
COUNT DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 20, 30, 40],
    makeInput: singleNInput
  },
  smcTraversal: {
    id: 'smcTraversal',
    nameKey: 'algorithms.smcTraversal.name',
    descKey: 'algorithms.smcTraversal.description',
    complexity: 'O(n)',
    code: `; Self-modifying traversal demo
; Increments the operand of the LDA instruction at READ.
INP
STA N
LOOP LDA N
BRZ DONE
READ LDA DATA
OUT
LDA READ
ADD ONE
STA READ
LDA N
SUB ONE
STA N
BRA LOOP
DONE HLT
N DAT 0
ONE DAT 1
DATA DAT 11
DAT 22
DAT 33
DAT 44
DAT 55
DAT 66
DAT 77
DAT 88
DAT 99`,
    inputSizes: [1, 3, 5, 7, 9],
    makeInput: (n) => [Math.min(n, 9)]
  },
  linearSearch: {
    id: 'linearSearch',
    nameKey: 'algorithms.linearSearch.name',
    descKey: 'algorithms.linearSearch.description',
    complexity: 'O(n)',
    code: `; Linear-search workload
; Counts inspected positions until N is exhausted.
INP
STA N
LDA ZERO
STA INDEX
LOOP LDA N
BRZ NOTFOUND
LDA INDEX
ADD ONE
STA INDEX
LDA N
SUB ONE
STA N
BRA LOOP
NOTFOUND LDA INDEX
OUT
HLT
N DAT 0
INDEX DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [5, 10, 25, 50, 100],
    makeInput: singleNInput
  },
  power: {
    id: 'power',
    nameKey: 'algorithms.power.name',
    descKey: 'algorithms.power.description',
    complexity: 'O(n^2)',
    code: `; Power (Base^Exp)
INP
STA BASE
INP
STA EXP
LDA ONE
STA RESULT
OUTER LDA EXP
BRZ DONE
LDA ZERO
STA TEMP
LDA BASE
STA COUNT
INNER LDA COUNT
BRZ SAVE
LDA TEMP
ADD RESULT
STA TEMP
LDA COUNT
SUB ONE
STA COUNT
BRA INNER
SAVE LDA TEMP
STA RESULT
LDA EXP
SUB ONE
STA EXP
BRA OUTER
DONE LDA RESULT
OUT
HLT
BASE DAT 0
EXP DAT 0
RESULT DAT 0
TEMP DAT 0
COUNT DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [1, 2, 3, 4, 5],
    makeInput: powerInput
  }
};

export function getAlgorithm(id) {
  return ALGORITHMS[id] || null;
}

export function getAlgorithmList() {
  return Object.values(ALGORITHMS);
}

export function getBenchmarkInput(algorithmOrId, inputSize) {
  const algorithm = typeof algorithmOrId === 'string'
    ? ALGORITHMS[algorithmOrId]
    : algorithmOrId;

  if (!algorithm) return [];
  if (typeof algorithm.makeInput === 'function') {
    return algorithm.makeInput(inputSize);
  }
  return [inputSize];
}
