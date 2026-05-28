import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const { toggleLang, lang, t } = useI18n();
  const location = useLocation();
  const isZh = lang === 'zh';

  const navItems = [
    { path: '/', key: 'home', label: t('nav.home') },
    { path: '/editor', key: 'editor', label: t('nav.editor') },
    { path: '/benchmark', key: 'benchmark', label: t('nav.benchmark') }
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
          <button onClick={toggleLang} className="button-secondary-sm" aria-label="Switch language">
            <Globe size={16} />
            <span>{isZh ? 'EN' : '中文'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
