import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Cpu, Zap, BarChart3, Code } from 'lucide-react';

export default function Hero() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Code size={24} />,
      title: t('nav.editor'),
      description: 'Write and test LMC assembly code',
      link: '/editor'
    },
    {
      icon: <Zap size={24} />,
      title: t('nav.benchmark'),
      description: 'Compare LMC vs your CPU performance',
      link: '/benchmark'
    },
    {
      icon: <BarChart3 size={24} />,
      title: t('nav.analysis'),
      description: 'Visualize algorithm complexity',
      link: '/analysis'
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Cpu size={16} />
          <span>Educational Tool</span>
        </div>
        <h1 className="hero-title">{t('app.title')}</h1>
        <p className="hero-subtitle">{t('app.subtitle')}</p>
        <div className="hero-actions">
          <Link to="/benchmark" className="button-primary">
            Start Benchmark
          </Link>
          <Link to="/editor" className="button-secondary">
            Try Editor
          </Link>
        </div>
      </div>
      <div className="hero-features">
        {features.map((feature, index) => (
          <Link key={index} to={feature.link} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
