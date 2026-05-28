import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { Check, ChevronDown, Copy, Play, RotateCcw, Terminal } from 'lucide-react';
import { LMC } from '../utils/lmc';
import { ALGORITHMS, getBenchmarkInput } from '../utils/algorithms';
import gsap from 'gsap';

const PRESET_IDS = ['simpleArithmetic', 'loopSummation', 'multiplication', 'fibonacci', 'smcTraversal'];

export default function Editor() {
  const { t } = useI18n();
  const defaultAlgorithm = ALGORITHMS.simpleArithmetic;
  const [selectedPreset, setSelectedPreset] = useState(defaultAlgorithm.id);
  const [code, setCode] = useState(defaultAlgorithm.code);
  const [inputs, setInputs] = useState(getBenchmarkInput(defaultAlgorithm, 1).join('\n'));
  const [output, setOutput] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const sectionRef = useRef(null);
  const textareaRef = useRef(null);

  const presets = useMemo(() => PRESET_IDS.map((id) => ALGORITHMS[id]), []);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-editor-motion]', { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      gsap.fromTo('[data-editor-motion]', {
        autoAlpha: 0,
        y: 18
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showPresets || !sectionRef.current) return undefined;

    const menu = sectionRef.current.querySelector('.preset-menu');
    if (!menu || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const tween = gsap.fromTo(menu, {
      autoAlpha: 0,
      y: 8,
      scale: 0.98
    }, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: 'power3.out'
    });

    return () => tween.kill();
  }, [showPresets]);

  const handleRun = useCallback(() => {
    const lmc = new LMC();
    try {
      lmc.loadCode(code);

      const inputValues = inputs
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => Number.parseInt(line, 10))
        .map((value) => (Number.isNaN(value) ? 0 : value));

      lmc.setInput(inputValues);
      const result = lmc.run();
      setMetrics(result);
      setOutput(result.output.length > 0 ? result.output.join('\n') : t('editor.noOutput'));
    } catch (error) {
      setMetrics(null);
      setOutput(`${t('messages.executionError')}: ${error.message}`);
    }
  }, [code, inputs, t]);

  const handleReset = useCallback(() => {
    const algorithm = ALGORITHMS.simpleArithmetic;
    setSelectedPreset(algorithm.id);
    setCode(algorithm.code);
    setInputs(getBenchmarkInput(algorithm, 1).join('\n'));
    setOutput('');
    setMetrics(null);
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [code]);

  const handlePresetSelect = useCallback((presetId) => {
    const algorithm = ALGORITHMS[presetId];
    const defaultSize = algorithm.inputSizes.at(Math.min(1, algorithm.inputSizes.length - 1));
    setSelectedPreset(presetId);
    setCode(algorithm.code);
    setInputs(getBenchmarkInput(algorithm, defaultSize).join('\n'));
    setShowPresets(false);
    setOutput('');
    setMetrics(null);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = `${code.substring(0, start)}  ${code.substring(end)}`;
    setCode(newCode);
    window.requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    });
  }, [code]);

  return (
    <section id="editor" className="section" ref={sectionRef}>
      <div className="section-header" data-editor-motion>
        <h2 className="section-title">
          <Terminal size={20} />
          {t('editor.title')}
        </h2>
        <div className="section-actions">
          <div className="preset-dropdown">
            <button
              onClick={() => setShowPresets((visible) => !visible)}
              className="button-secondary-sm"
              aria-expanded={showPresets}
            >
              <ChevronDown size={14} />
              <span>{t('editor.presets')}</span>
            </button>
            {showPresets && (
              <div className="preset-menu">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`preset-item ${selectedPreset === preset.id ? 'active' : ''}`}
                  >
                    <span className="preset-name">{t(preset.nameKey)}</span>
                    <span className="preset-desc">{t(preset.descKey)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="button-secondary-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t('editor.copied') : t('editor.copy')}</span>
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
      <div className="editor-container" data-editor-motion>
        <div className="editor-panel">
          <div className="editor-header">
            <span className="editor-filename">program.lmc</span>
            <span className="editor-hint">{t('editor.editorHint')}</span>
          </div>
          <textarea
            ref={textareaRef}
            className="code-editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('editor.placeholder')}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div className="io-panel">
          <div className="input-panel">
            <div className="panel-header">
              <span className="panel-title">{t('editor.input')}</span>
              <span className="panel-hint">{t('editor.inputHint')}</span>
            </div>
            <textarea
              className="input-editor"
              value={inputs}
              onChange={(event) => setInputs(event.target.value)}
              placeholder={t('editor.inputHint')}
              spellCheck={false}
            />
          </div>
          <div className="output-panel">
            <div className="panel-header">
              <span className="panel-title">{t('editor.output')}</span>
              {metrics && (
                <span className="panel-hint">
                  {metrics.instructionCount} inst / {metrics.memoryAccess} mem
                </span>
              )}
            </div>
            <div className="output-content">
              <pre>{output || t('editor.runHint')}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
