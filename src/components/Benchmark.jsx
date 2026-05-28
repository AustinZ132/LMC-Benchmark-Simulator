import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { ALGORITHMS } from '../utils/algorithms';
import { getCPUInfo, benchmarkNativeCode, makeLMCComparisonData, formatDuration, formatMultiplier } from '../utils/cpu';
import { Play, Square, Cpu, Zap, HardDrive, Clock, Activity, Database, Gauge, GitBranch } from 'lucide-react';
import gsap from 'gsap';

export default function Benchmark() {
  const { t } = useI18n();
  const { isRunning, progress, status, statusText, runBenchmark, resetBenchmark } = useBenchmark();
  const [algorithm, setAlgorithm] = useState('loopSummation');
  const [inputSize, setInputSize] = useState(ALGORITHMS.loopSummation.inputSizes.at(-1));
  const [cpuInfo, setCpuInfo] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const sectionRef = useRef(null);
  const progressFillRef = useRef(null);
  const comparisonRef = useRef(null);

  const algorithmList = Object.values(ALGORITHMS);
  const selectedAlgorithm = ALGORITHMS[algorithm];

  useEffect(() => {
    setCpuInfo(getCPUInfo());
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo('[data-benchmark-motion]', {
          autoAlpha: 0,
          y: 18
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out'
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!progressFillRef.current) return;

    gsap.to(progressFillRef.current, {
      scaleX: progress / 100,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, [progress]);

  useEffect(() => {
    if (!showComparison || !comparisonRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-compare-motion]', { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.out' } })
        .fromTo('[data-compare-motion]', {
          autoAlpha: 0,
          y: 20
        }, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.07
        })
        .fromTo('.speedup-value', {
          autoAlpha: 0,
          y: 10,
          scale: 0.98
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35
        }, '<0.18');
    }, comparisonRef);

    return () => ctx.revert();
  }, [showComparison, comparison]);

  useEffect(() => {
    setInputSize(selectedAlgorithm.inputSizes.at(-1));
  }, [selectedAlgorithm]);

  const handleRun = async () => {
    setShowComparison(false);
    const benchmarkResult = await runBenchmark(algorithm, inputSize);
    const latest = benchmarkResult?.latest;
    const nativeResult = latest
      ? {
          executionTime: latest.nativeExecutionTime,
          measuredTime: latest.nativeMeasuredTime,
          instructions: latest.nativeInstructions,
          memoryAccess: latest.nativeMemoryAccess,
          branchCount: latest.nativeBranchCount,
          cycles: latest.nativeCycles,
          iterations: latest.nativeIterations
        }
      : benchmarkNativeCode(algorithm, inputSize);
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
    <section id="benchmark" className="section benchmark-section" ref={sectionRef}>
      <div className="section-header" data-benchmark-motion>
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
        <div className="benchmark-controls" data-benchmark-motion>
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
          <div className="cpu-info-card" data-benchmark-motion>
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

      <div className="progress-container" data-benchmark-motion>
        <div className="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
          <div className="progress-fill" ref={progressFillRef}></div>
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
        <div className="comparison-section" ref={comparisonRef}>
          <h3 className="comparison-title" data-compare-motion>
            <Gauge size={18} />
            {t('comparison.title') || 'Performance Comparison'}
          </h3>
          
          <div className="comparison-grid">
            <div className="comparison-card lmc-card" data-compare-motion>
              <div className="card-header">
                <HardDrive size={18} />
                <span>{t('comparison.lmc')}</span>
              </div>
              <div className="card-body">
                <div className="metric-row">
                  <Cpu size={14} />
                  <span className="metric-label">{t('comparison.clockSpeed')}</span>
                  <span className="metric-value">{comparison.lmc.clockSpeed}</span>
                </div>
                <div className="metric-row">
                  <Clock size={14} />
                  <span className="metric-label">{t('comparison.executionTime')}</span>
                  <span className="metric-value">{formatDuration(comparison.lmc.executionTime)}</span>
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
                <div className="metric-row">
                  <GitBranch size={14} />
                  <span className="metric-label">{t('metrics.branches')}</span>
                  <span className="metric-value">{comparison.lmc.branches.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <Cpu size={14} />
                  <span className="metric-label">{t('metrics.cycles')}</span>
                  <span className="metric-value">{comparison.lmc.cycles.toLocaleString()}</span>
                </div>
                <div className="spec-tags">
                  <span className="tag disabled">{t('comparison.cache')}: None</span>
                  <span className="tag disabled">{t('comparison.pipeline')}: None</span>
                </div>
              </div>
            </div>

            <div className="comparison-card native-card" data-compare-motion>
              <div className="card-header">
                <Zap size={18} />
                <span>{t('comparison.modern')} ({cpuInfo?.cpu})</span>
              </div>
              <div className="card-body">
                <div className="metric-row">
                  <Clock size={14} />
                  <span className="metric-label">{t('comparison.executionTime')}</span>
                  <span className="metric-value highlight">{formatDuration(comparison.native.executionTime)}</span>
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
                <div className="metric-row">
                  <GitBranch size={14} />
                  <span className="metric-label">{t('metrics.branches')}</span>
                  <span className="metric-value">{comparison.native.branchCount.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <Cpu size={14} />
                  <span className="metric-label">{t('metrics.cycles')}</span>
                  <span className="metric-value">{comparison.native.cycles.toLocaleString()}</span>
                </div>
                <div className="spec-tags">
                  <span className="tag enabled">L1/L2/L3 Cache</span>
                  <span className="tag enabled">Pipeline</span>
                  <span className="tag enabled">Branch Prediction</span>
                  <span className="tag enabled">{t('comparison.samples')}: {comparison.native.iterations.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="speedup-bar" data-compare-motion>
            <div className="speedup-content">
              <span className="speedup-label">{t('comparison.yourCpuIs')}</span>
              <span className="speedup-value">{formatMultiplier(comparison.speedup)}</span>
              <span className="speedup-label">{t('comparison.fasterThanLmc')}</span>
            </div>
          </div>

          <div className="why-faster" data-compare-motion>
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
