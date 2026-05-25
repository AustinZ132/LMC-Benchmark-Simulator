import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { ALGORITHMS } from '../utils/algorithms';
import { Play, Loader, Cpu, Zap, HardDrive, GitBranch, Clock } from 'lucide-react';

function runNativeAlgorithm(algorithmId, inputSize) {
  const startTime = performance.now();
  let instructions = 0;

  switch (algorithmId) {
    case 'simpleArithmetic': {
      const a = 5, b = 3;
      const result = a + b;
      instructions = 3;
      break;
    }
    case 'loopSummation': {
      let sum = 0;
      for (let i = 1; i <= inputSize; i++) {
        sum += i;
        instructions += 2;
      }
      break;
    }
    case 'multiplication': {
      let result = 0;
      for (let i = 0; i < inputSize; i++) {
        result += inputSize;
        instructions += 2;
      }
      break;
    }
    case 'factorial': {
      let result = 1;
      for (let i = 1; i <= inputSize; i++) {
        result *= i;
        instructions += 2;
      }
      break;
    }
    case 'fibonacci': {
      let prev = 0, curr = 1;
      for (let i = 0; i < inputSize; i++) {
        const temp = curr;
        curr = curr + prev;
        prev = temp;
        instructions += 3;
      }
      break;
    }
    case 'power': {
      let result = 1;
      for (let i = 0; i < inputSize; i++) {
        result *= 2;
        instructions += 2;
      }
      break;
    }
    default:
      instructions = 1;
  }

  const endTime = performance.now();
  return {
    executionTime: endTime - startTime,
    instructions: instructions
  };
}

export default function ArchComparison() {
  const { t } = useI18n();
  const [algorithm, setAlgorithm] = useState('loopSummation');
  const [inputSize, setInputSize] = useState(1000);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const algorithmList = Object.values(ALGORITHMS).filter(a => 
    !['bubbleSort', 'linearSearch'].includes(a.id)
  );

  const handleRun = async () => {
    setIsRunning(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const nativeResult = runNativeAlgorithm(algorithm, inputSize);
    
    const lmcCyclesPerSecond = 1000;
    const lmcTimeSeconds = (inputSize * 10) / lmcCyclesPerSecond;
    const lmcTimeMs = lmcTimeSeconds * 1000;
    
    setResults({
      native: nativeResult,
      lmc: {
        executionTime: lmcTimeMs,
        instructions: inputSize * 10,
        memoryAccess: inputSize * 15,
        clockSpeed: '1 Hz',
        hasCache: false,
        hasPipeline: false
      },
      modern: {
        clockSpeed: '3+ GHz',
        hasCache: true,
        hasPipeline: true,
        cacheSize: '32KB L1 + 256KB L2 + 8MB L3',
        pipelineStages: '14-20 stages',
        branchPrediction: true,
        outOfOrder: true
      },
      speedup: lmcTimeMs / nativeResult.executionTime
    });
    
    setIsRunning(false);
  };

  return (
    <section id="comparison" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <Cpu size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Architecture Comparison
        </h2>
        <div className="section-actions">
          <button onClick={handleRun} disabled={isRunning} className="button-primary">
            {isRunning ? <Loader size={16} className="spinner" /> : <Play size={16} />}
            <span>Run Comparison</span>
          </button>
        </div>
      </div>

      <div className="comparison-controls">
        <div className="control-group">
          <label className="control-label">Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="form-input">
            {algorithmList.map(a => (
              <option key={a.id} value={a.id}>{a.id}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Input Size</label>
          <select value={inputSize} onChange={(e) => setInputSize(Number(e.target.value))} className="form-input">
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={5000}>5000</option>
            <option value={10000}>10000</option>
          </select>
        </div>
      </div>

      {results && (
        <div className="comparison-results">
          <div className="comparison-cards">
            <div className="comparison-card lmc-card">
              <div className="card-header">
                <HardDrive size={20} />
                <h3>LMC (Little Man Computer)</h3>
              </div>
              <div className="card-body">
                <div className="spec-row">
                  <span className="spec-label">Clock Speed</span>
                  <span className="spec-value">{results.lmc.clockSpeed}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Execution Time</span>
                  <span className="spec-value highlight">{results.lmc.executionTime.toFixed(2)} ms</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Instructions</span>
                  <span className="spec-value">{results.lmc.instructions.toLocaleString()}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Memory Access</span>
                  <span className="spec-value">{results.lmc.memoryAccess.toLocaleString()}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Cache</span>
                  <span className="spec-value disabled">None</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Pipeline</span>
                  <span className="spec-value disabled">None</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Branch Prediction</span>
                  <span className="spec-value disabled">None</span>
                </div>
              </div>
            </div>

            <div className="comparison-card modern-card">
              <div className="card-header">
                <Zap size={20} />
                <h3>Modern CPU (x86/ARM)</h3>
              </div>
              <div className="card-body">
                <div className="spec-row">
                  <span className="spec-label">Clock Speed</span>
                  <span className="spec-value highlight">{results.modern.clockSpeed}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Execution Time</span>
                  <span className="spec-value highlight">{results.native.executionTime.toFixed(4)} ms</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Instructions</span>
                  <span className="spec-value">{results.native.instructions.toLocaleString()}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Cache</span>
                  <span className="spec-value enabled">{results.modern.cacheSize}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Pipeline</span>
                  <span className="spec-value enabled">{results.modern.pipelineStages}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Branch Prediction</span>
                  <span className="spec-value enabled">Yes</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Out-of-Order</span>
                  <span className="spec-value enabled">Yes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="speedup-banner">
            <div className="speedup-content">
              <span className="speedup-label">Modern CPU is</span>
              <span className="speedup-value">{results.speedup.toFixed(0)}x</span>
              <span className="speedup-label">faster than LMC</span>
            </div>
            <div className="speedup-reason">
              <p>Why? Modern CPUs use:</p>
              <ul>
                <li><strong>Pipelining</strong>: Execute multiple instructions simultaneously</li>
                <li><strong>Cache</strong>: Fast memory close to CPU (L1/L2/L3)</li>
                <li><strong>Branch Prediction</strong>: Guess jump direction before knowing</li>
                <li><strong>Out-of-Order Execution</strong>: Reorder instructions for efficiency</li>
                <li><strong>Multiple Cores</strong>: Parallel processing</li>
              </ul>
            </div>
          </div>

          <div className="architecture-diagram">
            <h4>Architecture Comparison</h4>
            <div className="diagram-grid">
              <div className="diagram-item">
                <div className="diagram-title">LMC</div>
                <div className="diagram-body">
                  <div className="component">CPU (Single)</div>
                  <div className="arrow">↕</div>
                  <div className="component">Memory (100 cells)</div>
                  <div className="arrow">↕</div>
                  <div className="component">I/O</div>
                </div>
                <div className="diagram-note">Single bus, sequential execution</div>
              </div>
              <div className="diagram-item">
                <div className="diagram-title">Modern CPU</div>
                <div className="diagram-body">
                  <div className="component highlight">Multi-core CPU</div>
                  <div className="arrow">↕</div>
                  <div className="component">L1 Cache (32KB)</div>
                  <div className="arrow">↕</div>
                  <div className="component">L2 Cache (256KB)</div>
                  <div className="arrow">↕</div>
                  <div className="component">L3 Cache (8MB)</div>
                  <div className="arrow">↕</div>
                  <div className="component">RAM (16GB+)</div>
                </div>
                <div className="diagram-note">Multiple buses, parallel execution</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
