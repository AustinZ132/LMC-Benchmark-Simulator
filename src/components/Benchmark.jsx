import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { ALGORITHMS } from '../utils/algorithms';
import { getCPUInfo, benchmarkNativeCode, makeLMCComparisonData } from '../utils/cpu';
import { Play, Loader, Square, Cpu, Zap, HardDrive, Clock, Activity, Database, Gauge } from 'lucide-react';

export default function Benchmark() {
  const { t } = useI18n();
  const { isRunning, progress, status, statusText, runBenchmark, resetBenchmark } = useBenchmark();
  const [algorithm, setAlgorithm] = useState('loopSummation');
  const [inputSize, setInputSize] = useState(ALGORITHMS.loopSummation.inputSizes.at(-1));
  const [cpuInfo, setCpuInfo] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const algorithmList = Object.values(ALGORITHMS);
  const selectedAlgorithm = ALGORITHMS[algorithm];

  useEffect(() => {
    setCpuInfo(getCPUInfo());
  }, []);

  useEffect(() => {
    setInputSize(selectedAlgorithm.inputSizes.at(-1));
  }, [selectedAlgorithm]);

  const handleRun = async () => {
    setShowComparison(false);
    const benchmarkResult = await runBenchmark(algorithm, inputSize);
    
    const nativeResult = benchmarkNativeCode(algorithm, inputSize);
    const lmcResult = makeLMCComparisonData(benchmarkResult?.latest);
    
    const speedup = nativeResult.executionTime > 0
      ? lmcResult.executionTime / nativeResult.executionTime
      : 0;
    
    setComparison({
      native: nativeResult,
      lmc: lmcResult,
      speedup: speedup,
      cpu: cpuInfo
    });
    setShowComparison(true);
  };

  const handleStop = () => {
    resetBenchmark();
    setShowComparison(false);
  };

  return (
    <section id="benchmark" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Activity size={20} />
          {t('benchmark.title')}
        </h2>
        <div className="section-actions">
          {isRunning ? (
            <button onClick={handleStop} className="button-primary button-danger">
              <Square size={16} />
              <span>{t('editor.stop')}</span>
            </button>
          ) : (
            <button onClick={handleRun} className="button-primary">
              <Play size={16} />
              <span>{t('benchmark.runTest')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="benchmark-layout">
        <div className="benchmark-controls">
          <div className="control-group">
            <label className="control-label" htmlFor="benchmark-algorithm">{t('benchmark.selectAlgorithm')}</label>
            <select
              id="benchmark-algorithm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="form-input"
              disabled={isRunning}
            >
              {algorithmList.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {t(algo.nameKey)} - {algo.complexity}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label className="control-label" htmlFor="benchmark-input-size">{t('benchmark.inputSize')}</label>
            <select
              id="benchmark-input-size"
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className="form-input"
              disabled={isRunning}
            >
              {selectedAlgorithm.inputSizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          {selectedAlgorithm && (
            <div className="algorithm-info">
              <p className="algorithm-name">{t(selectedAlgorithm.nameKey)}</p>
              <p className="algorithm-description">{t(selectedAlgorithm.descKey)}</p>
              <span className="algorithm-complexity">{selectedAlgorithm.complexity}</span>
            </div>
          )}
        </div>

        {cpuInfo && (
          <div className="cpu-info-card">
            <div className="cpu-info-header">
              <Cpu size={16} />
              <span>{t('benchmark.system')}</span>
            </div>
            <div className="cpu-info-body">
              <div className="cpu-spec">
                <span className="spec-label">CPU</span>
                <span className="spec-value">{cpuInfo.cpu}</span>
              </div>
              <div className="cpu-spec">
                <span className="spec-label">Cores</span>
                <span className="spec-value">{cpuInfo.cores}</span>
              </div>
              <div className="cpu-spec">
                <span className="spec-label">Memory</span>
                <span className="spec-value">{cpuInfo.memory}</span>
              </div>
              <div className="cpu-spec">
                <span className="spec-label">OS</span>
                <span className="spec-value">{cpuInfo.os}</span>
              </div>
            </div>
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

      {showComparison && comparison && (
        <div className="comparison-section">
          <h3 className="comparison-title">
            <Gauge size={18} />
            {t('comparison.title') || 'Performance Comparison'}
          </h3>
          
          <div className="comparison-grid">
            <div className="comparison-card lmc-card">
              <div className="card-header">
                <HardDrive size={18} />
                <span>LMC</span>
              </div>
              <div className="card-body">
                <div className="metric-row">
                  <Clock size={14} />
                  <span className="metric-label">{t('comparison.executionTime')}</span>
                  <span className="metric-value">{comparison.lmc.executionTime.toFixed(2)} ms</span>
                </div>
                <div className="metric-row">
                  <Activity size={14} />
                  <span className="metric-label">{t('comparison.instructions')}</span>
                  <span className="metric-value">{comparison.lmc.instructions.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <Database size={14} />
                  <span className="metric-label">{t('comparison.memoryAccess')}</span>
                  <span className="metric-value">{comparison.lmc.memoryAccess.toLocaleString()}</span>
                </div>
                <div className="spec-tags">
                  <span className="tag disabled">{t('comparison.cache')}: None</span>
                  <span className="tag disabled">{t('comparison.pipeline')}: None</span>
                </div>
              </div>
            </div>

            <div className="comparison-card native-card">
              <div className="card-header">
                <Zap size={18} />
                <span>{t('comparison.modern')} ({cpuInfo?.cpu})</span>
              </div>
              <div className="card-body">
                <div className="metric-row">
                  <Clock size={14} />
                  <span className="metric-label">{t('comparison.executionTime')}</span>
                  <span className="metric-value highlight">{comparison.native.executionTime.toFixed(4)} ms</span>
                </div>
                <div className="metric-row">
                  <Activity size={14} />
                  <span className="metric-label">{t('comparison.instructions')}</span>
                  <span className="metric-value">{comparison.native.instructions.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <Database size={14} />
                  <span className="metric-label">{t('comparison.memoryAccess')}</span>
                  <span className="metric-value">{comparison.native.memoryAccess.toLocaleString()}</span>
                </div>
                <div className="spec-tags">
                  <span className="tag enabled">L1/L2/L3 Cache</span>
                  <span className="tag enabled">Pipeline</span>
                  <span className="tag enabled">Branch Prediction</span>
                </div>
              </div>
            </div>
          </div>

          <div className="speedup-bar">
            <div className="speedup-content">
              <span className="speedup-label">{t('comparison.yourCpuIs')}</span>
              <span className="speedup-value">{comparison.speedup.toFixed(0)}x</span>
              <span className="speedup-label">{t('comparison.fasterThanLmc')}</span>
            </div>
          </div>

          <div className="why-faster">
            <h4>{t('comparison.whyFaster') || 'Why is modern CPU faster?'}</h4>
            <ul>
              <li><strong>Pipelining:</strong> {t('comparison.reasons.pipelining')}</li>
              <li><strong>Cache:</strong> {t('comparison.reasons.cache')}</li>
              <li><strong>Branch Prediction:</strong> {t('comparison.reasons.branchPrediction')}</li>
              <li><strong>Out-of-Order:</strong> {t('comparison.reasons.outOfOrder')}</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
