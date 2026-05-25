import React from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Activity, HardDrive, GitBranch, Clock } from 'lucide-react';

export default function Metrics() {
  const { t } = useI18n();
  const { metrics } = useBenchmark();

  const metricsList = [
    {
      key: 'instructions',
      label: t('metrics.instructions'),
      value: metrics.instructions,
      icon: <Activity size={20} />
    },
    {
      key: 'memory',
      label: t('metrics.memory'),
      value: metrics.memory,
      icon: <HardDrive size={20} />
    },
    {
      key: 'branches',
      label: t('metrics.branches'),
      value: metrics.branches,
      icon: <GitBranch size={20} />
    },
    {
      key: 'cycles',
      label: t('metrics.cycles'),
      value: metrics.cycles,
      icon: <Clock size={20} />
    }
  ];

  return (
    <section id="metrics" className="section">
      <div className="section-header">
        <h2 className="section-title">{t('metrics.title')}</h2>
      </div>
      <div className="metrics-grid">
        {metricsList.map((metric) => (
          <div key={metric.key} className="metric-item">
            <div className="metric-icon">{metric.icon}</div>
            <span className="metric-label">{metric.label}</span>
            <span className="metric-value">{metric.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
