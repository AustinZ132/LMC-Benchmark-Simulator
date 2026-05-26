import React, { useState, useRef, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
import { Play, RotateCcw, Copy, Check, ChevronDown, Terminal } from 'lucide-react';
import { LMC } from '../utils/lmc';

const PRESETS = {
  addition: {
    name: 'Addition (A+B)',
    description: 'Input two numbers and add them',
    inputs: '5\n3',
    code: `; Addition: Input two numbers and add them
; Input: 5, 3 -> Output: 8

INP
STA A
INP
ADD A
OUT
HLT

A DAT 0`
  },
  loop: {
    name: 'Loop Sum (1 to N)',
    description: 'Calculate sum from 1 to N',
    inputs: '10',
    code: `; Loop: Calculate sum from 1 to N
; Input: 10 -> Output: 55

INP
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
ONE DAT 1`
  },
  multiply: {
    name: 'Multiply (A x B)',
    description: 'A times B using repeated addition',
    inputs: '4\n5',
    code: `; Multiply: A times B
; Input: 4, 5 -> Output: 20

INP
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
ONE DAT 1`
  },
  factorial: {
    name: 'Factorial (N!)',
    description: 'Calculate N factorial',
    inputs: '5',
    code: `; Factorial: Calculate N!
; Input: 5 -> Output: 120

INP
STA N
LDA ONE
STA RESULT
LOOP LDA N
SUB ONE
STA N
BRZ DONE
LDA RESULT
MUL N
STA RESULT
BRA LOOP
DONE LDA RESULT
OUT
HLT

N DAT 0
RESULT DAT 0
ONE DAT 1`
  },
  fibonacci: {
    name: 'Fibonacci',
    description: 'Calculate Nth Fibonacci number',
    inputs: '10',
    code: `; Fibonacci: Nth number
; Input: 10 -> Output: 55

INP
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
ONE DAT 1`
  },
  counter: {
    name: 'Counter (1 to N)',
    description: 'Print numbers 1 to N',
    inputs: '5',
    code: `; Counter: Print 1 to N
; Input: 5 -> Output: 1,2,3,4,5

INP
STA N
LDA ONE
STA COUNT
LOOP LDA COUNT
OUT
LDA COUNT
ADD ONE
STA COUNT
LDA N
SUB COUNT
BRP LOOP
HLT

N DAT 0
COUNT DAT 0
ONE DAT 1`
  },
  max: {
    name: 'Find Maximum',
    description: 'Find max of two numbers',
    inputs: '7\n9',
    code: `; Find Maximum of two numbers
; Input: 7, 9 -> Output: 9

INP
STA A
INP
STA B
SUB A
BRP BMAX
LDA A
OUT
HLT
BMAX LDA B
OUT
HLT

A DAT 0
B DAT 0`
  }
};

export default function Editor() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';
  const [code, setCode] = useState(PRESETS.addition.code);
  const [inputs, setInputs] = useState(PRESETS.addition.inputs);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const textareaRef = useRef(null);

  const handleRun = useCallback(() => {
    const lmc = new LMC();
    try {
      lmc.loadCode(code);
      
      const inputLines = inputs.split('\n').filter(line => line.trim() !== '');
      const inputValues = inputLines.map(line => parseInt(line.trim()) || 0);
      lmc.setInput(inputValues);
      
      const result = lmc.run();
      if (result.output.length > 0) {
        setOutput(result.output.join('\n'));
      } else {
        setOutput(isZh ? '无输出（程序可能需要输入）' : 'No output (program may need input)');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }, [code, inputs, isZh]);

  const handleReset = useCallback(() => {
    setCode(PRESETS.addition.code);
    setInputs(PRESETS.addition.inputs);
    setOutput('');
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handlePresetSelect = useCallback((presetKey) => {
    const preset = PRESETS[presetKey];
    setCode(preset.code);
    setInputs(preset.inputs);
    setShowPresets(false);
    setOutput('');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, [code]);

  return (
    <section id="editor" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Terminal size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {isZh ? 'LMC 模拟器' : 'LMC Simulator'}
        </h2>
        <div className="section-actions">
          <div className="preset-dropdown">
            <button 
              onClick={() => setShowPresets(!showPresets)} 
              className="button-secondary-sm"
            >
              <ChevronDown size={14} />
              <span>{isZh ? '预设代码' : 'Presets'}</span>
            </button>
            {showPresets && (
              <div className="preset-menu">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className="preset-item"
                  >
                    <span className="preset-name">{preset.name}</span>
                    <span className="preset-desc">{preset.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="button-secondary-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button onClick={handleRun} className="button-primary-sm">
            <Play size={16} />
            <span>Run</span>
          </button>
          <button onClick={handleReset} className="button-secondary-sm">
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
      <div className="editor-container">
        <div className="editor-panel">
          <div className="editor-header">
            <span className="editor-filename">program.lmc</span>
            <span className="editor-hint">Tab to indent</span>
          </div>
          <textarea
            ref={textareaRef}
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter LMC code here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div className="io-panel">
          <div className="input-panel">
            <div className="panel-header">
              <span className="panel-title">Input</span>
              <span className="panel-hint">One number per line</span>
            </div>
            <textarea
              className="input-editor"
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              placeholder="Enter input data..."
              spellCheck={false}
            />
          </div>
          <div className="output-panel">
            <div className="panel-header">
              <span className="panel-title">Output</span>
            </div>
            <div className="output-content">
              <pre>{output || 'Click "Run" to execute'}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
