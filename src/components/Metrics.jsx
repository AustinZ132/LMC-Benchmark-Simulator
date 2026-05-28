import React, { useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Activity, HardDrive, GitBranch, Clock } from 'lucide-react';
import gsap from 'gsap';

export default function Metrics() {
  const { t } = useI18n();
  const { metrics } = useBenchmark();
  const sectionRef = useRef(null);
  const lmcMetrics = metrics?.lmc || {
    instructions: metrics?.instructions || 0,
    memory: metrics?.memory || 0,
    branches: metrics?.branches || 0,
    cycles: metrics?.cycles || 0
  };
  const cpuMetrics = metrics?.cpu || {
    instructions: 0,
    memory: 0,
    branches: 0,
    cycles: 0
  };

  const metricsList = [
    {
      key: 'instructions',
      label: t('metrics.instructions'),
      lmcValue: lmcMetrics.instructions,
      cpuValue: cpuMetrics.instructions,
      icon: <Activity size={20} />
    },
    {
      key: 'memory',
      label: t('metrics.memory'),
      lmcValue: lmcMetrics.memory,
      cpuValue: cpuMetrics.memory,
      icon: <HardDrive size={20} />
    },
    {
      key: 'branches',
      label: t('metrics.branches'),
      lmcValue: lmcMetrics.branches,
      cpuValue: cpuMetrics.branches,
      icon: <GitBranch size={20} />
    },
    {
      key: 'cycles',
      label: t('metrics.cycles'),
      lmcValue: lmcMetrics.cycles,
      cpuValue: cpuMetrics.cycles,
      icon: <Clock size={20} />
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.metric-item', { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      gsap.fromTo('.metric-item', {
        autoAlpha: 0,
        y: 14
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [
    lmcMetrics.instructions,
    lmcMetrics.memory,
    lmcMetrics.branches,
    lmcMetrics.cycles,
    cpuMetrics.instructions,
    cpuMetrics.memory,
    cpuMetrics.branches,
    cpuMetrics.cycles
  ]);

  return (
    <section id="metrics" className="section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">{t('metrics.title')}</h2>
      </div>
      <div className="metrics-grid">
        {metricsList.map((metric) => (
          <div key={metric.key} className="metric-item">
            <div className="metric-icon">{metric.icon}</div>
            <span className="metric-label">{metric.label}</span>
            <div className="metric-pair">
              <div className="metric-channel">
                <span className="metric-source">LMC</span>
                <span className="metric-value">{metric.lmcValue.toLocaleString()}</span>
              </div>
              <div className="metric-channel metric-channel-cpu">
                <span className="metric-source">CPU</span>
                <span className="metric-value cpu-value">{metric.cpuValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
