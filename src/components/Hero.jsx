import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { Terminal, Zap, ArrowRight, Cpu } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const tagsRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([badgeRef.current, titleRef.current, subtitleRef.current, card1Ref.current, card2Ref.current, tagsRef.current], {
        opacity: 0,
        y: 40
      });

      // Timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.2')
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .to(card1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.2)'
      }, '-=0.2')
      .to(card2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.2)'
      }, '-=0.4')
      .to(tagsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');

      // Hover animations
      const cards = [card1Ref.current, card2Ref.current];
      cards.forEach(card => {
        if (!card) return;

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            duration: 0.4,
            ease: 'power2.out'
          });
          gsap.to(card.querySelector('.menu-icon'), {
            scale: 1.15,
            rotation: 5,
            duration: 0.4,
            ease: 'power2.out'
          });
          gsap.to(card.querySelector('.menu-arrow'), {
            x: 8,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            duration: 0.4,
            ease: 'power2.out'
          });
          gsap.to(card.querySelector('.menu-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
          gsap.to(card.querySelector('.menu-arrow'), {
            x: 0,
            opacity: 0.5,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const menuItems = [
    {
      ref: card1Ref,
      icon: <Terminal size={28} />,
      title: isZh ? 'LMC 模拟器' : 'LMC Simulator',
      description: isZh ? '编写和运行 LMC 汇编代码，支持多种预设算法' : 'Write and run LMC assembly code with algorithm presets',
      link: '/editor',
      color: '#0070f3',
      bg: '#e8f4ff'
    },
    {
      ref: card2Ref,
      icon: <Zap size={28} />,
      title: isZh ? '基准测试' : 'Benchmark',
      description: isZh ? '测试算法性能，对比 LMC 与现代 CPU 的架构差异' : 'Test performance, compare LMC vs modern CPU architecture',
      link: '/benchmark',
      color: '#7928ca',
      bg: '#f3e8ff'
    }
  ];

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-content">
        <div ref={badgeRef} className="hero-badge">
          <Cpu size={14} />
          <span>{isZh ? '计算机体系结构教学工具' : 'Computer Architecture Educational Tool'}</span>
        </div>
        
        <h1 ref={titleRef} className="hero-title">
          {isZh ? 'LMC 基准测试工具' : 'LMC Benchmark Tool'}
        </h1>
        
        <p ref={subtitleRef} className="hero-subtitle">
          {isZh 
            ? '通过小人计算机深入理解冯·诺依曼架构、算法复杂度与性能分析' 
            : 'Deep dive into von Neumann architecture, algorithm complexity and performance analysis'}
        </p>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              ref={item.ref}
              to={item.link} 
              className="menu-card"
            >
              <div className="menu-icon" style={{ color: item.color, backgroundColor: item.bg }}>
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

        <div ref={tagsRef} className="hero-tags">
          <span className="tag-item">Fetch-Decode-Execute</span>
          <span className="tag-dot">·</span>
          <span className="tag-item">Von Neumann</span>
          <span className="tag-dot">·</span>
          <span className="tag-item">Algorithm Complexity</span>
        </div>
      </div>
    </section>
  );
}
