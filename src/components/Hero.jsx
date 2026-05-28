import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { ArrowRight, BarChart3, Cpu, Terminal } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-animate]', {
        opacity: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const menuItems = [
    {
      icon: <Terminal size={24} />,
      title: t('hero.simulatorTitle'),
      description: t('hero.simulatorDesc'),
      link: '/editor'
    },
    {
      icon: <BarChart3 size={24} />,
      title: t('hero.benchmarkTitle'),
      description: t('hero.benchmarkDesc'),
      link: '/benchmark'
    }
  ];

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-content">
        <div data-hero-animate className="hero-badge">
          <Cpu size={14} />
          <span>{t('hero.badge')}</span>
        </div>

        <h1 data-hero-animate className="hero-title">{t('hero.title')}</h1>

        <p data-hero-animate className="hero-subtitle">{t('hero.subtitle')}</p>

        <div data-hero-animate className="menu-grid">
          {menuItems.map((item) => (
            <Link key={item.link} to={item.link} className="menu-card">
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-info">
                <h3 className="menu-title">{item.title}</h3>
                <p className="menu-desc">{item.description}</p>
              </div>
              <div className="menu-arrow">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>

        <div data-hero-animate className="hero-tags">
          <span className="tag-item">Fetch-Execute</span>
          <span className="tag-dot">/</span>
          <span className="tag-item">von Neumann</span>
          <span className="tag-dot">/</span>
          <span className="tag-item">Memory Access</span>
        </div>
      </div>
    </section>
  );
}
