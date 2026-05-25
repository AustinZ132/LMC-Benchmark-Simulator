import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { ALGORITHMS } from '../utils/algorithms';
import { Play, Loader } from 'lucide-react';

export default function Benchmark() {
  const { t } = useI18n();
  const { isRunning, progress, status, statusText, runBenchmark } = useBenchmark();
  const [algorithm, setAlgorithm] = useState('simpleArithmetic');
  const [inputSize, setInputSize] = useState(10);

  const algorithmList = Object.values(ALGORITHMS);
  const selectedAlgorithm = ALGORITHMS[algorithm];

  const handleRun = async () => {
    await runBenchmark(algorithm, inputSize);
  };

  return (
    <section id="benchmark" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('benchmark.title')}</h2>
        <div className="section-actions">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="button-primary"
          >
            {isRunning ? (
              <Loader size={16} className="spinner" />
            ) : (
              <Play size={16} />
            )}
            <span>{t('benchmark.runTest')}</span>
          </button>
        </div>
      </div>
      <div className="benchmark-controls">
        <div className="control-group">
          <label className="control-label">{t('benchmark.selectAlgorithm')}</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="form-input"
            disabled={isRunning}
          >
            {algorithmList.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {t(algo.nameKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">{t('benchmark.inputSize')}</label>
          <select
            value={inputSize}
            onChange={(e) => setInputSize(Number(e.target.value))}
            className="form-input"
            disabled={isRunning}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </div>
        {selectedAlgorithm && (
          <div className="algorithm-info">
            <p className="algorithm-name">{t(selectedAlgorithm.nameKey)}</p>
            <p className="algorithm-description">{t(selectedAlgorithm.descKey)}</p>
            <p className="algorithm-complexity">Complexity: {selectedAlgorithm.complexity}</p>
          </div>
        )}
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-info">
          <span className="progress-text">{Math.round(progress)}%</span>
          <span className={`status-indicator status-${status}`}>
            {t(`labels.${status}`)}
          </span>
        </div>
        {statusText && <span className="status-text">{statusText}</span>}
      </div>
    </section>
  );
}
