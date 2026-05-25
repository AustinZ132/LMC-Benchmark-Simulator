import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Terminal, Zap, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  const menuItems = [
    {
      icon: <Terminal size={28} />,
      title: isZh ? 'LMC 模拟器' : 'LMC Simulator',
      description: isZh ? '编写和运行 LMC 汇编代码，支持预设和语法高亮' : 'Write and run LMC assembly code with presets',
      link: '/editor',
      color: '#0070f3'
    },
    {
      icon: <Zap size={28} />,
      title: isZh ? '基准测试' : 'Benchmark',
      description: isZh ? '测试算法性能，对比 LMC 与你的 CPU，查看数据分析和导出报告' : 'Test algorithm performance, compare LMC vs your CPU, view analysis and export',
      link: '/benchmark',
      color: '#7928ca'
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">{isZh ? 'LMC 基准测试工具' : 'LMC Benchmark Tool'}</h1>
        <p className="hero-subtitle">
          {isZh 
            ? '通过小人计算机理解冯·诺依曼架构和算法复杂度' 
            : 'Understand von Neumann architecture through Little Man Computer'}
        </p>
      </div>
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
            <ChevronRight size={20} className="menu-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
