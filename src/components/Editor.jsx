import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { Play, RotateCcw, StepForward, Copy, Check } from 'lucide-react';
import { LMC } from '../utils/lmc';

const OPCODES = ['HLT', 'ADD', 'SUB', 'STA', 'LDA', 'BRA', 'BRZ', 'BRP', 'INP', 'OUT', 'DAT'];

function highlightSyntax(code) {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    let highlighted = line;
    
    const commentIdx = line.indexOf(';');
    if (commentIdx !== -1) {
      const comment = line.substring(commentIdx);
      const before = line.substring(0, commentIdx);
      highlighted = before + `<span class="syntax-comment">${comment}</span>`;
    }
    
    OPCODES.forEach(op => {
      const regex = new RegExp(`\\b(${op})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="syntax-opcode">$1</span>`);
    });
    
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>');
    
    return `<div class="editor-line"><span class="line-number">${i + 1}</span>${highlighted}</div>`;
  }).join('');
}

export default function Editor() {
  const { t } = useI18n();
  const [code, setCode] = useState(`; LMC Program
; Input two numbers and add them

INP
STA A
INP
ADD A
OUT
HLT

A DAT 0`);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const handleRun = () => {
    const lmc = new LMC();
    try {
      lmc.loadCode(code);
      lmc.setInput([5, 3]);
      const result = lmc.run();
      setOutput(result.output.join('\n') || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleReset = () => {
    setCode(`; LMC Program
; Input two numbers and add them

INP
STA A
INP
ADD A
OUT
HLT

A DAT 0`);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <section id="editor" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('editor.title')}</h2>
        <div className="section-actions">
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
          </div>
          <div className="editor-wrapper">
            <div 
              ref={highlightRef}
              className="editor-highlight"
              dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
            />
            <textarea
              ref={textareaRef}
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              placeholder={t('editor.placeholder')}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="output-panel">
          <div className="output-header">
            <span className="output-title">Output</span>
          </div>
          <div className="output-content">
            <pre>{output || '// Output will appear here'}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
