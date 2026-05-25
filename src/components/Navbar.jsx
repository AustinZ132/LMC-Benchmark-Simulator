import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const { t, toggleLang, lang } = useI18n();
  const location = useLocation();

  const navItems = [
    { path: '/', key: 'home', label: 'Home' },
    { path: '/editor', key: 'editor', label: t('nav.editor') },
    { path: '/benchmark', key: 'benchmark', label: t('nav.benchmark') },
    { path: '/analysis', key: 'analysis', label: t('nav.analysis') },
    { path: '/export', key: 'export', label: t('nav.export') }
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-text">LMC</span>
          <span className="logo-subtitle">Benchmark</span>
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button onClick={toggleLang} className="button-secondary-sm">
            <Globe size={16} />
            <span>{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
