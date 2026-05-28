import React, { useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useBenchmark } from '../context/BenchmarkContext';
import { Activity, HardDrive, GitBranch, Clock } from 'lucide-react';
import gsap from 'gsap';

export default function Metrics() {
  const { t } = useI18n();
  const { metrics } = useBenchmark();
  const sectionRef = useRef(null);

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
  }, [metrics.instructions, metrics.memory, metrics.branches, metrics.cycles]);

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
            <span className="metric-value">{metric.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
