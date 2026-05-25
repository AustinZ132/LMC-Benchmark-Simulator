import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Terminal, Zap, ArrowRight, Cpu, Binary, Hash, Database, HardDrive, MemoryStick } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.menu-card', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power3.out'
      });

      gsap.from('.grid-item', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.8,
        ease: 'back.out(1.7)'
      });

      gsap.to('.grid-item', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random'
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const menuItems = [
    {
      icon: <Terminal size={32} />,
      title: isZh ? 'LMC 模拟器' : 'LMC Simulator',
      description: isZh ? '编写和运行 LMC 汇编代码，支持多种预设算法' : 'Write and run LMC assembly code with algorithm presets',
      link: '/editor',
      color: '#0070f3',
      gradient: 'linear-gradient(135deg, #0070f3 0%, #00c6ff 100%)'
    },
    {
      icon: <Zap size={32} />,
      title: isZh ? '基准测试' : 'Benchmark',
      description: isZh ? '测试算法性能，对比 LMC 与现代 CPU 的架构差异' : 'Test performance, compare LMC vs modern CPU architecture',
      link: '/benchmark',
      color: '#7928ca',
      gradient: 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)'
    }
  ];

  const gridItems = [
    { icon: <Hash size={20} />, label: 'O(1)' },
    { icon: <Binary size={20} />, label: 'O(n)' },
    { icon: <Database size={20} />, label: 'O(n2)' },
    { icon: <Cpu size={20} />, label: 'LMC' },
    { icon: <Zap size={20} />, label: 'CPU' },
    { icon: <HardDrive size={20} />, label: 'RAM' },
    { icon: <Cpu size={20} />, label: 'ALU' },
    { icon: <MemoryStick size={20} />, label: 'IR' },
    { icon: <Hash size={20} />, label: 'PC' }
  ];

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-bg-grid">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item">
            <span className="grid-icon">{item.icon}</span>
            <span className="grid-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <Cpu size={14} />
          <span>{isZh ? '计算机体系结构教学工具' : 'Computer Architecture Educational Tool'}</span>
        </div>
        
        <h1 ref={titleRef} className="hero-title">
          {isZh ? 'LMC 基准测试工具' : 'LMC Benchmark Tool'}
        </h1>
        
        <p ref={subtitleRef} className="hero-subtitle">
          {isZh 
            ? '通过小人计算机深入理解冯·诺依曼架构、算法复杂度与性能分析' 
            : 'Deep dive into von Neumann architecture, algorithm complexity and performance analysis through Little Man Computer'}
        </p>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.link} className="menu-card" style={{ '--card-gradient': item.gradient }}>
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

        <div className="hero-footer">
          <span className="footer-tag">Fetch-Decode-Execute</span>
          <span className="footer-divider">·</span>
          <span className="footer-tag">Von Neumann</span>
          <span className="footer-divider">·</span>
          <span className="footer-tag">Algorithm Complexity</span>
        </div>
      </div>
    </section>
  );
}
