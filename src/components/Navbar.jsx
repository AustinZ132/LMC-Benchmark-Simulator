import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const { t, toggleLang, lang } = useI18n();
  const location = useLocation();
  const isZh = lang === 'zh';

  const navItems = [
    { path: '/', key: 'home', label: isZh ? '首页' : 'Home' },
    { path: '/editor', key: 'editor', label: isZh ? '模拟器' : 'Simulator' },
    { path: '/benchmark', key: 'benchmark', label: isZh ? '基准测试' : 'Benchmark' },
    { path: '/analysis', key: 'analysis', label: isZh ? '数据分析' : 'Analysis' },
    { path: '/export', key: 'export', label: isZh ? '导出' : 'Export' }
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
            <span>{isZh ? 'EN' : '中'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
