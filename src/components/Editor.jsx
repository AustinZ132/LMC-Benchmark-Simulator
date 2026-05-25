import React, { useState, useRef, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';
import { Play, RotateCcw, Copy, Check, ChevronDown, Terminal } from 'lucide-react';
import { LMC } from '../utils/lmc';

const PRESETS = {
  addition: {
    name: '加法 (A+B)',
    nameEn: 'Addition (A+B)',
    description: '输入两个数并相加',
    descriptionEn: 'Input two numbers and add them',
    code: `; 加法: 输入两个数并相加
; 输入: 5, 3 → 输出: 8

INP
STA A
INP
ADD A
OUT
HLT

A DAT 0`
  },
  loop: {
    name: '循环求和 (1到N)',
    nameEn: 'Loop Sum (1 to N)',
    description: '计算1到N的累加和',
    descriptionEn: 'Calculate sum from 1 to N',
    code: `; 循环求和: 计算1到N的和
; 输入: 10 → 输出: 55

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
    name: '乘法 (A×B)',
    nameEn: 'Multiply (A×B)',
    description: '通过重复加法实现乘法',
    descriptionEn: 'A times B using repeated addition',
    code: `; 乘法: A乘以B
; 输入: 4, 5 → 输出: 20

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
    name: '阶乘 (N!)',
    nameEn: 'Factorial (N!)',
    description: '计算N的阶乘',
    descriptionEn: 'Calculate N factorial',
    code: `; 阶乘: 计算N!
; 输入: 5 → 输出: 120

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
    name: '斐波那契数列',
    nameEn: 'Fibonacci',
    description: '计算第N个斐波那契数',
    descriptionEn: 'Calculate Nth Fibonacci number',
    code: `; 斐波那契: 第N个数
; 输入: 10 → 输出: 55

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
    name: '计数器 (1到N)',
    nameEn: 'Counter (1 to N)',
    description: '打印1到N的数字',
    descriptionEn: 'Print numbers 1 to N',
    code: `; 计数器: 打印1到N
; 输入: 5 → 输出: 1,2,3,4,5

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
    name: '求最大值',
    nameEn: 'Find Maximum',
    description: '找出两个数中的最大值',
    descriptionEn: 'Find max of two numbers',
    code: `; 求最大值: 两个数中的最大值
; 输入: 7, 9 → 输出: 9

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
  const { t, lang } = useI18n();
  const [code, setCode] = useState(PRESETS.addition.code);
  const [inputs, setInputs] = useState('5\n3');
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
      setOutput(result.output.join('\n') || t('messages.noOutput') || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }, [code, inputs, t]);

  const handleReset = useCallback(() => {
    setCode(PRESETS.addition.code);
    setInputs('5\n3');
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
    
    const inputMatch = preset.code.match(/输入[：:]\s*(.+?)[\s→]/);
    if (inputMatch) {
      const inputStr = inputMatch[1].replace(/,/g, '\n');
      setInputs(inputStr);
    }
    
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

  const isZh = lang === 'zh';

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
                    <span className="preset-name">{isZh ? preset.name : preset.nameEn}</span>
                    <span className="preset-desc">{isZh ? preset.description : preset.descriptionEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="button-secondary-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制' : 'Copy')}</span>
          </button>
          <button onClick={handleRun} className="button-primary-sm">
            <Play size={16} />
            <span>{isZh ? '运行' : 'Run'}</span>
          </button>
          <button onClick={handleReset} className="button-secondary-sm">
            <RotateCcw size={16} />
            <span>{isZh ? '重置' : 'Reset'}</span>
          </button>
        </div>
      </div>
      <div className="editor-container">
        <div className="editor-panel">
          <div className="editor-header">
            <span className="editor-filename">program.lmc</span>
            <span className="editor-hint">{isZh ? 'Tab 缩进' : 'Tab to indent'}</span>
          </div>
          <textarea
            ref={textareaRef}
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isZh ? '在此输入 LMC 代码...' : 'Enter LMC code here...'}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div className="io-panel">
          <div className="input-panel">
            <div className="panel-header">
              <span className="panel-title">{isZh ? '输入' : 'Input'}</span>
              <span className="panel-hint">{isZh ? '每行一个数字' : 'One number per line'}</span>
            </div>
            <textarea
              className="input-editor"
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              placeholder={isZh ? '输入数据...\n例如：5\n3' : 'Input data...\nExample: 5\n3'}
              spellCheck={false}
            />
          </div>
          <div className="output-panel">
            <div className="panel-header">
              <span className="panel-title">{isZh ? '输出' : 'Output'}</span>
            </div>
            <div className="output-content">
              <pre>{output || (isZh ? '// 点击"运行"执行程序' : '// Click "Run" to execute')}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
