import React, { useState, useRef, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
import { Play, RotateCcw, Copy, Check, ChevronDown, BookOpen } from 'lucide-react';
import { LMC } from '../utils/lmc';

const PRESETS = {
  addition: {
    name: 'Addition (A+B)',
    description: 'Input two numbers and add them',
    code: `; Addition: Input two numbers and add them
; Input: 5, 3 → Output: 8

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
    code: `; Loop: Calculate sum from 1 to N
; Input: 10 → Output: 55

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
    name: 'Multiply (A×B)',
    description: 'A times B using repeated addition',
    code: `; Multiply: A times B
; Input: 4, 5 → Output: 20

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
    code: `; Factorial: Calculate N!
; Input: 5 → Output: 120

INP
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
ONE DAT 1`
  },
  fibonacci: {
    name: 'Fibonacci',
    description: 'Calculate Nth Fibonacci number',
    code: `; Fibonacci: Nth number
; Input: 10 → Output: 55

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
    code: `; Counter: Print 1 to N
; Input: 5 → Output: 1,2,3,4,5

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
    code: `; Find Maximum of two numbers
; Input: 7, 9 → Output: 9

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
  const { t } = useI18n();
  const [code, setCode] = useState(PRESETS.addition.code);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const textareaRef = useRef(null);

  const handleRun = useCallback(() => {
    const lmc = new LMC();
    try {
      lmc.loadCode(code);
      const inputMatch = code.match(/INP/g);
      const inputCount = inputMatch ? inputMatch.length : 0;
      const inputs = Array.from({ length: inputCount }, (_, i) => i + 1);
      lmc.setInput(inputs);
      const result = lmc.run();
      setOutput(result.output.join('\n') || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(PRESETS.addition.code);
    setOutput('');
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handlePresetSelect = useCallback((presetKey) => {
    setCode(PRESETS[presetKey].code);
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
          <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {t('editor.title')}
        </h2>
        <div className="section-actions">
          <div className="preset-dropdown">
            <button 
              onClick={() => setShowPresets(!showPresets)} 
              className="button-secondary-sm"
            >
              <ChevronDown size={14} />
              <span>Presets</span>
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
            <span>{t('editor.run')}</span>
          </button>
          <button onClick={handleReset} className="button-secondary-sm">
            <RotateCcw size={16} />
            <span>{t('editor.reset')}</span>
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
            placeholder={t('editor.placeholder')}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div className="output-panel">
          <div className="output-header">
            <span className="output-title">Output</span>
          </div>
          <div className="output-content">
            <pre>{output || '// Click "Run" to execute'}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
