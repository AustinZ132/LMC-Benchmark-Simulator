import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BarChart3, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

Chart.register(...registerables, zoomPlugin);

const CHART_COLORS = [
  { border: '#171717', bg: 'rgba(23, 23, 23, 0.08)' },
  { border: '#0070f3', bg: 'rgba(0, 112, 243, 0.08)' },
  { border: '#7928ca', bg: 'rgba(121, 40, 202, 0.08)' },
  { border: '#f5a623', bg: 'rgba(245, 166, 35, 0.12)' }
];

export default function Charts() {
  const { t } = useI18n();
  const { results } = useBenchmark();
  const complexityChartRef = useRef(null);
  const memoryChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const sectionRef = useRef(null);
  const complexityInstance = useRef(null);
  const memoryInstance = useRef(null);
  const comparisonInstance = useRef(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

  const algorithms = [...new Set(results.map((r) => r.algorithmId).filter(Boolean))];

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-chart-motion]', { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      gsap.fromTo('[data-chart-motion]', {
        autoAlpha: 0,
        y: 18
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [results.length, selectedAlgorithms.length]);

  useEffect(() => {
    if (results.length === 0) return undefined;

    const groupedByAlgorithm = {};
    results.forEach((result) => {
      if (!result.algorithmId) return;
      if (!groupedByAlgorithm[result.algorithmId]) {
        groupedByAlgorithm[result.algorithmId] = [];
      }
      groupedByAlgorithm[result.algorithmId].push(result);
    });

    const filteredAlgorithms = selectedAlgorithms.length > 0
      ? Object.keys(groupedByAlgorithm).filter((id) => selectedAlgorithms.includes(id))
      : Object.keys(groupedByAlgorithm);

    const lineDatasets = (key) => filteredAlgorithms.map((algorithmId, index) => {
      const color = CHART_COLORS[index % CHART_COLORS.length];
      return {
        label: algorithmId,
        data: groupedByAlgorithm[algorithmId].map((point) => ({
          x: point.inputSize,
          y: point[key]
        })),
        borderColor: color.border,
        backgroundColor: color.bg,
        tension: 0.25,
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

    const commonOptions = {
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
      }
    };

    if (complexityChartRef.current) {
      complexityInstance.current = new Chart(complexityChartRef.current, {
        type: 'line',
        data: { datasets: lineDatasets('instructionCount') },
        options: {
          ...commonOptions,
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: t('charts.inputSize') },
              grid: { color: '#ebebeb' }
            },
            y: {
              title: { display: true, text: t('metrics.instructions') },
              grid: { color: '#ebebeb' }
            }
          }
        }
      });
    }

    if (memoryChartRef.current) {
      memoryInstance.current = new Chart(memoryChartRef.current, {
        type: 'line',
        data: { datasets: lineDatasets('memoryAccess') },
        options: {
          ...commonOptions,
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: t('charts.inputSize') },
              grid: { color: '#ebebeb' }
            },
            y: {
              title: { display: true, text: t('metrics.memory') },
              grid: { color: '#ebebeb' }
            }
          }
        }
      });
    }

    if (comparisonChartRef.current && filteredAlgorithms.length > 0) {
      const latestResults = filteredAlgorithms.map((algorithmId) => {
        const data = groupedByAlgorithm[algorithmId];
        return data[data.length - 1];
      });

      comparisonInstance.current = new Chart(comparisonChartRef.current, {
        type: 'radar',
        data: {
          labels: [
            t('comparison.instructions'),
            t('comparison.memoryAccess'),
            t('metrics.branches'),
            t('metrics.cycles')
          ],
          datasets: filteredAlgorithms.map((algorithmId, index) => {
            const result = latestResults[index];
            const color = CHART_COLORS[index % CHART_COLORS.length];
            return {
              label: algorithmId,
              data: [result.instructionCount, result.memoryAccess, result.branchCount, result.cycles],
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
  }, [results, selectedAlgorithms, t]);

  const toggleAlgorithm = (algorithmId) => {
    setSelectedAlgorithms((previous) =>
      previous.includes(algorithmId)
        ? previous.filter((id) => id !== algorithmId)
        : [...previous, algorithmId]
    );
  };

  const resetZoom = (chartInstanceRef) => {
    chartInstanceRef.current?.resetZoom();
  };

  if (results.length === 0) {
    return (
      <section id="analysis" className="section" ref={sectionRef}>
        <div className="section-header" data-chart-motion>
          <h2 className="section-title">
            <BarChart3 size={20} />
            {t('charts.title')}
          </h2>
        </div>
        <div className="empty-state" data-chart-motion>
          <BarChart3 size={48} />
          <p>{t('charts.empty')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="analysis" className="section" ref={sectionRef}>
      <div className="section-header" data-chart-motion>
        <h2 className="section-title">
          <BarChart3 size={20} />
          {t('charts.title')}
        </h2>
        {algorithms.length > 0 && (
          <div className="algorithm-filters" aria-label={t('charts.algorithm')}>
            {algorithms.map((algorithmId) => (
              <button
                key={algorithmId}
                onClick={() => toggleAlgorithm(algorithmId)}
                className={`filter-chip ${selectedAlgorithms.includes(algorithmId) ? 'active' : ''}`}
              >
                {algorithmId}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="charts-grid">
        <div className="chart-container" data-chart-motion>
          <div className="chart-header">
            <h3 className="chart-title">{t('charts.complexity')}</h3>
            <button onClick={() => resetZoom(complexityInstance)} className="button-secondary-sm" aria-label={t('charts.resetZoom')}>
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="chart-wrapper">
            <canvas ref={complexityChartRef}></canvas>
          </div>
          <p className="chart-hint">{t('charts.zoomHint')}</p>
        </div>
        <div className="chart-container" data-chart-motion>
          <div className="chart-header">
            <h3 className="chart-title">{t('charts.memory')}</h3>
            <button onClick={() => resetZoom(memoryInstance)} className="button-secondary-sm" aria-label={t('charts.resetZoom')}>
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="chart-wrapper">
            <canvas ref={memoryChartRef}></canvas>
          </div>
          <p className="chart-hint">{t('charts.zoomHint')}</p>
        </div>
      </div>
      <div className="chart-container comparison-chart" data-chart-motion>
        <div className="chart-header">
          <h3 className="chart-title">{t('charts.comparison')}</h3>
        </div>
        <div className="chart-wrapper chart-wrapper-small">
          <canvas ref={comparisonChartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
