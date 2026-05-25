import React, { useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function Charts() {
  const { t } = useI18n();
  const { results } = useBenchmark();
  const complexityChartRef = useRef(null);
  const memoryChartRef = useRef(null);
  const complexityInstance = useRef(null);
  const memoryInstance = useRef(null);

  useEffect(() => {
    if (results.length === 0) return;

    const labels = results.map(r => r.inputSize);
    const instructionData = results.map(r => r.instructionCount);
    const memoryData = results.map(r => r.memoryAccess);

    if (complexityInstance.current) {
      complexityInstance.current.destroy();
    }

    if (memoryInstance.current) {
      memoryInstance.current.destroy();
    }

    if (complexityChartRef.current) {
      complexityInstance.current = new Chart(complexityChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: t('metrics.instructions'),
              data: instructionData,
              borderColor: '#171717',
              backgroundColor: 'rgba(23, 23, 23, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: t('metrics.memory'),
              data: memoryData,
              borderColor: '#0070f3',
              backgroundColor: 'rgba(0, 112, 243, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: t('charts.inputSize')
              }
            },
            y: {
              title: {
                display: true,
                text: t('charts.count')
              }
            }
          }
        }
      });
    }

    if (memoryChartRef.current) {
      memoryInstance.current = new Chart(memoryChartRef.current, {
        type: 'bar',
        data: {
          labels: results.map(r => r.inputSize),
          datasets: [
            {
              label: t('metrics.memory'),
              data: memoryData,
              backgroundColor: 'rgba(0, 112, 243, 0.8)',
              borderColor: '#0070f3',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: t('charts.inputSize')
              }
            },
            y: {
              title: {
                display: true,
                text: t('charts.count')
              }
            }
          }
        }
      });
    }

    return () => {
      if (complexityInstance.current) {
        complexityInstance.current.destroy();
      }
      if (memoryInstance.current) {
        memoryInstance.current.destroy();
      }
    };
  }, [results, t]);

  return (
    <section id="analysis" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('charts.title')}</h2>
      </div>
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">{t('charts.complexity')}</h3>
          </div>
          <div className="chart-wrapper">
            <canvas ref={complexityChartRef}></canvas>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">{t('charts.memory')}</h3>
          </div>
          <div className="chart-wrapper">
            <canvas ref={memoryChartRef}></canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
