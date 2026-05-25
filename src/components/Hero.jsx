import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Terminal, Zap, ArrowRight, Cpu } from 'lucide-react';

export default function Hero() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  const menuItems = [
    {
      icon: <Terminal size={28} />,
      title: isZh ? 'LMC 模拟器' : 'LMC Simulator',
      description: isZh ? '编写和运行 LMC 汇编代码，支持多种预设算法' : 'Write and run LMC assembly code with algorithm presets',
      link: '/editor',
      color: '#0070f3'
    },
    {
      icon: <Zap size={28} />,
      title: isZh ? '基准测试' : 'Benchmark',
      description: isZh ? '测试算法性能，对比 LMC 与现代 CPU 的架构差异' : 'Test performance, compare LMC vs modern CPU architecture',
      link: '/benchmark',
      color: '#7928ca'
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Cpu size={14} />
          <span>{isZh ? '计算机体系结构教学工具' : 'Computer Architecture Educational Tool'}</span>
        </div>
        
        <h1 className="hero-title">
          {isZh ? 'LMC 基准测试工具' : 'LMC Benchmark Tool'}
        </h1>
        
        <p className="hero-subtitle">
          {isZh 
            ? '通过小人计算机深入理解冯·诺依曼架构、算法复杂度与性能分析' 
            : 'Deep dive into von Neumann architecture, algorithm complexity and performance analysis through Little Man Computer'}
        </p>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.link} className="menu-card">
              <div className="menu-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="menu-info">
                <h3 className="menu-title">{item.title}</h3>
                <p className="menu-desc">{item.description}</p>
              </div>
              <div className="menu-arrow">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
