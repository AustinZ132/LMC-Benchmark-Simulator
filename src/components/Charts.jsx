import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BarChart3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

Chart.register(...registerables, zoomPlugin);

export default function Charts() {
  const { t, lang } = useI18n();
  const { results } = useBenchmark();
  const complexityChartRef = useRef(null);
  const memoryChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const complexityInstance = useRef(null);
  const memoryInstance = useRef(null);
  const comparisonInstance = useRef(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

  const isZh = lang === 'zh';
  const algorithms = [...new Set(results.map(r => r.algorithmId))];

  useEffect(() => {
    if (results.length === 0) return;

    const groupedByAlgorithm = {};
    results.forEach(r => {
      if (!groupedByAlgorithm[r.algorithmId]) {
        groupedByAlgorithm[r.algorithmId] = [];
      }
      groupedByAlgorithm[r.algorithmId].push(r);
    });

    const colors = [
      { border: '#171717', bg: 'rgba(23, 23, 23, 0.1)' },
      { border: '#0070f3', bg: 'rgba(0, 112, 243, 0.1)' },
      { border: '#ee0000', bg: 'rgba(238, 0, 0, 0.1)' },
      { border: '#f5a623', bg: 'rgba(245, 166, 35, 0.1)' }
    ];

    const filteredAlgorithms = selectedAlgorithms.length > 0
      ? Object.keys(groupedByAlgorithm).filter(a => selectedAlgorithms.includes(a))
      : Object.keys(groupedByAlgorithm);

    const complexityDatasets = filteredAlgorithms.map((algo, idx) => {
      const data = groupedByAlgorithm[algo];
      const color = colors[idx % colors.length];
      return {
        label: algo,
        data: data.map(d => ({ x: d.inputSize, y: d.instructionCount })),
        borderColor: color.border,
        backgroundColor: color.bg,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    const memoryDatasets = filteredAlgorithms.map((algo, idx) => {
      const data = groupedByAlgorithm[algo];
      const color = colors[idx % colors.length];
      return {
        label: algo,
        data: data.map(d => ({ x: d.inputSize, y: d.memoryAccess })),
        borderColor: color.border,
        backgroundColor: color.bg,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    if (complexityInstance.current) complexityInstance.current.destroy();
    if (memoryInstance.current) memoryInstance.current.destroy();
    if (comparisonInstance.current) comparisonInstance.current.destroy();

    const zoomOptions = {
      pan: { enabled: true, mode: 'xy' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'xy'
      }
    };

    if (complexityChartRef.current) {
      complexityInstance.current = new Chart(complexityChartRef.current, {
        type: 'line',
        data: { datasets: complexityDatasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              backgroundColor: '#171717',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`
              }
            },
            zoom: zoomOptions
          },
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: isZh ? '输入规模' : 'Input Size' },
              grid: { color: '#ebebeb' }
            },
            y: {
              title: { display: true, text: isZh ? '指令执行次数' : 'Instruction Count' },
              grid: { color: '#ebebeb' }
            }
          }
        }
      });
    }

    if (memoryChartRef.current) {
      memoryInstance.current = new Chart(memoryChartRef.current, {
        type: 'line',
        data: { datasets: memoryDatasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              backgroundColor: '#171717',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`
              }
            },
            zoom: zoomOptions
          },
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: isZh ? '输入规模' : 'Input Size' },
              grid: { color: '#ebebeb' }
            },
            y: {
              title: { display: true, text: isZh ? '内存访问次数' : 'Memory Access' },
              grid: { color: '#ebebeb' }
            }
          }
        }
      });
    }

    if (comparisonChartRef.current && filteredAlgorithms.length > 0) {
      const lastResults = filteredAlgorithms.map(algo => {
        const data = groupedByAlgorithm[algo];
        return data[data.length - 1];
      });

      comparisonInstance.current = new Chart(comparisonChartRef.current, {
        type: 'radar',
        data: {
          labels: [
            isZh ? '指令数' : 'Instructions',
            isZh ? '内存访问' : 'Memory',
            isZh ? '分支' : 'Branches',
            isZh ? '周期' : 'Cycles'
          ],
          datasets: filteredAlgorithms.map((algo, idx) => {
            const r = lastResults[idx];
            const color = colors[idx % colors.length];
            return {
              label: algo,
              data: [r.instructionCount, r.memoryAccess, r.branchCount, r.cycles],
              borderColor: color.border,
              backgroundColor: color.bg,
              pointBackgroundColor: color.border
            };
          })
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            r: {
              grid: { color: '#ebebeb' },
              angleLines: { color: '#ebebeb' },
              pointLabels: { color: '#171717' }
            }
          }
        }
      });
    }

    return () => {
      if (complexityInstance.current) complexityInstance.current.destroy();
      if (memoryInstance.current) memoryInstance.current.destroy();
      if (comparisonInstance.current) comparisonInstance.current.destroy();
    };
  }, [results, selectedAlgorithms, isZh]);

  const toggleAlgorithm = (algo) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algo) ? prev.filter(a => a !== algo) : [...prev, algo]
    );
  };

  const resetZoom = (chartRef) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  if (results.length === 0) {
    return (
      <section id="analysis" className="section">
        <div className="section-header">
          <h2 className="section-title">
            <BarChart3 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {isZh ? '数据分析' : 'Data Analysis'}
          </h2>
        </div>
        <div className="empty-state">
          <BarChart3 size={48} />
          <p>{isZh ? '运行基准测试后查看图表' : 'Run a benchmark to see charts'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="analysis" className="section">
      <div className="section-header">
        <h2 className="section-title">
          <BarChart3 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {isZh ? '数据分析' : 'Data Analysis'}
        </h2>
        {algorithms.length > 0 && (
          <div className="algorithm-filters">
            {algorithms.map(algo => (
              <button
                key={algo}
                onClick={() => toggleAlgorithm(algo)}
                className={`filter-chip ${selectedAlgorithms.includes(algo) ? 'active' : ''}`}
              >
                {algo}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">{isZh ? '复杂度曲线' : 'Complexity Curve'}</h3>
            <button onClick={() => resetZoom(complexityChartRef)} className="button-secondary-sm">
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="chart-wrapper">
            <canvas ref={complexityChartRef}></canvas>
          </div>
          <p className="chart-hint">{isZh ? '滚轮缩放，拖拽平移' : 'Scroll to zoom, drag to pan'}</p>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">{isZh ? '内存访问模式' : 'Memory Access Pattern'}</h3>
            <button onClick={() => resetZoom(memoryChartRef)} className="button-secondary-sm">
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="chart-wrapper">
            <canvas ref={memoryChartRef}></canvas>
          </div>
          <p className="chart-hint">{isZh ? '滚轮缩放，拖拽平移' : 'Scroll to zoom, drag to pan'}</p>
        </div>
      </div>
      <div className="chart-container comparison-chart">
        <div className="chart-header">
          <h3 className="chart-title">{isZh ? '架构对比' : 'Architecture Comparison'}</h3>
        </div>
        <div className="chart-wrapper chart-wrapper-small">
          <canvas ref={comparisonChartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
