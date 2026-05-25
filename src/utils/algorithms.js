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
  factorial: {
    id: 'factorial',
    nameKey: 'algorithms.factorial.name',
    descKey: 'algorithms.factorial.description',
    complexity: 'O(n)',
    code: `INP
STA N
LDA ONE
STA RESULT
LOOP LDA RESULT
MUL N
STA RESULT
LDA N
SUB ONE
STA N
BRP LOOP
LDA RESULT
OUT
HLT
N DAT 0
RESULT DAT 0
ONE DAT 1`,
    inputSizes: [1, 5, 10, 15, 20]
  },
  fibonacci: {
    id: 'fibonacci',
    nameKey: 'algorithms.fibonacci.name',
    descKey: 'algorithms.fibonacci.description',
    complexity: 'O(n)',
    code: `INP
STA N
LDA ZERO
STA PREV
LDA ONE
STA CURR
LOOP LDA CURR
STA TEMP
ADD PREV
STA CURR
LDA TEMP
STA PREV
LDA N
SUB ONE
STA N
BRP LOOP
LDA CURR
OUT
HLT
N DAT 0
PREV DAT 0
CURR DAT 0
TEMP DAT 0
ZERO DAT 0
ONE DAT 1`,
    inputSizes: [10, 20, 50, 100, 200]
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
  },
  linearSearch: {
    id: 'linearSearch',
    nameKey: 'algorithms.linearSearch.name',
    descKey: 'algorithms.linearSearch.description',
    complexity: 'O(n)',
    code: `; Linear Search
INP
STA TARGET
LDA ZERO
STA INDEX
LOOP LDA INDEX
ADD ONE
STA INDEX
LDA N
SUB INDEX
BRZ NOTFOUND
BRA LOOP
NOTFOUND LDA NEG1
OUT
HLT
TARGET DAT 0
INDEX DAT 0
N DAT 10
ZERO DAT 0
NEG1 DAT -1`,
    inputSizes: [10, 50, 100, 500, 1000]
  },
  power: {
    id: 'power',
    nameKey: 'algorithms.power.name',
    descKey: 'algorithms.power.description',
    complexity: 'O(n)',
    code: `; Power (Base^Exp)
INP
STA BASE
INP
STA EXP
LDA ONE
STA RESULT
LOOP LDA RESULT
MUL BASE
STA RESULT
LDA EXP
SUB ONE
STA EXP
BRP LOOP
LDA RESULT
OUT
HLT
BASE DAT 0
EXP DAT 0
RESULT DAT 0
ONE DAT 1`,
    inputSizes: [2, 5, 10, 15, 20]
  }
};

export function getAlgorithm(id) {
  return ALGORITHMS[id] || null;
}

export function getAlgorithmList() {
  return Object.values(ALGORITHMS);
}
