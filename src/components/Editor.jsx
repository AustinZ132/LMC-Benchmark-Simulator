import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { Play, StepForward, RotateCcw } from 'lucide-react';
import { LMC } from '../utils/lmc';

export default function Editor() {
  const { t } = useI18n();
  const [code, setCode] = useState(`INP
STA A
INP
ADD A
OUT
HLT
A DAT 0`);
  const [output, setOutput] = useState('');

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
    setCode(`INP
STA A
INP
ADD A
OUT
HLT
A DAT 0`);
    setOutput('');
  };

  return (
    <section id="editor" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('editor.title')}</h2>
        <div className="section-actions">
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
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('editor.placeholder')}
            spellCheck={false}
          />
        </div>
        <div className="output-panel">
          <div className="output-header">
            <span className="output-title">Output</span>
          </div>
          <div className="output-content">
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
