import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Cpu, Terminal, BarChart3, Download, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { t, lang } = useI18n();
  const isZh = lang === 'zh';

  const menuItems = [
    {
      icon: <Terminal size={24} />,
      title: isZh ? 'LMC 模拟器' : 'LMC Simulator',
      description: isZh ? '编写和运行 LMC 汇编代码' : 'Write and run LMC assembly code',
      link: '/editor',
      color: '#0070f3'
    },
    {
      icon: <Cpu size={24} />,
      title: isZh ? '基准测试' : 'Benchmark',
      description: isZh ? '测试算法性能，对比 LMC 与你的 CPU' : 'Test algorithm performance, compare LMC vs your CPU',
      link: '/benchmark',
      color: '#7928ca'
    },
    {
      icon: <BarChart3 size={24} />,
      title: isZh ? '数据分析' : 'Data Analysis',
      description: isZh ? '可视化算法复杂度和性能指标' : 'Visualize algorithm complexity and metrics',
      link: '/analysis',
      color: '#ff0080'
    },
    {
      icon: <Download size={24} />,
      title: isZh ? '导出报告' : 'Export Report',
      description: isZh ? '导出测试数据和图表' : 'Export test data and charts',
      link: '/export',
      color: '#50e3c2'
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Cpu size={16} />
          <span>{isZh ? '教学工具' : 'Educational Tool'}</span>
        </div>
        <h1 className="hero-title">{isZh ? 'LMC 基准测试工具' : 'LMC Benchmark Tool'}</h1>
        <p className="hero-subtitle">
          {isZh 
            ? '通过小人计算机理解冯·诺依曼架构和算法复杂度' 
            : 'Understand von Neumann architecture and algorithm complexity through Little Man Computer'}
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
